
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain;

const path = require('path')
const url = require('url')



const MindWave = require('mindwave');
const ThinkGear = require('node-thinkgear-sockets');

var tgc = ThinkGear.createClient({
    
})

var sample_data = {
	"poorSignalLevel": 0,
	"eSense": {
		"attention": 38,
		"meditation": 43
	},
	"eegPower": {
		"delta": 0.000115,
		"theta": 0.00000141,
		"lowAlpha": 0.000135,
		"highAlpha": 0.0000669,
		"lowBeta": 0.0000147,
		"highBeta": 6.95e-7,
		"lowGamma": 5.26e-7,
		"highGamma": 0.000014
	}
};

let mw = new MindWave();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.setFullScreen(true);
  try{
    tgc.connect();
  }catch(e){
    console.log('connect error', e);
  }
  

  

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  // mainWindow.webContents.send('plot-data', sample_data);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.once('get-plot-data', function(event, data){
    try{
        tgc.on('data', function(data){
          console.log('tgc', data);
          sample_data = data
          if(sample_data.poorSignalLevel < 60){
            
          }else{
            sample_data.eegPower.delta = 0;
            sample_data.eegPower.theta = 0;
            sample_data.eegPower.highAlpha = 0;
            sample_data.eegPower.lowAlpha = 0;
            sample_data.eegPower.lowBeta = 0;
            sample_data.eegPower.highBeta = 0;
            sample_data.eegPower.lowGamma = 0;
            sample_data.eegPower.highGamma = 0;
          }

          event.sender.send('plot-data', sample_data);
          
      })
    }catch(e){
      console.log('tgc error', e);
    }
    // setInterval(function(){
      
    // }, 200);
    
  })

  mainWindow.webContents.send('plot-data', sample_data);
  // console.log(sample_data);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)



// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


function data_generator(){
  return {
    "poorSignalLevel": 0,
    "eSense": {
      "attention": 38,
      "meditation": 43
    },
    "eegPower": {
      "delta": Math.random() * 100,
      "theta": Math.random() * 10,
      "lowAlpha": Math.random(),
      "highAlpha": Math.random(),
      "lowBeta": Math.random(),
      "highBeta": Math.random(),
      "lowGamma": Math.random(),
      "highGamma": Math.random()
    },
    "datetime" : Date.now()
  };
}