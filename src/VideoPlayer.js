import {VideoControl} from './VideoControl'

export function VideoPlayer(options) {
  this.options = Object.assign({wrap: null, video: null}, options)
  this.init()
}

VideoPlayer.prototype = {
  init: function () {
    var createElement = this.createElement
    var {video} = this.options
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
    )
    // console.log(el)

    if (video && typeof video === 'string') {
      video = this.options.video = document.querySelector(video)
    }
    video.controls && (video.controls = false)

    this.insertAfter(el, video)

    el.querySelector(".video-wrap").appendChild(video)

    this.videoControl = new VideoControl(el, video, this.options)
    this.videoControl.init()
  },

  insertAfter: function (newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling)
  },

  createElement: function (tag, data, children) {
    var domElement = document.createElement(tag)

    for (var s in data) {
      if (s === 'class') {
        domElement.className = data[s]
      } else if (s === 'style') {
        var styleObj = data[s]
        for (var attr in styleObj) {
          domElement.style[attr] = styleObj[attr]
        }
      } else {
        domElement[s] = data[s]
      }
    }

    if (children) {
      children = Array.isArray(children) ? children : [children]
      children.forEach(child => domElement.appendChild(child))
    }

    return domElement
  }
}