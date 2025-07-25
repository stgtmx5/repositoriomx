/********************************
GENERACIÓN DE FACTURA ELECTRÓNICA
Grupo Execom
v=3.4
********************************/


//IMPORTANTE: Déminus,deminus
//----------------------------
//EL CONTENIDO DE ESTE ARCHIVO ES EL MISMO PARA DEMINUS Y MAXICOMERCIO.
//EL CÓDIGO CONTIENE VALIDACIONES PARA IDENTIFICAR SI UN PROCESO PERTENECE A DEMINUS O MAXICOMERCIO,
//P.E. FACTURACION A CONSUMO DE ALIMENTOS SOLO APLICA PARA DEMINUS.

//LA ACTUALIZACION DEL ARCHIVO SE DEBE HACER MODIFICANDO EL CONTENIDO DEL SCRIPT DE MAXICOMERCIO
//LUEGO REALIZAR UNA COPIA Y CAMBIAR EL NOMBRE DE APLICACION (VARIABLE: ApplicationName) PARA INCLUIRLO A DEMINUS.
//----------------------------



//NOTA SE USA UIVentas,UIDef PARA OPERACIONES CON INTERFAZ.
/****************************************************
	IMPORTANTE TODAS LAS FUNCIONES PUBLICAS:
	obtenerFacturaElectonica(),qCFD(), mas todas las que usted agregue.	
	ESTAS FUNCIONES DEBEN LLAMAR inicializarObjetos() ANTES DE EJECUTAR ALGUN PROCESO.
	
	SE NECESITA DATAOBJECTS PARA CONFIGURAR UICFD.
*****************************************************/


var pkRangoFolioAprobado=0; //Sys_PK de ut_CFDfolio
var Utilizarfrontera;
var ubicacionAddenda="CFD\\Cliente\\addenda_"; //Más código de cliente 
var ubicacionCConcepto="CFD\\Producto\\cconcepto_"; //Más código de producto //ubicacion complemento concepto
var ubicacionComplemento="CFD\\Complemento\\complemento.js";
var proccess; //geCFD.cProccess  Encryptacion y procesos para sello digital
var uiCFD; //geUICFD.cAcction configuracion de cfds
var dsgnTemplate2; //dsgnTemplateTXTC2.cMain //GUARDAR PDF, DOC

var OnBackOffice=true; //indica si el script esta siendo ejecutados desde el backoffice; false=POS
var ApplicationName="Maxicomercio"; //Nombre de la aplicación - Maxicomercio o Deminus

//CFD 2.0
var cmdSQLqCFD="SELECT * FROM qryCFDVentas ORDER BY Fecha,Documento,Referencia";
var CmdSQLqCFDMes="SELECT * FROM qryCFDVentas WHERE Month(Fecha)=@Mes AND Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var CmdSQLqCFDTodos="SELECT * FROM qryCFDVentas WHERE Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var cmdSQLqCFD_CXC="SELECT * FROM qryCFDCxC ORDER BY Fecha,Documento,Referencia";
var CmdSQLqCFDMes_CXC="SELECT * FROM qryCFDCxC WHERE Month(Fecha)=@Mes AND Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var CmdSQLqCFDTodos_CXC="SELECT * FROM qryCFDCxC WHERE Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";


//CFDI 3.0
var IcmdSQLqCFD="SELECT * FROM qryCFDIVentas ORDER BY Fecha,Documento,Referencia";
var ICmdSQLqCFDMes="SELECT * FROM qryCFDIVentas WHERE Month(Fecha)=@Mes AND Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var ICmdSQLqCFDTodos="SELECT * FROM qryCFDIVentas WHERE Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var IcmdSQLqCFD_CXC="SELECT * FROM qryCFDICxC ORDER BY Fecha,Documento,Referencia";
var ICmdSQLqCFDMes_CXC="SELECT * FROM qryCFDICxC WHERE Month(Fecha)=@Mes AND Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";
var ICmdSQLqCFDTodos_CXC="SELECT * FROM qryCFDICxC WHERE Year(Fecha)=@Anio ORDER BY Fecha,Documento,Referencia";

var cfg_usarRetencionImpuesto2=true;//activa la integracion de retenciones si el impuesto 2 es negativo

/****************************************
ADDENDA, COMPLEMENTO, COMPLEMENTOCONCEPTO
CARPETA EN REPOSITORIO: 
	CFD\Cliente\Addenda_CodigoCliente.js
	CFD\Complemento\complemento.js
	CFD\Producto\CConcepto_CodigoProducto.js
	CFD\messageinfo.dat [información en cuerpo del mensaje de correo]
****************************************/

//NOTA: Asegurar una cadena cuando el atributo es tipo string. Si el valor asignado es vacio desde un propiedad de un objeto se producirá un error.
//Si Objeto.propiedadString="";
	//cfd.atributoString=Objeto.propiedadString; 	//ERROR
	//cfd.atributoString=Objeto.propiedadString+""; //CORRECTO


//Para registrar
//C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727>regasm C:\geCFD.dll /tlb:geCFD.tlb /codebase


/*************
	PARAMETRO: TIPO: 1=Venta 2= CXC, CAMPO BD uf_Tipo: 2=CFD2.0, 3=CFD3.0
*************/

/******************************************
			CARGAR ACCCIONES
******************************************/
function getUICFD(){
	inicializarObjetos();
	return uiCFD;
}

function CrearPanel(){
//SOLO PARA BACKOFFICE
		
	Application.UIShortCuts.CreateAction("CFD_A01","Abrir documento ",0,"","","","cfd.AbrirDocumento",0,"","","",0);	
	Application.UIShortCuts.CreateAction("CFD_A02","Vista previa ",0,"","","","cfd.VistaPrevia",0,"","","",0);
	//Application.UIShortCuts.CreateAction("CFD_A03","Exportar",0,"","","","cfd.ExportarCFD",0,"","","",0);
	//Application.UIShortCuts.CreateAction("CFD_A04","Enviar por e-Mail",0,"","","","cfd.EnviareMail",0,"","","",0);
	Application.UIShortCuts.CreateAction("CFD_A05","Realizar informe mensual",0,"","","","cfd.RealizarInformeMensual",0,"","","",0);
	Application.UIShortCuts.CreateAction("CFD_A06","Ver informes generados",0,"","","","cfd.VerInformesGenerados",0,"","","",0);	
	
	Application.UIShortCuts.CreateAction("CFD_A07","Eliminar factura electrónica",0,"","","","cfd.EliminarCFD",0,"","","",0);
			
	//=========== VENTAS =========	
	Application.UIShortCuts.CreateAction("CFD_A08","Generar Factura Electrónica",0,"","","","cfd.crearCFDVentas",0,"","","",0);	
	//============================	
	
	//============ CXC ===========
	Application.UIShortCuts.CreateAction("CFD_A09","Generar Factura Electrónica",0,"","","","cfd.crearCFDCXC",0,"","","",0);	
	Application.UIShortCuts.CreateAction("CFD_A09b","Cancelar Factura Electrónica",0,"","","","cfd.cancelarMovCXC",0,"","","",0);	
	//============================
	
	
	//============================
	//Application.UIShortCuts.CreateAction("CFD_A10","Más opciones",0,"","","","cfd.MasOpciones",0,"","","",0);		
	//============================		
	
	//R5
	Application.UIShortCuts.CreateAction("CFD_A03","Cancelar CFDI",0,"","","","cfd.R5CancelarCFDI",0,"","","",0);
	Application.UIShortCuts.CreateAction("CFD_A04","Marcar CFDI Cancelado",0,"","","","cfd.R5MarcarCFDI",0,"","","",0);
	Application.UIShortCuts.CreateAction("CFD_A10","Eliminar CFDI",0,"","","","cfd.R5EliminarCFDI",0,"","","",0);	
	
	IniciarScript();
}

function R5CancelarCFDI(A)
{
	cfdi.cancelarBrwCFDI(A);
	var Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null) return;
	Brw.RefreshRst();
	Application.MouseDefault();
}
function R5MarcarCFDI()
{
	var Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null) return;
	var FolioSAT=Brw.GetFieldValue("FolioSAT");
	cfdi33.MarcarCFDICancelado(FolioSAT);
	Brw.RefreshRst();
	Application.MouseDefault();
}
function R5EliminarCFDI()
{
	var Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null) return;
	var FolioSAT=Brw.GetFieldValue("FolioSAT");
	cfdi33.EliminarCFDI(FolioSAT);
	Brw.RefreshRst();
	Application.MouseDefault();
}

function IniciarScript(){
//Tambien se llama desde el POS
	inicializarObjetos();
	LBVenta.SetUiCFD(uiCFD);
	if(!OnBackOffice){
		loadScript("cfdi","(Subprograma funciones para generacón de Comprobantes Fiscales Digitales por Internet)");	
	}
	cfdi.inicializarObjetos();
	cfdi.OnBackOffice=OnBackOffice;
}

/******************************************
			FUNCION PUBLICA
		LLAMAR PARA GENERAR CFD
******************************************/
function obtenerFacturaElectronica(pkventa){
	return obtenerFE(pkventa,1);
}
function obtenerFacturaElectronica_CXC(pkcxc){
	return obtenerFE(pkcxc,2);
}
function obtenerFE(pk,TIPO){
//FUNCION PUBLICA
var archivo_xlst;
var archivo_privateKey;
var password_privateKey;
var r;
var resultado;
var sql="";

	if(TIPO==null) TIPO=-1;
	if(TIPO!=1 && TIPO!=2){
		eBasic.eMsgbox("El tipo de documento es incorrecto o no se ha indicado el valor.",6);
		return 0;
	}
	
	if(esInvalido(pk,"No se ha indicado la clave del documento.",true)) return 0;	

	if(!inicializarObjetos()) return 0;

	if(!uiCFD.PermitirAcceso("FXCA326x",Application.UIUsers.CurrentUser)){
		eBasic.eMsgbox("No se pudo crear el comprobante fiscal digital",6);
		Log("Permiso denegado. No se pudo crear el comprobante fiscal digital.");
		return 0;
	}
	//obtener datos de configuracion
	archivo_xlst=eBasic.AddSlashPath(GetRepository())+"CFD\\xslt\\cadenaoriginal_2_2.xslt";
	
	
	switch(TIPO){
		case 1: 
			sql="SELECT ut_CFDInfo.uf_LLavePrivada,ut_CFDInfo.uf_Clave FROM (Venta INNER JOIN (FoliosDocumentos INNER JOIN (BlockDocumentos INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON BlockDocumentos.uf_CFDfolio=ut_CFDFolio.Sys_PK) ON FoliosDocumentos.Block=BlockDocumentos.Sys_PK) ON Venta.IFolio=FoliosDocumentos.Sys_PK) WHERE Venta.Sys_PK="+pk;break;
		case 2: 
			sql="SELECT ut_CFDInfo.uf_LLavePrivada,ut_CFDInfo.uf_Clave FROM (DCXC INNER JOIN (FoliosDocumentos INNER JOIN (BlockDocumentos INNER JOIN (ut_CFDFolio INNER JOIN ut_CFDInfo ON ut_CFDFolio.uf_CFDInfo=ut_CFDInfo.Sys_PK) ON BlockDocumentos.uf_CFDfolio=ut_CFDFolio.Sys_PK) ON FoliosDocumentos.Block=BlockDocumentos.Sys_PK) ON DCXC.IFolio=FoliosDocumentos.Sys_PK) WHERE DCXC.Sys_PK="+pk;break;
		default:
			eBasic.eMsgbox("Error. Tipo de documento incorrecto.",6);
			return 0;
	}
	
	r=openRecordset(sql,true);
	if(esInvalido(r,"Error al acceder a información de certificado de sello digital. Es posible que el folio utilizado no sea un folio fiscal para CFD.")){
		return 0;
	}

	archivo_privateKey=stringValue(r,"uf_LLavePrivada");
	password_privateKey=stringValue(r,"uf_Clave");
	
		
	Application.MouseHourglass();
	resultado= generarFacturaElectronica(pk,archivo_xlst,archivo_privateKey,password_privateKey,TIPO);	
	Application.MouseDefault();
	return resultado;
}

/******************************************
			FUNCIÓN PRINCIPAL		
******************************************/

function generarFacturaElectronica(documento_SysPK,xsltfile,privateKeyFileName,pwd,TIPO){	
//TIPO: 1=Venta, 2=DCXC
	var cfd;
	var StatusAdministrativo;
	var documento_obj=null;
	
	var EDOfx;
	var emptyCnn;
	
	var oString;
	var dSeal;	
	var strReport;
	
	var xml;
	var tempFolder;
	var filename="";
	var tmpf="";
	var xml_claro;	
	var montoTotalVenta;
	
	
	try{
		if(esInvalido(TIPO,"No se ha indicado el tipo de documento(Venta o Documento por cobarar).",true)) return 0;		
	
		if(esInvalido(documento_SysPK,"No se ha indicado la clave del documento.",true)) return 0;	
										
		pkRangoFolioAprobado=0;
		Utilizarfrontera=UtilizarImpuestoFrontera();
		
		//tempFolder=eBasic.AddSlashPath(eBasic.GetTempDir());//+"cfd_temp";
		//eBasic.MakePath(tempFolder);
		
		tmpf=proccess.getTempFileName();
		filename=tmpf+".xml";//eBasic.AddSlashPath(tempFolder)+"comprobante_cfd.xml";
				
		documento_obj=null;
		switch(TIPO){
			case 1: 				
				documento_obj=eBasic.eCreateObject("EDOFx.Venta");break;				
			case 2:
				documento_obj=eBasic.eCreateObject("EDOFx.DCxC");				
												
				break;
				
			default:
				Log("Documento incorrecto");
				return 0;
		}
		
		if(esInvalido(documento_obj,"Error al crear objeto EDOFx.Venta-DCXC")) return 0;	
		//Cargar objeto	
		if(!documento_obj.LoadFromADOConnection(documento_SysPK,"",Application.ADOCnn,3)){
			Log("Error al cargar documento. "+documento_obj.lastErrDescrip);
			return 0;
		}
		
		EDOfx=eBasic.eCreateObject("EDOFx.EDO_Fx");
		if(esInvalido(EDOfx,"Error al crear objeto EDOFx.EDO_Fx")) return 0;			
		emptyCnn=eBasic.eCreateObject("ADODB.Connection");
		
		Log("===========================================");
		Log("Creando Comprobante Fiscal Digital (CFD)...");
		Application.eDoevents();		
		
		switch(TIPO){
			case 1: //venta
				StatusAdministrativo=documento_obj.StatusAdministrativo;
				cfd=generarCFD(documento_obj);break;				
			case 2: //cxc
				StatusAdministrativo=3;//siempre 3 para cxc ya que el documento siempre sera procesado(para cfd vigente [1])
				cfd=generarCFD_CXC(documento_obj);	break;
			default:
				Log("Documento incorrecto");
				return 0;
		}
		
		
		
		if(cfd!=null){
			xml = cfd.getXML(filename,true); //[guardar_en_archivo],[omitirValidarSello]
									
			if(esInvalido(xml,"Error al generar xml. "+cfd.lastError,false,true)) return 0;
			
			//CREAR CADENA ORIGINAL . necesario para poder guardarla en bd
			Log("Generando cadena original...");
			Application.eDoevents();
						
			oString=proccess.createOriginalString(filename,xsltfile);		
			if(esInvalido(oString,"Error al generar cadena original. "+proccess.lastError,false,true)){
				DeleteFile(filename);
				DeleteFile(tmpf);
				return 0;
			}
			
			Log("Generando sello digital...");
			Application.eDoevents();
									
			dSeal=proccess.getDigitalSeal(filename,xsltfile,privateKeyFileName,uiCFD.DecryptString(pwd));
			
			if(esInvalido(dSeal,"Error al generar sello digital. "+proccess.lastError,false,true)){
				DeleteFile(filename);
				DeleteFile(tmpf);
				return 0;
			}
					
			//ASIGNAR SELLO EN XML
			cfd.sello = dSeal; //R		
			xml = cfd.getXML(filename,false);
			if(esInvalido(xml,"Error al insertar sello en xml",false,true)){
				DeleteFile(filename);
				DeleteFile(tmpf);
				return 0;
			}
			
			xml_claro=eBasic.LoadFileToStr(filename);
			if(esInvalido(xml_claro,"",false,true)) xml_claro=xml;
									
			Log("Guardando registro...");
			Application.eDoevents();
			try{
				EDOfx.SetConnection(Application.ADOCnn);
				EDOfx.BeginTrans();
				
				pkCFD=guardarCFD(xml_claro,oString,dSeal,documento_obj,pkRangoFolioAprobado,cfd.fecha);
				if(esInvalido(pkCFD,"Error al guardar registro.",true)){
					EDOfx.RollbackTrans();							
					EDOfx.SetConnection(emptyCnn);
					DeleteFile(filename); //borrar archivo xml
					return 0;
				}
				
				//montoTotalVenta=roundValue(venta.Subtotal-venta.Descuento1-venta.Descuento2+venta.Impuesto1+venta.Impuesto2+venta.Impuesto3+venta.Impuesto4);
				strReport=generarRegistroDeReporte(cfd,StatusAdministrativo,documento_obj.TipoCambio);
				if(esInvalido(strReport,"Error al obtener datos para bitácora de facturación.",false,true)){
					EDOfx.RollbackTrans();			
					EDOfx.SetConnection(emptyCnn);
					DeleteFile(filename); //borrar archivo xml
					DeleteFile(tmpf);
					return 0;
				}
				
				if(!guardarBitacoraCFD(strReport,pkCFD)){
					EDOfx.RollbackTrans();				
					EDOfx.SetConnection(emptyCnn);
					Log("Error al guardar bitácora de facturación.");			
					DeleteFile(filename); //borrar archivo xml
					DeleteFile(tmpf);
					return 0;
				}
							
				EDOfx.CommitTrans();
				EDOfx.SetConnection(emptyCnn);
			}catch(e){
				EDOfx.RollbackTrans();
				EDOfx.SetConnection(emptyCnn);
				throw(e);
				return 0;
			}			
						
			if(!guardarPresentacion(documento_SysPK,pkCFD,TIPO)){
				Log("No se pudo guardar la versión de impresión del documento generado.");			
				DeleteFile(filename); //borrar archivo xml
				DeleteFile(tmpf);
				return 0;
			}
								
			//Log("*******************************************");
			Log("========== Comprobante Fiscal Digital generado correctamente ==========");		
			//Log("*******************************************");
			Application.eDoevents();
			
			uiCFD.GuardarCopiaComprobante(filename,documento_obj.Referencia+".xml");
			DeleteFile(filename); //borrar archivo xml
			DeleteFile(tmpf);
			
			EDOfx=null;			
			return pkCFD;
		}else{
			Log("Error al generar CFD.");
			eBasic.eMsgbox("Error al generar CFD. Proceso cancelado.",6);
			Application.eDoevents();
			return 0;
		}		
	}catch(e){
		Log("Error en método facturacionelectronica()");
		throw(e);
		return 0;
	}
}

/******************************************
	OPERACIONES ADICIONALES
******************************************/
function inicializarObjetos(){
	if(uiCFD==null){
		uiCFD=eBasic.eCreateObject("geUICFD.cAcction");		
		if(esInvalido(uiCFD,"Error al obtener objeto geUICFD.cAcction")) return false;
		//uiCFD=Configuracion.UIeInvoice;
		//if(DataAccess.ADOCnn==null)
			//eBasic.eMsgbox("Error");
				
		uiCFD.SetDataObjects(DataAccess,Catalogos); 
		uiCFD.AppRepositoryPath=GetRepository();
		uiCFD.AppReportsPath=eBasic.AddSlashPath(GetRepository())+"Reports";		
		
		try
		{//BackOffice
			ApplicationName=Application.cAppInfo.Name;
		}catch(e)
		{//Punto de Venta
			ApplicationName=Application.AppName;
		}
			
		uiCFD.ApplicationName=ApplicationName;
		
		//Configuracion.SetUIeInvoice(uiCFD);		
	}else{		
		if(!uiCFD.isSet()){			
			uiCFD.SetDataObjects(DataAccess,Catalogos); 
			uiCFD.AppRepositoryPath=GetRepository();
			uiCFD.AppReportsPath=eBasic.AddSlashPath(GetRepository())+"Reports";		
			
			try
			{//BackOffice
				ApplicationName=Application.cAppInfo.Name;
			}catch(e)
			{//Punto de Venta
				ApplicationName=Application.AppName;
			}
			
			uiCFD.ApplicationName=ApplicationName;		
			
			uiCFD.asignarTiposImpuesto();
		}		
	}
	
	if(proccess==null){
		proccess=eBasic.eCreateObject("geCFD.cProccess");
		if(esInvalido(proccess,"Error al crear objeto geCFD.cProccess")) return false;
	}
	
	if(dsgnTemplate2==null){ //nov2010
		dsgnTemplate2=eBasic.eCreateObject("dsgnTemplateTXTC2.cMain");
		dsgnTemplate2.setConnection(Application.ADOCnn,100);
	}
	
	return true;	
}

/******************************************
	VALIDACION DE DOCUMENTO DISPONIBLE
		PARA GENERAR CFD
******************************************/

function disponibleParaGenerar(oventa,showLog){
var r;
var er="Documento inválido.";
if(showLog==null) showLog=false;
	
	if(!documentoCorrecto_Venta(oventa,showLog)) return 0;
	
	if(!uiCFD.DocumentoAprobadoParaCFD(oventa.Sys_PK)){
		if(showLog) eBasic.eMsgbox(er+" El documento tiene un folio no registrado en un rango válido.",6);
		return 0;
	}
	
	r=openRecordset("SELECT Sys_PK FROM ut_CFD WHERE uf_IVenta="+oventa.Sys_PK);
	if(esInvalido(r)){
		if(showLog) eBasic.eMsgbox("No se pudo validar la existencia del cfd para este documento.",6);
		return 0;
	}
	if(!(r.EOF && r.BOF)){
		if(showLog) eBasic.eMsgbox(er+" Elemento duplicado, ya existe un CFD para este documento.",6);
		return 0;
	}	
	
	return -1;
}

function disponibleParaGenerar_CXC(cxc,showLog){
var r;
var er="Documento inválido.";
if(showLog==null) showLog=false;
	
	if(!documentoCorrecto_CXC(cxc,showLog)) return 0;
	
	if(!uiCFD.DocumentoAprobadoParaCFD_CXC(cxc.Sys_PK)){
		if(showLog) eBasic.eMsgbox(er+" El documento tiene un folio no registrado en un rango válido.",6);
		return 0;
	}
	
	r=openRecordset("SELECT Sys_PK FROM ut_CFD WHERE uf_IDCXC="+cxc.Sys_PK);
	if(esInvalido(r)){
		if(showLog) eBasic.eMsgbox("No se pudo validar la existencia del cfd para este documento.",6);
		return 0;
	}
	if(!(r.EOF && r.BOF)){
		if(showLog) eBasic.eMsgbox(er+" Elemento duplicado, ya existe un CFD para este documento.",6);
		return 0;
	}
	var v;
	//el cfd a generar no debe ser de un dcxc con el mismo folio de una venta
	v=uiCFD.ValorCampo("SELECT Sys_PK FROM Venta WHERE IFolio=" + cxc.IFolio.Sys_PK, "Sys_PK");
	if(v==null) v=0;
	if(v>0){
		if(showLog) eBasic.eMsgbox("No se puede crear el CFD porque ya existe un documento de venta con el mismo folio.",6);
		return 0;
	}
	
	
	//ESTABLECER ATRIBUTOS SI NO LOS TIENE: FORMAPAGO,METODOPAGO,CONDICIONESPAGO Y NUMEROCUENTAPAGO 	
	//gb 01022012
	//-----------
	
	if(!asignarAtributosAdicionalesCXC(cxc)){
		if(showLog) eBasic.eMsgbox("Error al asignar atributos adicionales del comprobante fiscal (2012).",6);
		return 0;
	}
	//-----------
	
	
	return -1;
}


