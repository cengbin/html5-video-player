# HTML5视频播放器

PC+Mobile端自适应简洁的视频播放器,无需引入其他插件
[Check out the demo here.](https://urlzengbin.github.io/html5-video-player/example/index.html)

## HTML
```
<div id="video_wrap" style="width: auto;max-width:800px;"></div>
```

## JavaSript

##### 导入videoplayer的正确方法和使用:
```js
import {VideoPlayer} from './videoplayer.js';

let vp=new VideoPlayer(options);
```

##### 引用videoplayer.js的正确方法和使用:
```js
<script src="dist/videoplayer.min.js"></script>

var vp = new dk.VideoPlayer(options);
```

##### options对象介绍
```
/**
* @options
* @param {String} el - 视频播放器容器元素id
* @param {String} url - 视频地址
* @param {Number} volume - 音量
* @param {Boolean} autoplay - 是否自动播放视频
* @param {Boolean} loop - 是否循环播放视频
* @param {Boolean} mute - 是否静音播放视频
*/
var options = {
    el: "video_wrap",
    url: 'movie.mp4',
    poster:'video_default.jpg',
    autoplay: false,
    loop: false,
    volume: 1,
    mute: false
}
```

