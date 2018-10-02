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
  this._vp = $(this.setting.el);
  this._video = this._vp.find("video")[0];
  if (this.setting.url) this._video.src = this.setting.url;
  if (this.setting.volume != 1) this._video.volume = this.setting.volume;
  if (this.setting.autoplay) this._video.autoplay = this.setting.autoplay;
  if (this.setting.loop) this._video.loop = this.setting.loop;
  if (this.setting.mute) this._video.mute = this.setting.mute;

  this.videoControl = new VideoControl(this._vp, this._video, this.setting);
  this.videoControl.init();
}