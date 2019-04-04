<template>
  <div>
    <button @click="createWindow('new')">创建一个新窗体</button>
    <br /> <br />
    <button @click="createWindow('no')">创建一个无框窗体</button>
    <br /> <br />
    <button @click="createWindow('sale')">创建一个可缩放窗体</button>
    <br /> <br />
    <button @click="destroyLine">进程崩溃后重载窗体</button>
    <br /> <br />
    <button @click="reloadWindow">进程挂起后重载窗体</button>
    <br /> <br />
    <span style="font-size:14px;color:red">{{answer}}</span>
  </div>
</template>

<script>
const { BrowserWindow, app, dialog } = window.require('electron').remote

export default {
  data () {
    return {
      answer: ''
    }
  },
  methods: {
    createWindow (arg) {
      const modalPath = `file://${app.getAppPath()}/src/html/hello.html`
      let win
      if(arg === 'new') {
        win = new BrowserWindow({ width:400, height:320 })
      }else if(arg === 'no') {
        win = new BrowserWindow({ frame: false })
      }else if(arg === 'sale') {
         win = new BrowserWindow({ width:400, height:320 })
         win.on('resize', () => {
            const message = `大小: ${win.getSize()} 位置: ${win.getPosition()}`
            this.answer = message
         })
         win.on('move', () => {
            const message = `大小: ${win.getSize()} 位置: ${win.getPosition()}`
            this.answer = message
         })
      }
      win.on('close', () => { win = null; this.answer = ''})
      win.loadURL(modalPath)
      win.show()
    },
    destroyLine () {
      const crashWinPath = `file://${app.getAppPath()}/src/html/process-crash.html`
      let win = new BrowserWindow({width: 400, height: 320})
      win.webContents.on('crashed', () => {
        const options = {
          type: 'info',
          title: '渲染器进程崩溃',
          message: '这个进程已经崩溃.',
          buttons: ['重载', '关闭']
        }

        dialog.showMessageBox(options, (index) => {
          if (index === 0) win.reload()
          else win.close()
        })
      })

      win.on('close', () => { win = null })
      win.loadURL(crashWinPath)
      win.show()
    },
    reloadWindow () {
      const hangWinPath = `file://${app.getAppPath()}/src/html/process-hang.html`
      let win = new BrowserWindow({ width: 400, height: 320 })

      win.on('unresponsive', () => {
        const options = {
          type: 'info',
          title: '渲染器进程挂起',
          message: '这个进程已经被挂起.',
          buttons: ['重载', '关闭']
        }

        dialog.showMessageBox(options, (index) => {
          if (index === 0) win.reload()
          else win.close()
        })
      })

      win.on('close', () => { win = null })
      win.loadURL(hangWinPath)
      win.show()
    }
  }
}
</script>
