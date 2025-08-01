/*
Módulo de requisiciones, unicamente disponible para los motores MySQL 5.0+ y SQLServer 2008 R2
*/
var blDocFlujo;
var uiDocFlujo;
var engineType=0; //1=SQLServer 2008 R2, 2=MySQL 5.0+
var XMLRequisiciones = "";
var netconnection;
var procesosCompras;
var SQLRequisiciones, SQLRequisicionesTodos, SQLReqAll;
var SQLQry;
var Destino=1;
var XPDFormatReq = "Formato requisicion.xpd";
var oInfo=null;
var xNety=null;
var uiComVentasBI;
var created = false;
var motorDetectado = false
//var AppEngine = Application.InternalObject("UIDef");
//SQLRequisiciones="SELECT DISTINCT Sys_PK, Fecha, Tipo_Requisicion, Status, Serie, Folio, Remitente, Destinatario, Asunto, almaceno as Almacen_Origen, almacend as Almacen_Destino FROM qRequisiciones Where Mes=@Mes AND Anio=@Anio @WhereWho @WhereID ORDER BY Sys_PK DESC;";

SQLRequisiciones="SELECT DISTINCT Sys_PK, Fecha, Tipo_Requisicion, Status, Serie, Folio, Remitente, Destinatario, Asunto, almaceno as Almacen_Origen, almacend as Almacen_Destino, uf_Color FROM qRequisiciones Where Mes=@Mes AND Anio=@Anio @WhereWho ORDER BY Sys_PK DESC;";

SQLReqAll="SELECT DISTINCT Sys_PK, Fecha, Tipo_Requisicion, Status, Serie, Folio, Remitente, Destinatario, Asunto, almaceno as Almacen_Origen, almacend as Almacen_Destino, uf_Color FROM qRequisiciones Where Mes=@Mes AND Anio=@Anio ORDER BY Sys_PK DESC;";

//SQLRequisicionesTodos="SELECT DISTINCT Sys_PK, Fecha,  Tipo_Requisicion, Status, Serie, Folio, Remitente, Destinatario, Asunto, almaceno as Almacen_Origen, almacend as Almacen_Destino FROM qRequisiciones Where Anio=@Anio @WhereWho @WhereID ORDER BY Sys_PK DESC;";


SQLRequisicionesTodos="SELECT DISTINCT Sys_PK, Fecha,  Tipo_Requisicion, Status, Serie, Folio, Remitente, Destinatario, Asunto, almaceno as Almacen_Origen, almacend as Almacen_Destino, uf_Color FROM qRequisiciones Where Anio=@Anio @WhereWho ORDER BY Sys_PK DESC;";

