<template>
  <div class="about">
    <button>Command+k</button>
    <br /> <br />
    <button @click="getPath">在文件管理器中打开路径</button>
    <br /> <br />
    <button @click="getOutLink">打开外部链接</button>
    <br /> <br />
    <button @click="baseInfo">基本通知</button>
    <br /> <br />
    <button @click="systemFile">系统文件查找</button>
    <br /> <br />
    <button @click="errMsg">错误提示</button>
    <br /> <br />
    <button @click="msgTalk">信息对话框</button>
    <br /> <br />
    <button @click="saveDialog">保存对话框</button>
    <br /> <br />
    <button @click="openThis">从其他应用中的url启动应用</button>

     <!-- <div style="width:300px;height:300px;border:1px solid #000">
      <img src="file:///Users/berlin/Pictures/%E7%85%A7%E7%89%87%E5%9B%BE%E5%BA%93.photoslibrary/resources/proxies/derivatives/00/00/1/UNADJUSTEDNONRAW_thumb_1.jpg" alt="" >
     </div> -->

  </div>
</template>

<script>
const { shell,ipcRenderer } = window.require('electron')
const path = require('path')
const os = require('os')

export default {
  data () {
    return  {
      notification: {
        title: '基本通知',
        body: '简短的通知内容'
      },
      imgUrl: ''
    }
  },
  created() {

  },
  methods: {
    getPath () {
     shell.showItemInFolder(os.homedir())
    },
    getOutLink () {
      shell.openExternal("http://www.baidu.com")
    },
    baseInfo () {
      const myNotification = new window.Notification(this.notification.title, this.notification)
      myNotification.onclick = () => {
         console.log('通知被点击')
       }
    },
    systemFile () {
      ipcRenderer.send('open-file-dialog')

      ipcRenderer.on('selected-directory', (event, path) => {
       this.imgUrl = path[0]
      })
    },
    errMsg () {
      ipcRenderer.send('open-err-dialog')
    },
    msgTalk () {
      ipcRenderer.send('open-information-dialog')

      ipcRenderer.on('information-dialog-selection', (event, index) => {
        let message = '你已选择'
        if(index === 0) message += '是'
        else message += '否'
        console.log(message)
      })
    },
    saveDialog () {
      ipcRenderer.send('save-dialog')

      ipcRenderer.on('save-file', (event, path) => {
        if(!path) path= '无路径'
        else console.log(path)
      })
    },
    openThis () {
      const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')

      const pagePath = path.join('http://localhost:8090/', pageDirectory, './frame')
      console.log(pagePath)
      shell.openExternal(pagePath)
    }
  }
}
</script>

<style scoped>

</style>


