(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.vp = {}));
}(this, (function (exports) { 'use strict';

  function VideoControl(el, video, options) {
    this._options = options;
    this._onState = null;
    this._onMute = null;
    this._onFullScreen = false;

    // 视频div层
    this.$el = $(el);
    // 视频对象
    this._video = video;

    // 提示层
    this._playerTips = null;
    this._playing = null;
    this._waiting = null;
    this._replaying = null;
    this._warning = null;

    // 底部控制层
    this._playerControls = null;
    // 播放和暂停按钮
    this._switchBtn = null;
    this._timeCurrent = null;
    this._timeDuration = null;
    // 进度条
    this._processBar = null;
    // 缓冲条
    this._processBuffer = null;
    // 播放进度条
    this._processLine = null;
    // 静音按钮
    this._muteBtn = null;
    // 全屏按钮
    this._fullScreenBtn = null;
  }

  VideoControl.prototype = {
    toggleFullScreenClasses: function () {
      this._fullScreenBtn.removeClass('fullscreen-off fullscreen-on');
      if (this.onFullScreen) {
        this._fullScreenBtn.addClass('fullscreen-off');
        this.$el.addClass('vp-fullscreen');
      } else {
        this._fullScreenBtn.addClass('fullscreen-on');
        this.$el.removeClass('vp-fullscreen');
      }
    },
    updateBar: function () {
      var length = parseInt(this._video.duration),
        ct = parseInt(this._video.currentTime),
        n = ct / length * 100;

      this._processLine.css("width", n + "%");

      this._timeCurrent.text(formatTime(ct));
    },
    setProcess: function (n) {
      this._processBuffer.css('width', n + '%');
    },
    seek: function (e) {
      this._video.currentTime = e;
    },
    toPlay: function () {
      this._video.play();
      this.hidePlaying();
    },
    toPause: function () {
      this._video.pause();
      this.showPlaying();
    },
    showPause: function () {},
    hidePause: function () {},
    showProcessBar: function () {},
    hideProcessBar: function () {},
    showPlaying: function () {
      this._playing.show();
    },
    hidePlaying: function () {
      this._playing.hide();
    },
    showWaiting: function () {
      this._waiting.show();
    },
    hideWaiting: function () {
      this._waiting.hide();
    },
    showWarning: function () {
      this._warning.show();
    },
    showReplaying: function () {
      this._replaying.show();
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
    set onFullScreen(value) {
      this._onFullScreen = value;
      this.toggleFullScreenClasses();
    },
    get onFullScreen() {
      return this._onFullScreen
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
      return this._onMute
    },
    set onState(value) {
      this._onState = value;

      if (value == 'waiting') {
        this.showWaiting();
      } else if (value == 'playing') {
        this._switchBtn.removeClass('play pause').addClass('pause');
        this._replaying.hide();
        this.hidePlaying();
      } else if (value == 'pause') {
        this._switchBtn.removeClass('play pause').addClass('play');
        // 视频播放结束也会触发视频暂停事件
        // 采用异步显示播放按钮，避免视频暂停时显示播放按钮与视频结束时隐藏播放按钮冲突
        setTimeout(() => {
          if (this._onState !== 'ended')
            this.showPlaying();
        });
      } else if (value == 'ended') {
        this.hidePlaying();
        this.showReplaying();
        this._playerControls.show();
      }
    },
    get onState() {
      return this._onState
    },
  };

  VideoControl.prototype.init = function () {
    var scope = this;

    this.$el.mouseover(function (event) {
      scope._playerControls.show();
    }).mouseout(function (event) {
      if (scope._onState == null || scope._onState == 'pause' || scope._onState == 'ended') ; else {
        scope._playerControls.hide();
      }
    });

    this._playerTips = this.getChildEle(".player-tips");
    this._playerTips.click(function (e) {
      e.stopPropagation();
      if (scope._onState == 'ended') {
        scope.toPlay();
        scope._replaying.hide();
      } else {
        scope.togglePlay();
      }
    });

    this._playing = this.getChildEle('.playing');
    this._waiting = this.getChildEle('.waiting');
    this._warning = this.getChildEle('.warning');
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
      scope.toggleFullScreen();
    });
    ['fullscreenchange', 'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'].forEach(function (value) {
      document.addEventListener(value, function () {
        scope.onFullScreen = !scope.onFullScreen;
      });
    });

    this.addVideoEvents(this._video);

    this.onMute = this._options.mute;

    this.onState = this._video.paused ? "pause" : "";
  };

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
    }, false);
    _v.addEventListener("canplaythrough", function () {
      console.log('7、canplaythrough、当媒介能够无需因缓冲而停止即可播放至结尾时运行的脚本。');
    }, false);


    _v.addEventListener("waiting", function () {
      console.log('waiting,当媒介已停止播放但打算继续播放时（比如当媒介暂停已缓冲更多数据）运行脚本');
      scope.onState = 'waiting';
    }, false);
    _v.addEventListener("play", function () {
      console.log('play,当媒介已就绪可以开始播放时运行的脚本。');
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
    _v.addEventListener("seeking", function () {}, false); // 跳帧（seek）操作开始。
    _v.addEventListener("seeked", function () {}, false); // 跳帧（seek）操作完成。

    _v.addEventListener("ratechange", function () {}, false); //播放速率改变
    _v.addEventListener("volumechange", function () {}, false); //音量改变
    _v.addEventListener("timeupdate", function () {  // currentTime 属性指定的时间发生变化。
      scope.updateBar();
    }, false);
    _v.addEventListener("error", function () {
      scope.videoError();
    }, false);
  };

  VideoControl.prototype.toggleFullScreen = function () {
    if (this.onFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      // console.log('removing fullscreen class');
    } else {
      var player = this.$el[0];
      if (player.requestFullscreen) {
        player.requestFullscreen(); // standard
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
      } else {
        const video = this._video;
        video.webkitEnterFullScreen();
        // console.error('Unable to find a fullscreen request method');
      }
    }
  };

  VideoControl.prototype.videoError = function () {
    var err = {};
    err.code = this._video.error.code;
    err.error = "";
    switch (err.code) {
      case 1:
        err.error = "播放过程中用户终止";
        break
      case 2:
        err.error = "播放过程中网络错误";
        break
      case 3:
        err.error = "播放过程中解码错误";
        break
      case 4:
        err.error = "播放过程中URL无效";
    }
    console.log(JSON.stringify(err));
    this.showWarning();
  };

  VideoControl.prototype.getChildEle = function (el) {
    el = this.$el[0].querySelector(el);
    return $(el)
  };

  // 秒转换成时分秒
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
        minutes = '00:';
      }
    } else {
      seconds = '00:00';
    }
    return hours + minutes + seconds
  }

  // 小于10前面加0
  function t(num) {
    if (num < 10) {
      return '0' + num.toString()
    }
    return num
  }

  function VideoPlayer(options) {
    this.options = Object.assign({wrap: null, video: null}, options);
    this.init();
  }

  VideoPlayer.prototype = {
    init: function () {
      var createElement = this.createElement;
      var {video} = this.options;
      var el = createElement("div", {class: "video-player"}, [
          createElement("div", {class: "video-wrap"}),
          createElement("div", {class: "player-tips"}, [
            createElement("div", {class: "playing"}),
            createElement("div", {class: "waiting"}),
            createElement("div", {class: "warning"}),
            createElement("div", {class: "replaying"}),
          ]),
          createElement("div", {class: "player-controls"}, [
            createElement("div", {class: "switch play"}),
            createElement("div", {class: "time-current"}),
            createElement("div", {class: "process-bar"}, [
              createElement("div", {class: "process-bg"}),
              createElement("div", {class: "process-buffer"}),
              createElement("div", {class: "process-line"}),
            ]),
            createElement("div", {class: "time-duration"}),
            createElement("div", {class: "mute-btn mute-off"}),
            createElement("div", {class: "fullscreen-btn fullscreen-on"}),
          ])
        ]
      );
      // console.log(el)

      if (video && typeof video === 'string') {
        video = this.options.video = document.querySelector(video);
      }
      video.controls && (video.controls = false);

      this.insertAfter(el, video);

      el.querySelector(".video-wrap").appendChild(video);

      this.videoControl = new VideoControl(el, video, this.options);
      this.videoControl.init();
    },

    insertAfter: function (newNode, existingNode) {
      existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    },

    createElement: function (tag, data, children) {
      var domElement = document.createElement(tag);

      for (var s in data) {
        if (s === 'class') {
          domElement.className = data[s];
        } else if (s === 'style') {
          var styleObj = data[s];
          for (var attr in styleObj) {
            domElement.style[attr] = styleObj[attr];
          }
        } else {
          domElement[s] = data[s];
        }
      }

      if (children) {
        children = Array.isArray(children) ? children : [children];
        children.forEach(child => domElement.appendChild(child));
      }

      return domElement
    }
  };

  const version = '0.0.1';

  exports.VideoPlayer = VideoPlayer;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