function CrearPanel(){
	
	Application.UIShortCuts.CreateAction("P_Requisiciones_01","Nueva Requisición",0,"","","","UIRequisiciones.CrearRequisicion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_02","Editar requisición",0,"","","","UIRequisiciones.EditarRequisicion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_03","Cancelar requisición",0,"","","","UIRequisiciones.CancelarRequisicion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_06","Nuevo Igual a",0,"","","","UIRequisiciones.cloneRequisicion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_04","Configuración",0,"","","","UIRequisiciones.Configuraciones",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_05","Mas opciones",0,"","","","UIRequisiciones.Opciones",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Requisiciones_08","Unir requisiciones",0,"","","","UIRequisiciones.OptUnirRequisiciones",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Requisiciones_09","Dividir requisición",0,"","","","UIRequisiciones.OptDividirRequisiciones",0,"","","",0);
	
	//createObjects();
}

function getAccess()
{
	try
	{
		ObtenerMotor();
		switch(engineType)
		{
			case 1:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"SQLSvrRequisiciones.xml";
				break;
			case 2:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"MySQLRequisiciones.xml";
				break;
			case 3:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"MSAccessRequisiciones.xml";
				break;
			default:
				return 0;
		}
		
		//netconnection=eBasic.eCreateObject("geAccess.getAccess");
		//netconnection=eBasic.eCreateObject("dlgNet.cMain");
		oInfo=eBasic.eCreateObject("dlgNet.cEntidad");
		xNety=eBasic.eCreateObject("CnnNetAccess.Tools.NetAccess");
		netconnection=eBasic.eCreateObject("dlgNet.cMain");
		netconnection.CnnObj(Application.adoCnn);
		netconnection.LoadDataDefault();
		netconnection.ObjEntidad();
		xNety.Info.Server=netconnection.oEntidad.Server;
		xNety.Info.UserID=netconnection.oEntidad.UserID;
		xNety.Info.Pwd=netconnection.oEntidad.Pwd;
		xNety.Info.BaseDatos=netconnection.oEntidad.BaseDatos;
		xNety.Info.Mode=netconnection.oEntidad.Mode;
		xNety.Info.Seguridad=netconnection.oEntidad.Mode;
		
		if(oInfo==null)
		{
			Log("Error al crear objeto cEntidad");
			return null;
		} 
		
		if(netconnection==null){
			Log("Error al crear objeto geAccess");
			return null;
		}
		
		
		
		if(xNety.connect(XMLRequisiciones, engineType))
		{
			return xNety.acc;
		}
		else
		{
			netconnection=eBasic.eCreateObject("geAccess.getAccess");
			
			if(netconnection==null)
			{
				return null;
			}

			if(netconnection.connect(Application.adoCnn, XMLRequisiciones, engineType))
			{
				return netconnection.access;
			}
			else
			{
				Log("No se pudo conectar: " + netconnection.LastErrorDescription);
				return null;
			}
		}
	}
	catch(e)
	{
		Log(e.message);
	}
}

/*Funcion pública para acceder desde el POS*/
function createObjects() {
    try {
        //Log("STGT createObjects() invocado. created=" + created);

        // Validar ping() seguro
        if (created) {
            try {
                if (uiDocFlujo && uiDocFlujo.ping()) {
                    //Log("Ping exitoso, objetos ya creados.");
                    return;
                } else {
                    //Log("Ping falló, intentando reconectar.");
                }
            } catch (pingErr) {
                //Log("Error en ping(): " + pingErr.message + " - intentando reconectar.");
            }
        }

        // Solo ejecutar ObtenerMotor una vez
        if (!motorDetectado) {
            ObtenerMotor();

            if (engineType === -1) {
                Log("No se ha podido determinar el motor de la base de datos.");
                return -1;
            }

            motorDetectado = true;
        }

        switch (engineType) {
            case 1:
                XMLRequisiciones = eBasic.AddSlashPath(GetRepository()) + "SQLSvrRequisiciones.xml";
                break;
            case 2:
                XMLRequisiciones = eBasic.AddSlashPath(GetRepository()) + "MySQLRequisiciones.xml";
                break;
            case 3:
                XMLRequisiciones = eBasic.AddSlashPath(GetRepository()) + "MSAccessRequisiciones.xml";
                break;
            default:
                Log("Motor no soportado: " + engineType);
                return 0;
        }

        // Verificar que el archivo XML exista antes de continuar
        if (!eBasic.FileExists(XMLRequisiciones)) {
            Log("Archivo XML no encontrado: " + XMLRequisiciones);
            return 0;
        }

        // Crear objetos COM
        uiDocFlujo = eBasic.eCreateObject("uiFlujoDocumentos.cMain");
        blDocFlujo = eBasic.eCreateObject("blFlujoDocumentos.cMain");
        procesosCompras = eBasic.eCreateObject("ProcesosCompras.cMain");
        uiComVentasBI = eBasic.eCreateObject("ComVentasBI.cMain");

        if (!uiDocFlujo) {
            Log("Error al crear objeto uiFlujoDocumentos.cMain.");
            return 0;
        }
        if (!blDocFlujo) {
            Log("Error al crear objeto blFlujoDocumentos.cMain.");
            return 0;
        }
        if (!procesosCompras) {
            Log("Error al crear objeto ProcesosCompras.cMain.");
            return 0;
        }

        // Inicializar y cargar diccionario con manejo de errores
        try {
            if (!blDocFlujo.Initialize(Application.GetQName())) throw new Error(blDocFlujo.lastErrorDescription);
            if (!blDocFlujo.LoadDiccionarioDatos(XMLRequisiciones)) throw new Error(blDocFlujo.lastErrorDescription);
        } catch (initErr) {
            Log("Error en Initialize o LoadDiccionarioDatos: " + initErr.message);
            return 0;
        }

        // Validar Application.UIUsers
        if (!Application.UIUsers) {
            Log("Error: Application.UIUsers no está disponible.");
            return 0;
        }

        blDocFlujo.setCOMobjects(Application.UIUsers);
        procesosCompras.setObjects(blDocFlujo.obDriver);

        if (!blDocFlujo.obDriver) {
            Log("Error: blDocFlujo.obDriver no disponible.");
            return 0;
        }

        procesosCompras.setCOMobjects(Application.UIUsers);
        uiDocFlujo.setObjects(blDocFlujo.obDriver, blDocFlujo, procesosCompras);
        uiDocFlujo.setCOMobjects(Application.UIUsers);
        uiDocFlujo.filtrarProductosXGrupo = false;
        uiDocFlujo.applicationName = "MaxiComercio";
        uiComVentasBI.setObjects(blDocFlujo.obDriver);

/**        // ?? Validar si dlgDocumentZosFlujo existe
        if (!uiDocFlujo.dlgDocumentosFlujo.loadControls) {
            try {
                uiDocFlujo.dlgDocumentosFlujo = eBasic.eCreateObject("uiFlujoDocumentos.dlgDocumentosFlujo");
                if (uiDocFlujo.dlgDocumentosFlujo) {
                    Log("dlgDocumentosFlujo fue creado manualmente.");
                } else {
                    Log("Advertencia: dlgDocumentosFlujo no se pudo crear. STGT");
                }
            } catch (dlgErr) {
                Log("Error al crear dlgDocumentosFlujo manualmente: " + dlgErr.message);
            }
        } else {
            Log("dlgDocumentosFlujo ya estaba disponible.");
        }
		*/

        created = true;
        //Log("Objetos creados e inicializados correctamente.");
    } catch (e) {
        Log("Error al acceder a componentes de requisiciones: " + e.message);
    }
}

/**
function createObjects()
{
	try
	{
		if(created)
		{
			if (uiDocFlujo.ping())
				return;
		}
		
		ObtenerMotor();
		//engineType=AppEngine.inDataBaseType;
		switch(engineType)
		{
			case 1:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"SQLSvrRequisiciones.xml";
				break;
			case 2:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"MySQLRequisiciones.xml";
				break;
			case 3:
				XMLRequisiciones=eBasic.AddSlashPath(GetRepository())+"MSAccessRequisiciones.xml";
				break;
			default:
				return 0;
		}
				
		if(engineType == -1)
		{
			Log("No se ha podido determinar el motor de la base de datos.");
			return -1;
		}
		
		uiDocFlujo=eBasic.eCreateObject("uiFlujoDocumentos.cMain");
		blDocFlujo=eBasic.eCreateObject("blFlujoDocumentos.cMain");
		procesosCompras=eBasic.eCreateObject("ProcesosCompras.cMain");
		uiComVentasBI=eBasic.eCreateObject("ComVentasBI.cMain");
		
		if(uiDocFlujo==null){
			Log("Error al crear objeto uiFlujoDocumentos.cMain.");
			return 0;
		}
		if(blDocFlujo==null){
			Log("Error al crear objeto blFlujoDocumentos.cMain.");
			return 0;
		}
		if(procesosCompras==null){
			Log("Error al crear objeto ProcesosCompras.cMain.");
			return 0;
		}

		if(!blDocFlujo.Initialize(Application.GetQName())) throw new Error(blDocFlujo.lastErrorDescription);
		if(!blDocFlujo.LoadDiccionarioDatos(XMLRequisiciones)) throw new Error(blDocFlujo.lastErrorDescription);
		
		blDocFlujo.setCOMobjects(Application.UIUsers);
		procesosCompras.setObjects(blDocFlujo.obDriver); 
		procesosCompras.setCOMobjects(Application.UIUsers);
		uiDocFlujo.setObjects(blDocFlujo.obDriver, blDocFlujo, procesosCompras);
		uiDocFlujo.setCOMobjects(Application.UIUsers);
		uiDocFlujo.filtrarProductosXGrupo=false;
		uiDocFlujo.applicationName="MaxiComercio";
		uiComVentasBI.setObjects(blDocFlujo.obDriver);
		
		created=true;
	}
	catch(e)
	{
		Log("Error al acceder a componentes de requisiciones: " + e.message);
	}
}
**/
function DesplegarComVentasBI(){
	createObjects();
	if(uiComVentasBI.desplegarBI())
		return 1;
	else
		return 0;
}

 function AsignarCarpetaRepotes(Window){
	Window.ReportsFolder=Reportes.CarpetaRequisiciones;
	Window.ObjectTypeName="Requisiciones";
 }

function GetRepository(){
var sp="";
	try{
		sp=Application.ScrAdmin.GetPath(0);
	}catch(e){
		sp=Application.SourceAdmin.GetPath(0);
	}
	return sp;
}

function MainRequisiciones()
{
	CrearPanel();
	createObjects();

if(blDocFlujo.obDriver==null)
{
	Log("Para acceder al módulo de requisiciones es necesario configurar la conexión para ello diríjase a Herramientas > Configurar conexión de módulo de requisiciones.");
	return -1;
}

if(!Application.UIUsers.CheckItem("FX1-20-40-001"))  //PERMITIR ACCESO
	return 0;

/* if(engineType == 3)
{
	eBasic.eMsgbox("Característica disponible unicamente para motores de base de datos MySQL y SQL Server.");
	return -1;
} */

var Brw;
var Fecha;

Brw=null;

Brw=Application.Browsers.GetBrowser("qRequisiciones");
if (Brw==null)
	{
				
		Brw=Application.Browsers.CreateBrowser("qRequisiciones");
		Brw.Caption="Requisiciones";
		Brw.sqlCommand.CmdType=1;				
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Tipo", 100));		
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("IDTipo"));	
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=SQLReqAll;	
		
		Brw.CmdAfterRetriveFields="UIRequisiciones.RedimensionarColumnas";
		
		Brw.CmdAddNew="UIRequisiciones.CrearRequisicion"; 
		Brw.CmdEdit="UIRequisiciones.EditarRequisicion";
		Brw.CmdDelete = "UIRequisiciones.EliminarRequisicion";
		Brw.CmdDblClick=Brw.CmdEdit;
				
		AsignarCarpetaRepotes(Brw);
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Nueva Requisición","P_Requisiciones_01");
		Brw.AddButton("Editar requisición","P_Requisiciones_02");
		Brw.AddButton("Cancelar requisición","P_Requisiciones_03");
		Brw.AddButton("Nuevo igual a","P_Requisiciones_06");
		Brw.AddButton("Unir requisiciones","P_Requisiciones_08");		
		Brw.AddButton("Dividir requisición","P_Requisiciones_09");
		Brw.AddButton("Mas opciones","P_Requisiciones_05");
		Brw.AddButton("Configuración","P_Requisiciones_04");
		
		Brw.TopTabParameter="Tipo";
		Brw.CmdTopTabClick="UIRequisiciones.PrepararConsulta";		
		Brw.AddTopTab("Todos",100);
		Brw.AddTopTab("Enviados",101);
		Brw.AddTopTab("Recibidos",102);
		Brw.AddTopTab("Incompletos",104);

		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="UIRequisiciones.PrepararConsulta";
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
		

		//Ocultar columnas		
		Brw.HideFields("Sys_PK;uf_Color");
		
		Brw.DetailFunction="UIRequisiciones.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);

		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="docf_documento";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="docf_documento";	
		
			
				//Brw.SetGroup("Status");
	}
	else
	{
		Brw.Zorder();	
	}
	Application.eDoEvents();
}

