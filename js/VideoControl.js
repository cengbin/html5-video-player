function VideoControl(vp, video, options) {
  this._options=options;
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
  toggleFullScreenClasses: function(){
    this._fullScreenBtn.removeClass('fullscreen-off fullscreen-on');
    if(this.fullScreen){
      this._fullScreenBtn.addClass('fullscreen-off');
    }else{
      this._fullScreenBtn.addClass('fullscreen-on')
    }
  },
  set fullScreen(value){
    this._isFullScreen=value;
    this.toggleFullScreenClasses();
  },
  get fullScreen(){
    return this._isFullScreen;
  },
  set onMute(value) {
    this._onMute = value;
    this._muteBtn.removeClass('mute-off mute-on');

    if (value){
      this._muteBtn.addClass('mute-on');
      this._video.muted = true;
    }else{
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

    this._processLine.css({width: n + "%"});

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

  this._vp.mouseover(function (event) {
    scope._playerControls.show();
  }).mouseout(function (event) {
    if (scope._onState == null || scope._onState == 'pause' || scope._onState == 'ended') {

    } else {
      scope._playerControls.hide();
    }
  });

  this._playerTips = this._vp.find(".player-tips").click(function (e) {
    e.stopPropagation(); //不再派发事件
    if (scope._onState == 'ended') {
      scope.toPlay();
      scope._replaying.hide();
    } else {
      scope.togglePlay();
    }
  });
  this._playing = this._vp.find('.playing');
  this._waiting = this._vp.find('.waiting');
  this._replaying = this._vp.find('.replaying');

  this._playerControls = this._vp.find('.player-controls');
  this._switchBtn = this._vp.find('.switch').click(function (e) {
    e.stopPropagation(); //不再派发事件
    if (scope._onState == 'ended') {
      scope.toPlay();
      scope._replaying.hide();
    } else {
      scope.togglePlay();
    }
  });
  this._timeCurrent = this._vp.find('.time-current').text(formatTime(0));
  this._timeDuration = this._vp.find('.time-duration').text(formatTime(0));
  this._processBar = this._vp.find('.process-bar').click(function (e) {
    var offsetX = e.offsetX, barWidth = $(e.currentTarget).width();
    var n = (offsetX / barWidth);
    var d = scope._video.duration;
    var ct = n * d;
    console.log(offsetX, barWidth, n, ct, d);
    scope.seek(ct);
  });
  this._processBuffer = this._vp.find('.process-buffer');
  this._processLine = this._vp.find('.process-line');

  this._muteBtn = this._vp.find(".mute-btn").click(function (e) {
    e.stopPropagation();
    scope.onMute = !scope.onMute;
  });

  this._fullScreenBtn = this._vp.find('.fullscreen-btn').click(function(e){
    scope.toggleFullScreen()
  });
  ['fullscreenchange','mozfullscreenchange','webkitfullscreenchange','msfullscreenchange'].forEach(function(value){
    document.addEventListener(value, function(){
      scope.fullScreen= !scope.fullScreen;
    });
  })

  this.addVideoEvents(this._video);

  this.onMute=this._options.mute;
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

VideoControl.prototype.toggleFullScreen=function() {
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
    var player=this._vp[0];
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

//小于10前面加0
var t = function (num) {
  if (num < 10) {
    return '0' + num.toString();
  }
  return num;
}

//秒转换成时分秒
var formatTime = function (time) {
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