function documentoCorrecto_Venta(oventa,showLog)
{

var er="Documento inválido.";
if(showLog==null) showLog=false;

	if(oventa.Documento!=4 && oventa.Documento!=5){
		if(showLog) eBasic.eMsgbox(er+" El documento debe ser factura o nota de crédito.",6);
		return 0; //solo facturas y notas de crédito
	}
	if(oventa.StatusAdministrativo!=3){
		if(showLog) eBasic.eMsgbox(er+" El estatus del documento debe ser procesado (vigente pagado o crédito).",6);
		return 0; //solo procesados
	}
	
	return -1;
}

function documentoCorrecto_CXC(cxc,showLog){

var er="Documento inválido.";
if(showLog==null) showLog=false;
	
	if(cxc.Documento!=5 && cxc.Documento!=17 && cxc.Documento!=18 && cxc.Documento!=19){ //Nota de crédito,Nota de cargo,pagarè,recibo
		if(showLog) eBasic.eMsgbox(er+" El documento debe ser nota de crédito,nota de cargo, pagaré (por parcialidad) o recibo (por anticipo de financiamiento).",6);
		return 0; //solo facturas y notas de crédito
	}	
	if(cxc.Documento==17 && !cxc.Aplicable){
		if(showLog) eBasic.eMsgbox(er+" El documento debe estar marcado como aplicable.",6);
		return 0;
	}	
		
	if(cxc.Documento == 18){
		if(cxc.IVenta.Sys_PK <1 || cxc.IVenta.Documento != 4 || cxc.RelacionadoA <1 || cxc.IFolio.Sys_PK<1)
		{
			if(showLog) eBasic.eMsgbox(er+" El documento debe ser un pagaré por parcialidad.",6);
			return 0;
		}
	}
	
	if(cxc.Documento==19){
		//Un recibo debe tener folio tipo factura, es decir, generado por anticipo de un financiamiento
		if (cxc.IFolio.Sys_PK <1 || cxc.IFolio.Block.Documento != 4){			
			//no tiene folio fiscal para facturacion
			if(showLog) eBasic.eMsgbox(er+" El documento no esta relacionado con un folio para facturación.",6);
			return 0;
		}
	}
	
	return -1;
}

/******************************************
	GUARDAR CFD GENERADO
******************************************/

function guardarCFD(sXml,sCadenaOriginal,sSelloDigital,documento_edofx,pkCFDfolio,FechaHoraCFD){
//GUARDA INFORMACION EN UT_CFD
//documento_edofx= OBJETO DEL COMPONENTE EDOFX: Venta o DCxC.
	var r;
	var objDB;
	var Fld;
	var ColFld;
	var tbName="";
	
	
	if (esInvalido(documento_edofx,"El objeto indicado es inválido (documento_edofx).")) return 0;
	tbName=documento_edofx.tbName;
	
	objDB = eBasic.eCreateObject("geSDK_DB.DBTable");	
	if (esInvalido(objDB,"Error al crear el objeto geSDK_DB.DBTable")) return 0;	
	
	Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
	if (esInvalido(Fld,"Error al crear el componente eSQLBD.clsTypeInfo")) return 0;
	
	
	//*************COMPROBAR TAMAÑO DE CADENA ****************/
	var ok=true;
	if(uiCFD.databasetype(Application.ADOCnn)==1){//msaccess 65536 ? 64000
		if(sXml.length>64000 || sCadenaOriginal.length>64000 || sSelloDigital.length>64000){
			eBasic.eMsgbox("Error al guardar: Cadena demasiado larga. El motor de la base de datos no soporta cadenas con más de 64000 caracteres.",6);			
			ok=false;
		}
	}else{
		if(sXml.length>2147483647 || sCadenaOriginal.length>2147483647 || sSelloDigital.length>2147483647){
			eBasic.eMsgbox("Error al guardar: Cadena demasiado larga.",6);			
			ok=false;
		}
	}
	if(!ok){
		Log("Error cadena demasiado larga.");
		var tErrFile=eBasic.AddSlashPath(GetRepository())+"COMPROBANTE_"+documento_edofx.Referencia+".xml";
		eBasic.SaveStrToFile(tErrFile,sXml);			
		Log("Se guardó una copia del xml en "+tErrFile);
		if(uiCFD.StrConfiguracionLocal("FE_OmitirRegistroXML_CO","0")=="1"){						
			Log("ADVERTENCIA: El registro se ha realizado en la base de datos pero se ha omitido el archivo XML y el valor de la cadena original.");	
			sXml="$SIN_REGISTRO$";
			sCadenaOriginal="$SIN_REGISTRO$";
		}else{
			return 0;
		}
	}
	//**********************************************************/
		
	
	
	
	objDB.ADOCnn=Application.ADOCnn;
	objDB.SetTableName("ut_CFD");
	objDB.AddNew();
	
	ColFld = objDB.cTypeInfo;
	if (esInvalido(ColFld,"Error al intentar cargar colecciòn de campos")) return 0;
		
		
		Fld.classType = "String";
		Fld.ClassField = "uf_XML";
		Fld.DefaultVal = "";
		Fld.Value = sXml;
		Fld.isRequired = -1;
		Fld.Loaded = 0;
		Fld.Size = 2147483647;
		Fld.TableField = "uf_XML";        
		ColFld.Add (Fld);		
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "String";
		Fld.ClassField = "uf_CadenaOriginal";
		Fld.DefaultVal = "";
		Fld.Value = sCadenaOriginal;
		Fld.isRequired = -1;
		Fld.Loaded = 0;
		Fld.Size = 2147483647;
		Fld.TableField = "uf_CadenaOriginal";        
		ColFld.Add (Fld);
		
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "String";
        Fld.ClassField = "uf_SelloDigital";
        Fld.DefaultVal = "";
        Fld.Value = sSelloDigital;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 2147483647;
        Fld.TableField = "uf_SelloDigital";		
		ColFld.Add (Fld);
		
		if(tbName.toLowerCase()=="venta"){
			Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
			Fld.classType = "Long";
			Fld.ClassField = "uf_IVenta";
			Fld.DefaultVal = 0;
			Fld.Value = documento_edofx.Sys_PK;
			Fld.isRequired = 0;
			Fld.Loaded = 0;
			Fld.Size = 0;
			Fld.TableField = "uf_IVenta";		
			ColFld.Add (Fld);
		}
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Long";
        Fld.ClassField = "uf_CFDfolio";
        Fld.DefaultVal = 0;
        Fld.Value = pkCFDfolio;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 0;
        Fld.TableField = "uf_CFDfolio";		
		ColFld.Add (Fld);
		
		if(tbName.toLowerCase()=="dcxc"){
			Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
			Fld.classType = "Long";
			Fld.ClassField = "uf_IDCxC";
			Fld.DefaultVal = 0;
			Fld.Value = documento_edofx.Sys_PK;
			Fld.isRequired = 0;
			Fld.Loaded = 0;
			Fld.Size = 0;
			Fld.TableField = "uf_IDCxC";		
			ColFld.Add (Fld);
		}
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Date";
		Fld.ClassField = "uf_FechaHora";
		Fld.DefaultVal = new Date();
		Fld.Value = FechaHoraCFD;
		Fld.isRequired = -1;
		Fld.Loaded = 0;
		Fld.Size = 0;
		Fld.TableField = "uf_FechaHora";		
		ColFld.Add(Fld);
		
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Integer";
		Fld.ClassField = "uf_Tipo";
		Fld.DefaultVal = 2;
		Fld.Value = 2;//CFD 2.0
		Fld.isRequired = -1;
		Fld.Loaded = 0;
		Fld.Size = 0;
		Fld.TableField = "uf_Tipo";		
		ColFld.Add(Fld);
		
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Integer";
		Fld.ClassField = "uf_CanceladoSAT";
		Fld.DefaultVal = 0;
		Fld.Value = 0;
		Fld.isRequired = -1;
		Fld.Loaded = 0;
		Fld.Size = 0;
		Fld.TableField = "uf_CanceladoSAT";		
		ColFld.Add(Fld);
		
		if(objDB.Update()){
			return objDB.Sys_PK;
		}else{
			Log("Error al guardar factura electrónica. " + objDB.lastErrDescrip);
			return 0;
		}
}
/******************************************
	GUARDAR BITACORA DE DE CFDS GENERADOS
	GUARDA LA CADENA PARA REPORTE MENSUAL
	DE CADA CFD.
******************************************/

function guardarBitacoraCFD(datos,pkCFD){	
	var objDB;
	var Fld;
	var ColFld;
	
	objDB = eBasic.eCreateObject("geSDK_DB.DBTable");	
	if (esInvalido(objDB,"Error al crear el objeto geSDK_DB.DBTable")) return false;	
	
	Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
	if (esInvalido(Fld,"Error al crear el componente eSQLBD.clsTypeInfo")) return false;
	
	objDB.ADOCnn=Application.ADOCnn;
	objDB.SetTableName("ut_CFDBitacora");
	objDB.AddNew();
	
	ColFld = objDB.cTypeInfo;
	if (esInvalido(ColFld,"Error al intentar cargar colección de campos")) return false;
		
		Fld.classType = "String";
        Fld.ClassField = "uf_Datos";
        Fld.DefaultVal = "";
        Fld.Value = datos;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 32000;
        Fld.TableField = "uf_Datos";
        
		ColFld.Add (Fld);		
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Boolean";
        Fld.ClassField = "uf_Reportado";
        Fld.DefaultVal = "0";
        Fld.Value = 0;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 0;
        Fld.TableField = "Boolean";
        
		ColFld.Add (Fld);
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Long";
        Fld.ClassField = "uf_CFD";
        Fld.DefaultVal = "0";
        Fld.Value = pkCFD;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 0;
        Fld.TableField = "uf_CFD";
        
		ColFld.Add (Fld);
		
		if(objDB.Update()){
			return true;
		}else{
			Log("Error al guardar bitácora. " + objDB.lastErrDescrip);
			return false;
		}		
}


function guardarPresentacion(pk,pkcfd,TIPOx){
	asignarDivisa(pk,TIPOx);
	
	var tempfile;
	var r,stream,b64,reporte,archivo_temp;
	var predViewer=0;
	reporte=loadTextFromGlobalVar("FXCA303x","$AppReportsPath$\\Ventas\\facturaelectronica.xpd");
	reporte=uiCFD.ReplaceMacros(reporte,"$AppReportsPath$",uiCFD.AppReportsPath);
	
	//reporte=eBasic.AddSlashPath(GetRepository())+"Reports\\Ventas\\facturadigital.xpd";
	var f=new Date();
	archivo_temp=eBasic.AddSlashPath(eBasic.GetTempDir())+"mxcfd"+f.getFullYear()+""+f.getMonth()+""+f.getDate()+""+f.getHours()+""+f.getMinutes()+""+f.getSeconds();
	
	//Generar
	
	/*
	uf_ExtPresentacion=
		1=XPR
		2=TXT
		3=PDF
		4=DOC
		5=DOCX	
	*/	
	var tipo=1; 			// 1=Reporte CodiceFX, 2=Tira, 3=PDF,DOC,DOCX	
	var fmt_plantilla=""; 	//ubicacion del formato xpd,js,txf PARA FACTURA O NOTA DE CREDITO	
	var extension=1;		//extension del archivo 1=xpr,2=txt, 3=pdf, 4=doc y 5=docx
	var destino=1;			//1=Vista previa, 2=Impresora predeterminada y 3=No imprimir
	var enviarmail=3;		//1=Enviar a dir del cliente, 2=Solicitar direccion, 3=No enviar	
	var js="";
	var tdocumento=0;
	
	switch(TIPOx){
		case 1://venta
			tdocumento=uiCFD.TipoDocumento(pk);break;
		case 2://dcxc
			tdocumento=uiCFD.TipoDocumento_CXC(pk);break;
		default:
			Log("Tipo de documento incorrecto");
			return 0;
	}
	
	switch(tdocumento){
		case 4:
			fmt_plantilla=loadTextFromGlobalVar("CFDImp002",reporte);
			break;
		case 5:
			if(TIPOx==1) 
				fmt_plantilla=loadTextFromGlobalVar("CFDImp006","");//NCredito ventas
			else
				fmt_plantilla=loadTextFromGlobalVar("CFDImp007","");//NCredito cxc
			break;
		case 17:
			fmt_plantilla=loadTextFromGlobalVar("CFDImp008","");
			break;
		case 18:
			fmt_plantilla=loadTextFromGlobalVar("CFDImp010","");//factura-pagare 08022012
			break;
		case 19:
			fmt_plantilla=loadTextFromGlobalVar("CFDImp011","");//factura-recibo 14022012
			break;
		default:
			eBasic.eMsgbox("Documento inválido. El tipo de documento no puede ser "+tdocumento,6);
			return 0;
	}
		
	
	tipo=loadNumFromGlobalVar("CFDImp001",1);	
	extension=loadNumFromGlobalVar("CFDImp003",1);
	destino=loadNumFromGlobalVar("CFDImp004",1);
	enviarmail=loadNumFromGlobalVar("CFDImp005",3);
	predViewer=loadNumFromGlobalVar("CFDImp009",1);
	
	switch(tipo){
		case 1://reporte de códice fx
			archivo_temp+=".xpr";
			EjecutarReporte(fmt_plantilla,3,pk,true,archivo_temp);
			break;
		case 2: //Tira
			if(eBasic.FileExists(fmt_plantilla)){
				archivo_temp+=".txt";
				var obj=eBasic.GetFileNameWithoutExt(fmt_plantilla);
				if(!loadScript(fmt_plantilla)) return 0;
				//metodo predeterminado que debe tener el script:
				//ImprimirCFD(pk,Destino,Archivo)
				//pk: Sys_PK de la venta				
				//Archivo: Nombre y ruta de archivo donde se guardara el texto				
				eval(obj+".ImprimirCFD("+pk+",\""+getString(archivo_temp)+"\")");
			}else{
				Log("El archivo (*.js) para impresión no existe: "+fmt_plantilla);
				return 0;
			}
						
			break;
		case 3:	//Generador de plantillas (pdf,doc y docx)				
			switch(extension){
				case 3:
					archivo_temp+=".pdf";
					dsgnTemplate2.savePreview(fmt_plantilla,pk,512,archivo_temp);
					break;
				case 4:
					archivo_temp+=".doc";
					dsgnTemplate2.savePreview(fmt_plantilla,pk,64,archivo_temp);
					break;
				case 5:
					archivo_temp+=".docx";
					dsgnTemplate2.savePreview(fmt_plantilla,pk,1024,archivo_temp);
					break;
			}
			break;
	}
		
	//Guardar
	b64=proccess.doBase64FromFile(archivo_temp);
	if(esInvalido(b64,"Error al guardar presentación de documento. No se pudo obtener Base64.",false,true)) 	return 0;
	
	try{
		r= eBasic.eCreateObject("ADODB.Recordset");
		if(esInvalido(r,"Error al crear objeto ADODB.Recordset")) return 0;
		
		r.Open("SELECT Sys_PK,uf_Presentacion,uf_ExtPresentacion FROM ut_CFD WHERE Sys_PK="+pkcfd,Application.ADOCnn, 1, 3);
		if(r.State!=1) return 0;

		// stream = eBasic.eCreateObject("ADODB.Stream");
		// if(esInvalido(r,"Error al crear objeto ADODB.Stream")) return 0;
		
		// stream.Type = 1;
		// stream.Open();
		// if(stream.State!=1) return 0;
		
		// stream.LoadFromFile(archivo_temp);
		//r.Fields("uf_Presentacion").Value = stream.Read();				
				
		r.Fields("uf_Presentacion").Value = b64;				
		r.Fields("uf_ExtPresentacion").Value = extension;				
		r.Update();
		r.Close;
		r=null;
		// stream=null;
	}catch(e){
		//Borrar temp
		DeleteFile(archivo_temp);
		Log("Error al guardar presentación de documento.");
		throw(e);
		return 0;
	}
	
	try{
		//DESTINO
		switch(destino){
			case 1: //vista previa			
				switch(tipo)
				{
					case 1: 
					case 2: 						
						dsgnTemplate2.openDocument(archivo_temp,"");//abrir xpr o txt
						break;
					case 3: 
						if(predViewer==1 && extension==3)//pdf? en visor predeterminado?
						{
							dsgnTemplate2.openDocument(archivo_temp,"");
							break;
						}
						dsgnTemplate2.showTXFile(archivo_temp,true);//segundo parámetro indica que el archivo se borrará despues de abrir						
						break;
				}				
				break;			
			case 2: //impresora predeterminada
			
				switch(tipo)
				{
					case 1: //xpd
						EjecutarReporte(fmt_plantilla,2,pk,true);						
						//Borrar temp
						DeleteFile(archivo_temp);
						break;
					case 2: //txt
						var contenido="";
						contenido=eBasic.LoadFileToStr(archivo_temp);					
						ConfigImpresora();
						Impresora.Texto(contenido);
						Impresora.Terminar();
						//Borrar temp
						DeleteFile(archivo_temp);
						break;
					case 3: //pdf,doc,docx
						dsgnTemplate2.printTXFile(archivo_temp,true);//segundo parámetro indica que el archivo se borrará despues de imprimir
						break;
				}								
				break;		
				
			case 3:	//no imprimir				
				//Borrar temp
				DeleteFile(archivo_temp);
				break;
		}	
	}catch(e){
		eBasic.eMsgbox("Error al abrir o enviar a impresora.",6);
	}
	

	//PENDIENTE MODIFICAR ENVIAR EMAIL PARA VALIDAR EXTENSION DE ARCHIVO DE PRESENTACION

	switch(enviarmail){
		case 1: //a direccion del cliente
			EnviareMailA(pkcfd,0,TIPOx);
			break;
		case 2: //solicitar
			EnviareMailA(pkcfd,1,TIPOx);
			break;
		case 3: //no eviar
			break;
	}		

	return -1;
}

/******************************************
	GENERACION DE CADENA PARA REGISTRO 
	DE CFDS GENERADOS - REPORTE MENSUAL
******************************************/

function generarRegistroDeReporte(ocfd,statusAdministrativo,TipoCambio){
	var rep,IVAtrasladado = 0;
	var traslado,concepto;
	var i;	
		
	if(TipoCambio==null) TipoCambio=1;
	if(TipoCambio<=0) TipoCambio=1;
	
	try{
	
		rep=eBasic.eCreateObject("geCFD.cReport");
		if(esInvalido(rep,"Error al crear objeto geCFD.cReport")) return "";
		
		rep.rfcReceptor = ocfd.Receptor.rfc;
		rep.serie = ocfd.serie;
		rep.folio = ocfd.folio;
		rep.noAprobacion = ocfd.noAprobacion;
		rep.fechaHoraExpedicion = ocfd.fecha;
		rep.montoTotal = ocfd.total*TipoCambio;//montoTotal;
		if(rep.montoTotal>9999999999.99){
			Log("Valor incorrecto en monto de operación. El total no puede ser mayor a 9999999999.99");
			return "";
		}
		
		IVAtrasladado = 0;
		if(ocfd.Impuestos.Traslados.Count>0){ 
			for(i=0;i<ocfd.Impuestos.Traslados.Count;i++){ //ArrayList empieza en indice 0
				traslado=ocfd.getObjectInArrayList(ocfd.Impuestos.Traslados,i);
				if(esInvalido(traslado,"Error al obtener sumatoria de impuestos trasladados.")) return "";
				
				if (traslado.impuesto=="IVA")
				{
					IVAtrasladado += traslado.importe;  
				}    	 
			}		
		}	
		rep.montoIVATrasladado = IVAtrasladado*TipoCambio;
		
		if(rep.montoIVATrasladado>9999999999.99){
			Log("Valor incorrecto en monto de impuesto. No puede ser mayor a 9999999999.99");
			return "";
		}
		
		if(rep.montoIVATrasladado>rep.montoTotal){
			Log("Valor incorrecto en monto de impuesto. No puede ser mayor al total de la operación.");
			return "";
		}
		
		if(statusAdministrativo!=3 && statusAdministrativo!=99){
			Log("Valor inválido en estatus administrativo del documento.");
			return "";
		}
		if(statusAdministrativo==3){//Estado administrativo procesado en sistema
			rep.estadoComprobante = 1;//0.-Cancelado 1.-Vigente //valores permitidos 
		}else{ //99
			rep.estadoComprobante = 0;
		}
				
		switch (ocfd.tipoDeComprobante.toLowerCase())
		{
			case "ingreso": rep.efectoComprobante = "I"; break;
			case "egreso": rep.efectoComprobante = "E"; break;
			case "traslado": rep.efectoComprobante = "T"; break;
		}
		
		if(ocfd.Conceptos.Count>0){
			for(i=0;i<ocfd.Conceptos.Count;i++){ //ArrayList empieza en indice 0
				concepto=ocfd.getObjectInArrayList(ocfd.Conceptos,i);
				if(esInvalido(concepto,"Error al obtener información de aduana.")) return "";
				
				rep.InformacionAduanera = concepto.InformacionAduanera;
				//INFORMACION ADUANERA DE CONCEPTO.PARTE NO SE INCLUIRA.				
			}
		}	
		if (rep.isOK())
		{
			return rep.getData();
		}
		else
		{
			Log(rep.lastError);
			return "";
		}
		
	}catch(e){
		Log("Error en método: generarRegistroDeReporte");
		return "";
		throw(e);		
	}
	
}

/******************************************
	GENERACION DE OBJETO CFD PARA VENTA
******************************************/