function RedimensionarColumnas(){
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qRequisiciones");	
	if (Brw!=null){		
				
		Brw.SetColumnWidth("Fecha",100);
		Brw.SetColumnWidth("Status",100);
		Brw.SetColumnWidth("Serie",70);
		Brw.SetColumnWidth("Folio",70);
		Brw.SetColumnWidth("Remitente",150);
		Brw.SetColumnWidth("Destinatario",150);
		Brw.SetColumnWidth("Asunto",400);
		Brw.SetColumnWidth("Almacen_Origen",200);	
		Brw.SetColumnWidth("Almacen_Destino",200);			
		
		Brw.SetCaptionByFieldName("Almacen_Origen","Almacén origen");
		Brw.SetCaptionByFieldName("Almacen_Destino","Almacén destino");
		Brw.SetCaptionByFieldName("Tipo_Requisicion","Tipo de requisición");

	}

//Brw.SetTitle("Requisiciones");
}

function cambiarConsulta(value)
{
	ConfigurarConsulta();
}

function PrepararConsulta(value)
{
	ConfigurarConsulta();
}

function ConfigurarConsulta(){	
var Brw;
Brw=null;

Brw=Application.Browsers.GetBrowser("qRequisiciones");
	if (Brw!=null){
		
			if(Brw.Parameter("Mes").Value==0)
			{
				SQLQry = SQLRequisicionesTodos;
			}	
			else
			{
				SQLQry = SQLRequisiciones;
			}
		
		Application.eDoEvents();
			
			var ViewAll = false;
			var sent, received, all;
			
			if(!Application.UIUsers.CheckItem("FX1-20-40-002", false, false))  //Permitir visualizar todas las requisiciones
			{
				all = " AND (PKRemitente = " + Application.UIUsers.CurrentUser.Sys_PK + " OR PKDestinatario = " + Application.UIUsers.CurrentUser.Sys_PK + ")";
			}
			else			
			{
				all = "";
			}
			sent = " AND PKRemitente = " + Application.UIUsers.CurrentUser.Sys_PK;
			received = " AND PKDestinatario = " + Application.UIUsers.CurrentUser.Sys_PK;
			
			
			//Debido a valores de parámetros es necesario realizar switch
			switch(Brw.Parameter("Tipo").Value)
			{
				case 100://Todos
					SQLQry = SQLQry.replace("@WhereWho", " AND Eliminado <> 1" + all);
				break;
				case 101: //Enviados
					SQLQry = SQLQry.replace("@WhereWho", " AND Eliminado <> 1" + sent);
				break;
				case 102: //Recibidos
					SQLQry = SQLQry.replace("@WhereWho", " AND Eliminado <> 1" + received); 
				break;
				case 104: //Incompletos
					SQLQry = SQLQry.replace("@WhereWho", " AND Eliminado <> 1 AND CantidadReal <> Ejercido AND (IDStatus = 105 OR IDStatus = 205 OR IDStatus = 305 OR IDStatus = 405)" + all);
				break;
				default:
					SQLQry = SQLQry.replace("@WhereWho", "");
				break;
			}
			Brw.sqlCommand.CmdSQL = SQLQry;


	}else{
		Log("Error al asignar consulta");
	}	

}

