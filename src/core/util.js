function _$(el){
  el.text=function(text){
    el.innerText=text;
  }

  el.addClass=function(cla){
    return addClass(el,cla)
  }
  el.removeClass=function(cla){
    return removeClass(el,cla);
  }
  el.css=function(name,value){
    el.style[name]=value;
  }

  var display=_getComputedStyle(el,"display");
  el.olddisplay=(display === "none" || display === "")?_defaultDisplay(el.nodeName):display;
  el.show=function(){
    if(el.style){
      var display=el.style.display;
      if(display === "" || display === "none"){
        el.style.display=el.olddisplay;
      }
    }
  }
  el.hide=function(){
    el.style.display='none';
  }

  el.click=function(fn){
    el.addEventListener('click',fn);
  }

  return el;
}

/*
* DOM添加类
* @param {HTMLElement} element - DOM元素
* @param {string} value - 类名
* */
function addClass(element, value) {
  var rspace = /\s+/,
    classNames,
    i,
    cl,
    setClass;
  if (element.nodeType === 1) {
    if (value && typeof value === "string") {
      classNames = value.split(rspace);
      if (!element.className && classNames.length === 1) {
        element.className = value;
      } else {
        setClass = " " + element.className + " ";
        for (i = 0 , cl = classNames.length; i < cl; i++) {
          if (!~setClass.indexOf(" " + classNames[i] + " ")) {
            setClass += classNames[i] + " ";
          }
        }
        element.className = setClass.trim();
      }
    }
  }
  return element;
}

/*
* DOM删除类
* */
function removeClass(elem, value) {
  var rspace = /\s+/;
  var rclass = /[\n\t\r]/g;
  var classNames,
    className,
    c,
    cl;

  if (elem.nodeType === 1 && elem.className) {
    if ((value && typeof value === "string") || value === undefined) {
      classNames = (value || "").split(rspace);

      if (value) {
        className = (" " + elem.className + " ").replace(rclass, " ");
        for (c = 0, cl = classNames.length; c < cl; c++) {
          className = className.replace(" " + classNames[c] + " ", " ");
        }
        elem.className = className.trim();

      } else {
        elem.className = "";
      }
    }
  }

  return elem;
}

/*
* 判断DOM是否有某个类名
* */
function hasClass(element, selector) {
  var rclass = /[\n\t\r]/g;
  var className = " " + selector + " ";
  if ((" " + element.className + " ").replace(rclass, " ").indexOf(className) > -1) {
    return true;
  }
  return false;
}

/*
* DOM添加/删除类的切换操作
* */
function toggleClass(elem, value) {
  var rspace = /\s+/;
  // toggle individual class names
  var className,
    i = 0,
    classNames = value.split(rspace),
    fn;

  while ((className = classNames[i++])) {
    fn = hasClass(elem, className) ? removeClass : addClass;
    fn(elem, className);
  }
  return elem;
}

//小于10前面加0
var t = function (num) {
  if (num < 10) {
    return '0' + num.toString();
  }
  return num;
}

//秒转换成时分秒
function formatTime(time) {
  var hours = '', minutes = '', seconds = '';
  if (time > 0) {
    seconds = t(parseInt(time % 60));
    if (time >= 60) {
      minutes = t(parseInt(time / 60 % 60)) + ':';
      if (time >= 3600) {
        hours = t(parseInt(time / 3600 % 24)) + ':';
      }
    } else {
      minutes = '00:'
    }
  } else {
    seconds = '00:00';
  }
  return hours + minutes + seconds;
}

var _getComputedStyle;
if (document.defaultView && document.defaultView.getComputedStyle) {
  _getComputedStyle = function (elem, name) {
    var ret, defaultView, computedStyle, width,
      style = elem.style;

    name = name.replace(/([A-Z]|^ms)/g, "-$1").toLowerCase();

    if ((defaultView = elem.ownerDocument.defaultView) &&
      (computedStyle = defaultView.getComputedStyle(elem, null))) {

      ret = computedStyle.getPropertyValue(name);
    }

    // A tribute to the "awesome hack by Dean Edwards"
    // WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
    // which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
    /*if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
      width = style.width;
      style.width = ret;
      ret = computedStyle.width;
      style.width = width;
    }*/

    return ret;
  };
}

var _elemdisplay={};
function _defaultDisplay(nodeName){
  if(!_elemdisplay[nodeName]){
    var body=document.body;
    var elem=document.createElement(nodeName);
    body.appendChild(elem);
    var display=_getComputedStyle(elem,'display');
    body.removeChild(elem);
    _elemdisplay[nodeName]=display;
    // console.log('_defaultDisplay:',elem,display);
  }
  return _elemdisplay[nodeName];
}