function generarCFD(venta){
	var data;
	var pkventa;	
	var cfd;
	var r;
	var Domicilio;
	var traslado;
	var retencion;	
	
	var boCConcepto,cConcepto_js,cConcepto_contenido,resultado_CConcepto;
	var boComplemento,complemento_js,complemento_contenido,resultado_complemento;
	var boAddenda,addenda_js,addenda_contenido,resultado_addenda;
	
	
	
	if(esInvalido(venta,"No se ha indicado el documento de venta.")) return null;	
	
	pkventa=venta.Sys_PK;
	
	//Crear objectos
	//*********************************************
	cfd=null;
	cfd=eBasic.eCreateObject("geCFD.cCFD");	//new ActiveXObject("geCFD.cCFD");
	if(cfd==null){
		Log("Error al crear objeto geCFD.cCFD");
		return null;
	}		

	
	if(!disponibleParaGenerar(venta,true)) return null;
	
	try{
		//ATRIBUTOS PRINCIPALES. ELEMENTO: COMPROBANTE
		var pkCFDfolio,fechaventa,serie,noaprobacion,anoaprobacion,nocertificado,certificado;
		
		pkCFDfolio=buscarCFDfolio_Sys_PK(venta.IFolio.Block.Sys_PK);		
		if(esInvalido(pkCFDfolio,"El folio asignado al documento no tiene un número de aprobación válido.",true)) return null;
		
		pkRangoFolioAprobado=pkCFDfolio; //Utilizado para insertar en tabla ut_cfd.
		
		r=openRecordset("SELECT ut_CFDfolio.uf_Serie,ut_CFDfolio.uf_noAprobacion,ut_CFDfolio.uf_anoAprobacion,ut_CFDfolio.uf_FolioInicial,ut_CFDfolio.uf_FolioFinal,ut_CFDinfo.uf_noCertificado,ut_CFDinfo.uf_Certificado FROM ut_CFDfolio INNER JOIN ut_CFDinfo ON ut_CFDfolio.uf_CFDinfo=ut_CFDinfo.Sys_PK WHERE ut_CFDfolio.Sys_PK="+pkCFDfolio);
		if(esInvalido(r,"Error al acceder a información de folios aprobados.")) return null;
			
			fechaventa=ventaFechaHora(venta);
			if(esInvalido(fechaventa,"No se pudo cargar la fecha-hora de venta del campo uf_fechaCFD")) return null;
			
			serie=stringValue(r,"uf_serie"); //O
			noaprobacion=r("uf_noAprobacion").Value; //R
			if(esInvalido(noaprobacion,"El número de aprobación de rango de folios es inválido.",true)) return null;
			anoaprobacion=r("uf_anoAprobacion").Value; //R
			if(esInvalido(anoaprobacion,"El año de aprobación de rango de folios es inválido.",true)) return null;
			nocertificado=stringValue(r,"uf_noCertificado"); //R
			if(esInvalido(nocertificado,"El número de certificado de sello digital es inválido.",false,true)) return null;
			certificado=stringValue(r,"uf_Certificado"); //O
			if(certificado!=""){
				certificado=certificadoBase64(certificado);
				if(esInvalido(certificado,"No se pudo cargar el archivo de certificado de sello digital. Asegúrese que la ubicación es correcta.",false,true)) return null;
			}
			
			if(venta.IFolio.Folio<r("uf_FolioInicial").Value || venta.IFolio.Folio>r("uf_FolioFinal")){
				Log("Folio incorrecto. El folio se ecuentra fuera del rango de folios válido con número de aprobación: "+noaprobacion);
				return null;
			}
			
			cfd.version= 2.2;   //R //2.0->2.2 //gb 25012012
			cfd.serie = serie; //O
			cfd.folio = venta.IFolio.Folio; //R
			cfd.fecha = fechaventa;//venta.Fecha;   //R formato:"2010-04-11T18:38:20";			
			cfd.sello = ""; //R  se indicará después de generarlo.
			cfd.noAprobacion = noaprobacion;   //R
			cfd.anoAprobacion = anoaprobacion;   //R		
			cfd.formaDePago = sFormaDePago(venta);    //R
			cfd.noCertificado = nocertificado; //R
			cfd.certificado = certificado;   //O //BASE64 DE CERTIFICADO DE SELLO DIGITAL
			cfd.condicionesDePago = sCondicionesDePago(venta);    //O		
			cfd.subTotal = roundValue(venta.Subtotal);  //R
			cfd.descuento = roundValue(venta.Descuento1+venta.Descuento2);  //O		
			cfd.motivoDescuento = "";   //O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO		
			
			if(venta.IDivisa.Codigo.toUpperCase()=="PMX" || venta.IDivisa.Codigo.toUpperCase()=="MXN"){ //ES OPCIONAL
				cfd.TipoCambio=venta.TipoCambio+"";	//O
				cfd.Moneda="MXN";	//O
			}else{
				//GB se incluirá
				cfd.TipoCambio=venta.TipoCambio+"";	//O
				cfd.Moneda=venta.IDivisa.Codigo.toUpperCase()+"";	//O
			}
			
			
			cfd.total = roundValue(venta.Subtotal-venta.Descuento1-venta.Descuento2+venta.Impuesto1+venta.Impuesto2+venta.Impuesto3+venta.Impuesto4); //R		
			
			cfd.tipoDeComprobante = sTipoComprobante(venta.Documento);  //R
			cfd.metodoDePago = sMetodoDePago(venta);   //R //gb 31012012
			//LugarExpedicion se encuentra abajo
			cfd.NumCtaPago=sNumeroCuentaPago(venta); //O Atributo opcional para incorporar al menos los cuatro últimos digitos del número de cuenta con la que se realizó el pago. // gb 31012012
		
		//ELEMENTO EMISOR //R						
		cfd.Emisor.rfc = rfcEmisor();    //R
		cfd.Emisor.nombre =nombreEmisor();  //R
			//DOMICILIO FISCAL 
			Domicilio=null;
			Domicilio=oDimicilioFiscal();
			if(esInvalido(Domicilio,"No se pudo cargar el domicilio fiscal del emisor.")) return null;
			
			cfd.Emisor.DomicilioFiscal.calle = direccionDividir(Domicilio.Direccion,1)+"";  //R
			cfd.Emisor.DomicilioFiscal.noExterior= direccionDividir(Domicilio.Direccion,2)+""; //0
			cfd.Emisor.DomicilioFiscal.noInterior= direccionDividir(Domicilio.Direccion,3)+""; //O
			cfd.Emisor.DomicilioFiscal.colonia= Domicilio.Colonia+"";  //O
			cfd.Emisor.DomicilioFiscal.localidad=""; //O
			cfd.Emisor.DomicilioFiscal.referencia= Domicilio.Notas+"";   //O
			cfd.Emisor.DomicilioFiscal.municipio= obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";    //R
			cfd.Emisor.DomicilioFiscal.estado= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";   //R
			cfd.Emisor.DomicilioFiscal.pais= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";   //R
			cfd.Emisor.DomicilioFiscal.codigoPostal = Domicilio.CodPos+"";  //R
			
			//EXPEDIDO EN //OPCIONAL
			Domicilio=null;
			if(parseInt(loadTextFromGlobalVar("FXCB01121", "0"))==1) //agregado gb 26012012
			{
				//domicilio fiscal es domicilio de expedición-> domicio de expedición ya no se agrega
				
				cfd.LugarExpedicion=cfd.Emisor.DomicilioFiscal.municipio+", "+cfd.Emisor.DomicilioFiscal.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. gb 26012012
				
			}else{
				//agrear domicilio de expedición
				Domicilio=oExepedidoEn(venta.ICConsumo.Sys_PK);
				if(!esInvalido(Domicilio,"")){
					cfd.Emisor.ExpedidoEn.calle = direccionDividir(Domicilio.Direccion,1)+"";  //O
					cfd.Emisor.ExpedidoEn.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
					cfd.Emisor.ExpedidoEn.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O								
					cfd.Emisor.ExpedidoEn.colonia = Domicilio.Colonia+"";//O
					cfd.Emisor.ExpedidoEn.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
					cfd.Emisor.ExpedidoEn.referencia = Domicilio.Notas+"";//O
					cfd.Emisor.ExpedidoEn.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
					cfd.Emisor.ExpedidoEn.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
					cfd.Emisor.ExpedidoEn.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";  //R
					cfd.Emisor.ExpedidoEn.codigoPostal = Domicilio.CodPos+"";//O
					if(esInvalido(cfd.Emisor.ExpedidoEn.pais,"Falta valor en atributo País en domicilio de expedición.",false,true)) return null;
					
					cfd.LugarExpedicion=cfd.Emisor.ExpedidoEn.municipio+", "+cfd.Emisor.ExpedidoEn.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. //gb 26012012
					
				}else{					
					Log("No se pudo cargar el domicilio de expedición.");
					return null;
				}				
			}
			
			
			//REGIMEN FISCAL //REQUERIDO
			//gb 25012012
			//--------------------------
			var RegimenesFiscales,infoRegFis,k,RegimenFiscal;
			RegimenesFiscales=uiCFD.RegimenesFicalesCol();
			if (RegimenesFiscales.Count()<1)
			{
				Log("Debe indicar el régimen fiscal en el que tributa el emisor.");
				return null;
			}
			
			for(k=1;k<=RegimenesFiscales.Count();k++){					
				infoRegFis=RegimenesFiscales.Item(k);
				RegimenFiscal=eBasic.eCreateObject("geCFD.cRegimenFiscal");
				if(esInvalido(RegimenFiscal,"No se pudo crear el objeto geCFD.cRegimenFiscal")) return null;
				
				RegimenFiscal.Regimen = infoRegFis.Regimen;
				cfd.Emisor.RegimenFiscal.Add(RegimenFiscal);
				RegimenFiscal = null;
			}
			//--------------------------
			
			
		
		//ELEMENTO RECEPTOR //R		           
		cfd.Receptor.rfc = venta.ICliente.RFC+"";  //R
		cfd.Receptor.nombre = venta.ICliente.Nombre+"";   //O
			//DOMICILIO REQUERIDO 2010//R
			//DOMICILIO OPCIONAL 2011 //O
			Domicilio=null;
			Domicilio=oDomicilioReceptor(venta.ICliente.FK_Domicilio1);
			if(!esInvalido(Domicilio,"")){			
				cfd.Receptor.Domicilio.calle = direccionDividir(Domicilio.Direccion,1)+"";//O
				cfd.Receptor.Domicilio.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
				cfd.Receptor.Domicilio.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O
				cfd.Receptor.Domicilio.colonia = Domicilio.Colonia+"";//O
				cfd.Receptor.Domicilio.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
				cfd.Receptor.Domicilio.referencia = Domicilio.Notas+"";//O
				cfd.Receptor.Domicilio.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
				cfd.Receptor.Domicilio.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
				cfd.Receptor.Domicilio.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+""; //R
				cfd.Receptor.Domicilio.codigoPostal = Domicilio.CodPos+"";//O				
			}
			
		//ELEMENTO CONCEPTOS   //R  MIN 1 MAX ILIMITADO		 
        var concepto,dv,i,rL;
		if(venta.Detalle.Elements.Count()<1){
			Log("Error de carga. El documento actual no tiene conceptos a facturar.");
			return null;
		}
		dv=null
		concepto=null;
		
		
		//NOTA::::ESTE CODIGO TAMBIEN ESTA EN generarCBB() DE VENTA
		var oformaGenFac=null;
		var boResumido=false;
		var inTipoFormato=0;
		if(venta.Documento==4 && tipoAplicacion()==2 && !OnBackOffice){
			//Es factura, Es deminus y Está en el POS
			oformaGenFac=uiCFD.FormaGenerarComprobanteDeminus();
			boResumido=oformaGenFac.Resumido;
		}
		
		if(boResumido){
			//FORMA RESUMIDA
			
			//Buscar productos sin impuestos
			var importeOtroSinIVA=0;
			var importeConsumo=0;
			
			oformaGenFac.CantidadA=1;
			oformaGenFac.PrecioA=0;
			oformaGenFac.DescuentosA=0;
			oformaGenFac.ImpuestosA=0;
			
			oformaGenFac.CantidadB=1;
			oformaGenFac.PrecioB=0;
			oformaGenFac.DescuentosB=0;
			oformaGenFac.ImpuestosB=0;
			
			for(i=1;i<=venta.Detalle.Elements.Count();i++){	
				//OBTENER CONCEPTO. Montos se incluirán sin impuestos
				dv=venta.Detalle.Elements.Item(i);
				if(esInvalido(dv,"No se pudo obtener detalle de venta con indice: "+i)) return null;
				
				//iva es impuesto uno
				if(dv.Impuesto1==0){
					importeOtroSinIVA=parseFloat(importeOtroSinIVA)+parseFloat(roundValue((dv.Cantidad*dv.Precio)-dv.Descuento1-dv.Descuento2));
									
					oformaGenFac.PrecioB=oformaGenFac.PrecioB+(dv.Cantidad*dv.Precio);
					oformaGenFac.DescuentosB=oformaGenFac.DescuentosB+(dv.Descuento1+dv.Descuento2);
					oformaGenFac.ImpuestosB=oformaGenFac.ImpuestosB+(dv.Impuesto1+dv.Impuesto2+dv.Impuesto3+dv.Impuesto4);
					
				}else{
					importeConsumo=parseFloat(importeConsumo)+parseFloat(roundValue((dv.Cantidad*dv.Precio)-dv.Descuento1-dv.Descuento2));
					
					oformaGenFac.PrecioA=oformaGenFac.PrecioA+(dv.Cantidad*dv.Precio);
					oformaGenFac.DescuentosA=oformaGenFac.DescuentosA+(dv.Descuento1+dv.Descuento2);
					oformaGenFac.ImpuestosA=oformaGenFac.ImpuestosA+(dv.Impuesto1+dv.Impuesto2+dv.Impuesto3+dv.Impuesto4);
				}
			}	

			
			oformaGenFac.PrecioA=roundValue(oformaGenFac.PrecioA);
			oformaGenFac.DescuentosA=roundValue(oformaGenFac.DescuentosA);
			oformaGenFac.ImpuestosA=roundValue(oformaGenFac.ImpuestosA);
			
			oformaGenFac.PrecioB=roundValue(oformaGenFac.PrecioB);
			oformaGenFac.DescuentosB=roundValue(oformaGenFac.DescuentosB);
			oformaGenFac.ImpuestosB=roundValue(oformaGenFac.ImpuestosB);
			
			//crear conceptos
			
			if(importeOtroSinIVA==0){
				importeConsumo=roundValue(venta.Subtotal-venta.Descuento1-venta.Descuento2);
			}else{
				importeConsumo=roundValue(importeConsumo);
				importeOtroSinIVA=roundValue(importeOtroSinIVA);
			}
			
			concepto=eBasic.eCreateObject("geCFD.cConcepto");
			if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;
			
			concepto.cantidad =1;//R
			concepto.unidad = oformaGenFac.UnidadC1;//R
			concepto.noIdentificacion = "";//O
			concepto.descripcion = oformaGenFac.ConceptoResumido+"";//R
			concepto.valorUnitario = importeConsumo;//R
			concepto.importe = importeConsumo;//R
			cfd.Conceptos.Add(concepto);
			concepto=null;
			
			inTipoFormato=1;
			
			if(importeOtroSinIVA>0){
				
				concepto=eBasic.eCreateObject("geCFD.cConcepto");
				if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;
				
				concepto.cantidad =1;//R
				concepto.unidad = oformaGenFac.UnidadC2;//R
				concepto.noIdentificacion = "";//O
				concepto.descripcion = oformaGenFac.ConceptoResumidoCeroIVA+"";//R
				concepto.valorUnitario = importeOtroSinIVA;//R
				concepto.importe = importeOtroSinIVA;//R
				cfd.Conceptos.Add(concepto);
				concepto=null;
				
				inTipoFormato=2;
			}						
			
			if(!uiCFD.EstablecerDeminusTipoFormato(venta.Sys_PK,inTipoFormato,oformaGenFac))
			{
				Log("Error al guardar información de tipo de formato a imprimir detalle/resumido.");
				return null;
			}
			
		}else{
			//FORMA DETALLADA
			
			for(i=1;i<=venta.Detalle.Elements.Count();i++){		
				//OBTENER CONCEPTO. Montos se incluirán sin impuestos
				dv=venta.Detalle.Elements.Item(i);
				if(esInvalido(dv,"No se pudo obtener detalle de venta con indice: "+i)) return null;
				
				concepto=eBasic.eCreateObject("geCFD.cConcepto");
				if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;
				
				if(!dv.IProducto.LoadFromADOConnection(dv.IProducto.Sys_PK,"",Application.ADOCnn)){
					Log("No se cargo el detalle del producto.");
					return null;
				}				
				
				concepto.cantidad = roundValueVol(dv.Cantidad);//R
				concepto.unidad = dv.Unidad+"";//R
				concepto.noIdentificacion = dv.IProducto.Codigo+"";//O
				concepto.descripcion = dv.IProducto.Descripcion+"";//R
					//--------------------------------------------------
					if(dv.Notas!="" && loadNumFromGlobalVar("FXCA400x",0)==1){
						var strDelimitador=loadTextFromGlobalVar("FXCA401x"," ");
						if(strDelimitador==null) strDelimitador=" ";
						if(strDelimitador=="") strDelimitador=" ";
						concepto.descripcion=concepto.descripcion+strDelimitador+dv.Notas+"";
					}
					//--------------------------------------------------
				concepto.importe = roundValue((dv.Cantidad*dv.Precio)-dv.Descuento1-dv.Descuento2);//R
				concepto.valorUnitario = roundValue(concepto.importe/dv.Cantidad);//R
				
					
					// OPCIONAL: ARRAYLIST concepto.InformacionAduanera //O   MIN CERO MAX ILIMITADO				
					   /*****************************
					   geCFD.ct_InformacionAduanera info = new geCFD.ct_InformacionAduanera();
					   info.numero = ""; //R
					   info.fecha = Date;//R
					   info.aduana = "";//R
					   concepto.InformacionAduanera.Add(info);
					   *****************************/
						//Buscar lotes del producto para incluir InformacinoAduanera
						rL=openRecordset("SELECT DISTINCT DCardex.ILote FROM DCardex INNER JOIN Lote ON DCardex.ILote=Lote.Sys_PK WHERE RVenta="+dv.Sys_PK);
						if(esInvalido(rL,"Error al acceder a información de lotes.")) return null;
						if(!(rL.BOF && rL.EOF)){
							while(!rL.EOF){
								if(rL("ILote").Value!=null){
									if(rL("ILote").Value>0){
										if(!agregarInformacionAduanera(concepto.InformacionAduanera,rL("ILote").Value)){
											Log("Error al asignar información aduanera en Concepto");
											return null;
										}
									}//fin si lote>0
								}//fin si lote<>null
								rL.MoveNext();
							}//fin lotes
						}//fin
						rL=null;
					
					
					
					// OPCIONAL: concepto.CuentaPredial       //O   MIN 0 MAX 1
					//concepto.CuentaPredial.numero=""; //R

					// OPCIONAL: concepto.ComplementoConcepto //O     MIN 0 MAX 1
					//concepto.ComplementoConcepto.complemento=null;
					
					boCConcepto=incluirComplementoConcepto(dv.IProducto.Sys_PK);
					if(boCConcepto==null) return null;
									
					if(boCConcepto){
						cConcepto_js=eBasic.AddSlashPath(GetRepository())+ubicacionCConcepto+dv.IProducto.Codigo+".js";
						if(!eBasic.FileExists(cConcepto_js)){						
							Log("No se encontró el archivo para integrar Complemento Concepto: "+cConcepto_js+" del producto "+dv.IProducto.Descripcion);								
							Log("Error imposible continuar.");
							return null;
						}
						cConcepto_contenido=eBasic.LoadFileToStr(cConcepto_js);
						if(esInvalido(cConcepto_contenido,"El archivo "+cConcepto_js+" se encuentra vacío. Producto "+dv.IProducto.Descripcion,false,true)) return null;
						
						resultado_CConcepto=eval(cConcepto_contenido);
						if(!resultado_CConcepto){
							Log("Error al integrar complemento concepto");
							return null;
						}
					}
					
					
					// OPCIONAL: ARRAYLIST concepto.Parte     //O    MIN 0 MAX ILIMITADO
					
					//-----------------------------------------
					if(loadNumFromGlobalVar("FXCA403x",0)==1){
						if(!asignarSerieLoteEnParteConcepto(concepto,dv)){
							Log("No se pudo cargar información de series y lotes en el concepto "+dv.IProducto.Descripcion+"");
							return null;
						}
					}
					//-----------------------------------------
									
					/*****************************
					geCFD.cParte parte = new geCFD.cParte();
					parte.cantidad = 0;//R
					parte.unidad = "";//O
					parte.noIdentificacion = "";//O
					parte.descripcion = "";//R
					parte.valorUnitario = roundValue(0);//O
					parte.importe =roundValue(0);//O
					   // OPCIONAL: ARRAYLIST parte.InformacionAduanera     //O  MIN 0 MAX ILIMITADO
					   //*****************************
					   geCFD.ct_InformacionAduanera info = new geCFD.ct_InformacionAduanera();
					   info.numero = ""; //R
					   info.fecha = DateTime.Today;//R
					   info.aduana = "";//R
					   parte.InformacionAduanera.Add(info);
					   //*****************************
					concepto.Parte.Add(parte);
					****************************/
				
				cfd.Conceptos.Add(concepto);           
				dv=null
				concepto=null;
			}//Fin de for del detalle de venta.							
			
			uiCFD.EstablecerDeminusTipoFormato(venta.Sys_PK,inTipoFormato);
		}//FIN IF FORMATO RESUMIDO O DETALLE
		
		
		
		
		//ELEMENTO IMPUESTOS   //R MIN 1 MAX 1		
		
		cfd.Impuestos.totalImpuestosRetenidos = 0; //O				
		cfd.Impuestos.totalImpuestosTrasladados=roundValue(venta.Impuesto1+venta.Impuesto3); //O // IMPUESTO 2 Y 4 NO USADOS PARA CFD PENDIENTE. 
			
			//OPCIONAL ARRAY COLLECTION   //Si existe <Rentenciones> MIN 1 MAX ILIMITADO
			//cfd.Impuestos.Retenciones     
			/*******************************/
			if(venta.Impuesto2<0 && cfg_usarRetencionImpuesto2){
				cfd.Impuestos.totalImpuestosRetenidos = roundValue(venta.Impuesto2*-1); //O		
				retencion = null;
				retencion = eBasic.eCreateObject("geCFD.cRetencion");
				if(esInvalido(retencion,"Error al crear objeto geCFD.cRetencion")) return null;
				retencion.impuesto = "IVA";//R //ISR o IVA
				retencion.importe = roundValue(venta.Impuesto2*-1);//R
				cfd.Impuestos.Retenciones.Add(retencion);
			}			
			/*******************************/

			//OPCIONAL ARRAY COLLECTION //Si existe <Traslados>    MIN 1 MAX ILIMITADO
			//cfd.Impuestos.Traslados			
			// TIPO DE IMPUESTO ES POR PRODCUTO.. EL PROD PODRIA TENER MAS DE UN TIPO DE IMPUESTO.
						
			var r,dv,tipoImpuesto="",tasaImpuesto=0,totalImpuesto=0,trasladoPendiente=false;
			
			//TRASLADOS DE IVA
			r=openRecordset("SELECT DVenta.Sys_PK AS PKDVenta,DVenta.IProducto AS PKProducto,Producto.Impuestos AS PKImpuesto,cfgImpuesto.uf_TipoI1,cfgImpuesto.I1Venta FROM DVenta INNER JOIN (Producto INNER JOIN cfgImpuesto ON Producto.Impuestos=cfgImpuesto.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK WHERE DVenta.Impuesto1>0 AND DVenta.FK_Venta_Detalle="+pkventa+" ORDER BY cfgImpuesto.uf_TipoI1,cfgImpuesto.I1Venta;");
			if(esInvalido(r,"Error al obtener impuestos por concepto.")) return null;
			
			tipoImpuesto="";
			totalImpuesto=0;
			tasaImpuesto=0;
			trasladoPendiente=false;
			
			while(!r.EOF){
				trasladoPendiente=true;
				dv=null;
				dv=dVenta(venta.Detalle.Elements,r("PKDVenta").Value);
				if(esInvalido(dv,"Error al obtener detalle de venta en elemento impuestos.")) return null;
				
				if(tipoImpuesto=="") tipoImpuesto=stringValue(r,"uf_TipoI1");
				if(tasaImpuesto==0) tasaImpuesto=tasaImpuestoActual(stringValue(r,"I1Venta"));
				
				if(tipoImpuesto.toLowerCase()!=stringValue(r,"uf_TipoI1").toLowerCase()){
					Log("Error al obtener tipos de impuestos. Existe un impuesto diferente a IVA en impuesto 1 del producto: "+ dv.IProducto.Descripcion);
					Log("El impuesto 1 debe ser IVA, Impuesto 3 IEPS");
					return null;
				}
				
				if(tasaImpuesto!=tasaImpuestoActual(stringValue(r,"I1Venta"))){	
					
					traslado = null;
					traslado = eBasic.eCreateObject("geCFD.cTraslado");
					if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
					traslado.impuesto = tipoImpuesto;//R // IVA o IEPS
					traslado.tasa = tasaImpuesto;//R
					traslado.importe = roundValue(totalImpuesto);//R
					cfd.Impuestos.Traslados.Add(traslado);
					traslado = null;
					
					tasaImpuesto=tasaImpuestoActual(stringValue(r,"I1Venta"));
					totalImpuesto=dv.Impuesto1;
				}else{
					totalImpuesto=totalImpuesto+dv.Impuesto1;
				}
				r.MoveNext();
			}
			
			if(trasladoPendiente){
				traslado = null;
				traslado = eBasic.eCreateObject("geCFD.cTraslado");
				if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
				traslado.impuesto = tipoImpuesto;//R // IVA o IEPS
				traslado.tasa = tasaImpuesto;//R
				traslado.importe = roundValue(totalImpuesto);//R
				cfd.Impuestos.Traslados.Add(traslado);
				traslado = null;
			
			}
			r.Close();
			r=null;
			
			//TRASLADOS DE IEPS
			r=openRecordset("SELECT DVenta.Sys_PK AS PKDVenta,DVenta.IProducto AS PKProducto,Producto.Impuestos AS PKImpuesto,cfgImpuesto.uf_TipoI3,cfgImpuesto.I3Venta FROM DVenta INNER JOIN (Producto INNER JOIN cfgImpuesto ON Producto.Impuestos=cfgImpuesto.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK WHERE DVenta.Impuesto3>0 AND DVenta.FK_Venta_Detalle="+pkventa+" ORDER BY cfgImpuesto.uf_TipoI3,cfgImpuesto.I3Venta;");
			if(esInvalido(r,"Error al obtener impuestos por concepto.")) return null;
			
			tipoImpuesto="";
			totalImpuesto=0;
			tasaImpuesto=0;
			trasladoPendiente=false;
			
			while(!r.EOF){
				trasladoPendiente=true;
				dv=null;
				dv=dVenta(venta.Detalle.Elements,r("PKDVenta").Value);
				if(esInvalido(dv,"Error al obtener detalle de venta en elemento impuestos.")) return null;
				
				if(tipoImpuesto=="") tipoImpuesto=stringValue(r,"uf_TipoI3");
				if(tasaImpuesto==0) tasaImpuesto=tasaImpuestoActual(stringValue(r,"I3Venta"));
								
				if(tipoImpuesto.toLowerCase()!=stringValue(r,"uf_TipoI3").toLowerCase()){
					Log("Error al obtener tipos de impuestos. Existe un impuesto diferente a IEPS en impuesto 3 del producto: "+ dv.IProducto.Descripcion);
					Log("El impuesto 1 debe ser IVA, Impuesto 3 IEPS");
					return null;
				}
				
				if(tasaImpuesto!=tasaImpuestoActual(stringValue(r,"I3Venta"))){	
					
					traslado = null;
					traslado = eBasic.eCreateObject("geCFD.cTraslado");
					if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
					traslado.impuesto = tipoImpuesto;//R // IVA o IEPS
					traslado.tasa = tasaImpuesto;//R
					traslado.importe = roundValue(totalImpuesto);//R
					cfd.Impuestos.Traslados.Add(traslado);
					traslado = null;
					
					tasaImpuesto=tasaImpuestoActual(stringValue(r,"I3Venta"));
					totalImpuesto=dv.Impuesto3;
				}else{
					totalImpuesto=totalImpuesto+dv.Impuesto3;
				}
				r.MoveNext();
			}
			
			if(trasladoPendiente){
				traslado = null;
				traslado = eBasic.eCreateObject("geCFD.cTraslado");
				if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
				traslado.impuesto = tipoImpuesto;//R // IVA o IEPS
				traslado.tasa = tasaImpuesto;//R
				traslado.importe = roundValue(totalImpuesto);//R
				cfd.Impuestos.Traslados.Add(traslado);
				traslado = null;
			
			}
			r.Close();
			r=null;
			
			
		//ELEMENTO COMPLEMENTO
		//cfd.Complemento; //O     SI EXISTE: MIN 1   MAX 1				
		boComplemento=incluirComplemento();
		if(boComplemento==null) return null;
		
		if(boComplemento){
			complemento_js=eBasic.AddSlashPath(GetRepository())+ubicacionComplemento;
			if(!eBasic.FileExists(complemento_js)){
				Log("No se encontró el archivo para integrar Complemento: "+complemento_js);
				Log("Error imposible continuar.");
				return null;
			}
			complemento_contenido=eBasic.LoadFileToStr(complemento_js);
			if(esInvalido(complemento_contenido,"El archivo "+complemento_js+" se encuentra vacío.",false,true)) return null;
				
			resultado_complemento=eval(complemento_contenido);			
			if(!resultado_complemento){
				Log("Error al integrar Complemento");
				return null;
			}
		}
		
		//ELEMENTO ADDENDA
		//cfd.Addenda;    //O		SI EXISTE: MIN 1   MAX 1		
		boAddenda=incluirAddenda(venta.ICliente.Sys_PK);
		if(boAddenda==null) return null;
		
		if(boAddenda){
			addenda_js=eBasic.AddSlashPath(GetRepository())+ubicacionAddenda+venta.ICliente.Codigo+".js";
			if(!eBasic.FileExists(addenda_js)){
				Log("No se encontró el archivo para integrar Addenda: "+addenda_js + ". Cliente: "+venta.ICliente.Nombre);
				Log("Error imposible continuar.");
				return null;
			}
			addenda_contenido=eBasic.LoadFileToStr(addenda_js);
			if(esInvalido(addenda_contenido,"El archivo "+addenda_js+" se encuentra vacío. Cliente "+venta.ICliente.Nombre,false,true)) return null;
				
			resultado_addenda=eval(addenda_contenido);			
			if(!resultado_addenda){
				Log("Error al integrar Addenda");
				return null;
			}
		}else{
			//gb 19052011
			//cargar addenda de maxicomercio
			if(loadNumFromGlobalVar("FXCA402x",0)==1){
				addenda_js=eBasic.AddSlashPath(GetRepository())+ubicacionAddenda+"maxicomercio.js";
				if(!eBasic.FileExists(addenda_js)){
					Log("No se encontró el archivo para integrar Addenda: "+addenda_js);
					Log("Error imposible continuar.");
					return null;
				}
				addenda_contenido=eBasic.LoadFileToStr(addenda_js);
				if(esInvalido(addenda_contenido,"El archivo "+addenda_js+" se encuentra vacío.",false,true)) return null;
					
				resultado_addenda=eval(addenda_contenido);			
				if(!resultado_addenda){
					Log("Error al integrar Addenda");
					return null;
				}
			}
		}			
		
		return cfd;
	}catch(e){
		Log("Error al generar factura electrónica.");
		throw(e);
		return null;
	}	
	
}

        

