/********************************
GENERACIÓN DE FACTURA ELECTRÓNICA
Grupo Execom
v=1.4
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


var pkCertificadoUsado=0; //Sys_PK de ut_CFDfolio
var Utilizarfrontera;
var ubicacionAddenda="CFDI\\Cliente\\addenda_"; //Más código de cliente 
var ubicacionCConcepto="CFDI\\Producto\\cconcepto_"; //Más código de producto //ubicacion complemento concepto
var ubicacionComplemento="CFDI\\Complemento\\complemento.js";
var proccess; //geCFD.cProccess  Encryptacion y procesos para sello digital
var uiCFD; //geUICFD.cAcction configuracion de cfds
var dsgnTemplate2; //dsgnTemplateTXTC2.cMain //GUARDAR PDF, DOC
var PAC=null;
var ClassID_PAC="";
var uiCBB=null;

var OnBackOffice=true; //indica si el script esta siendo ejecutados desde el backoffice; false=POS
var ApplicationName="Maxicomercio"; //Nombre de la aplicación - Maxicomercio o Deminus

var cfg_usarRetencionImpuesto2=true;//activa la integracion de retenciones si el impuesto 2 es negativo

/****************************************
ADDENDA, COMPLEMENTO, COMPLEMENTOCONCEPTO
CARPETA EN REPOSITORIO: 
	CFDI\Cliente\Addenda_CodigoCliente.js
	CFDI\Complemento\complemento.js
	CFDI\Producto\CConcepto_CodigoProducto.js
	CFDI\messageinfo.dat [información en cuerpo del mensaje de correo]
****************************************/

//NOTA: Asegurar una cadena cuando el atributo es tipo string. Si el valor asignado es vacio desde un propiedad de un objeto se producirá un error.
//Si Objeto.propiedadString="";
	//cfd.atributoString=Objeto.propiedadString; 	//ERROR
	//cfd.atributoString=Objeto.propiedadString+""; //CORRECTO


//Para registrar
//C:\WINDOWS\Microsoft.NET\Framework\v2.0.50727>regasm C:\geCFD.dll /tlb:geCFD.tlb /codebase


/******************************************
			CARGAR ACCCIONES
******************************************/
//function getUICFD()
//function CrearPanel()
//function IniciarScript()

