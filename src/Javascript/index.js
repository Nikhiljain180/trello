(function (global) {

    var trelloLib = global.trelloLibrary;

    function TodoList(todoconfig) {
        this.todoInit(todoconfig);
        this.attachTaskEvent();
    }

    TodoList.prototype = {

        todoInit : function (todoconfig) {
            trelloLib.initData(todoconfig);
        },
        attachTaskEvent : function () {
            trelloLib.taskEvent();
        }
    };

    new TodoList({
        url: './jsons/trelloConfig.json',
        type: 'GET'
    });

}(window));
