const remote = require('electron').remote
const index = remote.require('./index.js')
const mysql = require("mysql");
const credenciales=index.bd_connection_info;
var fecha=new Date();
var horario_actual;
var hora_actual=fecha.getHours()+":"+fecha.getMinutes()+":"+"00";
var datos="";
if(fecha.getHours()<10){
   hora_actual="0"+fecha.getHours()+":"+fecha.getMinutes()+":"+"00";
}
function listarControles(horario) {
    //saber hora para el selecet
    if (horario==""){        
        horario=obtenerHoraLaboral();
    }
    if(horario!="No es Hora Laboral"){
      dibujarSalas();
    }
    horario_actual=horario;
    saberDia(horario);
    let hora=horario.split("-",1)
    //
    let string_fecha=fecha.getFullYear() + "-" + (fecha.getMonth() +1) + "-" + fecha.getDate();
    //let string_fecha='2015-01-07'
    console.log(string_fecha)
    let query = 'select CON_DIA,MAT_ABREVIATURA,control.DOC_CODIGO,DOC_NOMBRES,DOC_APELLIDOS,DOC_TITULO,CON_EXTRA,LAB_ABREVIATURA,LAB_ESTADO,control.CON_HORA_ENTRADA,control.CON_HORA_SALIDA,control.CON_HORA_ENTRADA_R,control.CON_HORA_SALIDA_R FROM control,materia,docente,laboratorio WHERE control.MAT_CODIGO=materia.MAT_CODIGO and control.DOC_CODIGO=docente.DOC_CODIGO and control.LAB_CODIGO=laboratorio.LAB_CODIGO and control.CON_DIA="'+string_fecha+'" and control.CON_HORA_ENTRADA='+'"'+hora+'"'
    let color_tarjeta=["light","info","success","secondary"];
    let accion_boton=["DISPONIBLE","ENTRAR","SALIR","FINALIZADO"]
    let indice_colores;
    const connection = mysql.createConnection(credenciales)
    connection.connect() 
    connection.query(query,function(err,rows,fields){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        controles=rows;
        controles.forEach(control => {
            if(control.LAB_ESTADO==1){
              //Obtienedo si es ocacional
              let ocasional="H";
              if (control.CON_EXTRA==1){
                  ocasional="O"
              }
              //Obteniendo el estado de control
              if(control.CON_HORA_ENTRADA_R!=null){
                if(control.CON_HORA_SALIDA_R==null){
                  indice_colores=2;
                }else{
                  indice_colores=3
                }  
              }else{
                indice_colores=1;
              }
              const controlesTemplate = `
              <div class="card text-white bg-${color_tarjeta[indice_colores]} mb-5" style="max-width: 20rem;">
                  <div class="card-header">
                      <div class="row">
                      <div class="col-md-3">
                          <label class="btn btn-primary">${control.LAB_ABREVIATURA}</label>
                      </div>
                      <div class="col-md-8">
                          <h5><b class="card-text" style="color:#fffb00";>${ocasional}</b>&nbsp ${control.MAT_ABREVIATURA} </h5>
                      </div>
                      </div>
                  </div>
                  <div class="card-body">
                      <h4 class="card-title">${control.DOC_TITULO} ${control.DOC_APELLIDOS} ${control.DOC_NOMBRES} </h4>
                  </div>
                  <div class="card-footer">
                      <button id=boton${control.LAB_ABREVIATURA} class="btn btn-${color_tarjeta[indice_colores]} btn-block">
                        ${accion_boton[indice_colores]}
                      </button>
                  </div>
                  </div>
              `;
              document.getElementById(control.LAB_ABREVIATURA).innerHTML = controlesTemplate;
              let btn=document.getElementById("boton"+control.LAB_ABREVIATURA)
              btn.addEventListener('click', e => {  
                let hora_valida=obtenerHoraLaboral()
                hora_valida=hora_valida.split("-",2)
                if(control.CON_HORA_ENTRADA<=hora_valida[0]){
                  crearVentanaAutentificar(control.DOC_CODIGO, (btn.textContent).trim())
                }else{
                  alert("No puede cambiar controles futuros")
                }
              })
          }
      })
    })
    connection.end()
}

function dibujarSalas(){
    const connection = mysql.createConnection(credenciales)
    var salasTemplate='<div class="row" id="salas">'
    let query = 'select LAB_ABREVIATURA, CAM_CODIGO FROM laboratorio WHERE LAB_ESTADO=1'
    connection.connect() 
    connection.query(query,function(err,rows,fields){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        let salas=rows;
        salas.forEach(sala => {
          salasTemplate+=`
          <div class="col-xs-4 p-2" id="${sala.LAB_ABREVIATURA}" style="display: none">
            <div class="card  bg-light mb-5" style="max-width: 20rem;" >
              <div class="card-header">
                <div class="row">
                  <div class="col-md-2">
                      <label  class="btn btn-primary">${sala.LAB_ABREVIATURA}</label>
                  </div>
                  <div class="col-md-8">
                    <h5></h5>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <h4 class="card-title"></h4>
              </div>
              <div class="card-footer">
                  <button class="btn btn-secondary btn-block">
                    DISPONIBLE
                  </button>
              </div>
            </div>
          </div>  
          `
        })
        document.getElementById("salas").innerHTML = salasTemplate
        salas.forEach(sala => {
          mostrarLaboratorios(sala.CAM_CODIGO,sala.LAB_ABREVIATURA)
        })
    })
  connection.end() 
  
}

