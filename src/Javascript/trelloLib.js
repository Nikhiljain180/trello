var trelloLibrary = (function () {

    var trelloObj = {

        domElems: {
            todoTask: document.querySelector('.board-content .todoTasks'),
            inprogressTask: document.querySelector('.board-content .inprogressTasks'),
            completedTask: document.querySelector('.board-content .completedTasks')
        },
        container: document.querySelector('.trelloBlock'),
        taskObj: {
            todoTask: [],
            inprogressTask: [],
            completedTask: []
        },
        renderElemFunc: function (task, taskElem) {
            this.domElems[task].insertAdjacentHTML('beforeend',
                '<div class="card " draggable="true" id="' + task + '_' + taskElem.id + '" data-task=' + task + ' data-taskId=' + taskElem.id +
                ' draggable="true"> ' +
                '<div class="text-container"' + 'data-task=' + task + ' data-taskId=' + taskElem.id + '>' +
                '<div class="textarea"' + 'data-task=' + task +  ' data-taskId=' + taskElem.id + '>' + taskElem.text +
                '</div> ' +
                '</div> ' +
                '<span class="close"' + ' data-task=' + task + ' data-taskId=' + taskElem.id + '>x' + '</span> ' +
                '</div>'
            )
        }

    };

    return {
        initData: function (todoConfig) {

            var that = this, localTaskObj = localStorage.getItem('taskObj');

            if (!localTaskObj) {
                this.ajaxHandler(todoConfig, function (renderData) {

                    localStorage.setItem('taskObj', renderData);
                    that.initializeTaskObj(renderData);
                });
            } else {
                that.initializeTaskObj(localTaskObj);
            }
        },

        taskEvent: function () {
            var that = this;
            trelloObj.container.addEventListener('keyup', function (event) {

                var task = event.target.getAttribute("data-task");
                if (event.keyCode === 13 && task) {

                    var taskObj = {
                        text: event.target.value,
                        id: trelloObj.taskObj[task][trelloObj.taskObj[task].length - 1] ?
                            trelloObj.taskObj[task][trelloObj.taskObj[task].length - 1].id + 1 : 1
                    };
                    trelloObj.taskObj[task].push(taskObj);
                    trelloObj.renderElemFunc(task, taskObj);

                    event.target.value = '';

                    localStorage.setItem('taskObj', JSON.stringify(trelloObj.taskObj));

                }
            });

            trelloObj.container.addEventListener('click', function (event) {
                if (window.LIB.libElement(event.target).hasClass('close')) {
                    var taskId = event.target.getAttribute("data-taskid"),
                        taskName = event.target.getAttribute("data-task"),
                        cardElem = event.target.parentNode;

                    cardElem.parentElement.removeChild(cardElem);

                    trelloObj.taskObj[taskName] = trelloObj.taskObj[taskName].filter(function (item) {
                        return item.id != taskId
                    });

                    localStorage.setItem('taskObj', JSON.stringify(trelloObj.taskObj));
                }
            });

            trelloObj.container.addEventListener('dragstart', function (event) {
                if (window.LIB.libElement(event.target).hasClass('card')) {
                    event.dataTransfer.setData("text", event.target.id);
                }
            });

            trelloObj.container.addEventListener('drop', function (event) {
                var data = event.dataTransfer.getData("text"),
                    containerDiv = event.target.getAttribute("data-task"),
                    rearrangingDiv = document.querySelector('.' + containerDiv + 's');

                if(data.indexOf(containerDiv) === 0){
                    var dragDiv = data.split('_')[1],
                        dropDiv = event.target.getAttribute("data-taskid");

                    that.reArrangeComponentByID(trelloObj.taskObj,containerDiv,dragDiv,dropDiv);

                    trelloObj.domElems[containerDiv].innerHTML = '';
                    trelloObj.taskObj[containerDiv].forEach(function (taskElem, index) {
                        trelloObj.renderElemFunc(containerDiv, taskElem);
                    })
                }else {
                    if (rearrangingDiv) {
                        var dataAr = data.split('_');
                        trelloObj.taskObj[dataAr[0]] = trelloObj.taskObj[dataAr[0]].filter(function (item) {
                            return item.id != dataAr[1]
                        });

                        var taskObj = {
                            text: document.querySelector('#' + data + ' .textarea').innerHTML,
                            id: trelloObj.taskObj[containerDiv][trelloObj.taskObj[containerDiv].length - 1] ?
                                trelloObj.taskObj[containerDiv][trelloObj.taskObj[containerDiv].length - 1].id + 1 : 1
                        };

                        trelloObj.taskObj[containerDiv].push(taskObj);

                        that.removeallTaskData();
                        that.renderInitialTaskData();
                    }
                }

                localStorage.setItem('taskObj', JSON.stringify(trelloObj.taskObj));

            });

            trelloObj.container.addEventListener('dragover', function (event) {
                event.preventDefault();
            });
        },
        reArrangeComponentByID : function (taskObj,elem,id1,id2) {
            var index1=0,index2=0,
                trelloObj = taskObj;

            trelloObj[elem].forEach(function (taskObj,index) {
                if(taskObj.id == id1){
                    index1 = index
                }
                if(taskObj.id == id2){
                    index2 = index
                }
            });
            var tempVar = trelloObj[elem][index1];
            trelloObj[elem][index1] = trelloObj[elem][index2];
            trelloObj[elem][index2] = tempVar;

            tempVar = trelloObj[elem][index1].id;
            trelloObj[elem][index1].id = trelloObj[elem][index2].id;
            trelloObj[elem][index2].id = tempVar;
        },
        removeallTaskData : function () {
            for(var taskContainer in trelloObj.domElems){
                if (trelloObj.domElems.hasOwnProperty(taskContainer)) {
                    trelloObj.domElems[taskContainer].innerHTML = '';
                }
            }
        },
        ajaxHandler: function (reqparm, success) {
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.open(reqparm.type, reqparm.url);
            xhr.onreadystatechange = function () {
                if (xhr.readyState > 3 && xhr.status == 200)
                    success(xhr.responseText);
            };
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            reqparm.type === 'POST' ? xhr.send(reqparm.data) : xhr.send();
            return xhr;
        },
        initializeTaskObj: function (todoData) {
            trelloObj.taskObj = JSON.parse(todoData);
            this.renderInitialTaskData()
        },
        renderInitialTaskData: function () {
            for (var task in trelloObj.taskObj) {
                if (trelloObj.taskObj.hasOwnProperty(task)) {
                    if (trelloObj.taskObj[task].length > 0) {
                        trelloObj.taskObj[task].forEach(function (taskElem, index) {
                            trelloObj.renderElemFunc(task, taskElem);
                        })
                    }
                }
            }
        }
    }
}());
