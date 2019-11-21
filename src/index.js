const { app, BrowserWindow, Menu } = require('electron');
const mysql = require("mysql");
const url = require('url');
const path = require('path');
exports.Menu=Menu;
exports.BrowserWindow=BrowserWindow;
exports.url=url;
exports.path=path;
var mainWindow;

const connection = mysql.createConnection({
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
}) 
connection.connect(function(err){
  if (err){
    console.log(err.code)
  }
})
exports.connection=connection
exports.closeConnection = () =>{
  connection.end(function(){})
}

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