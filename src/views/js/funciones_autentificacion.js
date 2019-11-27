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
  let query = 'SELECT DOC_CLAVE, DOC_MIESPE FROM docente WHERE DOC_CODIGO='+info_control.docente
  const credenciales=index.bd_connection_info;
  let connection = mysql.createConnection(credenciales)
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
        query2='UPDATE control SET control.CON_HORA_ENTRADA_R = "'+info_control.hora_actual+'" , control.CON_REG_FIRMA_ENTRADA="'+docente[0].DOC_MIESPE+'"    WHERE DOC_CODIGO='+info_control.docente
      }else{
        if(info_control.accion=="SALIR"){
          query2='UPDATE control SET control.CON_HORA_SALIDA_R = "'+info_control.hora_actual+'" , control.CON_REG_FIRMA_SALIDA="'+docente[0].DOC_MIESPE+'" WHERE DOC_CODIGO='+info_control.docente
        }
      }
      connection.query(query2,function(err,result){
        if (err){
          console.log("error fatal")
          console.log(err)
          alert(err)
          return
        }
        connection.end()
        window.close()
      })
    }else{
      alert("Clave incorrecta")
    }
  })

}