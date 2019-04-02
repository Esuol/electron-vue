<template>
  <div class="hello">
    <button @click="getInfo">获取应用信息</button>
    <br /> <br />
    <button @click="getVersion">获取版本信息</button>
    <br /> <br />
    <button @click="getScreen">屏幕信息</button>
    <br /> <br />
    <button @click="copy">复制</button>&nbsp;&nbsp;&nbsp;&nbsp;
    <input type="text" v-model="inputValue" :placeholder="placeholder">
    <br /> <br />
    <button @click="printPDF">打印到PDF</button>
    <br /> <br />
    <button @click="screenHot">创建屏幕截图</button>
    <br /> <br />
    <span style="font-size:14px;color:red">{{answer}}</span>
  </div>
</template>

<script>
const { ipcRenderer, screen, clipboard, shell, desktopCapturer } = window.require('electron')
const fs = window.require('fs')
const os = require('os')
const path = require('path')
const { process } = window.require('electron').remote


export default {
  name: 'HelloWorld',
  props: {

  },
  data () {
    return {
      inputValue: '',
      placeholder: '',
      msg: '',
      answer: ''
    }
  },
  methods: {
    getInfo () {
      ipcRenderer.send('get-app-path')

      ipcRenderer.on('got-app-path',(event, path) => {
        console.log(path)
        this.answer = path
      })
    },
    getVersion () {
      // console.log(electronVersion)
      const electronVersion = process.versions.electron
      const message =  `当前electron的版本是${electronVersion}`
      this.answer = message
      console.log(message)
    },
    getScreen () {
      const size = screen.getPrimaryDisplay().size
      const message = `当前屏幕是: ${size.width}px x ${size.height}px`
      this.answer = message
      console.log(message)
    },
    copy () {
      if(this.inputValue !== '') this.inputValue = ''
      this.placeholder = '已复制! 请在这里执行粘贴.'
      clipboard.writeText('Electron 示例!')
    },
    printPDF () {
      ipcRenderer.send('print-to-pdf')

      ipcRenderer.on('wrote-pdf', (event, path) => {
        const message = `PDF保存到：${path}`
        this.answer = message
        console.log(message)
      })
    },

    screenHot () {
      console.log(fs)
      this.msg = '正在截取屏幕...'
      const thumbSize = this.determineScreenShotSize()
      let options = { types: ['screen'], thumbnailSize: thumbSize }
        desktopCapturer.getSources(options, (error, sources) => {
          if (error) return console.log(error)

          sources.forEach((source) => {
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
              const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

              fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                if (error) return console.log(error)
                shell.openExternal(`file://${screenshotPath}`)

                const message = `截图保存到: ${screenshotPath}`
                this.answer = message
              })
            }
          })
        })
    },

    determineScreenShotSize () {
      const screenSize = screen.getPrimaryDisplay().workAreaSize
      const maxDimension = Math.max(screenSize.width, screenSize.height)
      return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
      }
    }
  }
}
</script>