/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				COMPROBANTE
******************************************/

function buscarCFDfolio_Sys_PK(pkBlock){
	var r;	
	r=openRecordset("SELECT uf_CFDfolio FROM BlockDocumentos WHERE Sys_PK="+pkBlock,true);
	if(esInvalido(r)) return 0;
	
	return r("uf_CFDfolio").Value;	
}

function certificadoBase64(filename){
	var b64;
	b64=proccess.doBase64FromFile(filename);
	if(b64!=null){
		return b64;
	}else{
		Log("(opcional) No se pudo incluir el certificado de sello digital. "+proccess.lastError);
		Log("Archivo: "+filename);
		return null;
	}
}

function ventaFechaHora(venta){
	/*
	var r;	
	r=openRecordset("SELECT uf_fechaCFD FROM Venta WHERE Sys_PK="+pkventa,true);
	if(esInvalido(r,"Error al obtener fecha de venta.")) return null;	
	return r("uf_fechaCFD").Value;
	*/
	return uiCFD.ObtenerFechaHora(venta.Fecha,venta.Sys_DTCreated);
}

function sFormaDePago_CXC(ocxc){
	//gb 31012012
	if(valorEnObjetoFX(ocxc,"XMLFormaPago")!="") return valorEnObjetoFX(ocxc,"XMLFormaPago");
	return "PAGO EN UNA SOLA EXHIBICIÓN";
}

function sFormaDePago(oventa){
var n,s;

	if(valorEnObjetoFX(oventa,"XMLFormaPago")!="") return valorEnObjetoFX(oventa,"XMLFormaPago"); //gb 31012012

	try{
		if(oventa.Documento==4){
			switch(oventa.FormaPago){
				case 0: 
						//s="";
						//s=uiCFD.SolicitarFormaPago();
						//if(s==""){
							//Log("Forma de pago inválida"); //No aplica
						//}
						return "PAGO EN UNA SOLA EXHIBICIÓN";
						break;
				case 1: return "PAGO EN UNA SOLA EXHIBICIÓN"; //cContado
						break;
				case 2: return "PAGO EN UNA SOLA EXHIBICIÓN"; //cCrédito
						break;
				case 3:	//cFinanciado
						return "PAGO EN UNA SOLA EXHIBICIÓN";
						/*
						n=numParticialidades(oventa);
						if(esInvalido(n,"No se pudo obtener el número de parcialidades.",true)) return "";
						s="PARCIALIDAD";
						for(i=1;i<=n;i++){
							if(s!="PARCIALIDAD") s+=",";
							s=s+" "+i+" DE "+n;
						}
						return s;*/
						break; 
				case 4:	Log("Forma de pago inválida: Consignado"); //cConsignado
						return "";
						break;
			}	
		}else{
			//nota de credito
			if(oventa.Documento==5)
				return "PAGO EN UNA SOLA EXHIBICIÓN";
			else
				return "";
		}
	}catch(e){
		return "";
	}
}

function numParticialidades(oventa){
	var r,n;	
	
	if(oventa.Documento!=4) return 0;
	
	r=openRecordset("SELECT Sys_PK FROM DCXC WHERE IVenta="+oventa.Sys_PK+" AND Documento<>4 AND Documento<>5 AND Debe>0");
	if(esInvalido(r,"Error al consultar número de parcialidades.")) return 0;
	n=0;
	while(!r.EOF){
		n+=1;		
		r.MoveNext();
	}
	r.Close();
	r=null;
	return n;
}

function sCondicionesDePago_CXC(ocxc){
	//gb 31012012
	return valorEnObjetoFX(ocxc,"XMLCondicionesPago"); 
}
function sCondicionesDePago(oventa){

	if(valorEnObjetoFX(oventa,"XMLCondicionesPago")!="") return valorEnObjetoFX(oventa,"XMLCondicionesPago"); //gb 31012012

	//OPCIONAL POR LO TANTO SI NO ESTA SALDADO NO SE INCLUIRA.	
	try{
		switch(oventa.FormaPago){
			case 0: return ""; break;		//cNo_aplica
			case 1:	return "INMEDIATO"; break; //cContado
			case 2:	return "CREDITO"; break;		   //cCrédito
			case 3: return "CREDITO"; break;	//cFinanciado
			case 4:	return ""; break;	//cConsignado
		}
	}catch(e){
		return "";
	}
	
}

function sNumeroCuentaPago_CXC(ocxc)
{
	//gb 31012012
	return valorEnObjetoFX(ocxc,"XMLNumeroCuentaPago");
}

function sNumeroCuentaPago(oventa)
{
	//gb 31012012
	return valorEnObjetoFX(oventa,"XMLNumeroCuentaPago");
}

function sMetodoDePago_CXC(ocxc){
	//gb 31012012
	if(valorEnObjetoFX(ocxc,"XMLMetodoPago")!="") return valorEnObjetoFX(ocxc,"XMLMetodoPago");
	return "99";
}
//function sMetodoDePago(pkMovCaja){
function sMetodoDePago(oventa){
	var r;
	var m;
	var pkMovCaja;
	
	//gb 31012012
	if(valorEnObjetoFX(oventa,"XMLMetodoPago")!="") return valorEnObjetoFX(oventa,"XMLMetodoPago");
	if(oventa.IMovCaja.Sys_PK<1) return "99";
	pkMovCaja=oventa.IMovCaja.Sys_PK;
	//-----------
	
	r=openRecordset("SELECT Efectivo,Cheques,Depositos,Tarjetas,Vales FROM MovCaja WHERE Sys_PK="+pkMovCaja,true);
	if(esInvalido(r)) return "";
	
	m="";
	if(r("Efectivo").Value>0) 
		m="01";
	
	if(r("Cheques").Value>0){
		if(m!="")
			m+=", ";
		m+="02";	
	}
	if(r("Depositos").Value>0){
		if(m!="")
			m+=", ";
		m+="03";
	}
	if(r("Tarjetas").Value>0){
		if(m!="")
			m+=", ";
		m+="04";
	}
	if(r("Vales").Value>0){
		if(m!="")
			m+=", ";
		m+="08";
	}	
	return m;
}

function sTipoComprobante(documento){
	switch(documento){
		case 4://factura
			return "ingreso"; break;
		case 5://nota de crédito
			return "egreso"; break;
		case 17://nota de cargo
			return "ingreso"; break;
		case 18://pagarè por parcialidad
			return "ingreso"; break;
		case 19://recibo por anticipo financiamiento
			return "ingreso"; break;
	}
	return "";	
}

/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				EMISOR
******************************************/

function rfcEmisor(){
var v="";

	if(OnBackOffice)
		v=Configuracion.eApplicationVars.FXCA101;
	else
		v=Configuracion.eApplicationVars.GetTextVar("FXCA101","");
	 
	 v=v+"";	 
	 return v;
}
function nombreEmisor(){
var v="";
	if(OnBackOffice)
		v=Configuracion.eApplicationVars.FXCA100;
	else
		v=Configuracion.eApplicationVars.GetTextVar("FXCA100","");
		
	v=v+"";	
	return v;
}

function oDimicilioFiscal(){
	var r,d,pkDom=0,pkStr;
	try{
		// r=openRecordset("SELECT VarValue FROM GlobalVar WHERE VarName='FXCA102b'",true);
		// if(esInvalido(r)) return null;
		// pkDom=r("VarValue").Value;		
		pkDom=loadNumFromGlobalVar("FXCA102b",0);		
		if(esInvalido(pkDom,"",true)) return null;
		
		d=eBasic.eCreateObject("EDOFx.Domicilio");
		if(d==null) return null;
		if(!d.LoadFromADOConnection(pkDom,"",Application.ADOCnn,2)) return null;
		return d;
	}catch(e){
		throw(e);
		return null;
	}
}


function oExepedidoEn(pkCConsumo){
	var r,d,pkDom;
	try{
		r=openRecordset("SELECT uf_DomicilioCFD FROM CConsumo WHERE Sys_PK="+pkCConsumo,true);
		if(esInvalido(r)) return null;
		pkDom=r("uf_DomicilioCFD").Value;
		if(esInvalido(pkDom,"",true)) return null;
		
		d=eBasic.eCreateObject("EDOFx.Domicilio");
		if(d==null) return null;
		if(!d.LoadFromADOConnection(pkDom,"",Application.ADOCnn,2)) return null;
		return d;
	}catch(e){
		return null;
	}
}


function oExepedidoEn_CXC(){
	var r,d,pkDom;
	try{
		r=openRecordset("SELECT uf_DomicilioCFD FROM CConsumo WHERE uf_ExpedicionCXC=1",true);
		if(esInvalido(r)) return null;
		pkDom=r("uf_DomicilioCFD").Value;
		if(esInvalido(pkDom,"",true)) return null;
		
		d=eBasic.eCreateObject("EDOFx.Domicilio");
		if(d==null) return null;
		if(!d.LoadFromADOConnection(pkDom,"",Application.ADOCnn,2)) return null;
		return d;
	}catch(e){
		return null;
	}
}


/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				RECEPTOR
******************************************/

function oDomicilioReceptor(pkDom){
	var d;
	try{
		if(pkDom==null) pkDom=0;
		if(pkDom<1) return null;
		
		d=eBasic.eCreateObject("EDOFx.Domicilio");
		if(d==null) return null;
		if(!d.LoadFromADOConnection(pkDom,"",Application.ADOCnn,2)) return null;
		return d;
	}catch(e){
		return null;
	}
}

/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				CONCEPTO
******************************************/
function incluirComplementoConcepto(pkProducto){
	var r,v;
	r=openRecordset("SELECT uf_Complemento FROM Producto WHERE Sys_PK="+pkProducto,true);
	if(esInvalido(r,"Error al obtener configuración de complemento concepto en Producto.")) return null;
	v=r("uf_Complemento").Value;
	if(v==null) v=0;
	return v;
}




/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				IMPUESTOS
******************************************/

function tasaImpuestoActual(impVenta){
	//ImpVenta="16%|11%" interior-fronter
	var s;
	var i="";
	var f="";
		
	s=impVenta.split('|');		
	if(Utilizarfrontera){
		f=s[1];
		f=f.replace('%','');
		return parseFloat(f);
	}else{
		i=s[0];
		i=i.replace('%','');
		return parseFloat(i);
	}	
}

function dVenta(ventacol,pkDVenta){
	var i,dv;
	try{
		
		if(ventacol.Count()<1) return null;
		
		for(i=1;i<=ventacol.Count();i++){
			dv=ventacol.Item(i);
			if(esInvalido(dv,"No se pudo obtener impuestos. Error al obtener detalle de venta.")) return null;
			
			if(dv.Sys_PK==pkDVenta) return dv;
		}
		return null;
	}catch(e){
		throw(e);
		return null;
	}
}
/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				COMPLEMENTO
******************************************/

function incluirComplemento(){
	var v;	
	//v= 0 o -1
	
	// r=openRecordset("SELECT VarValue FROM GlobalVar WHERE VarName='FXCA300x'",true);
	// if(esInvalido(r,"Error al obtener configuración de complemento. No se encontró el valor FXCA300x.")) return null;
	// v=r("VarValue").Value;
	//if(v==null) v="0";
	//vi=parseInt(v);	
	//return vi
	v=loadNumFromGlobalVar("FXCA300x",0);
	if(v==null) v=0;	
	return v;
}

/******************************************
	FUNCIONES PARA OBTENER DATOS DE VENTA
				ADDENDA
******************************************/

function incluirAddenda(pkCliente){
	var r,v;
	r=openRecordset("SELECT uf_Addenda FROM Cliente WHERE Sys_PK="+pkCliente,true);
	if(esInvalido(r,"Error al obtener configuración de Addenda.")) return null;
	v=r("uf_Addenda").Value;
	if(v==null) v=0;
	return v;
}


/******************************************
	FUNCIONES DE SOPORTE
******************************************/
function obtenerUbicacionCorrecta(v){
	try{		
		if(v.toLowerCase()=="(desconocido)" || v.toLowerCase()=="desconocido")
			return "";
		else
			return v;
	}catch(e){
		return v;
	}
}

function direccionDividir(direccion,parte){
	var s;
	try{
		if(esInvalido(direccion,"",false,true)) return "";
		if(direccionDetallada(direccion)){			
			s=direccion.split('|');
			return s[parte+1];
		}else{
			switch(parte){
				case 1: return direccion;break;
				case 2: return "";break;
				case 3: return "";break;
			}			
		}		
	}catch(e){
		return "";
	}
}

function direccionDetallada(v){
var s;
//	||CALLE|NoEXTERIOR|NoINTERIOR||
	if(esInvalido(v,"",false,true)) return false;
	s=v.split('');
	if(s[0]+s[1]=="||"){
		return true;
	}else{
		return false;
	}
}

function esInvalido(v,serror,mayor_que_cero,diferente_vacio){
	if(serror==null) serror="";
	if(mayor_que_cero==null) mayor_que_cero=false;
	if(diferente_vacio==null) diferente_vacio=false;
	
	if(v==null){
		if(serror!="") Log(serror);
		return true;
	}else{
		if(mayor_que_cero){
			if(v>0)
				return false;
			else{
				if(serror!="") Log(serror);
				return true;
			}
		}else{
			if(diferente_vacio){
				if(v!="")
					return false;
				else{
					if(serror!="") Log(serror);
					return true;
				}
			}else{			
				return false;
			}
		}
	}
}

function roundValue(v){
	return v.toFixed(NDecsMonto());
}

function roundValueVol(v){
	return v.toFixed(NDecsUnidades());
}

function stringValue(r,field){
	try{
		if(r(field).Value==null)
			return "";
		else
			return r(field).Value;
	}catch(e){
		Log("Error al obtener valor de campo "+field);
		return "";
	}
}

function openRecordset(sql,omitNoRecords){
var r=null;
	try{
		if(omitNoRecords==null) omitNoRecords=false;
		r=eBasic.eCreateObject("ADODB.Recordset");
		if(r==null){
			Log("Error al crear objeto ADODB.Recordset");
			return null;
		}		
		//r=Application.Database.OpenRecordset(sql,Application.ADOCnn);
			
		r.ActiveConnection=Application.ADOCnn;
		r.CursorLocation=3;
		r.Source=sql;
		r.Open();
		
		if(r.State!=1) return null;
		
		if (!(r.EOF && r.BOF)){
			return r;
		}else{
			if(omitNoRecords)
				return null;
			else
				return r;
		}
	}catch(e){
		return null;
	}
}

function DeleteFile(filename){
	var fso;
	try{
		fso=eBasic.eCreateObject("Scripting.FileSystemObject");
		fso.DeleteFile(filename);
		return -1;
	}catch(e){
		return 0;
	}
}

function loadTextFromGlobalVar(key,def){
	if(uiCFD==null)	
		return null;
	
	if(def==null) def="";
	return uiCFD.GlobalVar.GetTextVar(key,def);
}

function loadNumFromGlobalVar(key,def){
	if(uiCFD==null)	
		return null;
	
	if(def==null) def=0;
	return uiCFD.GlobalVar.GetNumVar(key,def);
}



/******************************************************************
				INTERFAZ DE USUARIO
			PARA OPERACIONES CON CFD
******************************************************************/

function qCFD(){
//FUNCION PUBLICA
var Brw;
var Fecha;
Brw=null;

if(!inicializarObjetos()) return 0;

if(!uiCFD.PermitirAcceso("FXCA316x",Application.UIUsers.CurrentUser)) return 0;

Brw=Application.Browsers.GetBrowser("qCFD");
if (Brw==null)
	{
		//if(!Application.UIUsers.CheckItem("FX1-20-30-001"))  //PERMITIR ACCESO PENDIENTE
			//return 0;
			
		Brw=Application.Browsers.CreateBrowser("qCFD");
		Brw.Caption="Facturación Electrónica";
		Brw.sqlCommand.CmdType=1;				
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("TIPO",1));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Version",2)); //2=cfd, 3=cfdi
		
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=CmdSQLqCFDMes;
		Brw.CmdAfterRetriveFields="cfd.RedimensionarColumnas";
		
		//Brw.CmdAddNew="UIVentas.OpcionesVentas"; 
		Brw.CmdEdit="cfd.AbrirDocumento";
		Brw.CmdRowChanged = "cfd.TituloCFD";
		Brw.CmdDelete = "cfd.CancelarCFD";
		Brw.CmdDblClick=Brw.CmdEdit;

		AsignarCarpetaRepotes(Brw);
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Abrir documento","CFD_A01");
		Brw.AddButton("Vista previa","CFD_A02");
		Brw.AddButton("Cancelar CFDI","CFD_A03");
		Brw.AddButton("Marcar CFDI Cancelado","CFD_A04");
		Brw.AddButton("Eliminar CFDI","CFD_A10");
		/*Brw.AddButton("Informe mensual","CFD_A05");
		Brw.AddButton("Informes generados","CFD_A06");
		Brw.AddButton("Eliminar CFD","CFD_A07");
		*/
		
		Brw.TopTabParameter="TIPO";
		Brw.CmdTopTabClick="cfd.ConfigurarConsulta";		
		Brw.AddTopTab("Ventas",1);
		Brw.AddTopTab("Cuentas por cobrar",2);
		Brw.ShowTopTabsBar();
		Brw.ShowTopCombo();		
		Brw.TopComboParameter="Version";	
		Brw.CmdTopComboClick="cfd.CambiarConsulta";
		Brw.TopComboAdd(2,"CFD");
		Brw.TopComboAdd(3,"CFDI");
		if(uiCFD.TipoComprobanteAGenerarInt==1)
			Brw.TopComboItem(2);
		else
			Brw.TopComboItem(3);
		
		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="cfd.ConfigurarConsulta";
		Brw.AddBottomTab("Enero",1);
		Brw.AddBottomTab("Febrero",2);
		Brw.AddBottomTab("Marzo",3);
		Brw.AddBottomTab("Abril",4);
		Brw.AddBottomTab("Mayo",5);
		Brw.AddBottomTab("Junio",6);
		Brw.AddBottomTab("Julio",7);
		Brw.AddBottomTab("Agosto",8);
		Brw.AddBottomTab("Septiembre",9);
		Brw.AddBottomTab("Octubre",10);
		Brw.AddBottomTab("Noviembre",11);
		Brw.AddBottomTab("Diciembre",12);				
		Brw.AddBottomTab("Todos",0);				
		Brw.ShowBottomTabsBar();
		Brw.ShowBottomCombo();		
		Brw.BottomComboParameter="Anio";		
		UIDef.FillComboYears(Brw,false,true,true);					
				
		Brw.HideFields("Sys_PK;IVenta;IDCxC");
		//Brw.AutoAdjust();		
		
		//Funcionalidad del Panel de detalle -> By  JFrank : 14/Sept/09
		Brw.DetailFunction="cfd.Detail";
		Application.GetDetailPanel().DoWith(Brw.GetFieldValue("IVenta"));
	}
	else
		Brw.Zorder();
		
	TituloCFD(Brw.PrimaryKeyValue);

}