/******************************************
			FUNCION PUBLICA
		LLAMAR PARA GENERAR CFDI
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
	archivo_xlst=eBasic.AddSlashPath(GetRepository())+"CFDI\\xslt\\cadenaoriginal_3_2.xslt";
	
		
	switch(TIPO){
		case 1: 
			sql="SELECT ut_CFDInfo.uf_LLavePrivada,ut_CFDInfo.uf_Clave FROM (Venta INNER JOIN (FoliosDocumentos INNER JOIN (BlockDocumentos INNER JOIN ut_CFDInfo ON BlockDocumentos.uf_CFDI_Info=ut_CFDInfo.Sys_PK) ON FoliosDocumentos.Block=BlockDocumentos.Sys_PK) ON Venta.IFolio=FoliosDocumentos.Sys_PK) WHERE Venta.Sys_PK="+pk;break;
		case 2: 
			sql="SELECT ut_CFDInfo.uf_LLavePrivada,ut_CFDInfo.uf_Clave FROM (DCXC INNER JOIN (FoliosDocumentos INNER JOIN (BlockDocumentos INNER JOIN ut_CFDInfo ON BlockDocumentos.uf_CFDI_Info=ut_CFDInfo.Sys_PK) ON FoliosDocumentos.Block=BlockDocumentos.Sys_PK) ON DCXC.IFolio=FoliosDocumentos.Sys_PK) WHERE DCXC.Sys_PK="+pk;break;
		default:
			eBasic.eMsgbox("Error. Tipo de documento incorrecto.",6);
			return 0;
	}
	
	r=openRecordset(sql,true);
	if(esInvalido(r,"Error al acceder a información de certificado de sello digital. Es posible que el folio utilizado no sea un folio fiscal para CFDI.")){
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
	var xslt_TFD;
	var ocfd;
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
		
		Utilizarfrontera=UtilizarImpuestoFrontera();
		
		//tempFolder=eBasic.AddSlashPath(eBasic.GetTempDir());//+"cfd_temp";
		//eBasic.MakePath(tempFolder);
		
		tmpf=proccess.getTempFileName();
		filename=tmpf+".xml";//eBasic.AddSlashPath(tempFolder)+"comprobante_cfdi.xml";
				
		
		xslt_TFD=rutaXSLT_TDF();
	
		
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
		//Cargar objeto venta	
		if(!documento_obj.LoadFromADOConnection(documento_SysPK,"",Application.ADOCnn,3)){
			Log("Error al cargar documento. "+documento_obj.lastErrDescrip);
			return 0;
		}
		
		EDOfx=eBasic.eCreateObject("EDOFx.EDO_Fx");
		if(esInvalido(EDOfx,"Error al crear objeto EDOFx.EDO_Fx")) return 0;			
		emptyCnn=eBasic.eCreateObject("ADODB.Connection");
		
		Log("============================================");
		Log("Creando Comprobante Fiscal Digital (CFDI)...");
		Application.eDoevents();		
		
		switch(TIPO){
			case 1: //venta
				StatusAdministrativo=documento_obj.StatusAdministrativo;
				ocfd=generarCFD(documento_obj);break;				
			case 2: //cxc
				StatusAdministrativo=3;//siempre 3 para cxc ya que el documento siempre sera procesado(para cfd vigente [1])
				ocfd=generarCFD_CXC(documento_obj);	break;
			default:
				Log("Documento incorrecto");
				return 0;
		}
		
		
		
		if(ocfd!=null){
			xml = ocfd.getXML(filename,true); //[guardar_en_archivo],[omitirValidarSello]
			if(esInvalido(xml,"Error al generar xml. "+ocfd.lastError,false,true)) return 0;
						
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
			ocfd.sello = dSeal; //R		
			xml = ocfd.getXML(filename,false);
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
				
				pkCFD=guardarCFD(xml_claro,oString,dSeal,documento_obj,pkCertificadoUsado,ocfd.fecha);
				if(esInvalido(pkCFD,"Error al guardar registro.",true)){
					EDOfx.RollbackTrans();							
					EDOfx.SetConnection(emptyCnn);
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
			var resultado=0;
			if(parseInt(uiCFD.StrConfiguracionLocal("FE_Timbrar","1"))==1){				
				resultado=timbrar(pkCFD,ocfd.Emisor.rfc,ocfd.Receptor.rfc,ocfd.total,filename,xslt_TFD,documento_obj.Referencia,TIPO);
			}			
			if(resultado==1){
				if(!guardarPresentacion(documento_SysPK,pkCFD,TIPO)){
					Log("No se pudo guardar la versión de impresión del documento generado.");			
					//DeleteFile(filename); //borrar archivo xml
					//return 0;
				}else{
					//Log("*******************************************");
					Log("========== Comprobante Fiscal Digital generado correctamente ==========");		
					//Log("*******************************************");
				}		
			}else{
				Log("Comprobante sellado por el emisor");		
				Log("***** PENDIENTE TIMBRE FISCAL DIGITAL*****");		
			}
			
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
		Application.MouseDefault();
		throw(e);
		return 0;
	}
}

function rutaXSLT_TDF(){
	return eBasic.AddSlashPath(GetRepository())+"CFDI\\xslt\\cadenaoriginal_TFD_1_0.xslt";
}

/***************************************
	TIMBRAR
****************************************/
function timbrarSeleccionado(A){
	try{
		var o,r,x,archivo,atmp,resultado,pk,documentopk,TIPO;
		o=eBasic.eCreateObject("geCFD.cCFDI");
		if(o==null){
			Log("Error al crear objeto geCFD.cCFDI");
			return 0;
		}		
		//BUSCAR REGISTRO DE CFDI
		
		pk=A.Context.ActiveWindow.PrimaryKeyValue;
		if(pk==null) pk=0;
		if(pk<1){
			Log("Seleccione un elemento de la lista.");
			return 0;
		}
		
		
		r=openRecordset("Select Sys_PK,uf_XML,uf_Tipo,uf_XMLCFDI FROM ut_CFD WHERE Sys_PK="+pk);
		if(esInvalido(r,"Error al leer registro de cfd")){
			o=null;			
			return 0;
		}
		//regresar
		if(stringValue(r,"uf_XMLCFDI")!=""){
			eBasic.eMsgbox("Imposible continuar. El comprobante seleccionado ya contiene el Timbre Fiscal Digital",6);
			return 0;
		}
		
		if(r("uf_Tipo").Value!=3){
			eBasic.eMsgbox("Imposible crear TFD el registro seleccionado no tiene el formato CFDI",6);
			return 0;
		}
		atmp=proccess.getTempFileName();		
		archivo=atmp+".xml";		
		eBasic.SaveStrToFile(archivo,r("uf_XML").Value);		
		if(!o.loadByXMLFile(archivo)){			
			Log("Error al cargar objeto CFDI"+o.lastError);
			o=null;			
			r=null;
			return 0;
		}
		TIPO=A.Context.ActiveWindow.Parameter("TIPO").Value;		
		if(TIPO==1)//venta
		{
			documentopk=A.Context.ActiveWindow.GetFieldValue("IVenta");			
		}else{
			documentopk=A.Context.ActiveWindow.GetFieldValue("IDCXC");
		}
		if(documentopk==null) documentopk=0;
		if(documentopk<1){
			Log("No fue posible obtener la clave del documento.");
			return 0;
		}
		
		resultado=timbrar(r("Sys_PK").Value,o.Emisor.rfc,o.Receptor.rfc,o.total,archivo,rutaXSLT_TDF(),A.Context.ActiveWindow.GetFieldValue("Referencia"),TIPO);
		if(resultado==1){
			if(!guardarPresentacion(documentopk,pk,TIPO)){
				Log("No se pudo guardar la versión de impresión del documento generado.");			
				//DeleteFile(filename); //borrar archivo xml
				//return 0;
			}
		}
		
		DeleteFile(archivo); //borrar archivo xml
		DeleteFile(atmp);
		A.Context.ActiveWindow.RefreshRst();
		return resultado;
	}catch(e){	
		eBasic.eMsgbox("Error al intentar crear timbre",6);		
		throw(e);
		return 0;
	}
}
function timbrar(pkcfd,Emisor_rfc,Receptor_rfc,total,archivoxml,xslt_TFD,Referencia,TIPO){
	//Referencia=venta.Referencia o cxc.Referencia
	//TIPO: 1=VENTA, 2=CXC
	var er1="Error al crear timbre fiscal digital. "
	var resultado=0;
	
	//resultado=0 ERROR
	//resultado=1 TODO BIEN
	//resultado=2 NO SE PUEDE OBTENER VERSION DE IMPRESION	
		
	Log("Solicitando timbre fiscal digital(TFD) por favor espere...");
	Application.eDoEvents();
	
	
	try{
		var guid;
		guid=uiCFD.ValorCampo("SELECT Sys_GUID FROM ut_CFD WHERE Sys_PK="+pkcfd,"Sys_GUID");
		if(guid==null) guid="";
		if(guid==""){
			Log(er1+"No se pudo obtener el campo Sys_GUID del comprobante",6);
			return 0;
		}
		
	
		var xmlCertificado;//ruta temporal de xml timbrado
		xmlCertificado=PAC.timbrarCFDI(archivoxml,Emisor_rfc,Receptor_rfc,guid);
						
		switch(PAC.cfdiStatus){
			case 0://0=OK Timbrado sin errores								
				break;
			case 1://1=Credenciales no asignada								
			case 2://2=imposible comprimir
				Log(er1+PAC.ErrDesc); 
				return 0;			
			case 3://3=No timbrado por PAC										
				if(PAC.ErrCode==99){ //Error devuelto por proveedor
					Log(er1+"Mesaje del proveedor del servicio: "+PAC.ErrDesc);
				}else{
					Log(er1+"Mesaje del servidor: "+PAC.ErrDesc);
				}				
				return 0;
			case 4://4=Timbrado imposible descomprimir
				Log("El comprobante fue correctamente timbrado pero no se pudo descargar. "+PAC.ErrDesc); 
				resultado=2
				return resultado;
			case 5://5=No timbrado (Otro Error)
				Log(er1+PAC.ErrDesc); 
				return 0;
		}
			
		
		//obtener informacion del cfd
		var tfd=null,sql,cbb=null,cadOriginalSAT="",r;		
		tfd=eBasic.eCreateObject("geCFD.cTimbreFDInfo");
		if(tfd==null){
			Log("Error al crear objeto geCFD.cTimbreFDInfo. El comprobante ha sido timbrado, pero no es posible crear la versión de impresión.");
			resultado=2;
		}else{
			if(!tfd.loadInfoFromFile(xmlCertificado)){
				Log("Error al cargar objeto geCFD.cTimbreFDInfo. El comprobante ha sido timbrado, pero no es posible crear la versión de impresión. " +tfd.lastError);
				resultado=2;
				tfd=null;
			}
		}
		
		Log("Creando cadena original para TFD...");
		Application.eDoEvents();
		cadOriginalSAT=proccess.createOriginalString(xmlCertificado,xslt_TFD);		
		if(esInvalido(cadOriginalSAT,"Error al generar cadena original del timbre fiscal digital. "+proccess.lastError,false,true)) cadOriginalSAT="";
		
		Log("Guardando información generada del TFD ...");
		Application.eDoEvents();
		
		r= eBasic.eCreateObject("ADODB.Recordset");
		if(esInvalido(r,"Error al crear objeto ADODB.Recordset")) return resultado;		
		
		
		agregarAddendaCFDI_timbrado(xmlCertificado,pkcfd,TIPO);		
		
		if(tfd!=null){			
			//GUARDAR INFO Y XML
			var img=proccess.getTempFileName();
			if(!uiCBB.getImgCBB(Emisor_rfc,Receptor_rfc,total,tfd.UUID,img)){
				Log("No se pudo generar código de barrras bidimiensional");
			}
						
			sql="SELECT Sys_PK,uf_XMLCFDI,uf_CadenaOriginalSAT,uf_SelloDigitalSAT,uf_FolioSAT,uf_NoCertificadoSAT,uf_FechaHoraCerSAT,uf_CBB FROM ut_CFD WHERE Sys_PK="+pkcfd;	
			
			r.CursorLocation = 3;
			r.Open(sql,Application.ADOCnn, 1, 3);
			if(r.State!=1) return resultado;
			r.Fields("uf_XMLCFDI").Value =eBasic.LoadFileToStr(xmlCertificado);	
			r.Fields("uf_CadenaOriginalSAT").Value = cadOriginalSAT;
			r.Fields("uf_SelloDigitalSAT").Value = tfd.selloSAT;
			r.Fields("uf_FolioSAT").Value = tfd.UUID;
			r.Fields("uf_NoCertificadoSAT").Value = tfd.noCertificadoSAT;
			r.Fields("uf_FechaHoraCerSAT").Value = tfd.FechaTimbrado;
				
			try{
				stream = eBasic.eCreateObject("ADODB.Stream");
				if(!esInvalido(stream,"No se pudo guardar el código de barras del comprobante. Error al crear objeto ADODB.Stream")){
					stream.Type = 1;
					stream.Open();
					if(stream.State==1){
						stream.LoadFromFile(img);
						r.Fields("uf_CBB").Value = stream.Read();
						stream.Close();
					}else{
						Log("No se pudo guardar el código de barras del comprobante");
					}
				}								
			}catch(e){
				eBasic.eMsbox(e.description);
			}
			
			r.Update();
			
			Log("Información de TFD guardada correctamente...");
			Application.eDoEvents();
			DeleteFile(img);
			r.Close;
			r=null;
			resultado=1;
			
		}else{
			//SOLO GUARDAR XML
			sql="SELECT Sys_PK,uf_XMLCFDI FROM ut_CFD WHERE Sys_PK="+pkcfd;			
			r.CursorLocation = 3;
			r.Open(sql,Application.ADOCnn, 1, 3);
			if(r.State!=1) return resultado;
			r.Fields("uf_XMLCFDI").Value =eBasic.LoadFileToStr(xmlCertificado);		
			//r.Fields("uf_CadenaOriginalSAT").Value = cadOriginalSAT;			
			r.Update();
			
			Log("Se guardó únicamente el XML timbrado...");
			Application.eDoEvents();
			
			r.Close;
			r=null;			
		}
		
		uiCFD.GuardarCopiaComprobante(xmlCertificado,Referencia+".xml");
		DeleteFile(xmlCertificado);
		return resultado;
	}catch(e){		
		Log("Error al obtener timbre fiscal digital");
		Application.MouseDefault();
		throw(e);
		return 0;
	}	
}

