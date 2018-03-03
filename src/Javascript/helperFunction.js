/**********Small Javascript Function Library **********************/
/**
 * PolyFiling
 */
(function(global, document, undef) {

    var strundef = typeof(undef),
        strstring = typeof("");

    var lib = global.LIB = global.LIB||{};
    lib.libElement = function(elem){
        return({
            hasClass: function (className) {
                if (elem && typeof(className) === strstring) {
                    var classAttr = elem.getAttribute("class");
                    var classes = (classAttr) ? classAttr.split(" ") : [];
                    return (classes.indexOf(className) > -1);
                }
                return false;
            },
            addClass: function (className) {
                if (elem && typeof(className) === strstring && !this.hasClass(className)) {
                    var classAttr = elem.getAttribute("class");
                    var classes = (classAttr) ? classAttr.split(" ") : [];
                    classes.push(className);
                    this.attr("class", classes.join(" "));
                }
                return this;
            },
            attr: function(attrName, attrValue) {
                if (elem && typeof(attrName) === strstring && typeof(attrValue) === strundef) {
                    return elem.getAttribute(attrName);
                } else if (elem && typeof(attrName) === strstring && typeof(attrValue) !== strundef) {
                    elem.setAttribute(attrName, attrValue);
                    return attrValue;
                }
                return null;
            },
            removeClass: function(className) {
                if (elem && typeof(className) === strstring && this.hasClass(className)) {
                    var classAttr = elem.getAttribute("class");
                    var classes = (classAttr) ? classAttr.split(" ") : [];
                    var indexOfClass = classes.indexOf(className);
                    while (indexOfClass > -1) {
                        classes.splice(indexOfClass, 1);
                        indexOfClass = classes.indexOf(className);
                    }
                    this.attr("class", classes.join(" "));
                }
                return this;
            }
        })
    }
}(window, document));

/********************************************************************************************************/