function MasOpciones(A){
var ask;
var opc;

	ask=Application.NewAsk();
	var tab=A.Context.ActiveWindow.Parameter("TIPO").Value;
	switch(A.Context.ActiveWindow.Parameter("Version").Value){
		case 2: //cfd
			ask.SetOption(10,"Crear informe mensual","Utilice esta opción para crear el informe mensual de folios emitidos.");
			ask.SetOption(20,"Ver informes generados","Seleccione esta opción si desea ver la lista de informes de folios emitidos.");
			ask.SetOption(80,"Eliminar CFD","Seleccione esta opción si desea eliminar el CFD del sistema.  Utilice este proceso cuando desee corregir algún dato para posteriormente regenerar el CFD. Deberá enviar nuevamente el comprobante al cliente.");			
			ask.SetOption(90,"Regenerar representación impresa","Use esta opción para regenerar la representacion impresa del comprobante seleccionado.");
			break;
		case 3:
			//ask.SetOption(30,"Crear timbre fiscal digital","Use esta opción si desea crear el TFD, el cual da validez al comprobante de tipo CFDI.");
			if(tab==1)ask.SetOption(40,"Cancelar CFDI","Seleccione esta opción se desea enviar a cancelación el registro seleccionado en la cuadrícula.");
			ask.SetOption(50,"Marcar CFDI como cancelado","Utilice este proceso si el CFDI fue cancelado totalmente por el servicio de cancelación del SAT.");			
			ask.SetOption(60,"Eliminar CFDI","Seleccione esta opción si desea eliminar el CFDI del sistema.  Utilice este proceso cuando desee corregir algún dato para posteriormente regenerar el CFDI. Solo es posible si el CFDI aun no se ecuentra timbrado.");			
			ask.SetOption(70,"Regenerar representación impresa","Use esta opción para regenerar la representacion impresa del comprobante seleccionado.");
			break;
	}
	
	
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	var FolioSAT=A.Context.ActiveWindow.GetFieldValue("FolioSAT");
	switch(opc)
	{
		case 10: RealizarInformeMensual(A);break;
		case 20: VerInformesGenerados(A);break;
		//case 30: cfdi.timbrarSeleccionado(A);break;
		case 40: if(tab==1) cfdi.cancelarBrwCFDI(A);break;
		//case 50: cfdi.MarcarCFDICancelado();break;
		case 50: cfdi33.MarcarCFDICancelado(FolioSAT);break;
		//case 60: cfdi.EliminarCFDI();break;
		case 60: cfdi33.EliminarCFDI(FolioSAT);break;
		//case 70: cfdi.RegenerarRepresentacionCFDI();break;
		case 70: cfdi33.RegenerarRepresentacionCFDI(FolioSAT);break;
		case 80: EliminarCFDLista();break;
		case 90: RegenerarRepresentacionCFD();break;
	}
	ask=null;
}



function Detail(){

	var r=null;
	var Brw;
	var p;
	try
	{
		Brw=Application.Browsers.GetBrowser("qCFD");
		if(Brw==null) return 0;
		
		if(Brw.Parameter("TIPO").Value==2) return 0;//cxc
		
		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de la Venta: " + Brw.GetFieldValue("Referencia"));
		r=Application.Database.OpenRecordset("Select DVenta.Sys_PK,Producto.Descripcion as Producto,DVenta.Cantidad,DVenta.Unidad,DVenta.Precio*DVenta.Cantidad as Subtotal,DVenta.Descuento1+DVenta.Descuento2 as Descuentos, DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Impuestos,(DVenta.Precio*DVenta.Cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Total FRom DVenta INNER JOIN Producto ON DVenta.IProducto=Producto.Sys_PK  Where Dventa.FK_Venta_Detalle="+Brw.GetFieldValue("IVenta"),Application.ADOCnn);
		
		//Poner datos en el panel
	
		p.SetDataSource(r,"Sys_PK");
		p.HideFields("Sys_PK");
		p.SetColumnWidth("Producto",445);
		p.SetColumnWidth("Cantidad",90);
		p.SetColumnWidth("Unidad",90);
		p.SetColumnWidth("Subtotal",90);
		p.SetColumnWidth("Descuentos",90);
		p.SetColumnWidth("Impuestos",90);
		p.SetColumnWidth("Total",90);		
	}
	catch(e)
	{
		eBasic.eMsgbox("Error al obtener información para el panel de detalle");
		return 0;
	}
}

 function AsignarCarpetaRepotes(Window){
	Window.ReportsFolder=Reportes.CarpetaVentas;
	Window.ObjectTypeName="CFD";
}

function CambiarConsulta(Value){
	ActualizarConsultaBrw();
}

function ConfigurarConsulta(Tab){	
	ActualizarConsultaBrw();
}

function ActualizarConsultaBrw(){
var Brw,TV,TC,MV,MC;
Brw=null;
Brw=Application.Browsers.GetBrowser("qCFD");	

	if (Brw!=null){
		
		switch(Brw.Parameter("Version").Value){
			case 2: //cfd
				TV=CmdSQLqCFDTodos;				
				MV=CmdSQLqCFDMes;
				TC=CmdSQLqCFDTodos_CXC;
				MC=CmdSQLqCFDMes_CXC;				
				break;
			case 3://cfdi
				TV=ICmdSQLqCFDTodos;				
				MV=ICmdSQLqCFDMes;
				TC=ICmdSQLqCFDTodos_CXC;
				MC=ICmdSQLqCFDMes_CXC;				
				break;
			default:
				return;
		}
		
		if(Brw.Parameter("TIPO").Value==1){
			//ventas
			Brw.GetButtonByIDAction("CFD_A01").Enabled=true;
			
			if (Brw.Parameter("Mes").Value==0) //Todos los meses
				Brw.sqlCommand.CmdSQL=TV;
			else //por mes
				Brw.sqlCommand.CmdSQL=MV;
		}else{
			//cxc
			Brw.GetButtonByIDAction("CFD_A01").Enabled=false;
			
			if (Brw.Parameter("Mes").Value==0) //Todos los meses
				Brw.sqlCommand.CmdSQL=TC;
			else //por mes
				Brw.sqlCommand.CmdSQL=MC;
		}		
	}else{
		Log("Error al asignar consulta");
	}	
}

function RedimensionarColumnas(){
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qCFD");	
	if (Brw!=null){				
		Brw.SetColumnWidth("Documento",90);
		Brw.SetColumnWidth("Referencia",70);
		Brw.SetColumnWidth("Fecha",140);
		Brw.SetColumnWidth("Nombre",190);
		Brw.SetColumnWidth("RFC",100);		
		Brw.SetColumnWidth("Total",85);
		Brw.SetColumnWidth("Folio",45);
		Brw.SetColumnWidth("NoAprobacionFolios",80);
		Brw.SetColumnWidth("Reportado",60);		
		Brw.SetColumnWidth("Cancelado",60);
		
		Brw.SetCaptionByFieldName("Nombre","Cliente");			
		Brw.SetCaptionByFieldName("NoAprobacionFolios","No. Aprobación");			
		
		//cfdi //si la columna no existe no marca error
		Brw.SetColumnWidth("NoCertificadoSAT",200);		
		Brw.SetColumnWidth("FolioSAT",200);		
		Brw.SetColumnWidth("FechaHoraCerSAT",120);		
		Brw.SetColumnWidth("CanceladoSAT",110);		
		
		Brw.SetCaptionByFieldName("NoCertificadoSAT","Certificado SAT");
		Brw.SetCaptionByFieldName("FolioSAT","Folio fiscal");
		Brw.SetCaptionByFieldName("FechaHoraCerSAT","Fecha hora certificación");
		Brw.SetCaptionByFieldName("CanceladoSAT","Cancelado en SAT");
		
		try{
			Brw.SetColumnFormat("Total",NDecsMonto(),FormatoMonto());
		}catch(e){}
	}
}

function TituloCFD(pk){
var Brw;
	//Brw=Application.Browsers.GetBrowser("qCFD");
	//Brw.SetTitle("");
}

function AbrirDocumento(){
	var pk;
	
	if(!uiCFD.PermitirAcceso("FXCA317x",Application.UIUsers.CurrentUser)) return 0;
	
	pk=Application.ActiveWindow().GetFieldValue("IVenta");
	UIVentas.EditarVenta(pk);
}

function VistaPrevia(A){
	/*
	var pk,archivo_temp;
	var Brw,r;
	var predViewer=0;
	
	if(!uiCFD.PermitirAcceso("FXCA318x",Application.UIUsers.CurrentUser)) return 0;
	
	Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null){ 
		Log("Error al obtener qCFD");
		return 0;
	}
	pk=Brw.PrimaryKeyValue;
	if(esInvalido(pk,"No se pudo obtener la clave del documento.",true)) return 0;
	
	try{
		
		predViewer=loadNumFromGlobalVar("CFDImp009",1);
		
		r=openRecordset("SELECT Sys_PK,uf_Presentacion,uf_ExtPresentacion FROM ut_CFD WHERE Sys_PK="+pk,true);
		if(esInvalido(r,"Error al obtener registro.")) return 0;
		var te;
		var ext;
		
		te=r("uf_ExtPresentacion").Value;
		if(te==null) te=1;
		ext=obtenerExtensionArchivo(te);
		archivo_temp=eBasic.AddSlashPath(eBasic.GetTempDir())+"mxcfdprev"+ext;
		
		if(esInvalido(r("uf_Presentacion").Value,"El registro no existe. Ejecute el formato desde Más Informes y Gráficos en el menú Informes.")) return 0;
		
		if(proccess.saveStrBase64toFile(r("uf_Presentacion").Value,archivo_temp)){			
			switch(te)
			{
				case 1://xpr  //eBasic.OpenDocument(archivo_temp,"&Open"); 
				case 2://txt 						
					dsgnTemplate2.openDocument(archivo_temp,"");//abrir xpr o txt
					break;
				case 3://pdf
						if(predViewer==1)//pdf? en visor predeterminado?
						{
							dsgnTemplate2.openDocument(archivo_temp,"");
							break;
						}
				case 4://doc
				case 5://docx
					dsgnTemplate2.showTXFile(archivo_temp,true);//segundo parámetro indica que el archivo se borrará despues de abrir						
					break;
			}					
		}else{
			eBasic.eMsgbox("Error al obtener presentación. Posiblemente el archivo no se guardó al crear el CFD.",6);
		}
		
		r.Close();
		r=null;
		
		//DeleteFile(archivo_temp); //no se puede borra mientras este abierto.		
		return -1;
	}catch(e){
		//Borrar temp
		DeleteFile(archivo_temp);
		Log("Error al leer presentación de documento.");
		throw(e);
		return 0;
	}
	*/
	
	// var FolioSAT=A.Context.ActiveWindow.GetFieldValue("FolioSAT");
	// cfdi33.RegenerarRepresentacionCFDI(FolioSAT);
	
	var Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null) return;
	var FolioSAT=Brw.GetFieldValue("FolioSAT");
	cfdi33.RegenerarRepresentacionCFDI(FolioSAT);
	Brw.RefreshRst();
	Application.MouseDefault();
}
function ExportarCFD(A){
	/*
	var pk,archivo,campoXml;
	var Brw,r;
	
	if(!uiCFD.PermitirAcceso("FXCA319x",Application.UIUsers.CurrentUser)) return 0;
	
	Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null){ 
		Log("Error al obtener qCFD");
		return 0;
	}
	pk=Brw.PrimaryKeyValue;
	if(esInvalido(pk,"No se pudo obtener la clave del documento.",true)) return 0;
	
	try{		
		var sql="";
		var pkdoc=Brw.GetFieldValue("IVenta");		
		if(pkdoc==null) pkdoc=0;
		if(pkdoc<1){//cxc
			pkdoc=Brw.GetFieldValue("IDCXC");
			if(pkdoc==null) pkdoc=0;
			if(pkdoc>0) sql="SELECT ut_CFD.Sys_PK,ut_CFD.uf_XML,ut_CFD.uf_Presentacion,DCXC.Referencia,ut_CFD.uf_ExtPresentacion,ut_CFD.uf_Tipo,ut_CFD.uf_XMLCFDI FROM ut_CFD INNER JOIN DCXC ON ut_CFD.uf_IDCXC=DCXC.Sys_PK WHERE ut_CFD.Sys_PK="+pk;
		}else{//venta			
			sql="SELECT ut_CFD.Sys_PK,ut_CFD.uf_XML,ut_CFD.uf_Presentacion,Venta.Referencia,ut_CFD.uf_ExtPresentacion,ut_CFD.uf_Tipo,ut_CFD.uf_XMLCFDI FROM ut_CFD INNER JOIN Venta ON ut_CFD.uf_IVenta=Venta.Sys_PK WHERE ut_CFD.Sys_PK="+pk;
		}
		
		r=openRecordset(sql,true);
		if(esInvalido(r,"Error al obtener registro.")) return 0;
		
		if(r("uf_Tipo").Value==3){ //cfdi 3.0
			campoXml="uf_XMLCFDI";
			if(stringValue(r,campoXml)==""){
				eBasic.eMsgbox("El comprobante no contiene el timbre fiscal digital.",6);
				return 0;
			}
		}else{//cfd 2.0
			campoXml="uf_XML";
		}
		
		
		var ext=obtenerExtensionArchivo(r("uf_ExtPresentacion").Value);
		
		archivo=uiCFD.ShowSaveAs("archivo XML|*.xml|Todos los archivos *.*|*.*",r("Referencia").Value);
		if(esInvalido(archivo,"Error al obtener nombre de archivo.",false,true)) return 0;		
		
		if(!eBasic.SaveStrToFile(archivo,r(campoXml).Value)){
			Log("Error al guardar archivo xml. "+proccess.lastError);
			return 0;
		}				
		
		if(esInvalido(r("uf_Presentacion").Value,"El registro (vista de impresión) no existe. Ejecute el formato desde Más Informes y Gráficos en el menú Informes.")) return 0;
		
		archivo=uiCFD.ShowSaveAs("Vista de impresión *"+ext+"|*"+ext+"|Todos los archivos *.*|*.*",r("Referencia").Value);
		if(esInvalido(archivo,"Error al obtener nombre de archivo.",false,true)) return 0;
				
		if(!proccess.saveStrBase64toFile(r("uf_Presentacion").Value,archivo)){
			Log("Error al guardar archivo "+ext+". "+proccess.lastError);
			return 0;
		}
		
		r.Close();
		r=null;
		
		return -1;
	}catch(e){		
		Log("Error al exportar documento.");
		throw(e);
		return 0;
	}
	*/
	
	if(!vbgeUICFD.PermitirAcceso("FXCA319x",Application.UIUsers.CurrentUser)) return 0;
	if(A==undefined || A==null) return;
	var FolioSAT=A.Context.ActiveWindow.GetFieldValue("FolioSAT");
	cfdi33.ExportarCfdi(FolioSAT);
}

function EnviareMail(A){
	/*
	var pk;
	var Brw;
	
	Brw=Application.Browsers.GetBrowser("qCFD");
	if(Brw==null){ 
		Log("Error al obtener qCFD");
		return 0;
	}
	pk=Brw.PrimaryKeyValue;//pk cfd
	if(esInvalido(pk,"No se pudo obtener la clave del documento.",true)) return 0;
	return EnviareMailA(pk,0,Brw.Parameter("TIPO").Value);
	*/
	var FolioSAT=A.Context.ActiveWindow.GetFieldValue("FolioSAT");
	cfdi33.SendMail(FolioSAT);
}

function EnviareMailA(pk,solicitarDir,TIPO){
	if(solicitarDir==null) solicitarDir=0;

	var archivo1="",archivo2="";
	var r,sql;
	
	if(!uiCFD.PermitirAcceso("FXCA320x",Application.UIUsers.CurrentUser)) return 0;
		
	try{
		//determinar el tipo: cfd o cfdi ya que la funcion es global y es usada por cfdi: se agrego selecciòn del campo uf_tipo y uf_xmlcfdi
		switch(TIPO){
			case 1:sql="SELECT ut_CFD.Sys_PK,ut_CFD.uf_XML,ut_CFD.uf_Presentacion,Venta.Referencia,Cliente.eMail,ut_CFD.uf_ExtPresentacion,ut_CFD.uf_Tipo,ut_CFD.uf_XMLCFDI FROM ut_CFD INNER JOIN (Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) ON ut_CFD.uf_IVenta=Venta.Sys_PK WHERE ut_CFD.Sys_PK="+pk;break;				
			case 2:sql="SELECT ut_CFD.Sys_PK,ut_CFD.uf_XML,ut_CFD.uf_Presentacion,DCXC.Referencia ,Cliente.eMail,ut_CFD.uf_ExtPresentacion,ut_CFD.uf_Tipo,ut_CFD.uf_XMLCFDI FROM ut_CFD INNER JOIN (DCXC  INNER JOIN Cliente ON  DCXC.ICliente=Cliente.Sys_PK) ON   ut_CFD.uf_IDCXC=DCXC.Sys_PK WHERE ut_CFD.Sys_PK="+pk;break;
			default:
				eBasic.eMsgbox("El tipo de documento es incorrecto: "+TIPO,6);
				return 0;
		}
		
		
		r=openRecordset(sql,true);		
		if(esInvalido(r,"Error al obtener registro.")) return 0;
		
		uiCFD.ShowProgress("Obteniendo comprobante XML",10,"Enviando Correo Electrónico...",0,100);
		
		archivo1=eBasic.AddSlashPath(eBasic.GetTempDir())+"Comp_"+r("Referencia").Value+".xml";					
		
		//determinar el contenido a enviar //gb 27092011
		var xmlfieldname="uf_XML";
		if(r("uf_Tipo").Value==3){
			xmlfieldname="uf_XMLCFDI";
		}
		//----------------------------------------------
		
		if(!eBasic.SaveStrToFile(archivo1,r(xmlfieldname).Value)){
			Log("Error al guardar archivo xml. ");
			uiCFD.CloseProgress(false);
			return 0;
		}
		
		uiCFD.ShowProgress("Obteniendo documento en versión de impresión (xpr)",25);
		
		archivo2=eBasic.AddSlashPath(eBasic.GetTempDir())+"Pres_"+r("Referencia").Value+obtenerExtensionArchivo(r("uf_ExtPresentacion").Value);							
		if(esInvalido(r("uf_Presentacion").Value,"El registro (vista de impresión) no existe. Ejecute el formato desde Más Informes y Gráficos en el menú Informes.")){
			if(eBasic.eMsgbox("El archivo presentación.xpr no existe. ¿Desea conotinuar y enviar unicamente el archivo XML?",4)==6)
				archivo2="";
			else{
				uiCFD.CloseProgress(false);
				return 0;
			}
		}
		
		if(archivo2!=""){
			if(!proccess.saveStrBase64toFile(r("uf_Presentacion").Value,archivo2)){
				Log("Error al guardar archivo. "+archivo2+". "+proccess.lastError);
				uiCFD.CloseProgress(false);
				return 0;
			}
		}
		
		uiCFD.ShowProgress("Obteniendo configuración",35);
		
		//Enviar por mail
		//***************
		var from,to,cc,subject,displayName,body,extbody,attach,filemsg,getAddr;
		var server,ssl,port,user,pwd,timeout;
		
		to=r("eMail").Value;
		if(esInvalido(to,"",false,true) || solicitarDir==1){
			to=uiCFD.getAddress("");
		}else{
			getAddr=parseInt(loadTextFromGlobalVar("FXCA315x", "1"));
			if(getAddr==1) to=uiCFD.getAddress(to);
		}
		
		if(to==""){
			Log("Envío cancelado. No se se agregó el destinario.");
			uiCFD.CloseProgress(false);
			return 0;
		}
		
		
		from = loadTextFromGlobalVar("FXCA304x", "");
		displayName = loadTextFromGlobalVar("FXCA305x", "");
		subject= loadTextFromGlobalVar("FXCA306x", "Factura Electrónica $Referencia$");
		subject=uiCFD.ReplaceMacros(subject,"$Referencia$",r("Referencia").Value);
		
		cc = loadTextFromGlobalVar("FXCA307x", "");
		body = loadTextFromGlobalVar("FXCA308x", "");
		server= loadTextFromGlobalVar("FXCA309x", "");
		ssl = parseInt(loadTextFromGlobalVar("FXCA310x", "0"));
		if(ssl==1)
			ssl=true;
		else
			ssl=false;
	
		user= loadTextFromGlobalVar("FXCA311x", "");
		pwd= loadTextFromGlobalVar("FXCA312x", "");		
		timeout = parseInt(loadTextFromGlobalVar("FXCA313x", "60"));
		port= parseInt(loadTextFromGlobalVar("FXCA314x", "80"));
		
		filemsg=eBasic.AddSlashPath(GetRepository())+"CFD\\messageinfo.dat";
		if(eBasic.FileExists(filemsg)){
			extbody=eBasic.LoadFileToStr(filemsg);			
		}
		if(extbody==null) extbody="";		
		if(archivo2!="")
			attach=archivo1+";"+archivo2;
		else
			attach=archivo1;
		
		uiCFD.ShowProgress("Enviando...",65);
		
		proccess.sendeMail(server,port,timeout,ssl,user,uiCFD.DecryptString(pwd),from,displayName,to,cc,subject,body,extbody,attach);
		if(proccess.lastError!=""){			
			Log(proccess.lastError);
			uiCFD.CloseProgress(false);
		}else{
			uiCFD.ShowProgress("Mensaje enviado.",100);
			uiCFD.CloseProgress();
			Log("Mesaje enviado correctamente a: "+to);			
		}
		
		// eBasic.eMsgbox(attach);		
		// eBasic.OpenDocument("mailto:"+to+"?subject="+subject+"&body="+body+"&cc="+cc+"&bcc="+bcc+"&Attach="+attach+"");
		
		//***************
		r.Close();
		r=null;
		
		return -1;
	}catch(e){		
		Log("Error al exportar documento.");
		uiCFD.CloseProgress(false);
		throw(e);
		return 0;
	}

}



function RealizarInformeMensual(){
var Brw;

if(!uiCFD.PermitirAcceso("FXCA321x",Application.UIUsers.CurrentUser)) return 0;
		
	if(uiCFD.GenerarInformeMensual()){
		Brw=Application.Browsers.GetBrowser("qCFD");
		if(Brw!=null) Brw.RefreshRst();
		return -1;
	}else{
		return 0;
	}
}

function VerInformesGenerados(){

	if(!uiCFD.PermitirAcceso("FXCA322x",Application.UIUsers.CurrentUser)) return 0;
	uiCFD.VerInformesMensuales(uiCFD.PermitirAcceso("FXCA324x",Application.UIUsers.CurrentUser,false),uiCFD.PermitirAcceso("FXCA323x",Application.UIUsers.CurrentUser,false));	
}

