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
/**
 * 视频播放器对象
 * @param {Object} options - 播放器初始化选项
 * */
function VideoPlayer(options) {
  /**
   * @options
   * @param {String} el - 视频元素id *
   * @param {String} url - 视频地址 *
   * @param {Number} volume - 音量
   * @param {Boolean} autoplay - 是否自动播放视频
   * @param {Boolean} loop - 是否循环播放视频
   * @param {Boolean} mute - 是否静音播放视频
   */
  var setting = {
    el: null,
    url: null,
    volume: 1,
    autoplay: false,
    loop: false,
    mute: false
  }
  this.setting = Object.assign(setting, options);

  this.init()
};

VideoPlayer.prototype.init=function(){
  this._vp = document.getElementById(this.setting.el);
  this._video = this._vp.querySelectorAll("video")[0];
  if (this.setting.url) this._video.src = this.setting.url;
  if (this.setting.poster) this._video.poster = this.setting.poster;
  if (this.setting.volume != 1) this._video.volume = this.setting.volume;
  if (this.setting.autoplay) this._video.autoplay = this.setting.autoplay;
  if (this.setting.loop) this._video.loop = this.setting.loop;
  if (this.setting.mute) this._video.mute = this.setting.mute;

  this.videoControl = new VideoControl(this._vp, this._video, this.setting);
  this.videoControl.init();
}
function VideoControl(vp, video, options) {
  this._options = options;
  this._onState = null;
  this._onMute = null;
  this._isFullScreen = false;

  //视频div层
  this._vp = vp;
  //视频对象
  this._video = video;

  //提示层
  this._playerTips = null;
  this._playing = null;
  this._waiting = null;
  this._replaying = null;

  //底部控制层
  this._playerControls = null;
  //播放和暂停按钮
  this._switchBtn = null;
  this._timeCurrent = null;
  this._timeDuration = null;
  this._processBar = null;
  this._processBuffer = null;
  this._processLine = null;
  //静音按钮
  this._muteBtn = null;
  //全屏按钮
  this._fullScreenBtn = null;
};

VideoControl.prototype = {
  toggleFullScreenClasses: function () {
    this._fullScreenBtn.removeClass('fullscreen-off fullscreen-on');
    if (this.fullScreen) {
      this._fullScreenBtn.addClass('fullscreen-off');
    } else {
      this._fullScreenBtn.addClass('fullscreen-on')
    }
  },
  set fullScreen(value) {
    this._isFullScreen = value;
    this.toggleFullScreenClasses();
  },
  get fullScreen() {
    return this._isFullScreen;
  },
  set onMute(value) {
    this._onMute = value;
    this._muteBtn.removeClass('mute-off mute-on');

    if (value) {
      this._muteBtn.addClass('mute-on');
      this._video.muted = true;
    } else {
      this._muteBtn.addClass('mute-off');
      this._video.muted = false;
    }
  },
  get onMute() {
    return this._onMute;
  },
  set onState(value) {
    this._onState = value;

    if (value == 'waiting') {
      this.showWaiting();
    } else if (value == 'playing') {
      this._switchBtn.removeClass('play pause').addClass('pause');
    } else if (value == 'pause') {
      this._switchBtn.removeClass('play pause').addClass('play');
    } else if (value == 'ended') {
      this.showEnded();
      this._playerControls.show();
    }
  },
  showPause: function () {
  },
  hidePause: function () {
  },
  showProcessBar: function () {
  },
  hideProcessBar: function () {
  },
  updateBar: function () {
    var length = parseInt(this._video.duration),
      ct = parseInt(this._video.currentTime),
      n = ct / length * 100;

    this._processLine.css("width",n + "%");

    this._timeCurrent.text(formatTime(ct));
  },
  setProcess: function (n) {
    this._processBuffer.css('width', n + '%');
  },
  seek: function (e) {
    this._video.currentTime = e
  },
  toPlay: function () {
    this._video.play();

    this._playing.hide();
  },
  toPause: function () {
    this._video.pause();

    this._playing.show();
  },
  showWaiting: function () {
    this._waiting.show();
  },
  hideWaiting: function () {
    this._waiting.hide();
  },
  showWarning: function () {

  },
  togglePlay: function () {
    if (this._video.paused) {
      this.toPlay();
    } else {
      this.toPause();
      //如果当前在加载则影藏加载，显示出播放按钮
      this.hideWaiting();
    }
  },
  showEnded: function () {
    this._replaying.show();
  }
};

