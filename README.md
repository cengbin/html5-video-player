# HTML5视频播放器

PC+Mobile端自适应简洁的视频播放器,无需引入其他插件
[Check out the demo here.](https://siyuanqiao.github.io/html5-video-player/example/index.html)

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
<script src="dist/videoplayer.js"></script>

var vp = new dk.VideoPlayer(options);
```

##### options对象介绍

| key | 值类型 | 描述|
| ------ | ------ | ------ |
| el | {String} | 视频播放器容器元素id,默认body |
| attributes | {Object} | 添加到video标签的属性 |
| style | {Object} | 添加到video标签行内样式 |

示例：

```
/**
* @options
* el - 视频播放器容器元素id
* src - 视频地址
* poster - 规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像
* preload - 视频在页面加载时进行加载，并预备播放
* autoplay - 是否自动播放视频
* loop - 是否循环播放视频
* mute - 是否静音播放视频
*/
var options = {
    el: "video_wrap",
    attributes:{
      src: './movie.mp4',
      poster: './video_default.jpg',
      preload: "meta",
      autoplay: "autoplay",
      loop: "loop",
      mute:'mute',
      "webkit-playsinline":true,
      "x-webkit-airplay":true,
      "x5-video-player-type":"h5",
      "playsinline":true,
    },
    style:{
      'box-shadow': '10px 10px 5px #888888'
    }
  }
```