function EliminarCFD(){
//si el cfd no ha sido reportado.
var pkcfd;
var Brw;

/* 	if(!uiCFD.PermitirAcceso("FXCA325x",Application.UIUsers.CurrentUser)) return 0;
	
	Brw=Application.Browsers.GetBrowser("qCFD");
	if(esInvalido(Brw,"Error de acceso a Browser aCFD")) return 0;
	
	pkcfd=Brw.PrimaryKeyValue;
	if(esInvalido(pkcfd,"Seleccione un elemento.",true)) return 0;
	
	if(!uiCFD.PosibleCancelar(pkcfd)){
		//cfd no reportado, venta no cancelada (no se puede cancelar venta si existe cfd)
		eBasic.eMsgbox("Error al eliminar. "+uiCFD.LastErrorDescript,6);
		return 0;
	}	
	
	if(!uiCFD.CancelarCFD(pkcfd)){
		if(uiCFD.LastErrorDescript!="") eBasic.eMsgbox("Error al eliminar. "+uiCFD.LastErrorDescript,6);
		return 0;
	}
	Brw.RefreshRst();
	eBasic.eMsgbox("Elemento eliminado correctamente.",6);
	return -1; */
}


function crearCFDVentas(A){
/*
//FUNCION PUBLICA
var pkcfd;
var pkventa;
var tc=0;

	if(!inicializarObjetos()) return 0;	
	
	pkventa=A.Context.ActiveWindow.PrimaryKeyValue;	
	if(pkventa==null) pkventa=0;
	if(pkventa<1){
		Log("Seleccione un elemento de la lista.");
		return 0;
	}
	tc=uiCFD.TipoComprobanteAGenerarInt;
	if(tc==1) //cfd
	{
		//pkventa=Application.Browsers.GetBrowser("qVentas").PrimaryKeyValue;
		pkcfd=obtenerFacturaElectronica(pkventa);
	}else{		
		if(tc==4){//cfdi/cbb				
			tc=uiCFD.BlockVentaCFDI_CBB(pkventa);//buscar tipo				
		}
		switch(tc){
			case 2: //cfdi
				cfdi.crearCFDVentas(A);
				break;
			case 3: //cbb
				var sArchivo="";
				generarCBB(pkventa);								
				break;
			case 0:
			default:
				eBasic.eMsgbox("Se intentó crear el comprobante CFDI o CBB, pero el block asignado no está configurado para ninguno de estos tipos",6);
				return 0;
		}
		
	}

	tryGenerarComprobantePorAnticipo(pkventa);
*/
	try
	{//R5
		if(A==undefined || A==null) throw new Error("Se esperaba el objeto subyacente al documento de venta.");
		cfdi33.TimbrarVtaCfdi33(A.Context.ActiveWindow.PrimaryKeyValue);
	}
	catch(ex)
	{
		Log(ex.message);
	}
}



function despuesGuardarVenta(pkventa,spregunta){
/*
//FUNCION PUBLICA
	var auto=0;
	var pkcfd=0;
	var tc=0;
			
	if(spregunta==null) spregunta="";
	
	if(!inicializarObjetos()) return 0;
	auto=loadNumFromGlobalVar("FXCA327x",1);
	
	tc=uiCFD.TipoComprobanteAGenerarInt;
	if(tc==1) //cfd
	{							
		if(auto==1){
			pkcfd=obtenerFacturaElectronica(pkventa);
		}else{
			if(spregunta!=""){
				if(eBasic.eMsgbox(spregunta,4)==6){
					pkcfd=obtenerFacturaElectronica(pkventa);
				}
			}
		}		
		
	}else{				
		if(tc==4){//solo cfdi			
			tc=uiCFD.BlockVentaCFDI_CBB(pkventa);//buscar tipo
		}
		switch(tc){
			case 2: //cfdi					
				if(auto==1){
					pkcfd=cfdi.obtenerFacturaElectronica(pkventa);
				}else{
					if(spregunta!=""){
						if(eBasic.eMsgbox(spregunta,4)==6){
							pkcfd=cfdi.obtenerFacturaElectronica(pkventa);
						}
					}
				}
				break;
			case 3: //cbb
				var sArchivo="";					
					generarCBB(pkventa);					
					pkcfd=1;
				break;
			case 0:
			default:
				eBasic.eMsgbox("Se intentó crear el comprobante CFDI o CBB, pero el block asignado no está configurado para ninguno de estos tipos",6);
				return 0;
		}			
	
			
	}
	
	tryGenerarComprobantePorAnticipo(pkventa);
	
	return pkcfd;
	*/

	try
	{//R5
		cfdi33.TimbrarVtaCfdi33(pkventa);
	}
	catch(ex)
	{
		Log(ex.message);
	}
}


function generarCBB(pkventa){
	if(!uiCFD.FolioAprobadoCBB(pkventa)){
		Log("No se pudo obtener la vista de impresión. Revise la configuración de rango de folios para CBB");
		return 0; //debe validar esto antes porq podria ser una factura que no esta conf para generar cfds.
	}
	
	var venta=eBasic.eCreateObject("EDOFx.Venta");
	if(esInvalido(venta,"Error al crear objeto EDOFx.Venta")) return 0;	
	//Cargar objeto
	if(!venta.LoadFromADOConnection(pkventa,"",Application.ADOCnn,3)){
		Log("Error al cargar documento. "+venta.lastErrDescrip);
		return 0;
	}
	
	if(!documentoCorrecto_Venta(venta,true)) return 0;
	
	
	
	//========================== RESUMIDO DEMINUS================
	//NOTA::::ESTE CODIGO TAMBIEN ESTA EN generarCFD() DE VENTA
	//ASIGNAR RESIMO O DETALLADO DEMINUS
	var oformaGenFac=null;
	var boResumido=false;
	var inTipoFormato=0;
	if(venta.Documento==4 && tipoAplicacion()==2 && !OnBackOffice){
		//Es factura, Es deminus y Está en el POS
		oformaGenFac=uiCFD.FormaGenerarComprobanteDeminus();
		boResumido=oformaGenFac.Resumido;
	}			
			if(boResumido){
				oformaGenFac.CantidadA=1;
				oformaGenFac.PrecioA=0;
				oformaGenFac.DescuentosA=0;
				oformaGenFac.ImpuestosA=0;
				
				oformaGenFac.CantidadB=1;
				oformaGenFac.PrecioB=0;
				oformaGenFac.DescuentosB=0;
				oformaGenFac.ImpuestosB=0;
				
				for(i=1;i<=venta.Detalle.Elements.Count();i++){	
					//OBTENER CONCEPTO. Montos se incluirán sin impuestos
					dv=venta.Detalle.Elements.Item(i);
					if(esInvalido(dv,"No se pudo obtener detalle de venta con indice: "+i)) return 0;
					
					//iva es impuesto uno
					if(dv.Impuesto1==0){					
						//sin iva	
						oformaGenFac.PrecioB=oformaGenFac.PrecioB+(dv.Cantidad*dv.Precio);
						oformaGenFac.DescuentosB=oformaGenFac.DescuentosB+(dv.Descuento1+dv.Descuento2);
						oformaGenFac.ImpuestosB=oformaGenFac.ImpuestosB+(dv.Impuesto1+dv.Impuesto2+dv.Impuesto3+dv.Impuesto4);
						
					}else{
						//con iva
						oformaGenFac.PrecioA=oformaGenFac.PrecioA+(dv.Cantidad*dv.Precio);
						oformaGenFac.DescuentosA=oformaGenFac.DescuentosA+(dv.Descuento1+dv.Descuento2);
						oformaGenFac.ImpuestosA=oformaGenFac.ImpuestosA+(dv.Impuesto1+dv.Impuesto2+dv.Impuesto3+dv.Impuesto4);
					}
				}
				
				oformaGenFac.PrecioA=roundValue(oformaGenFac.PrecioA);
				oformaGenFac.DescuentosA=roundValue(oformaGenFac.DescuentosA);
				oformaGenFac.ImpuestosA=roundValue(oformaGenFac.ImpuestosA);
				
				oformaGenFac.PrecioB=roundValue(oformaGenFac.PrecioB);
				oformaGenFac.DescuentosB=roundValue(oformaGenFac.DescuentosB);
				oformaGenFac.ImpuestosB=roundValue(oformaGenFac.ImpuestosB);
				
				inTipoFormato=1;
				if(oformaGenFac.PrecioB>0) inTipoFormato=2;
				
				if(!uiCFD.EstablecerDeminusTipoFormato(venta.Sys_PK,inTipoFormato,oformaGenFac))
				{
					Log("Error al guardar información de tipo de formato a imprimir detalle/resumido.");
					return 0;
				}
			}else{
				uiCFD.EstablecerDeminusTipoFormato(venta.Sys_PK,inTipoFormato);
			}
	//========================== FIN RESUMIDO DEMINUS================
	
	
	presentacionCBB(pkventa,1);
	Application.MouseDefault();
	return 1;
}



function generarCBB_CXC(pkcxc){
	if(!uiCFD.FolioAprobadoCBB_CXC(pkcxc)){
		Log("No se pudo obtener la vista de impresión. Revise la configuración de rango de folios para CBB");
		return 0; //debe validar esto antes porq podria ser una factura que no esta conf para generar cfds.
		
	}
	
	
	var cxc=eBasic.eCreateObject("EDOFx.DCXC");
	if(esInvalido(cxc,"Error al crear objeto EDOFx.DCXC")) return 0;	
	//Cargar objeto
	if(!cxc.LoadFromADOConnection(pkcxc,"",Application.ADOCnn,3)){
		Log("Error al cargar documento. "+cxc.lastErrDescrip);
		return 0;
	}
	
	if(!documentoCorrecto_CXC(cxc,true)) return 0;
	
	
	
	var unidadPredeterminada=Configuracion.eApplicationVars.GetGlobalvar.GetTextVar("gvar_unidadcxc","SERVICIO")+"";
	if(unidadPredeterminada=='' || unidadPredeterminada==null){
		Log("No existe una unidad predeterminada para el documento. Revise la configuración en el panel de control.");
		return 0;
	}

	if(!uiCFD.EstablecerUnidadDCXC(cxc.Sys_PK,unidadPredeterminada)){
		Log("Error al guardar unidad predeterminada del concepto."+uiCFD.LastErrorDescript);
		return 0;
	}

	
	//ESTABLECER ATRIBUTOS SI NO LOS TIENE: FORMAPAGO,METODOPAGO,CONDICIONESPAGO Y NUMEROCUENTAPAGO 	
	//gb 01022012
	//-----------
	
	if(!asignarAtributosAdicionalesCXC(cxc)){
		eBasic.eMsgbox("Error al asignar atributos adicionales del comprobante fiscal (2012).",6);
		return 0;
	}
	//-----------
		
	presentacionCBB(pkcxc,2);	
	Application.MouseDefault();
}

function presentacionCBB(pk,TIPOx){
	asignarDivisa(pk,TIPOx);
	
	var atmpf,archivo_temp;
	
	var tipo=1; 			// 1=Reporte CodiceFX, 2=Tira, 3=PDF,DOC,DOCX	
	var fmt_plantilla=""; 	//ubicacion del formato xpd,js,txf PARA FACTURA O NOTA DE CREDITO	
	var extension=1;		//extension del archivo 1=xpr,2=txt, 3=pdf, 4=doc y 5=docx
	var destino=1;			//1=Vista previa, 2=Impresora predeterminada y 3=No imprimir
	var enviarmail=3;		//1=Enviar a dir del cliente, 2=Solicitar direccion, 3=No enviar	
	var js="";
	var tdocumento=0;
	
	atmpf=proccess.getTempFileName();
	archivo_temp=atmpf;
	
	switch(TIPOx){
		case 1://venta
			tdocumento=uiCFD.TipoDocumento(pk);break;
		case 2://dcxc
			tdocumento=uiCFD.TipoDocumento_CXC(pk);break;
		default:
			Log("Tipo de documento incorrecto");
			return 0;
	}
	
	switch(tdocumento){
		case 4:
			fmt_plantilla=loadTextFromGlobalVar("CBBImp002","");
			break;
		case 5:
			if(TIPOx==1) 
				fmt_plantilla=loadTextFromGlobalVar("CBBImp006","");//NCredito ventas
			else
				fmt_plantilla=loadTextFromGlobalVar("CBBImp007","");//NCredito cxc
			break;
		case 17:
			fmt_plantilla=loadTextFromGlobalVar("CBBImp008","");
			break;
		case 18:
			fmt_plantilla=loadTextFromGlobalVar("CBBImp010","");//factura-pagare 08022012
			break;
		case 19:
			fmt_plantilla=loadTextFromGlobalVar("CBBImp011","");//factura-recibo 14022012
			break;
		default:
			eBasic.eMsgbox("Documento inválido. El tipo de documento no puede ser "+tdocumento);
			return 0;
	}
		
	
	tipo=loadNumFromGlobalVar("CBBImp001",1);	
	extension=loadNumFromGlobalVar("CBBImp003",1);
	destino=loadNumFromGlobalVar("CBBImp004",1);
	//enviarmail=loadNumFromGlobalVar("CBBImp005",3);
	predViewer=loadNumFromGlobalVar("CBBImp009",1);
	
	
	try{
		//DESTINO
		switch(destino){
			case 1: //vista previa			
				switch(tipo)
				{
					case 1: 
					case 2: 
						archivo_temp+=".xpr";
						EjecutarReporte(fmt_plantilla,3,pk,true,archivo_temp);
						dsgnTemplate2.openDocument(archivo_temp,"");//abrir xpr o txt
						break;
					case 3: 
						
						switch(extension){
							case 3:
								archivo_temp+=".pdf";
								dsgnTemplate2.savePreview(fmt_plantilla,pk,512,archivo_temp);
								break;
							case 4:
								archivo_temp+=".doc";
								dsgnTemplate2.savePreview(fmt_plantilla,pk,64,archivo_temp);
								break;
							case 5:
								archivo_temp+=".docx";
								dsgnTemplate2.savePreview(fmt_plantilla,pk,1024,archivo_temp);
								break;
						}
					
						if(predViewer==1 && extension==3)//pdf? en visor predeterminado?
						{
							dsgnTemplate2.openDocument(archivo_temp,"");
							break;
						}
						dsgnTemplate2.showTXFile(archivo_temp,true);//segundo parámetro indica que el archivo se borrará despues de abrir						
						break;
				}				
				break;			
			case 2: //impresora predeterminada
			
				switch(tipo)
				{
					case 1: //xpd
						EjecutarReporte(fmt_plantilla,2,pk,true);						
						//Borrar temp
						DeleteFile(archivo_temp);
						break;
					case 2: //txt
						var contenido="";
						contenido=eBasic.LoadFileToStr(archivo_temp);					
						ConfigImpresora();
						Impresora.Texto(contenido);
						Impresora.Terminar();
						//Borrar temp
						DeleteFile(archivo_temp);
						break;
					case 3: //pdf,doc,docx
						dsgnTemplate2.printTXFile(archivo_temp,true);//segundo parámetro indica que el archivo se borrará despues de imprimir
						break;
				}								
				break;		
				
			case 3:	//no imprimir				
				//Borrar temp
				DeleteFile(archivo_temp);
				break;
		}	
	}catch(e){
		eBasic.eMsgbox("Error al abrir o enviar a impresora.",6);
	}
	
	DeleteFile(atmpf);
	
	
}

/******************************* LOG ******************************/
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}


/*****************************************************************
		FUNCIONES PARA COMPATIBILIDAD CON EL PUNTO DE VENTA
******************************************************************/

function GetRepository(){
var sp="";
	try{
		sp=Application.ScrAdmin.GetPath(0);
	}catch(e){
		sp=Application.SourceAdmin.GetPath(0);
	}
	return sp;
}
function UtilizarImpuestoFrontera(){
	//FXConfig.UtilizarImpuestoFrontera();
	
	if(OnBackOffice){
		return Configuracion.eLocalVars.FXCT116;
	}else{
		var v;
		v=Configuracion.eLocalVars.EGetSetting(ApplicationName,"NodeVars","FXCT116","0");
		if(parseInt(v)==0)
			return false;
		else
			return true;
	}
	
}

function EjecutarReporte(sArchivo,Destino,PK,PGlobal,ArchivoXPR,P1,P1Val){
//PENDIENTE COMPATIBILIDAD CON POS
var savetofile=false;

	try{
		if(PGlobal==null) PGlobal=false;
			
		if(OnBackOffice){
			Reportes.EjecutarReporte(sArchivo,Destino,PK,PGlobal,ArchivoXPR,P1,P1Val);	
		}else{
			if(Destino==1) return -1; //preview No disponible
			if(Destino==3)
				savetofile=true;
			else
				savetofile=false;			
			Impresora.PrintReport(sArchivo,PK,false,P1,P1Val,savetofile,ArchivoXPR);
		}	
		return -1;
	}catch(e){
		Log("Error al ejecutar reporte.")
		throw(e);
		return 0;
	}
}

function NDecsMonto(){
//PENDIENTE COMPATIBILIDAD CON POS
	//return FXConfig.NDecsMonto()
	return uiCFD.NumeroDecimalesXML;//LBVenta.DecPreMontos;
}

function NDecsUnidades(){
	return LBInventario.DecPreUnidades;
}

function FormatoMonto(){
	try{
		return Inventario.FormatoMontos;
	}catch(e){
		return "$ #,#.00";
	}
}

function esFactura(PKVenta){
	var r;
	r=openRecordset("SELECT Documento FROM Venta WHERE Sys_PK="+PKVenta,true);
	if(r==null){
		eBasic.eMsgbox("No se pudo generar el CFD. Error al comprobar documento.",6);
		return 0;
	}
	if(r.Fields("Documento").Value==4)
		return -1;
	else
		return 0;
}


function obtenerExtensionArchivo(tipo){
	/*
	ut_cfd.uf_ExtPresentacion=
		1=XPR
		2=TXT
		3=PDF
		4=DOC
		5=DOCX	
	*/	
	if(tipo==null) return ".xpr";
	
	switch(tipo){
		case 1: return ".xpr";break;
		case 2: return ".txt";break;
		case 3: return ".pdf";break;
		case 4: return ".doc";break;
		case 5: return ".docx";break;		
		default: 
			return ".xpr"; break;
	}
}



//============ FUNCIONES PARA IMPRESION DE TIRA ==============

function ConfigImpresora(){
	//Configurar los parametros de la impresora que requiera
	Impresora.NombreFuente ("Courier New");
	Impresora.TamFuente(10);
	try{
		//Impresora.SetPrinter(NodeVars.EGetSetting(RegAppName,"POSVAR","PRINTER",""));
	}catch(e){
		eBasic.eMsgbox("Error al configurar impresora.",6);
	}
} 

function loadScript(sName,Err)
{
	try
	{
		if (!ModuleLoaded(sName))
		{
			if (!Application.LoadScript(sName))
			{
				eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
				return false;
			}
		}
	}catch(e)
	{
		eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
		return false;
	}	
	return true;
}

function ModuleLoaded(sName){
	try{
		if(OnBackOffice){
			return Application.ModuleLoaded(sName);
		}else{
			var i=0;
			for(i=1;i<=MainForm.Engine.Modules.Count();i++){
				if(MainForm.Engine.Modules(i).Name=="mdl"+sName){
					return true;
					break;
				}
			}
			return false;
		}		
	}catch(e){
		return false;
	}
}

function getString(v){
	var i=0;
	var n="";
	v=v.split("");
	for(i=0;i<v.length;i++){
		if(v[i]=="\\"){
			n+="\\\\";
		}else{
			n+=v[i];
		}
	}
	return n;
}




/******************************************
	GENERACION DE OBJETO CFD DESDE DCXC
******************************************/

