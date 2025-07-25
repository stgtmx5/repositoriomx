var servGuard;
var engineType=1;
var RegAppName="Maxicomercio";
var netconnection;
configurar();
var GUID_Linea_SA="78CA690D04FA45BDAF59B9F7EE57D046";
var GUID_SerGuarderia="04631B13080C49A9B2D284B0A093EA01";
var uiGuarderia;
function configurar()
{
	
	try
	{
	
		netconnection=eBasic.eCreateobject("geAccess.getAccess");
		servGuard= eBasic.eCreateObject("uiServicioGuarderia.cMain");
		
		if(netconnection==null)
		{
			eBasic.eMsgbox("Error al crear objeto geAcces.",6);
			return 0;
		}
		
		if (servGuard==null)
		{
			eBasic.eMsgbox("Error al crear el objeto uiServicioGuarderia");
			return 0;
		}

			servGuard.createDriver(documentos_flujo.Acceso);
			//servGuard.setCOMobjects(Application.UIUsers);
			servGuard.setCOMobjects(Application.UIUsers);
			
			try
			{
				var R=eBasic.eCreateObject("ADODB.Recordset");
				if(R==null)
				{
					eBasic.eMsgbox("Error al crear el objeto ADODB.Recordset");
					
				}
				R.ActiveConnection=Application.adoCnn;
				R.CursorLocation=3;
				R.Source="select sys_pk from ut_DservicioGuarderia LIMIT 1;";
				R.Open;
				R.Close;
			}
			catch(e)
			{
				if(R.State==1)
				{
					R.Close;
				}
				servGuard.createSchema();
			}
			
		}

	catch(e)
	{
		eBasic.eMsgbox("Error: "+e.description);
	}

	
}

function ConfigurarCostos()
{
	servGuard.dlgconfigcostos();
}

function ServicioGuarderia()
{
	servGuard.dlgServicioGuarderia();
}

function dlgconfiguracionlocal()
{
	servGuard.dlgconfiguracionlocal();
}

/************************************LOG********************************/
function Log(Error)
{
	if(Error!="")
		Application.FireEventLog(Error);
}

/***********************************************************************
FUNCIONES PARA COMPATIBILIDAD CON EL PUNTO DE VENTA
************************************************************************/