function cancelarVentaCFDI(pkventa){
	try{		
		var pkcfdi;
		pkcfdi=uiCFD.ValorCampo("SELECT Sys_PK FROM ut_CFD WHERE uf_Tipo=3 AND uf_IVenta="+pkventa,"Sys_PK");
		if(pkcfdi==null) pkcfdi=0;
		if(pkcfdi<1){//el documento no es cfdi
			return 1;
		}
		return cancelarCFDI(pkcfdi);	
	}catch(e){
		throw(e);
		return 0;
	}
}
function cancelarBrwCFDI(A){
	/*
	//debe ser llamada desde un botón en el browser
	try{	
		var pkcfdii;
		if(A.Context.ActiveWindow.Parameter("Version").Value!=3)//CFDI?
		{
			eBasic.eMsgbox("Seleccione los comprobantes de tipo CFDI.",6);
			return 0;
		}
		
		pkcfdi=A.Context.ActiveWindow.PrimaryKeyValue;
		if(pkcfdi==null) pkcfdi=0;
		if(pkcfdi<1){
			Log("Seleccione un elemento de la lista.");
			return 0;
		}
		
		if (eBasic.eMsgbox("¿Está seguro que desea cancelar el comprobante seleccionado?", 4)==7)
			return 0;
					
				
		return cancelarCFDI(pkcfdi);	
	}catch(e){
		throw(e);
		return 0;
	}
	*/
	
	//R5
	try
	{
		if(A==undefined || A==null) return 0;
		var FolioSAT=A.Context.ActiveWindow.GetFieldValue("FolioSAT");
		
		var qname="";
			if (Application.cAppInfo.Name=="MaxiComercio")
				qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
			else if (Application.cAppInfo.Name=="Deminus")
				qname=Application.CurrCnnInfo.Name+"@Deminus.R5";

		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return 0;
		//if (eBasic.eMsgbox("¿Está seguro que desea cancelar el comprobante seleccionado?",4)==7) return 0;
		
		var cmdData=cfdi33.ExecuteSQL("select Sys_PK, uf_IVenta from ut_cfd where uf_FolioSAT='"+FolioSAT+"'");
		if(cmdData==null || cmdData("uf_IVenta")=="") throw new Error("El documento solicitado para cancelación no existe.");
		var PkVta=cmdData("Sys_PK");
		if(cfd.cancelarCFDI_deVenta(PkVta, "")==true)
		{
			var CXC=eBasic.eCreateObject("Cancelacion_cfdi.MR5.Cancelacion");
			CXC.Main(qname,FolioSAT);
		}
	}
	catch(e)
	{
		Log(e.message);
	}
}
function cancelarCFDI(pkcfdi){
	try{		
		var r,pkv,sql,cancelado,rfcEmisor,uuid_idCFD,rutaPFX,pwd,uuidsCancelados,o,archivo;
		if(pkcfdi==null) pkcfdi=0;
		if(pkcfdi==0){
			Log("No se ha indicado la clave del comprobante");
			return 0;
		}		
		sql="SELECT ut_CFD.Sys_GUID,ut_CFD.uf_XMLCFDI, ut_CFD.uf_FolioSAT,ut_CFD.uf_CanceladoSAT,ut_CFDInfo.uf_PFX,ut_CFDInfo.uf_Clave FROM ut_CFD INNER JOIN ut_CFDInfo ON ut_CFD.uf_CFDI_Info=ut_CFDInfo.Sys_PK WHERE ut_CFD.Sys_PK="+pkcfdi;
		
		Application.MouseHourglass();	
		r=openRecordset(sql,true);		
		if(esInvalido(r)){
			Application.MouseDefault();
			eBasic.eMsgbox("Error al cancelar. No se pudo consultar la base de datos",6);
			return 0;
		}
		
		if(stringValue(r,"uf_FolioSAT")==""){
			Application.MouseDefault();
			eBasic.eMsgbox("Imposible continuar. El comprobante aún no contiene el Timbre Fiscal Digital (el comprobante no es válido)",6);
			return 0;
		}
		
		cancelado=0;
		if(r("uf_CanceladoSAT").Value!=null) 
			cancelado=r("uf_CanceladoSAT").Value;
		else
			cancelado=0;
			
		if(cancelado==1){
			Application.MouseDefault();
			eBasic.eMsgbox("Imposible continuar. El comprobante está marcado como cancelado",6);
			return 0;
		}
		
		o=eBasic.eCreateObject("geCFD.cCFDI");
		if(o==null){
			Application.MouseDefault();
			Log("Error al crear objeto geCFD.cCFDI");
			return 0;
		}			
		atmp=proccess.getTempFileName();		
		archivo=atmp+".xml";		
		eBasic.SaveStrToFile(archivo,r("uf_XMLCFDI").Value);			
		if(!o.loadByXMLFile(archivo)){			
			Log("Error al cargar objeto CFDI"+o.lastError);
			o=null;			
			r=null;
			Application.MouseDefault();
			return 0;
		}
		DeleteFile(atmp);
		DeleteFile(archivo);
		
		
		rfcEmisor=o.Emisor.rfc;
		uuid_idCFD=stringValue(r,"uf_FolioSAT")+"$"+o.Emisor.rfc+"|"+ stringValue(r,"Sys_GUID") +"|"+o.Receptor.rfc;
		rutaPFX=stringValue(r,"uf_PFX");
		pwd=stringValue(r,"uf_Clave");
		
		var	ack="";
		ack=PAC.cancelarCFDI(rfcEmisor,uuid_idCFD,rutaPFX,uiCFD.DecryptString(pwd));		
		if(ack==null) ack="";
		if(ack!=""){			
			uuidsCancelados=stringValue(r,"uf_FolioSAT");
			
			try{
				uiCFD.guardar_ack_cancelacion(ack,pkcfdi);
			}catch(eu){
			
			}
			
			if(uiCFD.MarcarCFDIsCancelado(uuidsCancelados)){				
				Application.MouseDefault();
				eBasic.eMsgbox("El comprobante se canceló correctamente.",6);
				return 1;
			}else{
				Application.MouseDefault();
				eBasic.eMsgbox("El comprobante se canceló correctamente pero no pudo marcarse como cancelado",6);
				return 1;
			}
						
			
		}else{
			Application.MouseDefault();
			eBasic.eMsgbox("Error al cancelar comprobante. "+PAC.ErrDesc,6);
			return 0;
		}		
	}catch(e){
		Application.MouseDefault();
		Log("Error en método cancelarCFDI");
		throw(e);
		return 0;
	}
}


