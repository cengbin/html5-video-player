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
<script src="dist/videoplayer.js"></script>

var vp = new dk.VideoPlayer(options);
```

##### options对象介绍

| key | 值 | 描述|
| ------ | ------ | ------ |
| el | {String} | 视频播放器容器元素id,默认body |
| CSS* | {any} | 以CSS开头的属性名会自动添加到video标签行内样式 |
| * | {any} | 其他属性自动添加到video标签的属性 |

示例：

```
/**
* @options
* @param el - 视频播放器容器元素id
* @param url - 视频地址
* @param autoplay - 是否自动播放视频
* @param loop - 是否循环播放视频
* @param mute - 是否静音播放视频
*/
var options = {
    "el": "video_wrap",
    "url": 'movie.mp4',
    "poster":'video_default.jpg',
    "autoplay":'autoplay',
    "loop":'loop',
    "mute":"mute",
    "webkit-playsinline":true,
    "x-webkit-airplay":true,
    "x5-video-player-type":"h5",
    "playsinline":true,
    "CSSwidth":'320px',
    "CSSheight":'240px'
}
```

