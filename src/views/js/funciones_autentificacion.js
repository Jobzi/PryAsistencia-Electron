const remote = require('electron').remote
const index = remote.require('./index.js')
const { ipcRenderer } = require('electron');
const mysql = require("mysql");
var info_control;
ipcRenderer.on('tarjeta', (event, tarjeta) => {
info_control=tarjeta;
})
const form = document.querySelector('form')
form.addEventListener('submit', e => {
  e.preventDefault();
  const contraseña = document.querySelector('#contraseña').value;
  validarDocente(contraseña)
});


function validarDocente(contraseña){
  let query = 'SELECT DOC_CLAVE FROM docente WHERE DOC_CODIGO='+info_control.docente
  const credenciales=index.bd_connection_info;
  const connection = mysql.createConnection(credenciales)
  connection.connect()
  connection.query(query,function(err,rows,fields){
    if (err){
      console.log("error fatal")
      console.log(err)
      return
    }
    let docente=rows;
    let query2="";
    if(docente[0].DOC_CLAVE==contraseña){
      if(info_control.accion=="ENTRAR"){
        query2='UPDATE control SET control.CON_HORA_ENTRADA_R = "'+info_control.hora_actual+'" WHERE DOC_CODIGO='+info_control.docente
      }else{
        query2='UPDATE control SET control.CON_HORA_SALIDA_R = "'+info_control.hora_actual+'" WHERE DOC_CODIGO='+info_control.docente
      }
      index.connection.query(query2,function(err,result){
        if (err){
          console.log("error fatal")
          console.log(err)
          alert(err)
          return
        }
        
        window.close()
      })
    }else{
      alert("Clave incorrectos")
    }
  })
  connection.end()
}