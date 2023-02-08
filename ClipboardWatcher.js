import { EventEmitter } from "events";
const crypto = require('crypto')
let { clipboard } = require("electron");

function getHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function isEqual(prev, current) {
  return getHash(prev) === getHash(current)
}

function readFromClipBoard() {
  return clipboard.readText()
}

export class ClipboardWater{
  constructor(options) {
    let {interval=500,...rest} = options
    this.clipboardEvents = new EventEmitter()
    // 
    this.timerFlag = null
    // 时间间隔
    this.interval = interval
    // 剪切板之前内容
    this.prevText = ''
    // 监听类型
    this.type = ''
  }

  startWatching() {
    this.timerFlag = setInterval(() => {
      let currentText = readFromClipBoard()
      // 是否相等
      if (!isEqual(this.prevText, currentText)) {
        this.prevText = currentText
        this.clipboardEvents.emit(this.type,currentText)
      }
    },this.interval)
  }
  on(type, callback) {
    this.type = type
    this.clipboardEvents.on(type, callback)
    this.startWatching()
  }
}