function GetRepository()
{
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


function Cobro_Guarderia()
{
		
		var CobroG;
		var datosCobro;
		var PKServicioGuarderia=0;
		var i_cconsumo=LBEfectivo.objCorte.ICaja.CentroConsumo.Sys_PK;
		var i_caja=LBEfectivo.objCorte.ICaja.Sys_PK;
		var i_divisa=AppVars.GetNumVar("FXCA013", 0);
		var i_cliente=NodeVars.EGetSetting(RegAppName, "NodeVars", "FXCT112", 0);
		var i_agente=MainForm.lnAgente;
		var i_frontera=false;
		var i_cat_ingreso=AppVars.GetNumVar("FXCA026", 0);
		var vnt;
		var mov=eBasic.eCreateObject("EDOFx.MovCaja");
		var prod=eBasic.eCreateObject("EDOFx.M_Producto");
		var info;
		var oServicioGuarderia;

	try
	{
		
		if (!existe_producto(GUID_SerGuarderia))
		{
		
			//El producto asignado al servicio no está disponible, se intentará agregarlo
			actualizar_cat_productos();
			if (!existe_producto(GUID_SerGuarderia))
			{
				eBasic.eMsgbox ("No se puede actualizar el catálogo de productos");
				return false;
			}
		}
		if (!prod.LoadFromADOConnection(0,GUID_SerGuarderia, Application.Adocnn))
		{
			eBasic.eMsgbox ("No se puede obtener información del servicio");
			return false;
		}
		try{
		
			if(servGuard==null)
			{
				eBasic.eMsgbox("Hola eliminar");
				return;
			}
			/*CobroG = Application.InternalObject("Guarderia");
			eBasic.eMsgbox("Hola eliminar");
			if(CobroG==null){
				eBasic.eMsgbox("No se pudo crear el objeto de cobro de servicio de guarderia",6);
				return;
			}*/
			servGuard.dlgbuscarticket();
			if (!servGuard.dlgbuscarticket())
			{
				eBasic.eMsgbox("Eliminar");
				/*if(servGuard.cval.cAccion==0)
				{
					eBasic.eMsgbox("Ha ocurrido un error :"+servGuard.stLastErrDescription);
					return;
				}
				return;*/
			}
			
			//if (!servGuard.cval.cAccion==3)return;
			
			//eBasic.eMsgbox(servGuard.cval.importe);
		}
		
		catch(e)
		{
			eBasic.eMsgbox("Error: "+e.description);
			return;
		}
		

		vnt=crearventa(i_cconsumo,i_caja,i_divisa, i_cliente, i_agente);
		if (vnt==null) 
		{
			//Error catastrofico
			eBasic.eMsgbox("Ha ocurrido un error en el cobro.\r Por favor vuelva a intentarlo");
			return false;
		}
		info = info + servGuard.cval.serie+servGuard.cval.folio;
		if (NodeVars.EGetSetting(RegAppName, "NodeVars", "FXCT116", "0")!="0")i_frontera=true;
			
		if (!agregarproducto(vnt, prod, servGuard.cval.importe, info, i_frontera))
			return false;

		if (!vnt.Update())
		{
			eBasic.eMsgbox(vnt.lastErrDescrip);
			return false;
		}

		//Cobrar e iniciar Transacción
		DataAccess.BeginTrans();

		mov.AddNew();
		mov.ADOCnn = Application.Adocnn;
		mov.Documento = 6;
		mov.Efectivo = servGuard.cval.pago;//continuar
		mov.ICategoria.LoadFromADOConnection(i_cat_ingreso, "", Application.Adocnn);
		mov.ICorte = LBEfectivo.objCorte;
		mov.IDivisa.LoadFromADOConnection(i_divisa,"",Application.Adocnn);
		mov.Importe = servGuard.cval.importe;//continuar
		mov.Notas = "Servicio de Guarderia de equipaje";
		mov.Referencia = vnt.Referencia;
		mov.TipoCambio = vnt.TipoCambio; 
		
		
		if (!mov.Update())
		{
			DataAccess.RollbackTrans();
			eBasic.eMsgbox(mov.lastErrDescrip);
			return false;
		}

		try
		{
			DataAccess.ADOCnn.Execute("UPDATE Venta Set StatusEntrega=3, StatusAdministrativo = 3,StatusFacturacion = 1, StatusFinanciero = 2,FormaPago = 1,IMovCaja=" + mov.Sys_PK +" Where Sys_PK=" + vnt.Sys_PK);
			
			DataAcces.ADOCnn.Execute("UPDATE ut_servicioGuarderia SET FK_venta = "+ vnt.sys_pk + " fk_folioventa = "+vnt.Ifolio+"  fk_StatusGuarderia = 2 ;"); 
			
			
		}
		catch(e)
		{
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error al actualizar la información de cobro en la venta");
			return false;
		}

		DataAccess.CommitTrans();
		
		if (eBasic.eMsgbox("¿Desea imprimir el comprobante?", 4 + 32) != 7)
		{
			pos_support.ConfigImpresora();
			if (loadScript("prn_ticket","El sub-programa para imprimir el ticket no pudo cargarse"))
			{
				prn_ticket.ImprimirEncabezado();
				
				prn_ticket.ImprimirPrincipal(vnt.Sys_PK,vnt.Referencia);
				
				Impresora.Texto (Impresora.getTextMultiLine(info, 30, 0));
				
				prn_ticket.ImprimirPie();
				
				Impresora.Terminar(); 
			}
		}
		else
		{
			//eBasic.eMsgbox(info);
		}
		
		
		//datosCobro=null;
	
	
	}
	catch(e)
	{
	
	}
	
}
function existe_producto(guid)
{

	var r;
	r=pos_support.OpenRecordset("Select Sys_PK FROM Producto Where Sys_GUID='"+guid+"'",Application.Adocnn);
	if (r==null)
		return false;
	if (r.Fields("Sys_PK").Value>0) return true;
	return false;
}
function actualizar_cat_productos()
{
	var u;
	var linea_sys_pk=0;
	var producto_sys_pk=0;

		u=eBasic.eCreateObject("MaxiComercio_DB_Utils.Functions");
		u.SetConnection(Application.Adocnn);

		linea_sys_pk=u.CrearLinea("RecTAE", "Recarga TAE");

		if (linea_sys_pk>0)
		{
			//Modificar la GUID que asignó el sistema
			try
			{
				Application.Adocnn.Execute("UPDATE Linea SET Sys_GUID='"+GUID_Linea_SA+"' WHERE Sys_PK="+linea_sys_pk);
			}
			catch(e)
			{
			//Solo se ignora el error
			}
		}
		
		producto_sys_pk=u.CrearServicio(u.Obtener_Sys_PK("SELECT Sys_PK FROM Linea WHERE Sys_GUID='"+GUID_Linea_SA+"'"), AppVars.GetNumVar("FXCA013", 0), u.Obtener_Sys_PK("SELECT Sys_PK FROM cfgImpuesto"), "EM_RTA", "RECARGA DE TIEMPO AIRE", 0);

		if (producto_sys_pk>0)
		{
			//Modificar la GUID que asignó el sistema
			try
			{
				Application.Adocnn.Execute("UPDATE Producto SET Sys_GUID='"+GUID_EM_rta+"' WHERE Sys_PK="+producto_sys_pk);
			}
			catch(e)
			{
			//Solo se ignora el error
			}
		}

	return true;
}


function agregarproducto(vnt, prod, importe,nota,Frontera)
{
	var dv = vnt.Detalle.NewElement();
	


	dv.ADOCnn = Application.Adocnn;

	dv.Cantidad = 1;
	dv.Factor = 1;
	
	dv.IAlmacen.SetPrimaryKey(LBEfectivo.objCorte.ICaja.CentroConsumo.IAlmacen.Sys_PK);

	Impuestos.Producto = prod.Sys_PK;
	
	Impuestos.Cliente = vnt.ICliente.Sys_PK;


	dv.Precio = Impuestos.Impuesto(prod.FK_Impuestos, 0, Frontera).AlaVenta.Desglozar(importe);
	


	dv.Impuesto1 = Impuestos.Impuesto(prod.FK_Impuestos, dv.Precio, Frontera).AlaVenta.Impuesto1;
	dv.Impuesto2 = Impuestos.Impuesto(prod.FK_Impuestos, dv.Precio, Frontera).AlaVenta.Impuesto2(true);
	dv.Impuesto3 = Impuestos.Impuesto(prod.FK_Impuestos, dv.Precio, Frontera).AlaVenta.Impuesto3(true);
	dv.Impuesto4 = Impuestos.Impuesto(prod.FK_Impuestos, dv.Precio, Frontera).AlaVenta.Impuesto4(true);


	dv.IProducto.SetPrimaryKey(prod.Sys_PK);
	dv.Notas = nota;

	dv.Status = 2;
	dv.TipoCambio = vnt.TipoCambio;
	dv.Unidad = prod.Unidad;
	dv.XFacturar = 1;
	dv.XSalir = 0;

	vnt.Subtotal=dv.Precio;
	vnt.Impuesto1=dv.Impuesto1;

	return true;

}

function crearventa(i_cconsumo,i_caja,i_divisa,i_cliente,i_agente)
{
	var vnt;
	var folio;
	var serie;
	vnt=eBasic.eCreateObject("EDOFx.Venta");
	
	if (vnt==null)
	{
		eBasic.eMsgbox("Error al crear el objeto Venta");
		return null;
	}
	
	serie=serieactual();
	
	
	folio=gFunciones.NuevoFolio(DataAccess, 6, serie);
	if (folio==null)
	{
		eBasic.eMsgbox("Error al solicitar folio");
		return null;
	}
	
	//
	vnt.AddNew();
    vnt.ADOCnn = Application.Adocnn;
    vnt.FormaPago = 0;
    //vnt.Fecha = datetime.dtDate();
    vnt.Documento = 6;
    vnt.ICConsumo.SetPrimaryKey(i_cconsumo);
    vnt.ICliente.SetPrimaryKey(i_cliente);
    vnt.IDivisa.LoadFromADOConnection( i_divisa,"",Application.Adocnn);
    vnt.TipoCambio = gFunciones.TipoCambio(DataAccess, 1);
    vnt.ICaja.SetPrimaryKey(i_caja);
	vnt.ICorte = LBEfectivo.objCorte;
	if (i_agente>0)
		obj.IAgente.SetPrimaryKey(i_agente);
    vnt.StatusAdministrativo = 1;
    
	DataAccess.BeginTrans();
		if (!gFunciones.FijarFolio(folio))
		{
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error al fijar el folio");
			return null;
		}
		
		vnt.IFolio = folio;
		vnt.Referencia = gFunciones.GenReferencia(folio)
		if(!vnt.Update())
		{
			DataAccess.RollbackTrans();
			eBasic.eMsgbox("Error al hacer persistente el objeto Venta");
			return null;
		}
	DataAccess.CommitTrans();
	return vnt;
	

}

function serieactual()
{
	var pk_serie;
	var r;
	pk_serie=NodeVars.EGetSetting(RegAppName, "NodeVars", "FXCT113", 0);
	r=pos_support.OpenRecordset("Select Serie FROM BlockDocumentos Where Sys_PK="+pk_serie,Application.Adocnn);

	if (r==null) return "";
	return r.Fields("Serie").Value;
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


function ServicioGuarderia()
{

	try
	{
			
			if(servGuard==null){
				eBasic.eMsgbox("No se pudo acceder al objeto de servicio de guardería",6);
				return;
			}
			servGuard.createDriver(documentos_flujo.Acceso);

			servGuard.dlgServicioGuarderia();

			
	
	}
	catch(e)
	{
	
	}
	
}


