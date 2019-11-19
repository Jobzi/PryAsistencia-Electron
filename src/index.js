const { app, BrowserWindow, Menu } = require('electron');
const mysql = require("mysql");
const url = require('url');
const path = require('path');
exports.Menu=Menu;
let mainWindow;

const connection = mysql.createConnection({
  host:"remotemysql.com",
  port:"3306",
  user:"V4m8MKkMx1",
  password:"qSE61lK4af",
  database:"V4m8MKkMx1",
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



// Reload in Development for Browser Windows
if(process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });
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

// Menu Template
const templateMenu = [
  {
    label: 'reload',
    click() {
          console.log('7:00:00');
          
    }
  },
];

// if you are in Mac, just add the Name of the App
if (process.platform === 'darwin') {
  templateMenu.unshift({
    label: app.getName(),
  });
};

// Developer Tools in Development Environment
if (process.env.NODE_ENV !== 'production') {
  templateMenu.push({
    label: 'DevTools',
    submenu: [
      {
        label: 'Show/Hide Dev Tools',
        accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  })
}
