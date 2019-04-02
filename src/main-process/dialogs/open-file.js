const {ipcMain, dialog} = require('electron')

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }, (files) => {
    if (files) {
      event.sender.send('selected-directory', files)
    }
  })
})

ipcMain.on('open-err-dialog', () => {
  dialog.showErrorBox('一条错误信息', '错误信息演示')
})

ipcMain.on('open-information-dialog', (event) => {
  const options = {
    type: 'info',
    title: '信息',
    message: '这是一个信息对话框，很不错吧',
    buttons: ['是', '否']
  }
  dialog.showMessageBox(options, (index) => {
    event.sender.send('information-dialog-selection', index)
  })
})

ipcMain.on('save-dialog', (event) => {
  const options = {
    title: '保存图像',
    filters: [
      {name: 'Image', extensions:['jpg', 'png', 'gif']}
    ]
  }

  dialog.showSaveDialog(options, (filename) => {
    event.sender.send('save-file', filename)
  })
})
