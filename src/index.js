const { app, BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
exports.Menu=Menu;
exports.BrowserWindow=BrowserWindow;
exports.url=url;
exports.path=path;
var mainWindow;

const bd_connection_info={
  /* host:"remotemysql.com",
   port:"3306",
   user:"V4m8MKkMx1",
   password:"qSE61lK4af",
   database:"V4m8MKkMx1",*/
   host:"10.2.0.3",
   port:"3306",
   user:"sg-lab2",
   password:"sglab2019",
   database:"sg-lab2",
 }


exports.bd_connection_info=bd_connection_info

app.on('ready', () => {

  // The Main Window
  mainWindow = new BrowserWindow({width: 1000, height: 750});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }))


  // Set The Menu to the Main Window
  Menu.setApplicationMenu(null);

  // If we close main Window the App quit
  mainWindow.on('closed', () => {
    app.quit();
  });
});