function generarCFD_CXC(cxc){
	var data;	
	var pkcxc;	
	var cfd;
	var r;
	var Domicilio;
	var traslado;
	var retencion;	
	
	var boCConcepto,cConcepto_js,cConcepto_contenido,resultado_CConcepto;
	var boComplemento,complemento_js,complemento_contenido,resultado_complemento;
	var boAddenda,addenda_js,addenda_contenido,resultado_addenda;
	
	var iventa;
	
	
	if(esInvalido(cxc,"No se ha indicado el documento de cuentas por cobrar.")) return null;	
	
	pkcxc=cxc.Sys_PK;
	
	//Crear objectos
	//*********************************************
	cfd=null;
	cfd=eBasic.eCreateObject("geCFD.cCFD");	//new ActiveXObject("geCFD.cCFD");
	if(cfd==null){
		Log("Error al crear objeto geCFD.cCFD");
		return null;
	}		

	
	if(!disponibleParaGenerar_CXC(cxc,true)) return null;
	
	try{
		//ATRIBUTOS PRINCIPALES. ELEMENTO: COMPROBANTE
		var pkCFDfolio,fechadocumento,serie,noaprobacion,anoaprobacion,nocertificado,certificado;
		
		pkCFDfolio=buscarCFDfolio_Sys_PK(cxc.IFolio.Block.Sys_PK);		
		if(esInvalido(pkCFDfolio,"El folio asignado al documento no tiene un número de aprobación válido.",true)) return null;
		
		pkRangoFolioAprobado=pkCFDfolio; //Utilizado para insertar en tabla ut_cfd.
		
		r=openRecordset("SELECT ut_CFDfolio.uf_Serie,ut_CFDfolio.uf_noAprobacion,ut_CFDfolio.uf_anoAprobacion,ut_CFDfolio.uf_FolioInicial,ut_CFDfolio.uf_FolioFinal,ut_CFDinfo.uf_noCertificado,ut_CFDinfo.uf_Certificado FROM ut_CFDfolio INNER JOIN ut_CFDinfo ON ut_CFDfolio.uf_CFDinfo=ut_CFDinfo.Sys_PK WHERE ut_CFDfolio.Sys_PK="+pkCFDfolio);
		if(esInvalido(r,"Error al acceder a información de folios aprobados.")) return null;
			
			fechadocumento=cxcFechaHora(cxc);
			if(esInvalido(fechadocumento,"No se pudo cargar la fecha-hora de cxc")) return null;
			
			serie=stringValue(r,"uf_serie"); //O
			noaprobacion=r("uf_noAprobacion").Value; //R
			if(esInvalido(noaprobacion,"El número de aprobación de rango de folios es inválido.",true)) return null;
			anoaprobacion=r("uf_anoAprobacion").Value; //R
			if(esInvalido(anoaprobacion,"El año de aprobación de rando de folios es inválido.",true)) return null;
			nocertificado=stringValue(r,"uf_noCertificado"); //R
			if(esInvalido(nocertificado,"El número de certificado de sello digital es inválido.",false,true)) return null;
			certificado=stringValue(r,"uf_Certificado"); //O
			if(certificado!=""){
				certificado=certificadoBase64(certificado);
				if(esInvalido(certificado,"No se pudo cargar el archivo de certificado de sello digital. Asegúrese que la ubicación es correcta.",false,true)) return null;
			}
			
			if(cxc.IFolio.Folio<r("uf_FolioInicial").Value || cxc.IFolio.Folio>r("uf_FolioFinal")){
				Log("Folio incorrecto. El folio se ecuentra fuera del rango de folios válido con número de aprobación: "+noaprobacion);
				return null;
			}
			
			cfd.version= 2.2;   //R //2.0->2.2 //gb 25012012
			cfd.serie = serie; //O
			cfd.folio = cxc.IFolio.Folio; //R
			cfd.fecha = fechadocumento;//venta.Fecha;   //R formato:"2010-04-11T18:38:20";			
			cfd.sello = ""; //R  se indicará después de generarlo.
			cfd.noAprobacion = noaprobacion;   //R
			cfd.anoAprobacion = anoaprobacion;   //R		
			cfd.formaDePago = sFormaDePago_CXC(cxc);    //R //gb 31012012
			cfd.noCertificado = nocertificado; //R
			cfd.certificado = certificado;   //O //BASE64 DE CERTIFICADO DE SELLO DIGITAL
			cfd.condicionesDePago = sCondicionesDePago_CXC(cxc); //O //gb 31012012
			
			var st,imp_origen,imp_intfin,imp_intmor; //variable usada tambien en:concepto,impuesto
			imp_origen=0;
			imp_intfin=0;
			imp_intmor=0;
			
			switch(cxc.Documento){
				case 5:			
					st=cxc.Haber/(1+(cxc.porImpuestoCap/100));
					st=st.toFixed(2);//siempre 2 por el importe se recalcula y los decimales varian
					
					cfd.subTotal =st;  //R			
					cfd.total = roundValue(cxc.Haber); //R		
					break;
				case 17:
					st=cxc.Debe/(1+(cxc.porImpuestoCap/100));
					st=st.toFixed(2);//siempre 2 por el importe se recalcula y los decimales varian
					
					cfd.subTotal =st;  //R			
					cfd.total = roundValue(cxc.Debe); //R									
					break;
				
				case 18: //PAGARE OBTENER INFO DE AMBOS
				case 19: //RECIBO OBTENER INFO DE AMBOS
					
					if(cxc.Documento==18){
						iventa=cxc.IVenta.GetStrongObject(true);
						
						//Obtener subtotal: capital sin impuestos+interes fiananciero sin impuetos+interes moratorio sin impuesto										
						//Quitar financieros impuesto correspondiente al total de la venta origen
						//(debe-financieros)*impuestos/subtotal
						imp_origen=(cxc.Debe-cxc.IntFinancieros)*(iventa.Impuesto1+iventa.Impuesto2+iventa.Impuesto3+iventa.Impuesto4)/(iventa.Subtotal-iventa.Descuento1-iventa.Descuento2+iventa.Impuesto1+iventa.Impuesto2+iventa.Impuesto3+iventa.Impuesto4);
						imp_origen=parseFloat(imp_origen);
						st=(cxc.Debe-cxc.IntFinancieros)-parseFloat(imp_origen);
												
						if(cxc.IntFinancieros>0){
							//contiene intereses financieros incluido impuestos si existieran						
							if(cxc.porImpuestoFin>0){
								//el int financiero tiene impuestos
								imp_intfin=cxc.IntFinancieros-(cxc.IntFinancieros/(1+(cxc.porImpuestoFin/100)));
								st=st+(cxc.IntFinancieros-imp_intfin);
							}else{
								//el int financiero NO tiene impuestos
								st=st+cxc.IntFinancieros;
							}
						}
						
						if(cxc.IntMoratorios>0){					
							if(cxc.porImpuestoMor>0){
								//el moratorio cobrado contiene impuestos
								imp_intmor=cxc.IntMoratorios-(cxc.IntMoratorios/(1+(cxc.porImpuestoMor/100)));
								st=st+(cxc.IntMoratorios-imp_intmor);
							}else{
								//el moratorio cobrado no contiene impuestos
								st=st+cxc.IntMoratorios;
							}
						}
						
						cfd.subTotal =roundValue(st);  //R
						cfd.total= roundValue(cxc.Debe+cxc.IntMoratorios); //R
						
					}else{ //19 recibo
						
						iventa=eBasic.eCreateObject("EDOFx.Venta");
						if(esInvalido(iventa,"Error al crear objeto EDOFx.Venta -origen recibo")) return null;	
						//Cargar objeto venta							
						if(!iventa.LoadFromADOConnection(LBCXC.obtenerVentaFinanciada_ReciboPorAnticipo(cxc.Sys_PK),"",Application.ADOCnn,3)){
							Log("Error al cargar documento. "+iventa.lastErrDescrip);
							return null;
						}
						
						//Obtener subtotal: capital sin impuestos correspondiete a la venta relacionada
						imp_origen=(cxc.Haber)*(iventa.Impuesto1+iventa.Impuesto2+iventa.Impuesto3+iventa.Impuesto4)/(iventa.Subtotal-iventa.Descuento1-iventa.Descuento2+iventa.Impuesto1+iventa.Impuesto2+iventa.Impuesto3+iventa.Impuesto4);
						imp_origen=parseFloat(imp_origen);
						st=(cxc.Haber)-parseFloat(imp_origen);
						
						cfd.subTotal =roundValue(st);  //R
						cfd.total= roundValue(cxc.Haber); //R
							
					}//fin else es recibo 19					
							
					
					//asignar
					var folioorigen=eBasic.eCreateObject("geUICFD.cFolioOrigen");
					if(esInvalido(folioorigen,"No se pudo crear el objeto geUICFD.cFolioOrigen")) return null;
					if(!folioorigen.cargarInformacion_CFD(iventa.Sys_PK,cxc.ADOCnn)){
						Log("No se pudo cargar la información del folio origen de la parcialidad. "+folioorigen.lastError);
						return null;
					}
					cfd.FolioFiscalOrig=folioorigen.FolioFiscalOrig+"";
					cfd.SerieFolioFiscalOrig=folioorigen.SerieFolioFiscalOrig+"";
					cfd.FechaFolioFiscalOrig=folioorigen.FechaFolioFiscalOrig;
					cfd.MontoFolioFiscalOrig=folioorigen.MontoFolioFiscalOrig;
					
					break;
				
			}//fin switch tipo documento
			
			cfd.descuento = 0;//gb  //O		
			cfd.motivoDescuento = "";   //O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO		
			
			
			//GB incluir divisa //opcional
			var ocliente;
			ocliente=cxc.ICliente.GetStrongObject();
			ocliente.IDivisa.LoadFromADOConnection(ocliente.IDivisa.Sys_PK,"",cxc.ADOCnn);			
			if(ocliente.IDivisa.Codigo.toUpperCase()=="PMX" || ocliente.IDivisa.Codigo.toUpperCase()=="MXN"){ //ES OPCIONAL
				cfd.TipoCambio=cxc.TipoCambio+"";	//O
				cfd.Moneda="MXN";	//O				
			}else{				
				cfd.TipoCambio=cxc.TipoCambio+"";	//O
				cfd.Moneda=ocliente.IDivisa.Codigo.toUpperCase()+"";	//O
			}
			
			
			cfd.tipoDeComprobante = sTipoComprobante(cxc.Documento);  //R
			cfd.metodoDePago =sMetodoDePago_CXC(cxc);//R  //gb 31012012		
			//LugarExpedicion se encuentra abajo
			cfd.NumCtaPago=sNumeroCuentaPago_CXC(cxc); //O Atributo opcional para incorporar al menos los cuatro últimos digitos del número de cuenta con la que se realizó el pago. // gb 31012012
			
		
		//ELEMENTO EMISOR //R						
		cfd.Emisor.rfc = rfcEmisor();    //R
		cfd.Emisor.nombre =nombreEmisor();  //R
			//DOMICILIO FISCAL 
			Domicilio=null;
			Domicilio=oDimicilioFiscal();
			if(esInvalido(Domicilio,"No se pudo cargar el domicilio fiscal del emisor.")) return null;
			
			cfd.Emisor.DomicilioFiscal.calle = direccionDividir(Domicilio.Direccion,1)+"";  //R
			cfd.Emisor.DomicilioFiscal.noExterior= direccionDividir(Domicilio.Direccion,2)+""; //0
			cfd.Emisor.DomicilioFiscal.noInterior= direccionDividir(Domicilio.Direccion,3)+""; //O
			cfd.Emisor.DomicilioFiscal.colonia= Domicilio.Colonia+"";  //O
			cfd.Emisor.DomicilioFiscal.localidad=""; //O
			cfd.Emisor.DomicilioFiscal.referencia= Domicilio.Notas+"";   //O
			cfd.Emisor.DomicilioFiscal.municipio= obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";    //R
			cfd.Emisor.DomicilioFiscal.estado= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";   //R
			cfd.Emisor.DomicilioFiscal.pais= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";   //R
			cfd.Emisor.DomicilioFiscal.codigoPostal = Domicilio.CodPos+"";  //R
			
			
			//EXPEDIDO EN //OPCIONAL
			Domicilio=null;
			if(parseInt(loadTextFromGlobalVar("FXCB01121", "0"))==1) //agregado gb 26012012
			{
				//domicilio fiscal es domicilio de expedición-> domicio de expedición ya no se agrega
				
				cfd.LugarExpedicion=cfd.Emisor.DomicilioFiscal.municipio+", "+cfd.Emisor.DomicilioFiscal.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. gb 26012012
				
			}else{			
								
				//ANTES 2012 -> gb  se supone que domicilio de expedicion sera el domicilio fiscal del emisor ya que cxc no tiene relacionado un centro de consumo
				//A PARTIR 2012 ->gb El domicilio de expedicion se obtiene del centro de consumo que haya sido marcado			
				Domicilio=oExepedidoEn_CXC();
				if(!esInvalido(Domicilio,"Sin domicilio de expedición")){
					cfd.Emisor.ExpedidoEn.calle = direccionDividir(Domicilio.Direccion,1)+"";  //O
					cfd.Emisor.ExpedidoEn.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
					cfd.Emisor.ExpedidoEn.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O								
					cfd.Emisor.ExpedidoEn.colonia = Domicilio.Colonia+"";//O
					cfd.Emisor.ExpedidoEn.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
					cfd.Emisor.ExpedidoEn.referencia = Domicilio.Notas+"";//O
					cfd.Emisor.ExpedidoEn.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
					cfd.Emisor.ExpedidoEn.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
					cfd.Emisor.ExpedidoEn.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";  //R
					cfd.Emisor.ExpedidoEn.codigoPostal = Domicilio.CodPos+"";//O
					if(esInvalido(cfd.Emisor.ExpedidoEn.pais,"Falta valor en atributo País en domicilio de expedición.",false,true)) return null;
					
					cfd.LugarExpedicion=cfd.Emisor.ExpedidoEn.municipio+", "+cfd.Emisor.ExpedidoEn.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. //gb 26012012
					
				}else{
					Log("No se pudo cargar el domicilio de expedición.");
					return null;
				}
				
			}
		
			
			//REGIMEN FISCAL //REQUERIDO
			//gb 25012012
			//--------------------------
			var RegimenesFiscales,infoRegFis,k,RegimenFiscal;
			RegimenesFiscales=uiCFD.RegimenesFicalesCol();
			if (RegimenesFiscales.Count()<1)
			{
				Log("Debe indicar el régimen fiscal en el que tributa el emisor.");
				return null;
			}
			
			for(k=1;k<=RegimenesFiscales.Count();k++){					
				infoRegFis=RegimenesFiscales.Item(k);
				RegimenFiscal=eBasic.eCreateObject("geCFD.cRegimenFiscal");
				if(esInvalido(RegimenFiscal,"No se pudo crear el objeto geCFD.cRegimenFiscal")) return null;
				
				RegimenFiscal.Regimen = infoRegFis.Regimen;
				cfd.Emisor.RegimenFiscal.Add(RegimenFiscal);
				RegimenFiscal = null;
			}
			//--------------------------
		
		
		//ELEMENTO RECEPTOR //R		           
		cfd.Receptor.rfc = cxc.ICliente.RFC+"";  //R
		cfd.Receptor.nombre = cxc.ICliente.Nombre+"";   //O
			//DOMICILIO REQUERIDO 2010//R
			//DOMICILIO OPCIONAL 2011//O
			Domicilio=null;
			Domicilio=oDomicilioReceptor(cxc.ICliente.FK_Domicilio1);
			if(!esInvalido(Domicilio,"")){			
				cfd.Receptor.Domicilio.calle = direccionDividir(Domicilio.Direccion,1)+"";//O
				cfd.Receptor.Domicilio.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
				cfd.Receptor.Domicilio.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O
				cfd.Receptor.Domicilio.colonia = Domicilio.Colonia+"";//O
				cfd.Receptor.Domicilio.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
				cfd.Receptor.Domicilio.referencia = Domicilio.Notas+"";//O
				cfd.Receptor.Domicilio.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
				cfd.Receptor.Domicilio.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
				cfd.Receptor.Domicilio.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+""; //R
				cfd.Receptor.Domicilio.codigoPostal = Domicilio.CodPos+"";//O				
			}
			
		//ELEMENTO CONCEPTOS   //R  MIN 1 MAX ILIMITADO		 
        var concepto,i,unidadPredeterminada;				
		concepto=null;		
			
			unidadPredeterminada=Configuracion.eApplicationVars.GetGlobalvar.GetTextVar("gvar_unidadcxc","SERVICIO")+"";
			if(unidadPredeterminada=='' || unidadPredeterminada==null){
				Log("No existe una unidad predeterminada para el documento. Revise la configuración en el panel de control.");
				return null;
			}
			
			if(!uiCFD.EstablecerUnidadDCXC(cxc.Sys_PK,unidadPredeterminada)){
				Log("Error al guardar unidad predeterminada del concepto."+uiCFD.LastErrorDescript);
				return null;
			}
			
			//OBTENER CONCEPTO. Montos se incluirán sin impuestos			
			if(esInvalido(cxc.Notas,"No existe un concepto para este documento",false,true)) return null;
			
			concepto=eBasic.eCreateObject("geCFD.cConcepto");
			if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;									
			concepto.cantidad = 1;//R
			concepto.unidad = unidadPredeterminada+"";//R //gb 01022012
			concepto.noIdentificacion = "";//O
			concepto.descripcion = cxc.Notas+"";//R
			
			if(cxc.Documento!=18){
				//No es pagarè por factura financiada
				concepto.valorUnitario = cfd.subTotal;//gb//roundValue(dv.Precio);//R
				concepto.importe = cfd.subTotal;//gb//roundValue(dv.Cantidad*dv.Precio);//R
			}else{
				//Es pagaré por factura financiada
				concepto.valorUnitario = roundValue(cxc.Debe-cxc.IntFinancieros-imp_origen);//R
				concepto.importe = roundValue(cxc.Debe-cxc.IntFinancieros-imp_origen);//R			
			}
				// OPCIONAL: ARRAYLIST concepto.InformacionAduanera //O   MIN CERO MAX ILIMITADO
                /*****************************
                var info = eBasic.eCreateObject("geCFD.ct_InformacionAduanera");
				if(esInvalido(info,"Error al crear objeto geCFD.ct_InformacionAduanera")) return 0;
                info.numero = "";//R
                info.fecha = Date;//R
                info.aduana = "";//R
                concepto.InformacionAduanera.Add(info);
                *****************************/
				
				// OPCIONAL: concepto.CuentaPredial       //O   MIN 0 MAX 1
                //concepto.CuentaPredial.numero=""; //R

                // OPCIONAL: concepto.ComplementoConcepto //O     MIN 0 MAX 1
                //concepto.ComplementoConcepto.complemento=null;
				
				
				/* //gb TEMPORALMENTE NO SE USARÁ COMPLEMENTO DEL CONCEPTO PARA NOTAS DE CARGO Y CREDITO DE CXC YA QUE NO HAY CAMPOS EN EL SISTEMA DE CXC PARA ESTE PROPÓSITO
				
				boCConcepto=incluirComplementoConcepto(dv.IProducto.Sys_PK);
				if(boCConcepto==null) return null;
								
				if(boCConcepto){
					cConcepto_js=eBasic.AddSlashPath(GetRepository())+ubicacionCConcepto+dv.IProducto.Codigo+".js";
					if(!eBasic.FileExists(cConcepto_js)){						
						Log("No se encontró el archivo para integrar Complemento Concepto: "+cConcepto_js+" del producto "+dv.IProducto.Descripcion);								
						Log("Error imposible continuar.");
						return null;
					}
					cConcepto_contenido=eBasic.LoadFileToStr(cConcepto_js);
					if(esInvalido(cConcepto_contenido,"El archivo "+cConcepto_js+" se encuentra vacío. Producto "+dv.IProducto.Descripcion,false,true)) return null;
					
					resultado_CConcepto=eval(cConcepto_contenido);
					if(!resultado_CConcepto){
						Log("Error al integrar complemento concepto");
						return null;
					}
				}
				*/
				

                // OPCIONAL: ARRAYLIST concepto.Parte     //O    MIN 0 MAX ILIMITADO
                /*****************************
                geCFD.cParte parte = new geCFD.cParte();
                parte.cantidad = 0;//R
                parte.unidad = "";//O
                parte.noIdentificacion = "";//O
                parte.descripcion = "";//R
                parte.valorUnitario = roundValue(0);//O
                parte.importe =roundValue(0);//O
                   // OPCIONAL: ARRAYLIST parte.InformacionAduanera     //O  MIN 0 MAX ILIMITADO
                   //*****************************
                   geCFD.ct_InformacionAduanera info = new geCFD.ct_InformacionAduanera();
                   info.numero = ""; //R
                   info.fecha = DateTime.Today;//R
                   info.aduana = "";//R
                   parte.InformacionAduanera.Add(info);
                   //*****************************
                concepto.Parte.Add(parte);
                ****************************/
			
			cfd.Conceptos.Add(concepto);           			
			concepto=null;
			
			if(cxc.Documento==18) //ES PAGARÉ -PARCIALIDAD
			{
				//CONCEPTO INTERES FINANCIERO
				if(cxc.IntFinancieros>0){
					//contiene intereses financieros incluido impuestos si existieran
					concepto=eBasic.eCreateObject("geCFD.cConcepto");
					if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;									
					concepto.cantidad = 1;//R
					concepto.unidad = unidadPredeterminada+"";//R //gb 01022012
					concepto.noIdentificacion = "";//O
					concepto.descripcion = "Pago de intereses financieros";//R
					concepto.valorUnitario =roundValue(cxc.IntFinancieros-parseFloat(imp_intfin));//R
					concepto.importe = roundValue(cxc.IntFinancieros-parseFloat(imp_intfin));//R				
					cfd.Conceptos.Add(concepto);           			
					concepto=null;				
				}
				//CONCEPTO INTERES MORATORIO
				if(cxc.IntMoratorios>0){
					//contiene intereses financieros incluido impuestos si existieran
					concepto=eBasic.eCreateObject("geCFD.cConcepto");
					if(esInvalido(concepto,"No se pudo crear el objeto geCFD.cConcepto")) return null;									
					concepto.cantidad = 1;//R
					concepto.unidad = unidadPredeterminada+"";//R //gb 01022012
					concepto.noIdentificacion = "";//O
					concepto.descripcion = "Pago de intereses moratorios";//R
					concepto.valorUnitario =roundValue(cxc.IntMoratorios-parseFloat(imp_intmor));//R
					concepto.importe = roundValue(cxc.IntMoratorios-parseFloat(imp_intmor));//R				
					cfd.Conceptos.Add(concepto);           			
					concepto=null;				
				}
			}//Fin es pagaré
		
		
		
		//ELEMENTO IMPUESTOS   //R MIN 1 MAX 1
		
		cfd.Impuestos.totalImpuestosRetenidos = 0; //O		
			//OPCIONAL ARRAY COLLECTION   //Si existe <Rentenciones> MIN 1 MAX ILIMITADO
			//cfd.Impuestos.Retenciones     
			/*******************************                                
			retencion = null;
			retencion = eBasic.eCreateObject("geCFD.cRetencion");
			if(esInvalido(retencion,"Error al crear objeto geCFD.cRetencion")) return 0;
			retencion.impuesto = "";//R //ISR o IVA
			retencion.importe = roundValue(0);//R
			cfd.Impuestos.Retenciones.Add(retencion);
			*******************************/

			//OPCIONAL ARRAY COLLECTION //Si existe <Traslados>    MIN 1 MAX ILIMITADO
			//cfd.Impuestos.Traslados			
			// TIPO DE IMPUESTO ES POR PRODCUTO.. EL PROD PODRIA TENER MAS DE UN TIPO DE IMPUESTO.
						
						
			//TRASLADOS DE IVA
			switch(cxc.Documento){
				case 5:
				case 17:
					//nota cargo o nota credito
					//Es nota de credito o nota de cargo
					
					cfd.Impuestos.totalImpuestosTrasladados=roundValue(cfd.total-cfd.subTotal); //O
					
					traslado = null;
					traslado = eBasic.eCreateObject("geCFD.cTraslado");
					if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
					traslado.impuesto = "IVA";//R // IVA o IEPS
					traslado.tasa = roundValue(cxc.porImpuestoCap);//R
					traslado.importe = roundValue(cfd.total-cfd.subTotal);//R
					cfd.Impuestos.Traslados.Add(traslado);
					traslado = null;
					break;
				case 18:
				case 19:
					//Es pagaré por parcialidad	o es recibo por anticipo
					var totalIT,total1,traslado_intfin,traslado_intmor,ti;
					totalIT=0;
					total1=0;
					
					//una factura sólo se puede enviar a parcialidades cuando únicamente tienen productos con IVA (impuesto1)
					ti=uiCFD.PorcentajeIVATrasladadoEnVentaFinanciada(iventa.Sys_PK);
					if(ti<0){
						Log("Error al consultar impuestos de venta financiada. "+uiCFD.LastErrorDescript);
						return null;
					}
					
					if(!uiCFD.EstablecerPorcentajeIVAVenta_enDCXC(cxc.Sys_PK,parseFloat(ti)))
					{
						Log("Error al guardar porcentaje de IVA correspondiente a Venta. "+uiCFD.LastErrorDescript);
						return null;
					}
					
					traslado = null;
					traslado = eBasic.eCreateObject("geCFD.cTraslado");
					if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
					traslado.impuesto = "IVA";//R // IVA o IEPS
					traslado.tasa = ti;//R
									
					total1=imp_origen;
					totalIT=imp_origen;
									
						
							if(imp_intfin>0){						
								imp_intfin=parseFloat(roundValue(imp_intfin));
															
								totalIT=parseFloat(totalIT)+parseFloat(imp_intfin);							
								if(cxc.porImpuestoFin==traslado.tasa){
									total1=parseFloat(total1)+parseFloat(imp_intfin);
								}else{
									traslado_intfin = null;
									traslado_intfin = eBasic.eCreateObject("geCFD.cTraslado");
									if(esInvalido(traslado_intfin,"Error al crear objeto geCFD.cTraslado")) return null;
									traslado_intfin.impuesto = "IVA";//R // IVA o IEPS
									traslado_intfin.tasa = cxc.porImpuestoFin;//R
									traslado_intfin.importe = imp_intfin;//R
									cfd.Impuestos.Traslados.Add(traslado_intfin);
								}
							}
							
							if(imp_intmor>0){							
								imp_intmor=parseFloat(roundValue(imp_intmor));
															
								totalIT=parseFloat(totalIT)+parseFloat(imp_intmor);
								if(cxc.porImpuestoMor==traslado.tasa){
									total1=parseFloat(total1)+parseFloat(imp_intmor);
								}else{
									if(cxc.porImpuestoMor==cxc.porImpuestoFin && traslado_intfin!=null){
										traslado_intfin.importe=roundValue(parseFloat(traslado_intfin.importe)+parseFloat(imp_intmor));
									}else{						
										traslado_intmor = null;
										traslado_intmor = eBasic.eCreateObject("geCFD.cTraslado");
										if(esInvalido(traslado_intmor,"Error al crear objeto geCFD.cTraslado")) return null;
										traslado_intmor.impuesto = "IVA";//R // IVA o IEPS
										traslado_intmor.tasa = cxc.porImpuestoMor;//R
										traslado_intmor.importe = imp_intmor;//R
										cfd.Impuestos.Traslados.Add(traslado_intmor);
									}
								}
							}
					
					traslado.importe=roundValue(total1); //R
					if(traslado.importe>0) cfd.Impuestos.Traslados.Add(traslado);
					traslado = null;
					traslado_intfin=null;
					traslado_intmor=null;
					
					cfd.Impuestos.totalImpuestosTrasladados=roundValue(totalIT); //O
					break;
				
			}//fin switch
			
							
			
			
		//ELEMENTO COMPLEMENTO
		//cfd.Complemento; //O     SI EXISTE: MIN 1   MAX 1				
		boComplemento=incluirComplemento();
		if(boComplemento==null) return null;
		
		if(boComplemento){
			complemento_js=eBasic.AddSlashPath(GetRepository())+ubicacionComplemento;
			if(!eBasic.FileExists(complemento_js)){
				Log("No se encontró el archivo para integrar Complemento: "+complemento_js);
				Log("Error imposible continuar.");
				return null;
			}
			complemento_contenido=eBasic.LoadFileToStr(complemento_js);
			if(esInvalido(complemento_contenido,"El archivo "+complemento_js+" se encuentra vacío.",false,true)) return null;
				
			resultado_complemento=eval(complemento_contenido);			
			if(!resultado_complemento){
				Log("Error al integrar Complemento");
				return null;
			}
		}
		
		//ELEMENTO ADDENDA
		//cfd.Addenda;    //O		SI EXISTE: MIN 1   MAX 1		
		boAddenda=incluirAddenda(cxc.ICliente.Sys_PK);
		if(boAddenda==null) return null;
		
		if(boAddenda){
			addenda_js=eBasic.AddSlashPath(GetRepository())+ubicacionAddenda+cxc.ICliente.Codigo+".js";
			if(!eBasic.FileExists(addenda_js)){
				Log("No se encontró el archivo para integrar Addenda: "+addenda_js + ". Cliente: "+cxc.ICliente.Nombre);
				Log("Error imposible continuar.");
				return null;
			}
			addenda_contenido=eBasic.LoadFileToStr(addenda_js);
			if(esInvalido(addenda_contenido,"El archivo "+addenda_js+" se encuentra vacío. Cliente "+cxc.ICliente.Nombre,false,true)) return null;
				
			resultado_addenda=eval(addenda_contenido);			
			if(!resultado_addenda){
				Log("Error al integrar Addenda");
				return null;
			}
		}			
		
		return cfd;
	}catch(e){
		Log("Error al generar factura electrónica.");
		throw(e);
		return null;
	}	
	

}




