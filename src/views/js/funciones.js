const remote = require('electron').remote
const index = remote.require('./index.js')
const fecha=new Date();
var horario_actual;
var hora_actual=fecha.getHours()+":"+fecha.getMinutes()+":"+"00";
if(fecha.getHours()<10){
  var hora_actual="0"+fecha.getHours()+":"+fecha.getMinutes()+":"+"00";
}


function listarControles(horario) {
    //saber hora para el selecet
    if (horario==""){        
        horario=obtenerHoraLaboral();
    }
    if(horario!="No es Hora Laboral"){
      dibujarSalas()
    }
    horario_actual=horario;
    saberDia(horario)
    let hora=horario.split("-",1)
    //
    let string_fecha=fecha.getFullYear() + "-" + (fecha.getMonth() +1) + "-" + fecha.getDate();
    console.log(string_fecha)
    let query = 'select CON_DIA,MAT_ABREVIATURA,control.DOC_CODIGO,DOC_NOMBRES,DOC_APELLIDOS,DOC_TITULO,CON_EXTRA,LAB_NOMBRE,control.CON_HORA_ENTRADA,control.CON_HORA_SALIDA,control.CON_HORA_ENTRADA_R,control.CON_HORA_SALIDA_R FROM control,materia,docente,laboratorio WHERE control.MAT_CODIGO=materia.MAT_CODIGO and control.DOC_CODIGO=docente.DOC_CODIGO and control.LAB_CODIGO=laboratorio.LAB_CODIGO and control.CON_DIA="2019-11-22" and control.CON_HORA_ENTRADA='+'"'+hora+'"'
    let salas=["SALA 01","SALA 02","SALA 03","SALA 04","SALA 05","SALA 06","COMPUTACIÓN I","COMPUTACIÓN II","REDES DE DATOS"];
    let sala_nombre;
    let ocasional="H";
    let color_tarjeta=["light","warning","danger","success"];
    let accion_boton=["DISPONIBLE","ENTRAR","SALIR","FINALIZADO"]
    let indice_colores;
    index.connection.query(query,function(err,rows,fields){
        if (err){
          console.log("error fatal")
          console.log(err)
          return
        }
        controles=rows;
        controles.forEach(control => {
            //Obteniendo el codigo de la sala
            sala_nombre=control.LAB_NOMBRE.split(" ", 2);
            if (sala_nombre[0]=="SALA"){
                sala_codigo="S"+sala_nombre[1].split("0",2)[1];
            }else{
                if(sala_nombre[0]=="COMPUTACIÓN"){
                  if(sala_nombre[1]=="I"){
                    sala_codigo="C"+"1";
                  }else{
                    sala_codigo="C"+"2";
                  }
                }else{
                    sala_codigo="RE";
                }
            }
            //Obtienedo si es ocacional
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
            <div id= ${sala_nombre}>
            <div class="card text-white bg-${color_tarjeta[indice_colores]} mb-5" style="max-width: 20rem;">
                <div class="card-header">
                    <div class="row">
                    <div class="col-md-2">
                        <label  class="btn btn-secondary">${sala_codigo}</label>
                    </div>
                    <div class="col-md-8">
                        <h5>${control.MAT_ABREVIATURA} </h5>
                    </div>
                    </div>
                </div>
                <div class="card-body">
                    <h4 class="card-title">${control.DOC_TITULO} ${control.DOC_APELLIDOS} ${control.DOC_NOMBRES} <a class="card-text" style="color:#fffb00";>${ocasional}</a> </h4>
                </div>
                <div class="card-footer">
                    <button id=boton${sala_codigo} class="btn btn-${color_tarjeta[indice_colores]}">
                      ${accion_boton[indice_colores]}
                    </button>
                </div>
                </div>
            </div>
            `;
            salas.forEach(sala=>{
                if(control.LAB_NOMBRE==sala){
                    document.getElementById(sala).innerHTML = controlesTemplate;
                }
            })
            let btn=document.getElementById("boton"+sala_codigo)
            btn.addEventListener('click', e => {
              crearVentanaAutentificar(control.DOC_CODIGO, accion_boton[indice_colores])
            })
      })
    })

    //index.closeConnection()
}

function dibujarSalas(){
    var salasTemplate =`
    <div class="row" id="salas">    
        <div class="col-xs-4 p-2" id="SALA 01">
            <div class="card  bg-light mb-5" style="max-width: 20rem;" >
              <div class="card-header">
                <div class="row">
                  <div class="col-md-2">
                      <label  class="btn btn-secondary">S1</label>
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
                  <button class="btn btn-secondary">
                    DISPONIBLE
                  </button>
              </div>
            </div>
          </div>  
        <!---->
        <div class="col-xs-4 p-2" id="SALA 02">
            <div class="card  bg-light mb-5" style="max-width: 20rem;" >
              <div class="card-header">
                <div class="row">
                  <div class="col-md-2">
                      <label  class="btn btn-secondary">S2</label>
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
                  <button class="btn btn-secondary">
                    DISPONIBLE
                  </button>
              </div>
            </div>
          </div>  
        <!---->
        <div class="col-xs-4 p-2" id="SALA 03">
            <div class="card  bg-light mb-5" style="max-width: 20rem;" >
              <div class="card-header">
                <div class="row">
                  <div class="col-md-2">
                      <label  class="btn btn-secondary">S3</label>
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
                  <button class="btn btn-secondary">
                    DISPONIBLE
                  </button>
              </div>
            </div>
          </div>  
      <!---->
        <div class="col-xs-4 p-2" id="SALA 04">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">S4</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>    
       <!---->
       <div class="col-xs-4 p-2" id="SALA 05">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">S5</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>    
       <!---->
       <div class="col-xs-4 p-2" id="SALA 06">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">S6</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>    
       <!---->
       <div class="col-xs-4 p-2" id="REDES DE DATOS">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">RE</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>    
       <!---->
       <div class="col-xs-4 p-2" id="COMPUTACIÓN I">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">C1</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>    
       <!---->
       <div class="col-xs-4 p-2" id="COMPUTACION II">
          <div class="card  bg-light mb-5" style="max-width: 20rem;" >
            <div class="card-header">
              <div class="row">
                <div class="col-md-2">
                    <label  class="btn btn-secondary">C2</label>
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
                <button class="btn btn-secondary">
                  DISPONIBLE
                </button>
            </div>
          </div>
        </div>
    </div>    
        `;
      document.getElementById("salas").innerHTML = salasTemplate
}

function reloj(){
    if (!document.layers&&!document.all&&!document.getElementById)
    return
    
     const Digital=new Date()
     var hours=Digital.getHours()
     var minutes=Digital.getMinutes()
     var seconds=Digital.getSeconds()
    
    var dn="PM"
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
    myclock=hours+":"+minutes+":"
     +seconds+" "+dn+"</b></font>"
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
      label: '7:00-9:00',
      click() {
        if(hora_actual.valueOf()>="06:45:00"){
          listarControles("07:00:00-9:00:00");
        }else{
          alert("No puede acceder a controles futuros");
        }
      }
    },
    {
      label: '9:30-11:30',
      click() {
        if(hora_actual.valueOf()>="09:15:00"){
          listarControles("09:30:00-11:30:00");
        }else{
          alert("No puede acceder a controles futuros");
        }
      }
    },
    {
      label: '12:00-14:00',
      click() {
        if(hora_actual.valueOf()>="11:45:00"){
          listarControles("12:00:00-14:00:00");
        }else{
          alert("No puede acceder a controles futuros");
        }
      }
    },
    {
      label: '14:00-16:00',
      click() {
        if(hora_actual.valueOf()>="14:00:00"){
          listarControles("14:00:00-16:00:00");
        }else{
          alert("No puede acceder a controles futuros"+hora_actual);
        }
      }
    },  
    
  ];
    // Menu
    const mainMenu = index.Menu.buildFromTemplate(templateMenu);
    // Set The Menu to the Main Window
    index.Menu.setApplicationMenu(mainMenu);
    // Menu Template
}

function crearVentanaAutentificar(docente,accion) {
  var tarjeta={
    docente: docente,
    accion: accion,
    hora_actual: hora_actual
  };
  if(accion!="FINALIZADO"){
    new_auth_window = new index.BrowserWindow({
      width: 300,
      height: 240,
      title: 'Autentificacion'
    });
    new_auth_window.setMenu(null);
    new_auth_window.loadURL(index.url.format({
      pathname: index.path.join(__dirname, '/autentificacion.html'),
      protocol: 'file',
      slashes: true
    }));
    new_auth_window.on('closed', () => {
      listarControles(horario_actual)
      new_auth_window = null;
    });
    new_auth_window.webContents.on('did-finish-load', () => {
      new_auth_window.webContents.send('tarjeta', tarjeta)
    })
  }
  
}


function iniciar(){
    listarControles("");
    reloj();
    menubar();
}
window.onload=iniciar;