VideoControl.prototype.init = function () {
  var scope = this;

  this._vp.addEventListener("mouseover",function (event) {
    scope._playerControls.show();
  })
  this._vp.addEventListener("mouseout",function (event) {
    if (scope._onState == null || scope._onState == 'pause' || scope._onState == 'ended') {

    } else {
      scope._playerControls.hide();
    }
  })

  this._playerTips = this.getChildEle(".player-tips");
  this._playerTips.click(function (e) {
    e.stopPropagation(); //不再派发事件
    if (scope._onState == 'ended') {
      scope.toPlay();
      scope._replaying.hide();
    } else {
      scope.togglePlay();
    }
  });
  this._playing = this.getChildEle('.playing');
  this._waiting = this.getChildEle('.waiting');
  this._replaying = this.getChildEle('.replaying');

  this._playerControls = this.getChildEle('.player-controls');
  this._switchBtn = this.getChildEle('.switch');
  this._switchBtn.click(function (e) {
    e.stopPropagation(); //不再派发事件
    if (scope._onState == 'ended') {
      scope.toPlay();
      scope._replaying.hide();
    } else {
      scope.togglePlay();
    }
  });
  this._timeCurrent = this.getChildEle('.time-current');
  this._timeCurrent.text(formatTime(0));
  this._timeDuration = this.getChildEle('.time-duration');
  this._timeDuration.text(formatTime(0));
  this._processBar = this.getChildEle('.process-bar');
  this._processBar.click(function (e) {
    var offsetX = e.offsetX,
      barWidth = e.currentTarget.offsetWidth;
    var n = (offsetX / barWidth);
    var d = scope._video.duration;
    var ct = n * d;
    console.log(offsetX, barWidth, n, ct, d);
    scope.seek(ct);
  });
  this._processBuffer = this.getChildEle('.process-buffer');
  this._processLine = this.getChildEle('.process-line');

  this._muteBtn = this.getChildEle(".mute-btn");
  this._muteBtn.click(function (e) {
    e.stopPropagation();
    scope.onMute = !scope.onMute;
  });

  this._fullScreenBtn = this.getChildEle('.fullscreen-btn');
  this._fullScreenBtn.click(function (e) {
    scope.toggleFullScreen()
  });
  ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(function (value) {
    document.addEventListener(value, function () {
      scope.fullScreen = !scope.fullScreen;
    });
  })

  this.addVideoEvents(this._video);

  this.onMute = this._options.mute;
}

VideoControl.prototype.addVideoEvents = function (_v) {
  var scope = this;
  //当音频/视频处于加载过程中时，会依次发生以下事件：
  _v.addEventListener("loadstart", function () {//客户端开始请求数据
    console.log('1、loadstart、客户端开始请求数据');
  }, false);
  _v.addEventListener("durationchange", function () {//资源长度改变
    console.log('2、durationchange、资源长度改变');
    scope._timeDuration.text(formatTime(_v.duration));
  }, false);
  _v.addEventListener("loadedmetadata", function () {
    console.log('3、loadedmetadata、');
  }, false);
  _v.addEventListener("loadeddata", function () {
    console.log('4、loadeddata、');
  }, false);
  _v.addEventListener("progress", function () {
    var log = '5、progress、';
    if (_v.readyState == 4) {
      var n = Math.round(_v.buffered.end(0) / _v.duration * 100);
      log += '正在缓冲：' + n + '%';
      scope.setProcess(n);
    }
    console.log(log);
  }, false);
  _v.addEventListener("canplay", function () {
    console.log('6、canplay、缓冲已足够开始时。-----每次卡住，再缓冲成功都会调用此方法');
    scope.hideWaiting();
    scope._playing.hide();
  }, false);
  _v.addEventListener("canplaythrough", function () {
    console.log('7、canplaythrough、当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本。');
  }, false);


  _v.addEventListener("waiting", function () {
    console.log('waiting,当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）运行脚本');
    scope.onState = 'waiting';
  }, false);
  _v.addEventListener("play", function () {
    console.log('play,当媒介已就绪可以开始播放时运行的脚本。')
  }, false);
  _v.addEventListener("playing", function () {
    console.log('playing,当媒介已开始播放时运行的脚本。-----加载提示影藏');
    scope.onState = 'playing';
  }, false);
  _v.addEventListener("pause", function () {
    console.log('pause,当媒介被用户或程序暂停时运行的脚本。-----视频播放结束也会调用此方法');
    scope.onState = 'pause';
  }, false);
  _v.addEventListener("ended", function () {
    console.log('ended,当媒介已到达结尾（可发送类似“感谢观看”之类的消息）。');
    scope.onState = 'ended';
    scope.seek(0);
  }, false);

  _v.addEventListener("suspend", function () {}, false); //延迟下载
  _v.addEventListener("abort", function () {}, false); //客户端主动终止下载（不是因为错误引起）
  _v.addEventListener("stalled", function () {}, false); //网速失速
  _v.addEventListener("seeking", function () {}, false);
  _v.addEventListener("seeked", function () {}, false);

  _v.addEventListener("ratechange", function () {}, false); //播放速率改变
  _v.addEventListener("volumechange", function () {}, false); //音量改变
  _v.addEventListener("timeupdate", function () {
    scope.updateBar();
  }, false);

  _v.addEventListener("error", this.videoError, false);
}

VideoControl.prototype.toggleFullScreen = function () {
  if (this.fullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      console.error('Unable to find a fullscreen exit method.');
    }
    // console.log('removing fullscreen class');
  } else {
    var player = this._vp;
    if (player.requestFullscreen) {
      player.requestFullscreen(); // standard
    } else if (player.webkitRequestFullscreen) {
      player.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (player.mozRequestFullScreen) {
      player.mozRequestFullScreen();
    } else if (player.msRequestFullscreen) {
      player.msRequestFullscreen();
    } else {
      console.error('Unable to find a fullscreen request method');
    }
  }
}

VideoControl.prototype.videoError = function () {
  var err = {};
  err.code = this._video.error.code;
  err.error = ""
  switch (err.code) {
    case 1:
      err.error = "播放过程中用户终止";
      break;
    case 2:
      err.error = "播放过程中网络错误";
      break;
    case 3:
      err.error = "播放过程中解码错误";
      break;
    case 4:
      err.error = "播放过程中URL无效"
  }
  console.log(JSON.stringify(err));
  this.showWarning();
}

VideoControl.prototype.getChildEle = function (el) {
  el=this._vp.querySelector(el);
  return _$(el);
}