function reloj(){
  fecha=new Date();
  if(hora_actual=="06:45:00" || hora_actual=="09:16:00" || hora_actual=="11:46:00" || hora_actual=="13:46:00"){
    listarControles(obtenerHoraLaboral())
  } 
  if (!document.layers&&!document.all&&!document.getElementById)
    return
     const Digital=new Date()
     var hours=Digital.getHours()
     var minutes=Digital.getMinutes()
     var seconds=Digital.getSeconds()
     var dn="PM"
     if(hours<10){
      hora_actual="0"+hours+":"+minutes+":"+seconds;
    }else{
      hora_actual=hours+":"+minutes+":"+seconds;
    }
     if (hours<12)
      dn="AM"
    if (hours>12)
      hours=hours-12
    if (hours==0)
      hours=12
    if (minutes<=9)
       minutes="0"+minutes
    if (seconds<=9)
       seconds="0"+seconds
    //change font size here to your desire
    myclock=hours+":"+minutes+":"+seconds+" "+dn+"</b></font>"
    if (document.layers){
      document.layers.liveclock.document.write(myclock)
      document.layers.liveclock.document.close()
    }
    else if (document.all)
      liveclock.innerHTML=myclock
    else if (document.getElementById)
      document.getElementById("liveclock").innerHTML=myclock
      setTimeout("reloj()",1000)
}
function saberDia(horario){
    let diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    let dia_actual = diasSemana[fecha.getDay()];
    let diaTemplate =` 
    <div id=dia>
        <h1>${dia_actual}: ${horario}</h1>
    </div>
    `
    document.getElementById("dia").innerHTML = diaTemplate
}
function obtenerHoraLaboral(){
    var hora="No es Hora Laboral";
    if(hora_actual.valueOf()>=("06:45:00").valueOf() && hora_actual.valueOf()<("09:15:00").valueOf()){
        hora="07:00:00-09:00:00"
    }else{
        if(hora_actual.valueOf()>=("09:15:00").valueOf() && hora_actual.valueOf()<("11:45:00").valueOf()){
            hora="09:30:00-11:30:00"
        }else{
            if(hora_actual.valueOf()>=("11:45:00").valueOf() && hora_actual.valueOf()<("14:00:00").valueOf()){
                hora="12:00:00-14:00:00"
            }else{
                if(hora_actual.valueOf()>=("14:00:00").valueOf() && hora_actual.valueOf()<("16:15:00").valueOf()){
                    hora="14:00:00-16:00:00"
                }
            }
        }
    }
    return hora 
}

function menubar(){
  const templateMenu = [
    {
      label: 'Acerca de:',
      click() {
          alert("Sistema desarrollado por: \nDaniel Lopez rodridani439@gmail.com \nJipson Murillo jymurillo@espe.edu.ec");
      },
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
    }, 
    
  ];
    // Menu
    const mainMenu = index.Menu.buildFromTemplate(templateMenu);
    // Set The Menu to the Main Window
    index.Menu.setApplicationMenu(mainMenu);
    // Menu Template
}

function seleccionarHora(opcion_hora){
    listarControles(opcion_hora);
}

function crearVentanaAutentificar(docente,accion) {
  var tarjeta={
    docente: docente,
    accion: accion,
    hora_actual: hora_actual
  };
  if(accion!="FINALIZADO"){
    new_auth_window = new index.BrowserWindow({
      parent: index.mainWindow,
      modal: true,
      width: 300,
      height: 180,
      title: 'Autentificacion'
    });
    //new_auth_window.setMenu(null);
    new_auth_window.loadURL(index.url.format({
      pathname: index.path.join(__dirname, '/autentificacion.html'),
      protocol: 'file',
      slashes: true
    }));
    new_auth_window.on('closed', () => {
      new_auth_window = null;
    });
    new_auth_window.webContents.on('did-finish-load', () => {
      new_auth_window.webContents.send('tarjeta', tarjeta)
    })
  }
  
}

function mostrarLaboratorios(campus,sala){
  var mostrar=""
  if( document.getElementById("CAMPUS-"+campus).checked==false){
    mostrar="none"
  }
  if( document.getElementById("CAMPUS-"+campus).checked==true){
    mostrar="block"
  }
  if(sala!=null){
    document.getElementById(sala).style.display = mostrar
  }else{
    const connection = mysql.createConnection(credenciales)
    let query = 'select LAB_ABREVIATURA FROM laboratorio WHERE LAB_ESTADO=1 AND CAM_CODIGO='+campus
    connection.connect() 
    connection.query(query,function(err,rows,fields){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        let salas=rows;
        salas.forEach(lab => {
          document.getElementById(lab.LAB_ABREVIATURA).style.display = mostrar
        })
      })
    connection.end()
  }
}

function buscarCambios(){
  let string_fecha=fecha.getFullYear() + "-" + (fecha.getMonth() +1) + "-" + fecha.getDate();
  const connection = mysql.createConnection(credenciales)
  let query = "select * FROM control WHERE CON_DIA='"+string_fecha+"'"
    connection.connect() 
    connection.query(query,function(err,rows,fields){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        datos="";
        controles=rows;
        controles.forEach(control => {
          datos+=control.CON_CODIGO
          datos+=control.CON_HORA_ENTRADA_R
          datos+=control.CON_HORA_SALIDA_R
        });
        if(datos.localeCompare(document.getElementById("datos").innerHTML)!=0){
          document.getElementById("datos").innerHTML = datos
          datos=document.getElementById("datos").innerHTML
          listarControles(horario_actual)
        }
    })
    connection.end()
    setTimeout("buscarCambios()",1000)
  }



function iniciar(){
    listarControles("");
    reloj();
    menubar();
    buscarCambios();
    
}

window.onload=iniciar;