function Opciones()
{
var ask;
var opc;

	ask=Application.NewAsk();
	ask.SetOption(10,"Generar requisición a partir de productos debajo del mínimo","Genera una requisición de aquellos productos cuya existencia se encuentre debajo del mínimo configurado.");
	ask.SetOption(20,"Generar requisición por faltantes","Genera una requisición con los productos de las requisiciones con status Terminado que cuenten con productos cuya cantidad solicitada no sea igual a la cantidad ejercida.");
	ask.SetOption(30,"Generar requisición a partir de ingredientes","Genera una requisición con las materias primas de las recetas que se encuentren en la requisición.");
	ask.SetOption(80,"Generar requisición a partir de pedidos sin surtir","Genera una requisición con los productos de pedidos por surtir.");
	ask.SetOption(40,"Realizar producción a partir de la requisición seleccionada","Permite realizar la producción de las recetas que se encuentren en la requisición seleccionada.");
	ask.SetOption(50,"Realizar comparación de costos y generación de pedidos de compra","Compara los costos de los productos que se encuentren dentro de la requisición con los diversos proveedores del sistema y permite generar un pedido de compra hacia el proveedor seleccionado.");
	ask.SetOption(70,"Exportar requisición a archivo MVI","Genera un archivo de movimiento .MVI con los productos y cantidades de la requisición seleccionada.");
	ask.SetOption(60,"Importar requisición de archivo MVI","Utilice esta opción para importar los productos de un archivo de movimiento MVI que se generó a partir de una requisición.");

	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10:
			OptGenReqMinimo();  break;
		case 20:
			OptRequisicionXFaltantes();  break;
		case 30:
			OptGenReqIngredientes(); break;
		case 40:
			OptReProduccion(); break;
		case 50:
			OptCompCostos(); break;
		case 60:
			importarMVI(); break;
		case 70:
			exportarMVIScript(); break;
		case 80: 
			optRequisicionPedido(); break;
	}
	ask=null;
}

function optRequisicionPedido()
{
	try
	{
		if(uiDocFlujo.requisicionPedido())
        {
            Actualizar();
        }
	}
	catch(e)
	{
		Log("Error crear requisición por faltanes." + e.description);
		return -1;
	}
}

function OptRequisicionXFaltantes()
{
	var result = 0;
	try
	{
		result = uiDocFlujo.requisicionXFaltantes();
        if (result > 0)
        {
            Actualizar();
        }
	}
	catch(e)
	{
		Log("Error crear requisición por faltanes." + e.description);
		return -1;
	}
}

function OptReProduccion()
{
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if(PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return 0;
	}
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	var s = StatusRequisicion(PKReq);
	if(s<1) return -1;
	
	if(s!=102 && s!=202 && s!=302 && s!=402)
	{
		Log("La requisición debe tener status Autorizado.");
		return -1;
	}
	
	try
	{
		if(ProducirEnsamble(PKReq) == 1) 
		{
			Actualizar();
			return 1;
		}
	}
	catch(e)
	{
		Log("Error al crear producción de la requisición." + e.description);
		return -1;
	}
}