function cxcFechaHora(cxc){	
	return uiCFD.ObtenerFechaHora(cxc.Fecha,cxc.Sys_DTCreated);
}

function crearCFDCXC(A){
	/*
	//FUNCION PUBLICA
	var pkcxc;
	pkcxc=A.Context.ActiveWindow.PrimaryKeyValue;		
	if(pkcxc==null) pkcxc=0;
	if(pkcxc<1){
		Log("Seleccione un elemento de la lista.");
		return 0;
	}
	return crearCFDCXC2(pkcxc);
	*/
	
	try
	{
		//R5
		if(A==undefined || A==null) return;
		if(A.Context.ActiveWindow.PrimaryKeyValue==undefined || A.Context.ActiveWindow.PrimaryKeyValue==null || A.Context.ActiveWindow.PrimaryKeyValue<=0) return;

		var PkVta=cfdi33.ExistMovApply(A.Context.ActiveWindow.PrimaryKeyValue);
		if(PkVta<=0) throw new Error("No existen movimientos aplicados para el documento seleccionado ó no corresponde a una factura.");
		cfdi33.TimbrarPagoCfdi33(PkVta);
	}
	catch(e)
	{
		Log(e.message);
	}
}

function crearCFDCXC2(pkcxc){
//FUNCION PUBLICA	
var pkcfd;
var tc=0;

	if(!inicializarObjetos()) return 0;
	
	tc=uiCFD.TipoComprobanteAGenerarInt;
	if(tc==1) //cfd
	{		
		//crear cfd
		pkcfd=obtenerFacturaElectronica_CXC(pkcxc); //la validacion del tipo de documento se hace posteriormente
	}else{		
		if(tc==4){ //cfdi/cbb
			tc=uiCFD.BlockCXC_CFDI_CBB(pkcxc);//buscar tipo					
		}								
		switch(tc){
			case 2: //cfdi
				cfdi.crearCFDCXC2(pkcxc);
				break;
			case 3: //cbb
				var sArchivo="";
				generarCBB_CXC(pkcxc);
				
				break;
			case 0:
			default:
				eBasic.eMsgbox("Se intentó crear el comprobante CFDI o CBB, pero el block asignado no está configurado para ninguno de estos tipos",6);
				return 0;
		}			
					
	}		
	return;
}

//FIN CAMBIOS PARA CFD CXC
//================================================================================
//================================================================================
//================================================================================




//FUNCION TEMPORAL PARA CANCELACION DE CFDI
//LA CANCELACION DE CFD SE HACE EN LA BITACORA PARA REPORTE
//EL CFDI SE DEBE CANCELAR DIRECTAMENTE CON EL SAT. PARA MAXICOMERCIO SE HARA USANDO FUNCION DEL PAC
function cancelarCFDI_deVenta(pkventa, venta){
	/*
	try{		
		return cfdi.cancelarVentaCFDI(pkventa);
		//VALIDACIONE QUE HACE LA FUNCION
		//COMPROBAR QUE ES UN CFDI		
		//ENVIAR A CANCELAR	
	}catch(e){
		Log("Error al intentar cancelar cfd-i")
		throw(e);
		return 0;
	}
	*/
	try
	{//R5
		if(pkventa==undefined || pkventa==null || pkventa=="" || pkventa<=0) throw new Error("Se esperaba el identificador correspondiente al documento timbrado.");
		return cfdi33.CancelarVta(pkventa, venta);
	}
	catch(ex)
	{
		Log(ex.message);
		return false;
	}
}


function ModuleLoaded(OName)
{
var col;

col=Application.MainForm.Engine.Modules;

for (var i=1; i<=col.Count;i++)
{
	if (col.Item(i).Name=="mdl"+OName) return true;
}

return false;
}


function loadScript(sName,Err)
{

	try
	{
		if (!ModuleLoaded(sName))
		{
			if (!Application.LoadScript(sName+".js"))
			{
				eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
				return false;
			}
		}
	}catch(e)
	{
		eBasic.eMsgbox("Error al intentar Cargar script: " + sName + ".js " + Err);
		return false;
	}	
	return true;
}


function asignarDivisa(pk,TIPO){
//asignar divisa al control de impresion pdf antes de procesar plantilla
	try{
		dsgnTemplate2.Divisa="PESOS";
		dsgnTemplate2.LetrasAdicInfo="M.N.";
		
		switch(TIPO)
		{
			case 1:
				//si tipo es 1 entonces es venta
				var r;
				r=Application.ADOCnn.Execute("SELECT Divisa.Codigo,Divisa.Descripcion FROM Divisa INNER JOIN Venta ON Divisa.Sys_PK=Venta.IDivisa WHERE Venta.Sys_PK="+pk);
				if(r==null) return 0;
				if(r.BOF && r.EOF) return 0;
				var desdivisa=r("Descripcion").Value;
				var coddivisa=r("Codigo").Value;
				var adic="";
				desdivisa=desdivisa.toUpperCase();
				coddivisa=coddivisa.toUpperCase();
				if(coddivisa=="PMX" || coddivisa=="MXN"){ 
					adic="M.N.";
				}
				dsgnTemplate2.Divisa=desdivisa+"";
				dsgnTemplate2.LetrasAdicInfo=adic+"";
				r=null;
			break;
			case 2: //Nota de crédito - Se obtiene la divisa configurada del cliente.
				var r;
				r=Application.ADOCnn.Execute("select Divisa.Codigo,Divisa.Descripcion from (cliente inner join dcxc on Cliente.Sys_PK = dcxc.ICliente) Inner join Divisa on Cliente.IDivisa = Divisa.Sys_PK where dcxc.Sys_PK ="+pk);
				if(r==null) return 0;
				if(r.BOF && r.EOF) return 0;
				var desdivisa=r("Descripcion").Value;
				var coddivisa=r("Codigo").Value;
				var adic="";
				desdivisa=desdivisa.toUpperCase();
				coddivisa=coddivisa.toUpperCase();
				if(coddivisa=="PMX" || coddivisa=="MXN"){ 
					adic="M.N.";
				}
				dsgnTemplate2.Divisa=desdivisa+"";
				dsgnTemplate2.LetrasAdicInfo=adic+"";
				r=null;
			break;
		}
	}catch(e){}
}

function asignarSerieLoteEnParteConcepto(concepto,dv){
	try{
		//concepto=geCFD.cConcepto
		//dv=EDOFx.DVenta
		
		var sql="SELECT Serie.Numero AS Serie,Lote.Numero AS Lote,DCardex.Salidas,Lote.Sys_PK AS PKLote FROM (DCardex LEFT JOIN Serie ON DCardex.ISerie=Serie.Sys_PK) LEFT JOIN Lote ON DCardex.ILote=Lote.Sys_PK WHERE (DCardex.ISerie>0 OR DCardex.ILote>0) AND DCardex.RVenta="+dv.Sys_PK;
		var r=openRecordset(sql,false);
		if(esInvalido(r,"No se pudo obtener información de series o lotes.")){
			return 0;
		}
		
		if(r.EOF && r.BOF){ //no existe cardex o no tiene series o lotes
			r=null;
			return 1;
		}
		
		var id,serie,lote,cantidad=0,precio=0,importe=0;
		var parte;
		var loteSys_PK=0;
		
		while(!r.EOF){
			serie=r("Serie").Value;
			if(serie==null) serie="";
			lote=r("Lote").Value;
			if(lote==null) lote="";
						
			loteSys_PK=r("PKLote").Value;
			if(loteSys_PK==null) loteSys_PK=0;
			
			id="";
			if(serie!=""){
				id=serie;	
				cantidad=1;	
				precio=concepto.valorUnitario;//roundValue(dv.Precio);			
				importe=concepto.valorUnitario//roundValue(dv.Precio);
			}else{
				//se agregará lote solo si no existe serie
				if(lote!=""){
					id=lote;
					cantidad=roundValueVol(r("Salidas").Value);					
					precio=concepto.valorUnitario;//roundValue(dv.Precio);	
					importe=roundValue(concepto.valorUnitario*r("Salidas").Value);//roundValue(dv.Precio*r("Salidas").Value);
				}
			}
			
			if(id!=""){
				// OPCIONAL: ARRAYLIST concepto.Parte     //O    MIN 0 MAX ILIMITADO
				//*****************************
				parte = null;
				parte = eBasic.eCreateObject("geCFD.cParte");
				if(esInvalido(parte,"No se pudo crear el objeto geCFD.cParte")){
					return 0;
				}
				parte.cantidad = cantidad;//R
				parte.unidad = dv.Unidad+"";//O
				parte.noIdentificacion = id+"";//O
				parte.descripcion = dv.IProducto.Descripcion+"";//R
				parte.valorUnitario = precio;//O
				parte.importe =importe;//O
				   // OPCIONAL: ARRAYLIST parte.InformacionAduanera     //O  MIN 0 MAX ILIMITADO
				   /*****************************
				   geCFD.ct_InformacionAduanera info = new geCFD.ct_InformacionAduanera();
				   info.numero = ""; //R
				   info.fecha = DateTime.Today;//R
				   info.aduana = "";//R
				   parte.InformacionAduanera.Add(info);
				   *****************************/
				   if(loteSys_PK>0){
					   if(!agregarInformacionAduanera(parte.InformacionAduanera,loteSys_PK)){
							Log("No se pudo incluir la información aduanera en Concepto.Parte");
							return 0;
					   }
				   }
				concepto.Parte.Add(parte);
				//****************************/
			}
			r.MoveNext();
		}
		r.Close();
		r=null;
		return 1;		
	}catch(e){
		Log("Ocurrió un error al asignar serie o lote en el nodo parte del concepto");
		throw(e);
		return 0;
	}
}

function agregarInformacionAduanera(Arr_InformacionAduanera,pkLote){
	try{
		var rA,infoA;		
		rA=openRecordset("SELECT DISTINCT Compra.uf_NumDocAduanero, Compra.uf_FechaDocAduanero, ut_Aduana.uf_Nombre FROM ((Compra INNER JOIN (Cardex INNER JOIN DCardex ON Cardex.Sys_PK=DCardex.FK_Cardex_Movimientos) ON Compra.Sys_PK=Cardex.DocCompra) INNER JOIN ut_Aduana ON Compra.uf_IAduana=ut_Aduana.Sys_PK) WHERE DCardex.ILote="+pkLote);
		if(esInvalido(rA,"Error al acceder a información aduanera (lotes).")) return false;
		if(!(rA.BOF && rA.EOF)){
			//cargar información aduanera									
			infoA=eBasic.eCreateObject("geCFD.ct_InformacionAduanera");
			if(esInvalido(infoA,"Error al crear objeto geCFD.ct_InformacionAduanera")) return false;
			infoA.numero = stringValue(rA,"uf_NumDocAduanero");//R
			infoA.fecha = rA("uf_FechaDocAduanero").Value;//R
			infoA.aduana = stringValue(rA,"uf_Nombre");//R
			Arr_InformacionAduanera.Add(infoA);
			infoA=null;
		}
		rA=null;
		return true;
	}catch(e){
		Log("Error al consultar información aduanera.");		
		return false;
	}
}



function EliminarCFDLista(){
	var cfdmng;
	
	if(!uiCFD.PermitirAcceso("FXCA325x",Application.UIUsers.CurrentUser)) return 0;
	
	cfdmng=eBasic.eCreateObject("CFDmng.cMain");
	if(cfdmng==null){
		eBasic.eMsgbox("Error al crear objeto",6);
		return 0;
	}
	cfdmng.setObjects(Application.ADOCnn,1);
	cfdmng.showCFDList();
}

function RegenerarRepresentacionCFD(){
	var f;
	
	if(!uiCFD.PermitirAcceso("FXCA326xa",Application.UIUsers.CurrentUser)) return 0;
	
	f=Application.ActiveWindow();
	if(f==null){
		eBasic.eMsgbox("El formulario de facturación electrónica debe estar seleccionado",6);
		return 0;
	}
	
	if(f.MyName!="qCFD"){
		eBasic.eMsgbox("El formulario de facturación electrónica debe estar seleccionado",6);
		return 0;
	}
	
	var pkcfd=null,pkdoc,tipodoc;	
	var r;
	pkcfd=f.PrimaryKeyValue;	
	if(pkcfd==null) pkcfd=0;
	if(pkcfd<1){
		eBasic.eMsgbox("Seleccione un comprobante de la lista.",6);
		return 0;
	}
	r=Application.Database.OpenRecordset("Select uf_IVenta, uf_IDCXC, uf_Tipo FROM ut_CFD WHERE Sys_PK="+pkcfd,Application.ADOCnn);
	if(r==null){
		eBasic.eMsgbox("Error al consultar base de datos.",6);
		return 0;
	}
	if(r.EOF && r.BOF){
		eBasic.eMsgbox("No se econtro el registro con clave "+pkcfd,6);
		r=null;
		return 0;
	}
	if(r.Fields("uf_IVenta").Value!=null){
		//venta
		pkdoc=r.Fields("uf_IVenta").Value;
		tipodoc=1;
	}else{
		//dcxc
		pkdoc=r.Fields("uf_IDCXC").Value;
		tipodoc=2;
	}
	if(pkdoc==null) pkdoc=0;
	if(pkdoc<1){
		eBasic.eMsgbox("No se econtró la clave del documento",6);
		return 0;
	}
	guardarPresentacion(pkdoc,pkcfd,tipodoc);	
}


function textTipoComprobanteConfigurado(){
	var v="CFD";
	try{		
		switch(getUICFD().TipoComprobanteAGenerarInt)
		{
			case 1:
				v="CFD";break;
			case 2:
				v="CFDI";break;
			case 3:
				v="CBB";break;
			case 4:
				v="CFDI/CBB";break;
			case 5:
				v="PREIMPRESO";break;
		}
	}catch(e){}
	return v;
}


function cancelarMovCXC(A){
/*
var pkcfd;
var pkcxc;
var tc=0;

	if(!inicializarObjetos()) return 0;
	
	try{
		pkcxc=A.Context.ActiveWindow.PrimaryKeyValue;		
		if(pkcxc==null) pkcxc=0;
		if(pkcxc<1){
			Log("Seleccione un elemento de la lista.");
			return 0;
		}
		
		if (eBasic.eMsgbox("¿Está seguro que desea cancelar el documento actualmente seleccionado? Se creará un movimiento de compensación sin folio fiscal.", 4)==7)
			return 0;
		
		var r=openRecordset("SELECT ut_CFD.Sys_PK,ut_CFD.uf_Tipo FROM ut_CFD INNER JOIN DCXC ON ut_CFD.uf_IDCXC=DCXC.Sys_PK WHERE DCXC.Sys_PK="+pkcxc);
		if(esInvalido(r,"Error al acceder a información de documento.")) return false;
		if(r.BOF && r.EOF){
			Log("Error al consultar. No se encontró el comprobante fiscal digital relacionado.");
			return 0;
		}
		
		pkcfd=r.Fields("Sys_PK").Value;
		if(pkcfd==null) pkcfd=0;
		if(pkcfd<1){//el documento no es cfd/cfdi
			Log("No se encontró el comprobante fiscal digital relacionado.");
			return 1;
		}
		tc=r.Fields("uf_Tipo").Value;
		if(tc==null) tc=0;		
		
		if(tc==2){//se puede cancelar cfd//verfica si esta en el informe mensual
			if(!uiCFD.PosibleCancelar(pkcfd)){
				Log(uiCFD.LastErrorDescript);
				return 0;
			}
		}
		
		var EDO=Application.InternalObject("DataAccess");
		
			
		//crear movimiento de compensación.
		
		var CXC=eBasic.eCreateObject("EDOFX.DCXC");
		if(!CXC.LoadFromADOConnection(pkcxc,"",EDO.ADOCnn,1)){
			Log("Error al cargar documento CXC");
			return 0;
		}
		
		var nref=CXC.Referencia+"_XCFD";
		if(uiCFD.ValorCampo("SELECT Count(Sys_PK) AS numero FROM DCXC WHERE Referencia='"+nref+"'","numero")>0) {
			if (eBasic.eMsgbox("Ya existe un documento con la referencia de cancancelación ("+nref+") de éste documento ¿Está seguro que desea continuar y generar un nuevo movimiento de compensación?", 4)==7)
			return 0;
		}
		
		EDO.BeginTrans();	
		
		switch(CXC.Documento){
			case 5: //nota de crèdito
				//crear nota de cargo
				var nc=LBCXC.NotaCargo(CXC.ICliente.Sys_PK, Application.CurrentDate(), Application.CurrentDate(), "Cancelación de documento con referencia "+CXC.Referencia, CXC.Haber, CXC.TipoCambio, 17, false, nref, "", 0, CXC.porImpuestoCap, uiCFD.CrearObjetoNothing(), false, true);
				if(nc==null){					
					EDO.RollbackTrans(false);
					Log("Error al crear nota de cargo.");
					return 0;
				}
				break;
			case 17: //nota de cargo
				//crear nota de crèdito
				var ncre=LBCXC.NotaCredito(CXC.ICliente.Sys_PK,  Application.CurrentDate(),  Application.CurrentDate(), "Cancelación de documento con referencia "+CXC.Referencia, CXC.Debe, CXC.TipoCambio, 5, false, nref, "", 0, CXC.porImpuestoCap, uiCFD.CrearObjetoNothing(), false);
				
				if(ncre==null){
					EDO.RollbackTrans(false);
					Log("Error al crear nota de crédito.");
					return 0;
				}
				break;
		}
		
		//marcar como cancelado cfd/ cancelar cfdi
		switch(tc){
			case 2:
				//cancelar cfd
				if(!uiCFD.CambiarEstadoEnBitacoraCXC(pkcxc,99)){
					EDO.RollbackTrans(false);
					Log("Error al cambiar estado del registro para informe mensual.");
					return 0;
				}
				break;
			case 3:
				//cancelar cfdi
				if(!cfdi.cancelarCFDI(pkcfd)){
					EDO.RollbackTrans(false);
					return 0;
				}
				break;
				
			default:
			EDO.RollbackTrans(false);
			Log("Tipo de comprobante incorrecto.");
			return 0;
		}
		
		EDO.CommitTrans(false);
		eBasic.eMsgbox("Documento cancelado correctamente.",6);
		A.Context.ActiveWindow.RefreshRst();
		
		return 0;	
	}catch(e){
		EDO.RollbackTrans(false);
		throw(e);
		return 0;
	}	
	*/
	
	if(A==undefined || A==null) return 0;
	if(A.Context.ActiveWindow.PrimaryKeyValue==undefined || A.Context.ActiveWindow.PrimaryKeyValue==null || A.Context.ActiveWindow.PrimaryKeyValue<=0) return 0;
	if(cfdi33.CancelarPago(A.Context.ActiveWindow.PrimaryKeyValue))
	{
		A.Context.ActiveWindow.RefreshRst();
	}
}


function valorEnObjetoFX(objFX,nombre)
{//gb31012012
	try{
		if(objFX.FieldByName(nombre)!=null)
		{
			return objFX.FieldByName(nombre)+"";
		}else{
			return "";
		}
	}catch(e){
		return "";
	}
}

function asignarAtributosAdicionalesCXC(cxc)
{
	try{
		
		var at=eBasic.eCreateObject("lbnEfectivo.cAtributosAdicionales");
		if(at==null){
			Log("Error al crear objeto lbnEfectivo.cAtributosAdicionales.");
			return 0;
		}
		at.SetObjects(Application.ADOCnn);
				
		at.CargarInfoCxC(cxc.Sys_PK);
		
		if(at.FormaPago=="" || at.MetodoPago=="")
		{
		
			switch(cxc.Documento)
			{				
				case 5://nota crédito
					at.EstablecerPredeterminadoNotaCredito();					
					break;
				case 17://nota cargo
					at.EstablecerPredeterminadoContado();
					at.EstablecerMetodoPagoDesdeDocCXC(cxc.Sys_PK);
					break;
				case 18://pagare				
					at.EstablecerMetodoPagoDesdeDocCXC(cxc.Sys_PK);
					break;
				case 19://recibo
					at.EstablecerPredeterminadoContado();
					at.EstablecerMetodoPagoDesdeDocCXC_Recibo(cxc.Sys_PK);
					break;
			}
		
			
		
			at.Sys_PK_Documento = cxc.Sys_PK
			at.Tipo_Documento = 2;//cxc
			Application.MouseDefault();
			if(at.FormaPago=="") at.FormaPago="PAGO EN UNA SOLA EXHIBICIÓN";
			
			if(LBEfectivo.AtributosAdicionalesCFD(at, true, true)){
				Application.MouseHourglass();
				//cambio en la base de datos
				if(!cxc.LoadFromADOConnection(cxc.Sys_PK,"",Application.ADOCnn,3)){
					Log("Error al cargar documento al refrescar atributos adicionales del comprobante.");
					return 0;
				}
			}else{
				Application.MouseHourglass();
				Log("Error al establecer información de atributos adicionales del comprobante. " + at.lastError);
				return 0;
			}
		}
		return 1;
		
	}catch(e){
		Log("Error al asignar atributos adicionales del comprobante fiscal.");
		return 0;
	}
}

function tryGenerarComprobantePorAnticipo(pkventa)
{	//gb 14022012
	var pkRecibo=LBCXC.obtenerReciboPorAnticipo_ventafinanciada(pkventa);
	if(pkRecibo>0){
		eBasic.eMsgbox("Se creará el comprobante fiscal por el recibo de enganche. Presione Aceptar para continuar.",6);
		crearCFDCXC2(pkRecibo);
	}
}

function tipoAplicacion()
{
	if(ApplicationName.toLowerCase()=="maxicomercio")
		return 1;
	else
		return 2;
}