/******************************************
	OPERACIONES ADICIONALES
******************************************/
function inicializarObjetos(){
	//R5
	try
	{//BackOffice
		ApplicationName=Application.cAppInfo.Name;
	}catch(e)
	{//Punto de Venta
		ApplicationName=Application.AppName;
	}
	
	if(uiCFD==null){
		uiCFD=cfd.getUICFD();		
	}else{		
		if(!uiCFD.isSet()){			
			uiCFD.SetDataObjects(DataAccess,Catalogos); 
			uiCFD.AppReportsPath=eBasic.AddSlashPath(GetRepository())+"Reports";		
		}		
	}
	
	if(proccess==null){
		proccess=cfd.proccess;
	}
	
	if(dsgnTemplate2==null){
		dsgnTemplate2=cfd.dsgnTemplate2;		
	}
	
	if(PAC==null){
		ClassID_PAC=uiCFD.StrConfiguracionLocal("FE_Timbre001","psecfdi.edicom.cMain");
		PAC=eBasic.eCreateObject(ClassID_PAC);
		if(PAC==null){
			Log("Error al crear objeto: "+ClassID_PAC);
			return false;
		}
		var nic,sucursalID,password;
		nic=uiCFD.StrConfiguracionLocal("FE_Timbre002","");
		sucursalID=uiCFD.StrConfiguracionLocal("FE_Timbre003","");
		password=uiCFD.StrConfiguracionLocal("FE_Timbre004","");
				
		PAC.credenciales(nic,sucursalID,password);
		
	}
	if(uiCBB==null){
		uiCBB=eBasic.eCreateObject("geCBB.CBB");
		if(uiCBB==null){
			Log("Error al crear objeto: geCBB.CBB");
			return false;
		}
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
	
	if(!cfd.documentoCorrecto_Venta(oventa,showLog)) return 0;
	
	if(!uiCFD.DocumentoAprobadoParaCFDI(oventa.Sys_PK)){
		if(showLog) eBasic.eMsgbox(er+" El documento tiene un folio no registrado en un rango válido.",6);
		return 0;
	}
	
	r=openRecordset("SELECT Sys_PK FROM ut_CFD WHERE uf_IVenta="+oventa.Sys_PK);
	if(esInvalido(r)){
		if(showLog) eBasic.eMsgbox("No se pudo validar la existencia del CFDI para este documento.",6);
		return 0;
	}
	if(!(r.EOF && r.BOF)){
		if(showLog) eBasic.eMsgbox(er+" Elemento duplicado, ya existe un CFDI para este documento.",6);
		return 0;
	}	
	
	return -1;
}

function disponibleParaGenerar_CXC(cxc,showLog){
var r;
var er="Documento inválido.";
if(showLog==null) showLog=false;
	
	if(!cfd.documentoCorrecto_CXC(cxc,showLog)) return 0;
	
	if(!uiCFD.DocumentoAprobadoParaCFDI_CXC(cxc.Sys_PK)){
		if(showLog) eBasic.eMsgbox(er+" El documento tiene un folio no registrado en un rango válido.",6);
		return 0;
	}
	
	r=openRecordset("SELECT Sys_PK FROM ut_CFD WHERE uf_IDCXC="+cxc.Sys_PK);
	if(esInvalido(r)){
		if(showLog) eBasic.eMsgbox("No se pudo validar la existencia del cfdi para este documento.",6);
		return 0;
	}
	if(!(r.EOF && r.BOF)){
		if(showLog) eBasic.eMsgbox(er+" Elemento duplicado, ya existe un CFDI para este documento.",6);
		return 0;
	}
	
	var v;
	//el cfd a generar no debe ser de un dcxc con el mismo folio de una venta
	v=uiCFD.ValorCampo("SELECT Sys_PK FROM Venta WHERE IFolio=" + cxc.IFolio.Sys_PK, "Sys_PK");
	if(v==null) v=0;
	if(v>0){
		if(showLog) eBasic.eMsgbox("No se puede crear el CFDI porque ya existe un documento de venta con el mismo folio.",6);
		return 0;
	}
	
	//ESTABLECER ATRIBUTOS SI NO LOS TIENE: FORMAPAGO,METODOPAGO,CONDICIONESPAGO Y NUMEROCUENTAPAGO 	
	//gb 01022012
	//-----------
	
	if(!cfd.asignarAtributosAdicionalesCXC(cxc)){
		if(showLog) eBasic.eMsgbox("Error al asignar atributos adicionales del comprobante fiscal (2012).",6);
		return 0;
	}
	//-----------
	
	return -1;
}

/******************************************
	GUARDAR CFD GENERADO
******************************************/

function guardarCFD(sXml,sCadenaOriginal,sSelloDigital,documento_edofx,pkCFDInfo,FechaHoraCFD){
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
		
		/* //PARA CFDI NO ES NECESARIO EL RANGO DE FOLIOS
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
		*/
		
		Fld = eBasic.eCreateObject("eSQLBD.clsTypeInfo");	
		Fld.classType = "Long";
        Fld.ClassField = "uf_CFDI_Info";
        Fld.DefaultVal = 0;
        Fld.Value = pkCFDInfo;
        Fld.isRequired = -1;
        Fld.Loaded = 0;
        Fld.Size = 0;
        Fld.TableField = "uf_CFDI_Info";		
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
		Fld.Value = 3;//CFDI 3.0
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

//function guardarBitacoraCFD(datos,pkCFD)


function guardarPresentacion(pk,pkcfd,TIPOx){
	cfd.asignarDivisa(pk,TIPOx);

	var tempfile,atmpf;
	var r,stream,b64,reporte,archivo_temp;
	var predViewer=0;
	
	//reporte=loadTextFromGlobalVar("FXCA303x","$AppReportsPath$\\Ventas\\facturaelectronica.xpd");
	//reporte=uiCFD.ReplaceMacros(reporte,"$AppReportsPath$",uiCFD.AppReportsPath);
	reporte="";
	
	//reporte=eBasic.AddSlashPath(GetRepository())+"Reports\\Ventas\\facturadigital.xpd";
	var f=new Date();
	atmpf=proccess.getTempFileName();
	archivo_temp=atmpf;
	//eBasic.AddSlashPath(eBasic.GetTempDir())+"mxcfd"+f.getFullYear()+""+f.getMonth()+""+f.getDate()+""+f.getHours()+""+f.getMinutes()+""+f.getSeconds();
	
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
			eBasic.eMsgbox("Documento inválido. El tipo de documento no puede ser "+tdocumento);
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
	
	DeleteFile(atmpf);

	//PENDIENTE MODIFICAR ENVIAR EMAIL PARA VALIDAR EXTENSION DE ARCHIVO DE PRESENTACION

	switch(enviarmail){
		case 1: //a direccion del cliente
			cfd.EnviareMailA(pkcfd,0,TIPOx);
			break;
		case 2: //solicitar
			cfd.EnviareMailA(pkcfd,1,TIPOx);
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

//function generarRegistroDeReporte(ocfd,statusAdministrativo)
	

/******************************************
	GENERACION DE OBJETO CFD PARA VENTA
******************************************/

function generarCFD(venta){
	var data;
	var pkventa;	
	var ocfd;
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
	ocfd=null;
	ocfd=eBasic.eCreateObject("geCFD.cCFDI");	//new ActiveXObject("geCFD.cCFD");
	if(ocfd==null){
		Log("Error al crear objeto geCFD.cCFDI");
		return null;
	}		

	
	if(!disponibleParaGenerar(venta,true)) return null;
	
	try{
		//ATRIBUTOS PRINCIPALES. ELEMENTO: COMPROBANTE
		var pkCFDInfo,fechaventa,serie,nocertificado,certificado;
		
		pkCFDInfo=buscarCFDInfo_Sys_PK(venta.IFolio.Block.Sys_PK);		
		if(esInvalido(pkCFDInfo,"El folio asignado al documento no tiene un certificado de sello digital relacionado.",true)) return null;
		
		pkCertificadoUsado=pkCFDInfo; //Utilizado para insertar en tabla ut_cfd.
		
		r=openRecordset("SELECT ut_CFDinfo.uf_noCertificado,ut_CFDinfo.uf_Certificado FROM ut_CFDinfo WHERE ut_CFDinfo.Sys_PK="+pkCFDInfo);
		if(esInvalido(r,"Error al acceder a información del certificado de sello digital.")) return null;
			
			fechaventa=ventaFechaHora(venta);
			if(esInvalido(fechaventa,"No se pudo cargar la fecha-hora de venta")) return null;
			
			serie=venta.IFolio.Block.Serie; //O			
			nocertificado=stringValue(r,"uf_noCertificado"); //R
			if(esInvalido(nocertificado,"El número de certificado de sello digital es inválido.",false,true)) return null;
			certificado=stringValue(r,"uf_Certificado"); //O
			if(certificado!=""){
				certificado=certificadoBase64(certificado);
				if(esInvalido(certificado,"No se pudo cargar el archivo de certificado de sello digital. Asegúrese que la ubicación es correcta.",false,true)) return null;
			}
									
			ocfd.version= 3.2;   //R
			ocfd.serie = serie; //O
			ocfd.folio = venta.IFolio.Folio; //O
			ocfd.fecha = fechaventa;//venta.Fecha;   //R formato:"2010-04-11T18:38:20";			
			ocfd.sello = ""; //R  se indicará después de generarlo.			
			ocfd.formaDePago = cfd.sFormaDePago(venta);    //R
			ocfd.noCertificado = nocertificado; //R
			ocfd.certificado = certificado;   //R //BASE64 DE CERTIFICADO DE SELLO DIGITAL
			ocfd.condicionesDePago = cfd.sCondicionesDePago(venta);    //O
			ocfd.subTotal = roundValue(venta.Subtotal);  //R
			ocfd.descuento = roundValue(venta.Descuento1+venta.Descuento2);  //O		
			ocfd.motivoDescuento = "";   //O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO		
			if(venta.IDivisa.Codigo.toUpperCase()=="PMX" || venta.IDivisa.Codigo.toUpperCase()=="MXN"){ //ES OPCIONAL
				ocfd.TipoCambio=venta.TipoCambio+"";	//O
				ocfd.Moneda="MXN";	//O
			}else{
				//GB se incluirá
				ocfd.TipoCambio=venta.TipoCambio+"";	//O
				ocfd.Moneda=venta.IDivisa.Codigo.toUpperCase()+"";	//O
			}
			ocfd.total = roundValue(venta.Subtotal-venta.Descuento1-venta.Descuento2+venta.Impuesto1+venta.Impuesto2+venta.Impuesto3+venta.Impuesto4); //R		
			
			ocfd.tipoDeComprobante = sTipoComprobante(venta.Documento);  //R
			ocfd.metodoDePago = cfd.sMetodoDePago(venta);   //R		
			//LugarExpedicion se encuentra abajo
			ocfd.NumCtaPago=cfd.sNumeroCuentaPago(venta); //O Atributo opcional para incorporar al menos los cuatro últimos digitos del número de cuenta con la que se realizó el pago. // gb 31012012
		
		//ELEMENTO EMISOR //R						
		ocfd.Emisor.rfc = rfcEmisor();    //R
		ocfd.Emisor.nombre =nombreEmisor();  //R
			//DOMICILIO FISCAL 
			Domicilio=null;
			Domicilio=oDimicilioFiscal();
			if(esInvalido(Domicilio,"No se pudo cargar el domicilio fiscal del emisor.")) return null;
			
			ocfd.Emisor.DomicilioFiscal.calle = direccionDividir(Domicilio.Direccion,1)+"";  //R
			ocfd.Emisor.DomicilioFiscal.noExterior= direccionDividir(Domicilio.Direccion,2)+""; //0
			ocfd.Emisor.DomicilioFiscal.noInterior= direccionDividir(Domicilio.Direccion,3)+""; //O
			ocfd.Emisor.DomicilioFiscal.colonia= Domicilio.Colonia+"";  //O
			ocfd.Emisor.DomicilioFiscal.localidad=""; //O
			ocfd.Emisor.DomicilioFiscal.referencia= Domicilio.Notas+"";   //O
			ocfd.Emisor.DomicilioFiscal.municipio= obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";    //R
			ocfd.Emisor.DomicilioFiscal.estado= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";   //R
			ocfd.Emisor.DomicilioFiscal.pais= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";   //R
			ocfd.Emisor.DomicilioFiscal.codigoPostal = Domicilio.CodPos+"";  //R
			
			//EXPEDIDO EN //OPCIONAL
			Domicilio=null;
			
			if(parseInt(loadTextFromGlobalVar("FXCB01121", "0"))==1) //agregado gb 26012012
			{
				//domicilio fiscal es domicilio de expedición-> domicio de expedición ya no se agrega
				
				ocfd.LugarExpedicion=ocfd.Emisor.DomicilioFiscal.municipio+", "+ocfd.Emisor.DomicilioFiscal.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. gb 26012012
				
			}else{
				//agrear domicilio de expedición
				Domicilio=oExepedidoEn(venta.ICConsumo.Sys_PK);
				if(!esInvalido(Domicilio,"")){
					ocfd.Emisor.ExpedidoEn.calle = direccionDividir(Domicilio.Direccion,1)+"";  //O
					ocfd.Emisor.ExpedidoEn.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
					ocfd.Emisor.ExpedidoEn.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O								
					ocfd.Emisor.ExpedidoEn.colonia = Domicilio.Colonia+"";//O
					ocfd.Emisor.ExpedidoEn.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
					ocfd.Emisor.ExpedidoEn.referencia = Domicilio.Notas+"";//O
					ocfd.Emisor.ExpedidoEn.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
					ocfd.Emisor.ExpedidoEn.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
					ocfd.Emisor.ExpedidoEn.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";  //R
					ocfd.Emisor.ExpedidoEn.codigoPostal = Domicilio.CodPos+"";//O
					if(esInvalido(ocfd.Emisor.ExpedidoEn.pais,"Falta valor en atributo País en domicilio de expedición.",false,true)) return null;
					
					ocfd.LugarExpedicion=ocfd.Emisor.ExpedidoEn.municipio+", "+ocfd.Emisor.ExpedidoEn.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. //gb 26012012
					
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
				ocfd.Emisor.RegimenFiscal.Add(RegimenFiscal);
				RegimenFiscal = null;
			}
			//--------------------------
			
			
		
		//ELEMENTO RECEPTOR //R		           
		ocfd.Receptor.rfc = venta.ICliente.RFC+"";  //R
		ocfd.Receptor.nombre = venta.ICliente.Nombre+"";   //O
			//DOMICILIO OPCIONAL //O
			Domicilio=null;
			Domicilio=oDomicilioReceptor(venta.ICliente.FK_Domicilio1);
			if(!esInvalido(Domicilio,"")){			
				ocfd.Receptor.Domicilio.calle = direccionDividir(Domicilio.Direccion,1)+"";//O
				ocfd.Receptor.Domicilio.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
				ocfd.Receptor.Domicilio.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O
				ocfd.Receptor.Domicilio.colonia = Domicilio.Colonia+"";//O
				ocfd.Receptor.Domicilio.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
				ocfd.Receptor.Domicilio.referencia = Domicilio.Notas+"";//O
				ocfd.Receptor.Domicilio.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
				ocfd.Receptor.Domicilio.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
				ocfd.Receptor.Domicilio.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+""; //R
				ocfd.Receptor.Domicilio.codigoPostal = Domicilio.CodPos+"";//O			
			}
			
		//ELEMENTO CONCEPTOS   //R  MIN 1 MAX ILIMITADO		 
        var concepto,dv,i,rL;
		if(venta.Detalle.Elements.Count()<1){
			Log("Error de carga. El documento actual no tiene conceptos a facturar.");
			return null;
		}
		dv=null
		concepto=null;
		
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
					importeOtroSinIVA=importeOtroSinIVA+parseFloat(roundValue((dv.Cantidad*dv.Precio)-dv.Descuento1-dv.Descuento2));	
					
					oformaGenFac.PrecioB=oformaGenFac.PrecioB+(dv.Cantidad*dv.Precio);
					oformaGenFac.DescuentosB=oformaGenFac.DescuentosB+(dv.Descuento1+dv.Descuento2);
					oformaGenFac.ImpuestosB=oformaGenFac.ImpuestosB+(dv.Impuesto1+dv.Impuesto2+dv.Impuesto3+dv.Impuesto4);
				}else{
					importeConsumo=importeConsumo+parseFloat(roundValue((dv.Cantidad*dv.Precio)-dv.Descuento1-dv.Descuento2));
					
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
			ocfd.Conceptos.Add(concepto);
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
				ocfd.Conceptos.Add(concepto);
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
				concepto.unidad = dv.Unidad+"";//O
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
					var info = eBasic.eCreateObject("geCFD.ct_InformacionAduanera");
					if(esInvalido(info,"Error al crear objeto geCFD.ct_InformacionAduanera")) return 0;
					info.numero = "";//R
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
										if(!cfd.agregarInformacionAduanera(concepto.InformacionAduanera,rL("ILote").Value)){
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
						if(!cfd.asignarSerieLoteEnParteConcepto(concepto,dv)){
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
				
				ocfd.Conceptos.Add(concepto);           
				dv=null
				concepto=null;
			}//Fin de for del detalle de venta.	
			
			
			uiCFD.EstablecerDeminusTipoFormato(venta.Sys_PK,inTipoFormato);			
		}//FIN IF FORMATO RESUMIDO O DETALLE
		
		
		
		
		
		//ELEMENTO IMPUESTOS   //R MIN 1 MAX 1
		
		ocfd.Impuestos.totalImpuestosRetenidos = 0; //O
		ocfd.Impuestos.totalImpuestosTrasladados=roundValue(venta.Impuesto1+venta.Impuesto3); //O // IMPUESTO 2 Y 4 NO USADOS PARA CFD PENDIENTE. 
			//OPCIONAL ARRAY COLLECTION   //Si existe <Rentenciones> MIN 1 MAX ILIMITADO
			//ocfd.Impuestos.Retenciones     
			/********************************/
			if(venta.Impuesto2<0 && cfg_usarRetencionImpuesto2){
				ocfd.Impuestos.totalImpuestosRetenidos = roundValue(venta.Impuesto2*-1); //O		
				retencion = null;
				retencion = eBasic.eCreateObject("geCFD.cRetencion");
				if(esInvalido(retencion,"Error al crear objeto geCFD.cRetencion")) return null;
				retencion.impuesto = "IVA";//R //ISR o IVA
				retencion.importe = roundValue(venta.Impuesto2*-1);//R
				ocfd.Impuestos.Retenciones.Add(retencion);
			}				
			/*******************************/

			//OPCIONAL ARRAY COLLECTION //Si existe <Traslados>    MIN 1 MAX ILIMITADO
			//ocfd.Impuestos.Traslados			
			// TIPO DE IMPUESTO ES POR PRODCUTO.. EL PROD PODRIA TENER MAS DE UN TIPO DE IMPUESTO.
						
			var r,dv,tipoImpuesto="",tasaImpuesto=0,totalImpuesto=0,trasladoPendiente=false;
			
			//TRASLADOS DE IVA
			r=openRecordset("SELECT DVenta.Sys_PK AS PKDVenta,DVenta.IProducto AS PKProducto,Producto.Impuestos AS PKImpuesto,cfgImpuesto.uf_TipoI1,cfgImpuesto.I1Venta FROM DVenta INNER JOIN (Producto INNER JOIN cfgImpuesto ON Producto.Impuestos=cfgImpuesto.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK WHERE DVenta.Impuesto1>=0 AND DVenta.FK_Venta_Detalle="+pkventa+" ORDER BY cfgImpuesto.uf_TipoI1,cfgImpuesto.I1Venta;");
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
					ocfd.Impuestos.Traslados.Add(traslado);
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
				ocfd.Impuestos.Traslados.Add(traslado);
				traslado = null;
			
			}
			r.Close();
			r=null;
			
			//TRASLADOS DE IEPS
			r=openRecordset("SELECT DVenta.Sys_PK AS PKDVenta,DVenta.IProducto AS PKProducto,Producto.Impuestos AS PKImpuesto,cfgImpuesto.uf_TipoI3,cfgImpuesto.I3Venta FROM DVenta INNER JOIN (Producto INNER JOIN cfgImpuesto ON Producto.Impuestos=cfgImpuesto.Sys_PK) ON DVenta.IProducto=Producto.Sys_PK WHERE DVenta.Impuesto3>=0 AND DVenta.FK_Venta_Detalle="+pkventa+" ORDER BY cfgImpuesto.uf_TipoI3,cfgImpuesto.I3Venta;");
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
					ocfd.Impuestos.Traslados.Add(traslado);
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
				ocfd.Impuestos.Traslados.Add(traslado);
				traslado = null;
			
			}
			r.Close();
			r=null;
			
			
		//ELEMENTO COMPLEMENTO
		//ocfd.Complemento; //O     SI EXISTE: MIN 1   MAX 1				
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
		//ocfd.Addenda;    //O		SI EXISTE: MIN 1   MAX 1		
		//LA ADDEDA DEBERA AGREGARSE DESPUES DE TIMBRAR
		//VER FUNCION timbrar()
		
		return ocfd;
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

function buscarCFDInfo_Sys_PK(pkBlock){
	var r;	
	r=openRecordset("SELECT uf_CFDI_Info FROM BlockDocumentos WHERE Sys_PK="+pkBlock,true);
	if(esInvalido(r)) return 0;
	
	return r("uf_CFDI_Info").Value;	
}

function certificadoBase64(filename){
	var b64;
	b64=proccess.doBase64FromFile(filename);
	if(b64!=null){
		return b64;
	}else{
		Log("Error al cargar certificado de sello digital. "+proccess.lastError);
		Log("Archivo: "+filename);
		return null;
	}
}

function ventaFechaHora(venta){
	/*var r;	
	r=openRecordset("SELECT uf_fechaCFD FROM Venta WHERE Sys_PK="+pkventa,true);
	if(esInvalido(r,"Error al obtener fecha de venta.")) return null;	
	return r("uf_fechaCFD").Value;
	*/
	return uiCFD.ObtenerFechaHora(venta.Fecha,venta.Sys_DTCreated);
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
		Log("Error al obtener valor de campo "+field + "  " +e.message);
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

//function qCFD()
//function Detail()
//function AsignarCarpetaRepotes(Window)
//function ConfigurarConsulta(Tab)
//function RedimensionarColumnas()
//function TituloCFD(pk)
//function AbrirDocumento()
//function VistaPrevia()
//function ExportarCFD()
//function EnviareMail()
//function EnviareMailA(pk,solicitarDir,TIPO)
//function RealizarInformeMensual()
//function VerInformesGenerados()
//function EliminarCFD()


function crearCFDVentas(A){
//FUNCION PUBLICA
var pkcfd;
var pkventa;
	if(!inicializarObjetos()) return 0;
	
	pkventa=Application.Browsers.GetBrowser("qVentas").PrimaryKeyValue;
	pkcfd=obtenerFacturaElectronica(pkventa);
}



//function despuesGuardarVenta(pkventa,spregunta)

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


//function obtenerExtensionArchivo(tipo)

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
	var ocfd;
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
	ocfd=null;
	ocfd=eBasic.eCreateObject("geCFD.cCFDI");	//new ActiveXObject("geCFD.cCFD");
	if(ocfd==null){
		Log("Error al crear objeto geCFD.cCFDI");
		return null;
	}		

	
	if(!disponibleParaGenerar_CXC(cxc,true)) return null;
	
	try{
		//ATRIBUTOS PRINCIPALES. ELEMENTO: COMPROBANTE
		var pkCFDInfo,fechadocumento,serie,nocertificado,certificado;
		
		pkCFDInfo=buscarCFDInfo_Sys_PK(cxc.IFolio.Block.Sys_PK);		
		if(esInvalido(pkCFDInfo,"El folio asignado al documento no tiene un certificado de sello digital relacionado.",true)) return null;
		
		pkCertificadoUsado=pkCFDInfo; //Utilizado para insertar en tabla ut_cfd.
		
		r=openRecordset("SELECT ut_CFDinfo.uf_noCertificado,ut_CFDinfo.uf_Certificado FROM ut_CFDinfo WHERE ut_CFDinfo.Sys_PK="+pkCFDInfo);
		if(esInvalido(r,"Error al acceder a información del certificado de sello digital.")) return null;
			
			fechadocumento=cxcFechaHora(cxc);
			if(esInvalido(fechadocumento,"No se pudo cargar la fecha-hora de cxc")) return null;
			
			serie=cxc.IFolio.Block.Serie; //O			
			nocertificado=stringValue(r,"uf_noCertificado"); //R
			if(esInvalido(nocertificado,"El número de certificado de sello digital es inválido.",false,true)) return null;
			certificado=stringValue(r,"uf_Certificado"); //O
			if(certificado!=""){
				certificado=certificadoBase64(certificado);
				if(esInvalido(certificado,"No se pudo cargar el archivo de certificado de sello digital. Asegúrese que la ubicación es correcta.",false,true)) return null;
			}else{
				Log("Falta la ubicación del certificado de sello digital");
				return null;
			}
									
			ocfd.version= 3.2;   //R
			ocfd.serie = serie; //O
			ocfd.folio = cxc.IFolio.Folio; //O
			ocfd.fecha = fechadocumento;//venta.Fecha;   //R formato:"2010-04-11T18:38:20";			
			ocfd.sello = ""; //R  se indicará después de generarlo.			
			ocfd.formaDePago = cfd.sFormaDePago_CXC(cxc); //R			
			ocfd.noCertificado = nocertificado; //R
			ocfd.certificado = certificado;   //R //BASE64 DE CERTIFICADO DE SELLO DIGITAL			
			ocfd.condicionesDePago = cfd.sCondicionesDePago_CXC(cxc); //O		
			
			var st,imp_origen,imp_intfin,imp_intmor; //variable usada tambien en:concepto,impuesto
			imp_origen=0;
			imp_intfin=0;
			imp_intmor=0;			
			
			switch(cxc.Documento){
				case 5:			
					st=cxc.Haber/(1+(cxc.porImpuestoCap/100));
					st=st.toFixed(2);//siempre 2 por el importe se recalcula y los decimales varian
					
					ocfd.subTotal =st;  //R			
					ocfd.total = roundValue(cxc.Haber); //R		
					break;
				case 17:
					st=cxc.Debe/(1+(cxc.porImpuestoCap/100));
					st=st.toFixed(2);//siempre 2 por el importe se recalcula y los decimales varian
					
					ocfd.subTotal =st;  //R			
					ocfd.total = roundValue(cxc.Debe); //R									
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
						
						ocfd.subTotal =roundValue(st);  //R
						ocfd.total= roundValue(cxc.Debe+cxc.IntMoratorios); //R
						
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
						
						ocfd.subTotal =roundValue(st);  //R
						ocfd.total= roundValue(cxc.Haber); //R
							
					}//fin else es recibo 19					
							
					
					//asignar
					var folioorigen=eBasic.eCreateObject("geUICFD.cFolioOrigen");
					if(esInvalido(folioorigen,"No se pudo crear el objeto geUICFD.cFolioOrigen")) return null;
					if(!folioorigen.cargarInformacion_CFD(iventa.Sys_PK,cxc.ADOCnn)){
						Log("No se pudo cargar la información del folio origen de la parcialidad. "+folioorigen.lastError);
						return null;
					}
					ocfd.FolioFiscalOrig=folioorigen.FolioFiscalOrig+"";
					ocfd.SerieFolioFiscalOrig=folioorigen.SerieFolioFiscalOrig+"";
					ocfd.FechaFolioFiscalOrig=folioorigen.FechaFolioFiscalOrig;
					ocfd.MontoFolioFiscalOrig=folioorigen.MontoFolioFiscalOrig;
					
					break;
				
			}//fin switch tipo documento
			
			
			ocfd.descuento = 0;//gb  //O		
			ocfd.motivoDescuento = "";   //O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO		
			
			//GB incluir divisa //opcional
			var ocliente;
			ocliente=cxc.ICliente.GetStrongObject();
			ocliente.IDivisa.LoadFromADOConnection(ocliente.IDivisa.Sys_PK,"",cxc.ADOCnn);			
			if(ocliente.IDivisa.Codigo.toUpperCase()=="PMX" || ocliente.IDivisa.Codigo.toUpperCase()=="MXN"){ //ES OPCIONAL
				ocfd.TipoCambio=cxc.TipoCambio+"";	//O
				ocfd.Moneda="MXN";	//O				
			}else{				
				ocfd.TipoCambio=cxc.TipoCambio+"";	//O
				ocfd.Moneda=ocliente.IDivisa.Codigo.toUpperCase()+"";	//O
			}
			
			ocfd.tipoDeComprobante = sTipoComprobante(cxc.Documento);  //R
			ocfd.metodoDePago =cfd.sMetodoDePago_CXC(cxc);  //R
			//LugarExpedicion se encuentra abajo
			ocfd.NumCtaPago=cfd.sNumeroCuentaPago_CXC(cxc); //O Atributo opcional para incorporar al menos los cuatro últimos digitos del número de cuenta con la que se realizó el pago. // gb 31012012
			
		//ELEMENTO EMISOR //R						
		ocfd.Emisor.rfc = rfcEmisor();    //R
		ocfd.Emisor.nombre =nombreEmisor();  //R
			//DOMICILIO FISCAL 
			Domicilio=null;
			Domicilio=oDimicilioFiscal();
			if(esInvalido(Domicilio,"No se pudo cargar el domicilio fiscal del emisor.")) return null;
			
			ocfd.Emisor.DomicilioFiscal.calle = direccionDividir(Domicilio.Direccion,1)+"";  //R
			ocfd.Emisor.DomicilioFiscal.noExterior= direccionDividir(Domicilio.Direccion,2)+""; //0
			ocfd.Emisor.DomicilioFiscal.noInterior= direccionDividir(Domicilio.Direccion,3)+""; //O
			ocfd.Emisor.DomicilioFiscal.colonia= Domicilio.Colonia+"";  //O
			ocfd.Emisor.DomicilioFiscal.localidad=""; //O
			ocfd.Emisor.DomicilioFiscal.referencia= Domicilio.Notas+"";   //O
			ocfd.Emisor.DomicilioFiscal.municipio= obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";    //R
			ocfd.Emisor.DomicilioFiscal.estado= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";   //R
			ocfd.Emisor.DomicilioFiscal.pais= obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";   //R
			ocfd.Emisor.DomicilioFiscal.codigoPostal = Domicilio.CodPos+"";  //R
									
			//EXPEDIDO EN //OPCIONAL
			Domicilio=null;
			
			if(parseInt(loadTextFromGlobalVar("FXCB01121", "0"))==1) //agregado gb 26012012
			{
				//domicilio fiscal es domicilio de expedición-> domicio de expedición ya no se agrega
				
				ocfd.LugarExpedicion=ocfd.Emisor.DomicilioFiscal.municipio+", "+ocfd.Emisor.DomicilioFiscal.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. gb 26012012
				
			}else{
			
				//ANTES 2012 -> gb  se supone que domicilio de expedicion sera el domicilio fiscal del emisor ya que cxc no tiene relacionado un centro de consumo
				//A PARTIR 2012 ->gb El domicilio de expedicion se obtiene del centro de consumo que haya sido marcado							
				Domicilio=oExepedidoEn_CXC();
				if(!esInvalido(Domicilio,"Sin domicilio de expedición")){
					ocfd.Emisor.ExpedidoEn.calle = direccionDividir(Domicilio.Direccion,1)+"";  //O
					ocfd.Emisor.ExpedidoEn.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
					ocfd.Emisor.ExpedidoEn.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O								
					ocfd.Emisor.ExpedidoEn.colonia = Domicilio.Colonia+"";//O
					ocfd.Emisor.ExpedidoEn.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
					ocfd.Emisor.ExpedidoEn.referencia = Domicilio.Notas+"";//O
					ocfd.Emisor.ExpedidoEn.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
					ocfd.Emisor.ExpedidoEn.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
					ocfd.Emisor.ExpedidoEn.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+"";  //R
					ocfd.Emisor.ExpedidoEn.codigoPostal = Domicilio.CodPos+"";//O
					if(esInvalido(ocfd.Emisor.ExpedidoEn.pais,"Falta valor en atributo País en domicilio de expedición.",false,true)) return null;
					
					ocfd.LugarExpedicion=ocfd.Emisor.ExpedidoEn.municipio+", "+ocfd.Emisor.ExpedidoEn.estado; //R Atributo requerido para incorporar el lugar de expedición del comprobante. //gb 26012012
					
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
				ocfd.Emisor.RegimenFiscal.Add(RegimenFiscal);
				RegimenFiscal = null;
			}
			//--------------------------
			
		
		//ELEMENTO RECEPTOR //R		           
		ocfd.Receptor.rfc = cxc.ICliente.RFC+"";  //R
		ocfd.Receptor.nombre = cxc.ICliente.Nombre+"";   //O
			//DOMICILIO OPCIONAL //R
			Domicilio=null;
			Domicilio=oDomicilioReceptor(cxc.ICliente.FK_Domicilio1);
			if(!esInvalido(Domicilio,"")){				
				ocfd.Receptor.Domicilio.calle = direccionDividir(Domicilio.Direccion,1)+"";//O
				ocfd.Receptor.Domicilio.noExterior = direccionDividir(Domicilio.Direccion,2)+"";//O
				ocfd.Receptor.Domicilio.noInterior = direccionDividir(Domicilio.Direccion,3)+"";//O
				ocfd.Receptor.Domicilio.colonia = Domicilio.Colonia+"";//O
				ocfd.Receptor.Domicilio.localidad = "";//O //VACIO NO SE HA ASIGNADO UN CAMPO PARA ESTE ATRIBUTO
				ocfd.Receptor.Domicilio.referencia = Domicilio.Notas+"";//O
				ocfd.Receptor.Domicilio.municipio = obtenerUbicacionCorrecta(Domicilio.ICiudad.Nombre)+"";//O
				ocfd.Receptor.Domicilio.estado = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.Nombre)+"";//O
				ocfd.Receptor.Domicilio.pais = obtenerUbicacionCorrecta(Domicilio.ICiudad.Estado.IPais.Nombre)+""; //R
				ocfd.Receptor.Domicilio.codigoPostal = Domicilio.CodPos+"";//O				
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
				concepto.valorUnitario = ocfd.subTotal;//gb//roundValue(dv.Precio);//R
				concepto.importe = ocfd.subTotal;//gb//roundValue(dv.Cantidad*dv.Precio);//R
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
			
			ocfd.Conceptos.Add(concepto);           			
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
					ocfd.Conceptos.Add(concepto);           			
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
					ocfd.Conceptos.Add(concepto);           			
					concepto=null;				
				}
			}//Fin es pagaré
		
		
		//ELEMENTO IMPUESTOS   //R MIN 1 MAX 1
		
		ocfd.Impuestos.totalImpuestosRetenidos = 0; //O		
			//OPCIONAL ARRAY COLLECTION   //Si existe <Rentenciones> MIN 1 MAX ILIMITADO
			//ocfd.Impuestos.Retenciones     
			/*******************************                                
			retencion = null;
			retencion = eBasic.eCreateObject("geCFD.cRetencion");
			if(esInvalido(retencion,"Error al crear objeto geCFD.cRetencion")) return 0;
			retencion.impuesto = "";//R //ISR o IVA
			retencion.importe = roundValue(0);//R
			ocfd.Impuestos.Retenciones.Add(retencion);
			*******************************/

			//OPCIONAL ARRAY COLLECTION //Si existe <Traslados>    MIN 1 MAX ILIMITADO
			//ocfd.Impuestos.Traslados			
			// TIPO DE IMPUESTO ES POR PRODCUTO.. EL PROD PODRIA TENER MAS DE UN TIPO DE IMPUESTO.
						
					
			//TRASLADOS DE IVA
			switch(cxc.Documento){
				case 5:
				case 17:
					//nota cargo o nota credito
					//Es nota de credito o nota de cargo
					
					ocfd.Impuestos.totalImpuestosTrasladados=roundValue(ocfd.total-ocfd.subTotal); //O
					
					traslado = null;
					traslado = eBasic.eCreateObject("geCFD.cTraslado");
					if(esInvalido(traslado,"Error al crear objeto geCFD.cTraslado")) return null;
					traslado.impuesto = "IVA";//R // IVA o IEPS
					traslado.tasa = roundValue(cxc.porImpuestoCap);//R
					traslado.importe = roundValue(ocfd.total-ocfd.subTotal);//R
					ocfd.Impuestos.Traslados.Add(traslado);
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
									ocfd.Impuestos.Traslados.Add(traslado_intfin);
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
										ocfd.Impuestos.Traslados.Add(traslado_intmor);
									}
								}
							}
					
					traslado.importe=roundValue(total1); //R
					if(traslado.importe>0) ocfd.Impuestos.Traslados.Add(traslado);
					traslado = null;
					traslado_intfin=null;
					traslado_intmor=null;
					
					ocfd.Impuestos.totalImpuestosTrasladados=roundValue(totalIT); //O
					break;
				
			}//fin switch
			
									
			
		//ELEMENTO COMPLEMENTO
		//ocfd.Complemento; //O     SI EXISTE: MIN 1   MAX 1				
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
		//ocfd.Addenda;    //O		SI EXISTE: MIN 1   MAX 1		
		//LA ADDEDA DEBERA AGREGARSE DESPUES DE TIMBRAR
		//VER FUNCION timbrar()			
		
		return ocfd;
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
	var pkcxc;
	pkcxc=A.Context.ActiveWindow.PrimaryKeyValue;	
	return crearCFDCXC2(pkcxc);
}

function crearCFDCXC2(pkcxc){
//FUNCION PUBLICA
var pkcfd;

	if(!inicializarObjetos()) return 0;
	
	//crear cfd
	pkcfd=obtenerFacturaElectronica_CXC(pkcxc); //la validacion del tipo de documento se hace posteriormente
	return pkcfd;
}



//FIN CAMBIOS PARA CFD CXC
//================================================================================
//================================================================================
//================================================================================




function agregarAddendaCFDI_timbrado(archivoXML_timbrado,pkcfd,TIPO){
//gb 20052011
//TIPO: 1=VENTA, 2=CXC
//Devuelve 0 o -1 informacion para indicar si se agregó o no la addenda.

	try{
		var boAddenda,addenda_js,addenda_contenido;
		var pkventa=0;
		var pkcliente=0;
		var pkcxc=0;
		var codigocliente;
		var nombrecliente;
		
				
		//cargar datos de venta y cliente
		var r,sql;
		
		if(TIPO==1){
			//venta
			sql="Select Venta.Sys_PK AS PK,Cliente.Sys_PK AS pkcliente,Cliente.Codigo,Cliente.Nombre,Cliente.uf_Addenda FROM ut_CFD INNER JOIN (Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) ON ut_CFD.uf_IVenta=Venta.Sys_PK WHERE ut_CFD.Sys_PK="+pkcfd;			
		}else{
			sql="Select DCXC.Sys_PK AS PK,Cliente.Sys_PK AS pkcliente,Cliente.Codigo,Cliente.Nombre,Cliente.uf_Addenda FROM ut_CFD INNER JOIN (DCXC INNER JOIN Cliente ON DCXC.ICliente=Cliente.Sys_PK) ON ut_CFD.uf_IDCXC=DCXC.Sys_PK WHERE ut_CFD.Sys_PK="+pkcfd;
		}
		
		r=openRecordset(sql,true);		
		
		if(esInvalido(r,"Error al acceder a información de cliente. No se pudo integrar la addenda")){
			return 0;
		}
		boAddenda=r("uf_Addenda").Value;
		if(boAddenda==null) boAddenda=0;
		
		if(TIPO==1){
			pkventa=r("PK").Value;
			pkcxc=0;
		}else{
			pkcxc=r("PK").Value;
			pkventa=0;
		}
		
		pkcliente=r("pkcliente").Value;
		codigocliente=r("codigo").Value;
		nombrecliente=r("nombre").Value;
		r.Close();
		r=null;
		//ELEMENTO ADDENDA
		//cfd.Addenda;    //O		SI EXISTE: MIN 1   MAX 1		
		
		//boAddenda=incluirAddenda(venta.ICliente.Sys_PK);
		//if(boAddenda==null) return 0;
		
		if(boAddenda){
			addenda_js=eBasic.AddSlashPath(GetRepository())+ubicacionAddenda+codigocliente+".js";
			if(!eBasic.FileExists(addenda_js)){
				Log("No se encontró el archivo para integrar Addenda: "+addenda_js + ". Cliente: "+nombrecliente);
				Log("Error imposible continuar.");
				return 0;
			}
			addenda_contenido=eBasic.LoadFileToStr(addenda_js);
			if(esInvalido(addenda_contenido,"El archivo "+addenda_js+" se encuentra vacío. Cliente "+nombrecliente,false,true)) return 0;
				
			resultado_addenda=eval(addenda_contenido);			
			if(resultado_addenda){
				return -1;
			}else{
				Log("Error al integrar Addenda");
				return 0;
			}
		}else{
			
			if(TIPO!=1) return 0; //es de tipo CXC terminar proceso. (aún no existe una addenda predeterminada para cxc
			
			//gb 19052011
			//cargar addenda de maxicomercio
			if(loadNumFromGlobalVar("FXCA402x",0)==1){
				addenda_js=eBasic.AddSlashPath(GetRepository())+ubicacionAddenda+"maxicomercio.js";
				if(!eBasic.FileExists(addenda_js)){
					Log("No se encontró el archivo para integrar Addenda: "+addenda_js);
					Log("Error imposible continuar.");
					return 0;
				}
				addenda_contenido=eBasic.LoadFileToStr(addenda_js);
				if(esInvalido(addenda_contenido,"El archivo "+addenda_js+" se encuentra vacío.",false,true)) return 0;
					
				resultado_addenda=eval(addenda_contenido);			
				if(resultado_addenda){
					return -1;
				}else{
					Log("Error al integrar Addenda");
					return 0;
				}
			}
		}
		return 0;
	}catch(e){
		Log("Error al integrar Addenda en CFDI.");
		return 0;
	}
}


function EliminarCFDI(){
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

function MarcarCFDICancelado(){
	var cfdmng;
	
	if(!uiCFD.PermitirAcceso("FXCA326xb",Application.UIUsers.CurrentUser)) return 0;
	
	cfdmng=eBasic.eCreateObject("CFDmng.cMain");
	if(cfdmng==null){
		eBasic.eMsgbox("Error al crear objeto",6);
		return 0;
	}
	cfdmng.setObjects(Application.ADOCnn,1);
	cfdmng.showCFDListForCancel();
}


function RegenerarRepresentacionCFDI(){
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


function cancelarCxC_CFDI(pkcxc){
	try{		
		var pkcfdi;
		pkcfdi=uiCFD.ValorCampo("SELECT Sys_PK FROM ut_CFD WHERE uf_Tipo=3 AND uf_IDCXC="+pkcxc,"Sys_PK");
		if(pkcfdi==null) pkcfdi=0;
		if(pkcfdi<1){//el documento no es cfdi
			eBasic.eMsgbox("No se pudo obtener la clave pimaria del cfdi.",6);
			return 0;
		}
		return cancelarCFDI(pkcfdi);	
	}catch(e){
		throw(e);
		return 0;
	}
}

function tipoAplicacion()
{
	if(ApplicationName.toLowerCase()=="maxicomercio")
		return 1;
	else
		return 2;
}