function OptCompCostos()
{
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if(PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return 0;
	}
	
	if(ValidarEliminado(PKReq))
	{
		return -1;
	}
	
	try
	{
		if(uiDocFlujo.compararcostos(PKReq))
		{
			Log("Pedido(s) de compra creados correctamente.");
			/*
			Mostrar panel de compras...
			*/
			UICompras.QCompras();
			UICompras.ActualizarQCompras();
			return 1;
		}
		else
		{
			Log(uiDocFlujo.LastErrorDescription());
		}
		
		return -1;
		
	}
	catch(e)
	{
		Log("Error al realizar comparación de costos. " + e.description);
		return -1;
	}
}


function OptGenReqIngredientes()
{
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if(PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return 0;
	}
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	var s = StatusRequisicion(PKReq);
	if(s<1) return -1;
	
	if(s!=102 && s!=202 && s!=302 && s!=402)
	{
		Log("La requisición debe tener status Autorizado.");
		return -1;
	}
	try
	{
		if(uiDocFlujo.docApartirdeIngredientes(PKReq))
		{
			Actualizar();
		}
		else
		{
			Log(uiDocFlujo.LastErrorDescription);
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al generar requisición a partir de ingredientes. " + e.description);
		return -1;
	}
}

function OptGenReqMinimo()
{
	try
	{
		if(uiDocFlujo.genReqDebMinimo())
		{
			Actualizar();
		}
		else
		{
			Log(uiDocFlujo.LastErrorDescription());
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al generar requisición de productos debajo del mínimo. " + e.description);
		return -1;
	}	
}

function OptUnirRequisiciones()
{
	try
	{
		uiDocFlujo.unirRequisiciones;
		Actualizar();
		return 1;
	}
	catch(e)
	{
		Log("Error al unir requisiciones. " + e.description);
		return -1;
	}
}

function OptDividirRequisiciones()
{
	var Brw;
	var PKReq;
	var status, tipo;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if(PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return 0;
	}
	
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	
	try
	{
		status = StatusRequisicion(PKReq);
		
		if(status <= 0)
		{
			return 0;
		}
		
		//eBasic.eMsgbox(status);
		
		if(status!=101 && status!=201 && status!=301 && status!=401)
		{
			Log("Unicamente es posible dividir una requisición con status nuevo.");
			return 0;
		}
		
		tipo = TipoRequisicion(PKReq);
		
		if(tipo < 1)
		{
			return 0;
		}
		uiDocFlujo.dividirDocumentos(PKReq,tipo);
		Actualizar();
	}
	catch(e)
	{
		Log("Error al intentar dividir requisiciones. " + e.description);
		return -1;
	}
}

function CrearRequisicion()
{
	var res;
	var ruta;
	try
	{
		createObjects();
		res = uiDocFlujo.nuevaRequisicion();
		if(res > 0)
		{
			if(uiDocFlujo.exportarMVI && uiDocFlujo.referenciaMVI != "")
			{
				exportarMVI(uiDocFlujo.referenciaMVI, res);
			}
			Actualizar();
			ruta = eBasic.AddSlashPath(Application.SourceAdmin.GetPath(0))+eBasic.AddSlashPath("Reports")+"Requisiciones\\" + XPDFormatReq;
			Reportes.EjecutarReporte(ruta,Destino,res,true);		
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al crear documento. " + e.description);
		return -1;
	}
}

function Actualizar(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");
	if (Brw!=null)
		Brw.RefreshRst();
}

function exportarMVIScript()
{
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if (PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return -1;
	}
	try
	{
		var referencia = generarRerefencia(PKReq);
		
		if(referencia == -1) return -1;
		
		exportarMVI(referencia, PKReq);
	}
	catch(e)
	{
		
	}
}

function generarRerefencia(PKReq)
{
	var result = "";
	try
	{
		var sql = "select blockdocumentos.serie, foliosdocumentos.folio from docf_documento inner join foliosdocumentos on docf_documento.ifolio = foliosdocumentos.sys_pk inner join blockdocumentos on foliosdocumentos.block = blockdocumentos.sys_pk where docf_documento.sys_pk = " + PKReq;
		var R = null;
		
		R = Application.Database.OpenRecordset(sql, Application.adoCnn);
		
		if(R==null)
		{
			Log("Error al obtener información de la base de datos.");
			return -1;
		}
		
		if(R.EOF && R.BOF)
		{
			R=null;
			Log("Error al obtener información a la base de datos.");
			return -1;
		}
		
		while(!R.EOF){		
		result = R("serie").Value + R("folio").Value; 
		R.MoveNext();
		}
		R.Close();
		R = null;
		return result;
	}
	catch(e)
	{
		Log("Error al generar referencia: " + e.description);
		return -1;
	}
}

function exportarMVI(referencia, pkRequisicion)
{
	try
	{
		var com = new ActiveXObject("com_maxicomercio_mvi.mvi_file");
		if(com == null)
		{
			Log("Error al crear objeto para realizar exportación de archivo.");
		}
		else
		{
			com.setObjects(Application.adoCnn);
			com.setRequisicion(pkRequisicion, referencia);
			if(com.loadfrommov(7,""))
			{
				com.saveas();
			}
			else
			{
				Log(com.LastErrorDescription);	
			}
			com = null;
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al exportar movimiento. " + e.description);
		return -1;
	}
}

function EditarRequisicion()
{
	var res;
	var Brw;
	var PKReq;
	var ruta;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;
	
	if (PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return -1;
	}
	
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	
	try
	{
		res = uiDocFlujo.editarRequisicion(Brw.PrimaryKeyValue);
		
		if(res > 0)
		{
			if(uiDocFlujo.exportarMVI && uiDocFlujo.referenciaMVI != "")
			{
				exportarMVI(uiDocFlujo.referenciaMVI, res);
			}
			Actualizar();
			ruta = eBasic.AddSlashPath(Application.SourceAdmin.GetPath(0))+eBasic.AddSlashPath("Reports")+"Requisiciones\\" + XPDFormatReq;
			Reportes.EjecutarReporte(ruta,Destino,res,true);	
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al editar la requisición. " + e.description);
		return -1;
	}
	
}

function EliminarRequisicion()
{
	var res;
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;

	if (PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return -1;
	}
	
	var s = StatusRequisicion(PKReq);
	
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	
	if(s<=0)
	{
		return 0;
	}
	
	//if(s == 105 || s==205 || s==305 || s==405)
	//{
		//Log("No es posible eliminar una requisición con status completado.");
		//return 0;
	//}
	
	if (eBasic.eMsgbox("¿Está seguro que desea eliminar la requisición?", 4)==7)
		return 0;
	
	try	
	{
		res = uiDocFlujo.eliminarDocumento(PKReq);

		if(res)
		{
			Actualizar();
		}
		else
		{
			Log("No se eliminó la requisición. " + uiDocFlujo.LastErrorDescription);
			return -1;
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al eliminar requisición. " + e.description);
		return -1;
	}
}

function CancelarRequisicion()
{
	var res;
	var Brw;
	var PKReq;
	
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qRequisiciones");

	if (Brw==null) return -1;
	
	PKReq = Brw.PrimaryKeyValue;

	if (PKReq < 1)
	{
		Log("Debe seleccionar una requisición.");
		return -1;
	}
	
	if(ValidarEliminado(PKReq))
	{
		Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
		return -1;
	}
	var s = StatusRequisicion(PKReq);
	if(s<=0)
	{
		return 0;
	}
	
	if(s != 101 && s!=102)
	{
		Log("Unicamente es posible cancelar una requisición con status Nuevo o Autorizado.");
		return 0;
	}
	
	if (eBasic.eMsgbox("¿Está seguro que desea cancelar la requisición?", 4)==7)
		return 0;
	
	try	
	{
		res = uiDocFlujo.cancelarrequisicion(PKReq);

		if(res)
		{
			Actualizar();
		}
		else
		{
			Log("Error al cancelar requisición. " + uiDocFlujo.LastErrorDescription);
			return -1;
		}
		return 1;
	}
	catch(e)
	{
		Log("Error al eliminar requisición. " + e.description);
		return -1;
	}
}

function Configuraciones()
{
	var ask;
	var opc;

	ask=Application.NewAsk();
	ask.SetOption(50,"Catálogo de tipos de requisición.","Muestra el catálogo de los tipos de requisición, además permite agregar, editar o eliminar un tipo de requisición.");
	ask.SetOption(10,"Configurar serie por tipo de requisición","Seleccione esta opción para establecer las series disponibles para cada tipo de requisición.");
	ask.SetOption(20,"Configurar serie por grupo de usuarios","Seleccione esta opción para establecer las serie disponibles para cada grupo de usuarios.");
	ask.SetOption(30,"Configuración local","Seleccione esta opción para configurar la serie predeterminada que utilizará el equipo actual.");
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10:	
			OptConfigTipoReq();break;
		case 20:
			OptConfigUserGroup();break;
		case 30:
			OptConfigLocal();  break;
		case 50:
			OptTiposRequisicion(); break;
	}
	ask=null;
}

function OptTiposRequisicion()
{
	try
	{
		uiDocFlujo.addTipo();
	}
	catch(e)
	{
		Log("Error al ingresar a catálogo de tipos de requisición." + e.description);
		return -1;
	}
}

function OptConfigTipoReq()
{
	try
	{
		uiDocFlujo.organizarBlockXTipo();
		return 1;
	}
	catch(e)
	{
		Log("Error al ingresar a configuración de block por tipo de documento. " + e.description);
		return -1;
	}
}

function OptConfigUserGroup()
{
	try
	{
		uiDocFlujo.BlockXGrupoUsuarios();
		return 1;
	}
	catch(e)
	{
		Log("Error al ingresar a configuración de block por grupo de usuarios." + e.description);
		return -1;
	}
}

function OptConfigLocal()
{
	try	
	{
		uiDocFlujo.configuracionLocal;
		return 1;
	}
	catch(e)
	{
		Log("Error al ingresar a configuración local. " + e.description);
		return -1;
	}
}

function OptSetPermisos()
{
	try
	{
		uiDocFlujo.PermisosXEstatus();
		return 1;
	}
	catch(e)
	{
		Log("Error al ingresar a configuración local. " + e.description);
		return -1;
	}
}

function Log(Error){
	if (Error!="")
		eBasic.eMsgbox(Error,6);
		//Application.FireEventLog(Error);
}

function StatusRequisicion(PKReq)
{
	try	
	{
		var sql;
		var R;
		sql = "SELECT docf_status.id FROM docf_status INNER JOIN docf_documento ON docf_status.sys_pk = docf_documento.istatus WHERE docf_documento.sys_pk = " + PKReq;
		R = Application.Database.OpenRecordset(sql, Application.adoCnn);
		
		if(R==null)
		{
			Log("Error al obtener status de la requisición");
			return 0;
		}
		
		if(R.EOF && R.BOF)
		{
			R = null;
			Log("Error al obtener status de la requisición.");
			return 0;
		}
		
		var status;
		while(!R.EOF){		
		status = R("id").Value;
		R.MoveNext();
		}
		R.Close();
		R = null;
		return status;
	}
	catch(e)
	{
		Log("Error al obtener status de la requisición." + e.description);
		return -1;
	}
}

function TipoRequisicion(PKReq)
{
	try
	{
		var sql;
		var R;
		sql = "SELECT ITipo from docf_documento where Sys_PK = " + PKReq;
		R = Application.Database.OpenRecordset(sql, Application.adoCnn);
		
		if(R==null)
		{
			Log("Error al obtener tipo de requisición.");
			return 0;
		}
		
		if(R.EOF && R.BOF)
		{
			R=null;
			Log("Error al obtener tipo de requisición.");
			return 0;
		}
		
		var tipo;
		while(!R.EOF){		
		tipo = R("ITipo").Value;
		R.MoveNext();
		}
		R.Close();
		R = null;
		return tipo;
	}
	catch(e)
	{
		Log("Error al obtener el tipo de requisición. " + e.description);
		return -1;
	}
}

function ProducirRequisicion(PKReq)
{
	var BL;
	var ModoProduccion=0;
	var Cfg;
	var EDO;
	var LBInv;
	var Func;
	var Configuracion;
	var POR;
	
	BL=new ActiveXObject("BLdmns.cActions");
	if(BL==null){
		eBasic.eMsgbox("Error al crear objeto 'BLdmns.cActions'",6);
		return 0;
	}
	
	Configuracion=Application.InternalObject("Configuracion");
	if(Configuracion==null){
		eBasic.eMsgbox("Error al obtener objeto 'Configuracion'",6);
		return 0;
	}
	Cfg=Application.InternalObject("FXConfig");
	if(Cfg==null){
		eBasic.eMsgbox("Error al obtener objeto 'FXConfig'",6);
		return 0;
	}
	
	EDO=Application.InternalObject("DataAccess");
	if(EDO===null){
		eBasic.eMsgbox("Error al obtener objeto 'DataAccess'",6);
		return 0;
	}
	LBInv=Application.InternalObject("LBInventario");
	if(LBInv==null){
		eBasic.eMsgbox("Error al obtener objeto 'LBInventario'",6);
		return 0;
	}
	Func=Application.InternalObject("gFunciones");
	if(Func==null){
		eBasic.eMsgbox("Error al obtener objeto 'gFunciones'",6);
		return 0;
	}
	
	BL.SetObjects(EDO,LBInv,eBasic,Func,Application.UIUsers);
	BL.DecPreMontos=Configuracion.eApplicationVars.FXCA001;	
	BL.ImpuestoFrontera=Configuracion.eApplicationVars.FXCT116;
	BL.VenderSinExistencias=Configuracion.eLocalVars.FXCT111;
	BL.Categoria_ProcesoProduccion=Configuracion.eLocalVars.FXCT206;
	
	POR=new ActiveXObject("prod_requisiciones.cMain");
	if(POR==null)
	{
		eBasic.eMsgbox("Error al crear el objeto cMain");
		return 0;
	}
	POR.SetObjects(EDO, BL);
	if(!POR.producirRequisicionXCProduccionCConsumo(PKReq))
	{
		if(POR.LastErrorDescription!="") eBasic.eMsgbox(POR.LastErrorDescription,6);
		return 0;
	}
	else
	{
		eBasic.eMsgbox("Producción realizada correctamente",6);
		return 1;
	}
}

/*Obtener motor de la base de datos...*/
function ObtenerMotor()
{
	var sql;
	var R = eBasic.eCreateObject("ADODB.Recordset");
	engineType = -1;
	if(R==null)
	{
		eBasic.eMsgbox("Error al crear objeto ADODB.Recordset");
		return -1;
	}
		
	/*Consulta para MySQL*/
	try
	{
		sql = "select UUID();";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//MySQL
		
		engineType = 2;
		XMLRequisiciones = "MySQLRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Siguiente motor...
	}
	
	//Consulta SQLServer
	try
	{
		sql = "select NEWID();";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//SQLServer
		engineType = 1;
		XMLRequisiciones = "SQLSvrRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Siguiente motor...
	}
	
	//Consulta Access
	try
	{
		sql = "Select cbool(-1) as Valor;";
		R.ActiveConnection = Application.adoCnn;
		R.CursorLocation = 3;
		R.Source = sql;
		R.Open;
		R.Close;
		//Access
		engineType = 3;
		XMLRequisiciones = "MSAccessRequisiciones.xml";
		return;
	}
	catch(e)
	{
		//Finaliza
	}
}

//Validar si la requisición no se encuentra eliminada.
function ValidarEliminado(PKReq)
{
	try
	{
		var sql;
		var R;
		var res;

		if(engineType == 1) //SQLServer
		{
			sql = "select case when isnull(sys_deleted,0) = 0 then 0 else 1 end as eliminado FROM docf_documento where Sys_PK = " + PKReq;
		}
		if(engineType == 2) //MySQL
		{
			sql = "SELECT IFNULL(sys_deleted,0) as eliminado FROM docf_documento where Sys_PK = " + PKReq;
		}
		if(engineType == 3) //Access
		{
			sql = "SELECT iif(isnull(sys_deleted),0,sys_deleted) as eliminado FROM docf_documento where Sys_PK = " + PKReq;
		}

		R = Application.Database.OpenRecordset(sql, Application.adoCnn);
		
		if(R==null)
		{
			Log("Error al obtener estado de la requisición.");
			return true;
		}
		
		if(R.EOF && R.BOF)
		{
			R=null;
			Log("Error al obtener estado de la requisición.");
			return true;
		}
		
		var v;
		while(!R.EOF){		
		v = R("eliminado").Value;
		R.MoveNext();
		}
		R.Close();
		R = null;

		switch(v)
		{
			case 0:
				return false
			break;
			case 1:
				return true;
			break;
		}
		
	}
	catch(e)
	{
		return true;
	}
}

function Detail(){

	var r=null;
	var p;
	var Brw;
	try
	{
		Brw=Application.Browsers.GetBrowser("qRequisiciones");
		if(Brw==null) return 0;
		
		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de la requisición");
		r=Application.Database.OpenRecordset("select docf_ddocumento.Sys_PK, Producto.Codigo, Producto.Descripcion as Producto, docf_DDocumento.Unidad, ROUND((docf_DDocumento.Cantidad * docf_DDocumento.Factor),4) AS Cantidad, docf_DDocumento.Ejercido from docf_ddocumento inner join producto on docf_DDocumento.IProducto = Producto.Sys_PK where idocumento="+p.CurrentValue,Application.adoCnn);
		
		//Poner datos en el panel
	
		p.SetDataSource(r,"Sys_PK");
		p.HideFields("Sys_PK;Codigo");
		p.SetColumnWidth("Producto",445);
		p.SetColumnWidth("Unidad",90);
		p.SetColumnWidth("Cantidad",90);
		p.SetColumnWidth("Ejercido",90);
		Application.eDoEvents();
	}
	catch(e)
	{
		Log("Error al obtener información para el panel de detalle");
		return 0;
	}
}

function cloneRequisicion()
{
	try
	{
		var res;
		var Brw;
		var PKReq;
		
		Brw=null;
		Brw=Application.Browsers.GetBrowser("qRequisiciones");

		if (Brw==null) return -1;
		
		PKReq = Brw.PrimaryKeyValue;
		
		if (PKReq < 1)
		{
			Log("Debe seleccionar una requisición.");
			return -1;
		}
		
		if(ValidarEliminado(PKReq))
		{
			Log("La requisición se encuentra eliminada, no es posible realizar la acción.");
			return -1;
		}
		
		if(uiDocFlujo.nuevaRequisicionIgual(PKReq))
		{
			Actualizar();
		}
	}
	catch(e)
	{
		Log("Error al crear requisición." + e.description);
		return -1;
	}
}

function importarMVI()
{
	if(!Application.UIUsers.CheckItem("FX1-20-40-007"))  //PERMITIR IMPORTAR MVI
	return 0;

	var dlg;
	var mviInfo;
	var productos;
	var mvi;
	try
	{
		dlg = new ActiveXObject("com_maxicomercio_mvi.mvi_ui");
		mviInfo = new ActiveXObject("com_maxicomercio_mvi.mvi_info");
		productos = new ActiveXObject("com_maxicomercio_mvi.prodinfo");
		mvi = new ActiveXObject("com_maxicomercio_mvi.mvi_file");
		if(dlg==null)
		{
			Log("Error al crear diálogo para importar archivo.");
			mviInfo = null;
			productos = null;
			mvi = null;
			return -1;
		}
		
		if(mviInfo==null)
		{
			Log("Error al crear objeto de información de archivo.");
			dlg = null;
			productos = null;
			mvi = null;
			return -1;
		}
		
		if(productos==null)
		{
			Log("Error al acceder a clase de productos.");
			mviInfo = null;
			dlg = null;
			mvi = null;
			return -1
		}
		
		if(mvi == null)
		{
			Log("Error al crear objeto mvi.");
			mviInfo = null;
			dlg = null;
			productos = null;
		}
		
		mvi.SetObjects(Application.adoCnn);
		mvi = dlg.dlg_GetMVIRequisicion();
		
		if(mvi==null) 
		{	
			return;
		}

		if(uiDocFlujo.loadFromMVI(mvi))
			Actualizar();
		
		return 1;
	}
	catch(e)
	{
		Log("Error al importar movimiento. " + e.description);
		return -1;
	}
}

function ProducirEnsamble(PKReq)
{
	try
	{
		var sql = "";
		var pkcategoria = 0;
		var EDO;
		EDO=Application.InternalObject("DataAccess");
		sql = "Select varvalue from globalvar where varname = 'CategoriaEnsamble'";
		pkcategoria = getValue(sql, "varvalue");

		if(pkcategoria < 1) return -1;
		
		//eBasic.eMsgbox(pkcategoria);
		
		if(!Inventario.EnsamblarRequisicion(PKReq, pkcategoria))
		{
			Log("Error al realizar producción. " + Inventario.LastErrorDescrip);
			return 0;
		}
		else
		{
			eBasic.eMsgbox("Producción realizada correctamente",6);
			return 1;
		}	
	}
	catch(e)
	{
		Log("Error al realizar producción de ensamble." + e.description);
		return -1;
	}
}

function getValue(sql, campo)
{
	var R = null;
	var result;
	
	try
	{
		R = Application.Database.OpenRecordset(sql, Application.adoCnn);
		
		if(R==null)
		{
			Log("Error al obtener información de la base de datos.");
			return -1;
		}
		
		if(R.EOF && R.BOF)
		{
			R=null;
			Log("Error al obtener información a la base de datos.");
			return -1;
		}
		
		while(!R.EOF){		
		result = R(campo).Value;
		R.MoveNext();
		}
		R.Close();
		R = null;
		return result;
	}
	catch(e)
	{
		Log("Error al obtener ");
		return -1;
	}
}