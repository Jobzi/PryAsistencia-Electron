const remote = require('electron').remote
const index = remote.require('./index.js')
const { ipcRenderer } = require('electron');
var info_control;
ipcRenderer.on('tarjeta', (event, tarjeta) => {
info_control=tarjeta;
})
const form = document.querySelector('form')
form.addEventListener('submit', e => {
  e.preventDefault();

  const usuario = document.querySelector('#usuario').value;
  const contraseña = document.querySelector('#contraseña').value;
  validarDocente(usuario,contraseña)
});


function validarDocente(usuario,contraseña){
  let query = 'select DOC_MIESPE, DOC_CLAVE FROM docente WHERE DOC_CODIGO='+info_control.docente
  index.connection.query(query,function(err,rows,fields){
    if (err){
      console.log("error fatal")
      console.log(err)
      return
    }
    let docente=rows;
    let query2="";
    if(docente[0].DOC_MIESPE==usuario &&docente[0].DOC_CLAVE==contraseña){
      if(info_control.accion=="ENTRAR"){
        query2='UPDATE control SET control.CON_HORA_ENTRADA_R = "'+info_control.hora+'" WHERE DOC_CODIGO='+info_control.docente
      }else{
        query2='UPDATE control SET control.CON_HORA_SALIDA_R = "'+info_control.hora+'" WHERE DOC_CODIGO='+info_control.docente
      }
      index.connection.query(query2,function(err,result){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        window.close()
      })
    }else{
      alert("Usuario o Clave incorrectos")
    }
  })
}