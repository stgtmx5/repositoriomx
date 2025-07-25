
//Versión: 0.2.0.2

//var CmdSQLQVentas = "SELECT * FROM qryVentas WHERE Mes=@Mes AND Anio=@Anio;";

var CmdSQLQVentas= "Select qryVentas.*,cStatusFinancieros.Const as DstatusFinanciero, cFormasPago.Const as DFormaPago, cStatusAdministrativos.Const as DstatusAdmin,Agente.Nombre as Agente,Venta.uf_Color FROM (qryVentas Inner JOIN (((Venta INNER JOIN cStatusAdministrativos ON Venta.StatusAdministrativo=cStatusAdministrativos.ID) Inner Join  cFormasPago ON Venta.FormaPago = cFormasPago.ID) Inner JOIN cStatusFinancieros ON  Venta.StatusFinanciero=cStatusFinancieros.ID)  ON qryVentas.Sys_PK=Venta.Sys_PK) LEFT JOIN Agente ON Venta.IAgente=Agente.Sys_PK WHERE Mes=@Mes AND Anio=@Anio ;";


//var CmdSQLQVentasTodos = "SELECT * FROM qryVentas WHERE Anio=@Anio;";
var CmdSQLQVentasTodos="Select qryVentas.*,cStatusFinancieros.Const as DstatusFinanciero, cFormasPago.Const as DFormaPago, cStatusAdministrativos.Const as DstatusAdmin,Agente.Nombre as Agente,Venta.uf_Color FROM (qryVentas Inner JOIN (((Venta INNER JOIN cStatusAdministrativos ON Venta.StatusAdministrativo=cStatusAdministrativos.ID) Inner Join  cFormasPago ON Venta.FormaPago = cFormasPago.ID) Inner JOIN cStatusFinancieros ON  Venta.StatusFinanciero=cStatusFinancieros.ID)  ON qryVentas.Sys_PK=Venta.Sys_PK) LEFT JOIN Agente ON Venta.IAgente=Agente.Sys_PK WHERE Anio=@Anio;";

//var CmdSQLQPromocionesXTipo="SELECT * FROM qryPromociones WHERE Tipo=@TipoPromo;";
var CmdSQLQPromociones="SELECT qryPromociones.*,ut_Color.uf_Color FROM qryPromociones LEFT JOIN ut_Color ON (qryPromociones.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='promocion');";
var CmdSQLQTipoCupon="SELECT qryTipoCupon.*,ut_Color.uf_Color FROM qryTipoCupon LEFT JOIN ut_Color ON (qryTipoCupon.Sys_PK=ut_Color.uf_PK AND ut_Color.uf_Tabla='tipocupon');";
var cntP;


function InitVentas()
{
	try
	{
		
		var qname="";
		if (Application.cAppInfo.Name=="MaxiComercio")
			qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
		else if (Application.cAppInfo.Name=="Deminus")
			qname=Application.CurrCnnInfo.Name+"@Deminus.R5";
		else if (Application.cAppInfo.Name=="ContaBlink")
			qname=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
		else
			qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
		
		if(NetCfdi33==null)
		{
			NetCfdi33=eBasic.eCreateObject("induxsoft.genCFDI.GenCFDI");
		}

		NetCfdi33.AplicationName = Application.cAppInfo.Name;
		NetCfdi33.CnnQName = qname;
		NetCfdi33.PathXsltCadOriCfdi = "cadenaoriginal.xslt";
	}
	catch(e)
	{
		Log(e.message);
	}
}
function CrearPanel(){
	Application.UIShortCuts.CreatePane("P_Ventas","Ventas","","","ICON_VENTAS","",0);
	
	Application.UIShortCuts.Pane("P_Ventas").CreateGroup(2,"P_Ventas_G_01","Ver","","",0);
	Application.UIShortCuts.Pane("P_Ventas").CreateGroup(2,"P_Ventas_G_02","Acciones","","",0);
	
	Application.UIShortCuts.CreateAction("P_Ventas_A01","Explorar documentos",0,"","","","UIVentas.QVentas",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Ventas_A02","Nuevo Pedido",0,"","","","UIVentas.CrearPedido1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A03","Nueva Remisión",0,"","","","UIVentas.CrearRemision1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A04","Nueva Factura",0,"","","","UIVentas.CrearFactura1",0,"","","",0);			
	Application.UIShortCuts.CreateAction("P_Ventas_A05","Nueva Nota de crédito",0,"","","","UIVentas.CrearNotaC1",0,"","","",0);
	
	
	Application.UIShortCuts.CreateAction("P_Ventas_A06","GuardarPedido",0,"","","","UIVentas.GuardarPedido",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A07","AgregarProducto",0,"","","","UIVentas.AgregarProducto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A07_1","Catálogo de Productos",0,"","","","UIVentas.CatalogoProductos",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Ventas_A08","GuardarRemision",0,"","","","UIVentas.GuardarRemision",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A09","DocInsert",0,"","","","UIVentas.DocIncluidos",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Ventas_A10","GuardarFactura",0,"","","","UIVentas.GuardarFactura",0,"","","",0);		
	Application.UIShortCuts.CreateAction("P_Ventas_A11","GuardarNota",0,"","","","UIVentas.GuardarNota",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A12","GuardarVenta",0,"","","","UIVentas.GuardarVenta",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A13","Crear Cotización",0,"","","","UIVentas.CrearCotizacion1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A14","Generar Documento",0,"","","","UIVentas.OpcionesVentas",0,"","","",0);

	//aqui se asigna el evento de la vista previa
	Application.UIShortCuts.CreateAction("crear_cfdi","Crear CFDI",0,"","","","UIVentas.crear_cfdi",0,"","","",0);

	Application.UIShortCuts.CreateAction("P_Ventas_A15","Agregar tipo de cupón",0,"","","","UIVentas.AgregarTipoCupon",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A16","Crear cupón",0,"","","","UIVentas.CrearCupon",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A17","Aplicar cupón de puntos",0,"","","","UIVentas.AplicarCuponPuntos",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_P01","Agregar promoción",0,"","","","UIVentas.AgregarPromocion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_P02","Ver tipos de cupón",0,"","","","UIVentas.QTipoCupon",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Ventas_A18","CancelarDocumento",0,"","","","UIVentas.CancelarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A19","ModificarDocumento",0,"","","","UIVentas.ModificarDocumento",0,"","","",0);
	
	
	Application.UIShortCuts.CreateAction("P_Ventas_A20","CancelarObjVenta_XAccion",0,"","","","UIVentas.CancelarObjVenta_XAccion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A21","InsertarConsignaciones",0,"","","","UIVentas.InsertarConsignaciones",0,"","","",0);	
	
	Application.UIShortCuts.CreateAction("P_Ventas_A22","Guardar y cerrar",0,"","","","UIVentas.GuardarCerrar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A23","Nuevo documento en blanco",0,"","","","UIVentas.Nuevo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A24","Nuevo igual a éste",0,"","","","UIVentas.CopiarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Ventas_A25","Recalcular precios",0,"","","","UIVentas.RecalcularPrecios",0,"","","",0);
	
	//jv - Productos similares - 27/11/2013
	Application.UIShortCuts.CreateAction("P_Ventas_N01","Productos similares",0,"","","","UIVentas.BuscarSimilares",0,"","","",0);
	Application.UIShortCuts.CreateAction("_P_Ventas_N01","Vista Previa CFDI",0,"","","","UIVentas.VistaPreviaCFDI",0,"","","",0);
	
	//Agregar Accion al grupo de  panel
	Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A13");
	Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_01").AddItem("P_Ventas_A01");
    Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A02");
	Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A03");
	Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A04");
	Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A05");
	//Application.UIShortCuts.Pane("P_Ventas").Group("P_Ventas_G_02").AddItem("P_Ventas_A14");
	
	cntP=1;
}

function QVentas(){
var Brw;
var Fecha;

Brw=null;

Brw=Application.Browsers.GetBrowser("qVentas");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-20-30-001"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qVentas");
		Brw.Caption="Ventas";
		Brw.sqlCommand.CmdType=1;				
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));				
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=CmdSQLQVentas;	
		Brw.CmdAfterRetriveFields="UIVentas.RedimensionarColumnas";
		
		Brw.CmdAddNew="UIVentas.OpcionesVentas"; 
		Brw.CmdEdit="UIVentas.EditarVenta";
		Brw.CmdRowChanged = "UIVentas.TituloVenta";
		Brw.CmdDelete = "UIVentas.CancelarDocumento";
		 Brw.CmdDblClick=Brw.CmdEdit;

		AsignarCarpetaRepotes(Brw);
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Nueva Cotización","P_Ventas_A13");
		Brw.AddButton("Nuevo Pedido","P_Ventas_A02");
		Brw.AddButton("Nueva Remisión","P_Ventas_A03");
		Brw.AddButton("Nueva Factura","P_Ventas_A04");
		Brw.AddButton("Nueva Nota de crédito","P_Ventas_A05");
		//if(gFunciones.CFDActivo()){
			var txtDoc="CFD";
			try{ txtDoc=cfd.textTipoComprobanteConfigurado()}catch(ex){txtDoc="CFD";}
			Brw.AddButton("Crear "+txtDoc,"CFD_A08"); //CFD 2010
		//}
		Brw.AddButton("Cancelar","P_Ventas_A18");
		Brw.AddButton("Generar Documento","P_Ventas_A14");
		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="UIVentas.ConfigurarConsulta";
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
		
		
		
		
		Brw.HideFields("Sys_PK;Mes;Anio;ID;ICliente;CodigoCliente;TipoDocumento;StatusFinanciero;StatusFacturacion;StatusEntrega;StatusAdministrativo;Estado;uf_Color");
		//Brw.AutoAdjust();		
		
		//Funcionalidad del Panel de detalle -> By  JFrank : 14/Sept/09
		Brw.DetailFunction="UIVentas.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="Venta";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="Venta";		
	}
	else
		Brw.Zorder();
		
TituloVenta(Brw.PrimaryKeyValue);
}


function Detail(){

	var r=null;
	var p;
	try
	{
	
		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de la Venta: " + GetReferencia(p.CurrentValue));
		r=Application.Database.OpenRecordset("Select DVenta.Sys_PK,Producto.Descripcion as Producto,DVenta.Cantidad,DVenta.Unidad,DVenta.Precio*DVenta.Cantidad as Subtotal,DVenta.Descuento1+DVenta.Descuento2 as Descuentos, DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Impuestos,(DVenta.Precio*DVenta.Cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4 as Total FRom DVenta INNER JOIN Producto ON DVenta.IProducto=Producto.Sys_PK  Where Dventa.FK_Venta_Detalle="+p.CurrentValue,Application.adoCnn);
		
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

function GetReferencia(PK){

	var r=null;
	var s;
	try
	{
		r=Application.Database.OpenRecordset("SELECT Referencia FROM Venta WHERE Sys_PK="+PK,Application.adoCnn);
		if (!(r.EOF && r.BOF))
			s=r.Fields("Referencia").Value;
		else
			s="No se encontró la venta";
		r.Close();
		return s;
	}
	catch(e)
	{
		return "Error al buscar la venta";
	}
}

function ConfigurarConsulta(Tab){	
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("qVentas");
	if (Brw!=null){
		if (Tab==0) //Todos los meses
			Brw.sqlCommand.CmdSQL=CmdSQLQVentasTodos;
		else //por mes
			Brw.sqlCommand.CmdSQL=CmdSQLQVentas;
	}else{
		Log("Error al asignar consulta");
	}	
}

function RedimensionarColumnas(){
	var Brw;
	Brw=null;
	
	Brw=Application.Browsers.GetBrowser("qVentas");	
	if (Brw!=null){				
		Brw.SetColumnWidth("Documento",90);
		Brw.SetColumnWidth("Referencia",100);
		Brw.SetColumnWidth("Fecha",70);
		Brw.SetColumnWidth("Nombre",190);
		Brw.SetColumnWidth("Vencimiento",70);
		Brw.SetColumnWidth("Divisa",60);
		Brw.SetColumnWidth("TipoCambio",85);
		Brw.SetColumnWidth("Total",100);		
		
		Brw.SetColumnWidth("DstatusFinanciero",100);
		Brw.SetColumnWidth("DFormaPago",100);
		Brw.SetColumnWidth("DstatusAdmin",115);
		Brw.SetColumnWidth("Agente",200);
		
		Brw.SetCaptionByFieldName("TipoCambio","Tipo de cambio");
		Brw.SetCaptionByFieldName("Nombre","Cliente");
		
		Brw.SetCaptionByFieldName("DstatusFinanciero","Estado Financiero");
		Brw.SetCaptionByFieldName("DFormaPago","Forma de Pago");
		Brw.SetCaptionByFieldName("DstatusAdmin","Estado Administrativo");
		
		try{
			Brw.SetColumnFormat("Total",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());				
		}catch(e){}
	}

Brw.SetTitle(" ");
TituloVenta(Brw.PrimaryKeyValue);
}

function TituloVenta(SysPK){
var ThisObj;
var OtherObj;
var Brw;
Brw=null;
if (SysPK==null) return 0;
	
	ThisObj = Application.NewObject("EDOFx.M_Venta");
	if (ThisObj.LoadFromADOConnection (SysPK,"", Application.adoCnn)){
			
		if (ThisObj.FK_AplicadoA!=0 && ThisObj.FK_AplicadoA!=null){
			//Existe una relacion
			OtherObj = Application.NewObject("EDOFx.M_Venta");			
			if (!OtherObj.LoadFromADOConnection(ThisObj.FK_AplicadoA,"",Application.adoCnn)){
				//Imprimir Error en Log
				Log(OtherObj.lastErrDescrip);
				return 0;
			}				
		}else
			OtherObj=null;
		
			//Si el documento es factura o remision cargar un objeto compra.		
		if (ThisObj.Documento==3 || ThisObj.Documento==4 || ThisObj.Documento==2){			
			ThisObj.Dispose();
			ThisObj=null;
			ThisObj = Application.NewObject("EDOFx.Venta");
			if (!ThisObj.LoadFromADOConnection (SysPK,"", Application.adoCnn)){
				Log(ThisObj.lastErrDescrip);
				return 0;				
			}
		}
		
		
		//Se llaman las mismas funciones que en compras.
		Brw=Application.Browsers.GetBrowser("qVentas");
			
		if (Brw!=null){					
			switch (ThisObj.Documento){
				case 1: 
					UICompras.TituloCotizacion(OtherObj,Brw);break;
				case 2: 
					UICompras.TituloPedido(ThisObj,OtherObj,Brw);break;
				case 3: 
					UICompras.TituloRemision(ThisObj,OtherObj,Brw);break;
				case 4: 
					UICompras.TituloFactura(ThisObj,OtherObj,Brw);break;
				case 5:
					Brw.SetTitle("Nota de crédito procesada");break;
			}
		}else
			Log("Error al obtener el estado actual del documento.");
	}else
		Log(ThisObj.lastErrDescrip);

}

// ANTES GuardarVenta
function GuardarVenta(objAction){
var ThisObj;
var Resultado;

ThisObj = objAction.Context.ActiveWindow.GetAxObject();	

	//evento
	var res;
	try{
		res=Eventos.EvAntesVenta(ThisObj.ThisObj);
	}catch(e){			
		res=true;
	}
	if(!res)
		return 0;
	//fin evento

switch(ThisObj.GetCurrentDocument())
	{
		case 1: 
			//"Cotización"
			Resultado=GuardarCotizacion(objAction);			
			break;
		case 2:
			//"Pedido"		
			Resultado=GuardarPedido(objAction);
			break;
		case 3:
			//"Remisión"	
			Resultado=GuardarRemision(objAction);
			break;
		case 4:
			//"Factura"
			Resultado=GuardarFactura(objAction);
			break;
		case 5:
		//"Nota de crédito"
			Resultado=GuardarNota(objAction);
			break;
	}
	
	if(Resultado==-1){
		//evento
		try{
			Eventos.EvDespuesVenta(ThisObj.ThisObj);
		}catch(e){			
		}
		//fin evento		
		ActualizarQVentas();
	}
	
	return Resultado;	
}

// ANTES GuardarCerrar
function GuardarCerrar(objAction){
	var r;
	var Ax;
	var dlg;
	var documento=0;
	r=GuardarVenta(objAction);	
	try{
		if(!r){
			return 0;
		}		
		//if (
		eBasic.eMsgbox("Documento creado con éxito");//, 4)==7){
		objAction.Context.ActiveWindow.UnloadMe();
		return 0;
		//}		
	/*	dlg=objAction.Context.ActiveWindow;
		dlg.Zorder();
		dlg.DelParent();
		Ax=objAction.Context.ActiveWindow.GetAxObject();	
		documento=Ax.ThisObj.Documento;
		Ax.PredDivisa = FXConfig.DivisaPredeterminada();			
		Ax.CConsumoPredet = FXConfig.CConsumoPredeterminado();
		Ax.NewDocument();
		
		
		switch(documento){
			case 1: //Cotización
				dlg.Caption="Cotización";
				dlg.GetButtonByIDAction("P_Ventas_A12").Caption="Guardar (F6)";			
				dlg.GetButtonByIDAction("P_Ventas_A22").Enabled=true;
				dlg.GetButtonByIDAction("P_Ventas_A07").Enabled=true;
				dlg.GetButtonByIDAction("P_Ventas_A07_1").Enabled=true;
				
				//jv - Productos similares - 27/11/2013
				dlg.GetButtonByIDAction("P_Ventas_N01").Enabled=true;
				break;
			case 2:
				dlg.ClearButtonsBar();
				dlg.Caption="Pedido";			
				dlg.AddButton("Guardar (F6)","P_Ventas_A12");			
				dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");				
				dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");
				dlg.AddButton("Catálogo de Productos","P_Ventas_A07_1");
				dlg.AddButton("Recalcular precios","P_Ventas_A25");
				
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares","P_Ventas_N01");		
				break;
			case 3:
				dlg.ClearButtonsBar();
				dlg.Caption="Remisión";				
				dlg.AddButton("Guardar (F6)","P_Ventas_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
				dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
				dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
				dlg.AddButton("Documentos Incluidos","P_Ventas_A09");
				dlg.AddButton("Recalcular precios","P_Ventas_A25");
				
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares","P_Ventas_N01");		
				break;
			case 4:
				dlg.ClearButtonsBar();
				dlg.Caption="Factura";				
				dlg.AddButton("Guardar (F6)","P_Ventas_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
				dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
				dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
				dlg.AddButton("Documentos Incluidos","P_Ventas_A09");	
				dlg.AddButton("Incluir Consignaciones","P_Ventas_A21");
				dlg.AddButton("Recalcular precios","P_Ventas_A25");
				
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares","P_Ventas_N01");		
				break;
			case 5:
				dlg.ClearButtonsBar();
				dlg.Caption="Nota de crédito";
				dlg.AddButton("Guardar (F6)","P_Ventas_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
				dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
				dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
				break;
		}*/
		return -1;
	}catch(e){
		Log("Ocurrió un error al cerrar");
		throw(e);
		return 0;
	}
}

function ActualizarQVentas(){
	var Brw;
	Brw=null;
	Brw=Application.Browsers.GetBrowser("qVentas");
	if (Brw!=null)
		Brw.RefreshRst();
}

function CrearCotizacion1(objAction){
		CrearCotizacion(0);
}

function CrearPedido1(objAction){
	//eBasic.eMsgbox(objAction.Context.ActiveWindow.MyName);
		CrearPedido(null,0);
} 

function CrearRemision1(objAction){
	
	if (objAction.Context.ActiveWindow==null || objAction.Context.ActiveWindow.FormType==2)
		CrearRemision(null,0);
	else
		CrearRemision(objAction.Context.ActiveWindow.GetAxObject().ThisObj,0,objAction.Context.ActiveWindow);
}



function AgregarProducto(objAction){
	//Pemirte Explorar los productos existentes
	if (objAction.Context.ActiveWindow!=null){		
		if (objAction.Context.ActiveWindow.GetAxObject().CurrentAction==3) return 0;					
		objAction.Context.ActiveWindow.GetAxObject().FindNewElement();
		
			
	}
}

function CatalogoProductos(objAction){
	//Pemirte Explorar los productos existentes
	if (objAction.Context.ActiveWindow!=null){
		if (objAction.Context.ActiveWindow.GetAxObject().CurrentAction==3) return 0;
			objAction.Context.ActiveWindow.GetAxObject().BrwProductos();
	}
}


function DocIncluidos(objAction){
	if (objAction.Context.ActiveWindow!=null)
		if (objAction.Context.ActiveWindow.GetAxObject().CurrentAction==3) return 0;
		objAction.Context.ActiveWindow.GetAxObject().InsertarDocumentos();
}

function InsertarConsignaciones(objAction){
 var tmp;
 var ThisObj;
	if (objAction.Context.ActiveWindow!=null){
		ThisObj=objAction.Context.ActiveWindow.GetAxObject();
		if (ThisObj.CurrentAction==3) return 0;
		tmp=null;
		ThisObj.GetData();
		
		if(ThisObj.ThisObj.ICliente.Sys_PK<1){
			eBasic.eMsgbox("Por favor seleccione un cliente.",6);
			return;
		}
		
		tmp = Venta.InsertarConsignaciones(ThisObj.ThisObj);
		if (tmp!=null){
			objAction.Context.ActiveWindow.GetAxObject().EditByObject(tmp);
			objAction.Context.ActiveWindow.GetAxObject().SetColConsignaciones(Venta.Consignaciones);
			Venta.DisposeConsignaciones();
		}
	}
 }

function CrearFactura1(objAction){
	if (objAction.Context.ActiveWindow==null || objAction.Context.ActiveWindow.FormType==2)
		CrearFactura(null,0,null);
	else
		CrearFactura(objAction.Context.ActiveWindow.GetAxObject().ThisObj,0,null,objAction.Context.ActiveWindow);
}

function CrearNotaC1(objAction){
	if (objAction.Context.ActiveWindow==null || objAction.Context.ActiveWindow.FormType==2)
		CrearNotaC(null);
	else
		CrearNotaC(objAction.Context.ActiveWindow.GetAxObject().ThisObj);
}

function EditarVenta(PK){
var dlg;
var ThisObj;
var ObjVenta;

var TipoDoc;

//if (Application.AXForms.AXForm("EditVenta" + cntP)!=null)
	//cntP++;	
	Application.MouseHourglass();
	dlg=Application.AXForms.AXForm("EditVenta_PK" + PK);
	if (dlg!=null){
		dlg.Zorder();
		Application.MouseDefault();
		return 0;
	}
	
	
	if (PK > 0){
		ObjVenta = Application.NewObject("EDOFx.Venta");
		if (!ObjVenta.LoadFromADOConnection (PK,"",Application.adoCnn)){
			Log(ObjVenta.lastErrDescrip);
			Application.MouseDefault();
			return 0;
		}			
	}else{
		Log("Falta la clave del documento");
		Application.MouseDefault();
		return 0;
	}	
	
	//dlg=Application.AXForms.CreateForm("FormVenta","EditVenta" + cntP);
	dlg=Application.AXForms.CreateForm("FormVenta","EditVenta_PK" + PK);
	
	dlg.Hide();
	Application.eDoEvents();
	switch(ObjVenta.Documento){
		case 1:
		dlg.Caption = "Cotización: " + ObjVenta.Referencia;break;
		case 2:
		dlg.Caption = "Pedido: " + ObjVenta.Referencia;break;
		case 3:
		dlg.Caption = "Remisión: " + ObjVenta.Referencia;break;
		case 4:
		dlg.Caption = "Factura: " + ObjVenta.Referencia;break;
		case 5:
		dlg.Caption = "Nota de crédito: " + ObjVenta.Referencia;break;
	}
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";
	AsignarCarpetaRepotes(dlg);
	
	//Asignar a ThisObj, el control venta creado
	ThisObj = dlg.GetAXObject();
	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	//Inicializar venta
	// Metodo de Calculo 
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
				
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();			
	ThisObj.CConsumoPredet = FXConfig.CConsumoPredeterminado();
	
		switch (ObjVenta.Documento){
			case 3: 
			case 4: 
			case 5: 
				dlg.AddButton("Nuevo documento en blanco","P_Ventas_A23");
				dlg.AddButton("Nuevo igual a éste","P_Ventas_A24");
				dlg.AddButton("Modificar Documento","P_Ventas_A19");	
				//aqui se asigna el titulo del btn
				var r=null;
				var SQL="SELECT * FROM ut_cfd u where u.uf_IVenta="+PK;
				var isTimbrado=false;
				try
				{
					r=Application.Database.OpenRecordset(SQL);
					if(!(r.EOF && r.BOF))
					{
						isTimbrado=true;
						r.Close();
					}
				}catch(e){Log(e.message);}

				if((ObjVenta.Documento==4 || ObjVenta.Documento==5) && !isTimbrado){dlg.AddButton("Crear CFDI","crear_cfdi");}
								
				if ((ObjVenta.Documento==4 && ObjVenta.StatusAdministrativo!=99) || (ObjVenta.Documento==3 && ObjVenta.StatusFacturacion==1 && ObjVenta.StatusAdministrativo!=99)){
						dlg.AddButton("Cancelar Documento","P_Ventas_A20");				
				}
				ThisObj.ViewByObject(ObjVenta);
				dlg.Title = ThisObj.GetEstadoVenta();
				//TituloVenta(ObjVenta.Sys_PK);
				break;
			default:
				ThisObj.SetOwnerForm(Application.MainForm);				
				
				if(ObjVenta.StatusAdministrativo!=99 && ObjVenta.AplicadoA.Sys_PK==0){
					dlg.AddButton("Guardar (F6)","P_Ventas_A12");
					dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
					dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");
					dlg.AddButton("Catálogo de Productos","P_Ventas_A07_1");
					dlg.AddButton("Recalcular precios","P_Ventas_A25");
					
					//jv Productos similares - 27/11/2013
					dlg.AddButton("Productos similares","P_Ventas_N01");
					
					dlg.CmdKeyDown="UIVentas.Command_KeyDown";	
					ThisObj.EditByObject(ObjVenta);										
				}else{
					dlg.AddButton("Nuevo documento en blanco","P_Ventas_A23");
					dlg.AddButton("Nuevo igual a éste","P_Ventas_A24");
					dlg.AddButton("Modificar Documento","P_Ventas_A19");
					ThisObj.ViewByObject(ObjVenta);
					dlg.Title = ThisObj.GetEstadoVenta();
				}							
				break;
		}

	dlg.ShowButtons();
	dlg.Show();	
	Application.MouseDefault();
	return -1;
}

function CrearCotizacion(PKCliente){
var dlg;
var thisObj;

	if (Application.AXForms.AXForm("DlgCotiza" + cntP)!=null)
		cntP++;
	
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormVenta","DlgCotiza" + cntP);
	dlg.CmdProxyEvent="UIVentas.CapturarEvento"; //eventos del AXventa			
	dlg.Caption="Cotización";
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";
	dlg.CmdKeyDown="UIVentas.Command_KeyDown";
	
	AsignarCarpetaRepotes(dlg);
	//Asignar a ThisObj el contrlo de venta creado
	ThisObj = dlg.GetAXObject();
	//Inicializar Venta	
	FXConfig.FormatoAXCompraVenta(ThisObj);
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	//'Indicar que es un nuevo documento de Venta
	ThisObj.AddNew();
	//Indicar documento a crear
	ThisObj.SetTipoDocumento(1);
	ThisObj.SetCliente(PKCliente);
	//Divisa Predeterminada
	ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
	//Centro de Consumo Predetermidado
	ThisObj.CConsumoPredet=FXConfig.CConsumoPredeterminado();
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.Frontera=FXConfig.UtilizarImpuestoFrontera();
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Ventas_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");
	dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
	
	//jv - Productos similares - 27/11/2013
	dlg.AddButton("Productos similares","P_Ventas_N01");
	
	dlg.ShowButtons();	
	dlg.ZOrder();	
	Application.MouseDefault();
	
			//Devuelve el Objeto venta
    
	return  ThisObj.ThisObj;
}

function CrearPedido(Cotizacion,PKCliente){
var dlg;
var ThisObj;
var Pedido;

if (Cotizacion!=null){	
	if(EnProceso("IDVenta"+"_"+Cotizacion.Referencia)==0)
		return 0;
}


	if (Application.AXForms.AXForm("DlgPedidoVnt" + cntP)!=null)
		cntP++;
		
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormVenta","DlgPedidoVnt" + cntP);
	dlg.CmdProxyEvent="UIVentas.CapturarEvento"; //eventos del AXventa			
	dlg.Caption = "Pedido";
	dlg.TagData="IDVenta";	
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";
	dlg.CmdKeyDown="UIVentas.Command_KeyDown";
	AsignarCarpetaRepotes(dlg);
	//Asignar a ThisObj, el control venta creado
	ThisObj = dlg.GetAXObject();
	//Inicializar Venta	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos, Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	//Si el pedido proviene de una remision, Asignar a Parent
	if (Cotizacion!=null){
		dlg.TagData="IDVenta"+"_"+Cotizacion.Referencia;
		ThisObj.SetParentVenta(Cotizacion);		 
	     // 'Generar Remision de Pedido
	    Pedido = LBVenta.GenerarDocVenta(Cotizacion, 2); //Remision
	    ThisObj.EditByObject(Pedido);
	}else{    
		//'Indicar que es un nuevo documento de Venta
		ThisObj.AddNew();
		//Indicar documento a crear	
		ThisObj.SetTipoDocumento(2);
		ThisObj.SetCliente(PKCliente);
		//Divisa Predeterminada
		ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
		//Centro de Consumo Predetermidado
		ThisObj.CConsumoPredet=FXConfig.CConsumoPredeterminado();
    }
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.Frontera=FXConfig.UtilizarImpuestoFrontera();
	ThisObj.SetOwnerForm(Application.MainForm);	
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Ventas_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");
	dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
	dlg.AddButton("Recalcular precios","P_Ventas_A25");
	
	//jv - Productos similares - 27/11/2013
	dlg.AddButton("Productos similares","P_Ventas_N01");
		
	dlg.ShowButtons();					
	dlg.ZOrder();
	Application.MouseDefault();	
	
	return  ThisObj.ThisObj;

}

function GuardarPedido(objAction){
var ThisObj;
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();	
	
	Application.MouseHourglass();
	if (ThisObj.CurrentAction!=3){
		if (ThisObj.Save()){
			ThisObj.ViewByObject(ThisObj.ThisObj);
			Application.MouseHourglass();	
			objAction.Context.ActiveWindow.Caption="Pedido " +ThisObj.ThisObj.Referencia;			
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A12").Caption="Modificar Pedido";			
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A25").Enabled=false;
			
			//jv - Productos similares - 27/11/2013
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=false;
			
			if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A03")==null)
				objAction.Context.ActiveWindow.AddButton("Generar Remisión","P_Ventas_A03");
			else
				objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A03").Enabled=true;
				
			if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A04")==null)
				objAction.Context.ActiveWindow.AddButton("Generar Factura","P_Ventas_A04");
			else
				objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A04").Enabled=true
						
			if(eBasic.eMsgbox("El Pedido se guardó correctamente.¿Desea imprimir el documento?",4)==6){
				ImprimirDocumento(objAction.Context.ActiveWindow);
			}			
			Application.MouseDefault();			
			return -1;
		}else{
			if(ThisObj.LastErrDescrip!="")
				eBasic.eMsgbox(ThisObj.LastErrDescrip,6);
			else
				Log("Error al guardar pedido.");
				
			Application.MouseDefault();			
			return 0;
		}
	}else{	
		//Revisar que no se esté realizando otro documento que incluya el pedido.		
		if(EnProceso("IDVenta"+"_"+ThisObj.ThisObj.Referencia)==0){
			Application.MouseDefault();
			return 0;
		}
		ThisObj.EditByObject(ThisObj.ThisObj);
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A12").Caption="Guardar (F6)";			
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=true;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=true;		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=true;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A25").Enabled=true;
		
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=true;
		
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A03")!=null) //Botón generar remisión
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A03").Enabled=false;
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A04")!=null) //Botón generar factura
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A04").Enabled=false;
		
		Application.MouseDefault();	
		return 0;
	}
	Application.MouseDefault();		
			
}

function CrearRemision(Pedido,PKCliente,ParentWindow){
var dlg;
var ThisObj;
var Remision;

if (Pedido!=null){	
	if(EnProceso("IDVenta"+"_"+Pedido.Referencia)==0)
		return 0;
}

	if (Application.AXForms.AXForm("DlgRemisionVnt" + cntP)!=null)
		cntP++;
	
	Application.MouseHourglass();
	dlg = Application.AXForms.CreateForm("FormVenta","DlgRemisionVnt" + cntP);	
	dlg.CmdProxyEvent="UIVentas.CapturarEvento"; //eventos del AXventa		
	dlg.Caption = "Remisión";
	dlg.TagData="IDVenta";
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";
	dlg.CmdKeyDown="UIVentas.Command_KeyDown";	
	AsignarCarpetaRepotes(dlg);
	
	ThisObj = dlg.GetAXObject();
	//Inicializar compra
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects (Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos,Application.UIUsers);
    ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	// 'Proviene de un pedido
    if (Pedido!=null){
			dlg.TagData="IDVenta"+"_"+Pedido.Referencia;
			if(ParentWindow!=null)
				dlg.SetParent(ParentWindow);
			
			ThisObj.SetParentVenta(Pedido);
			// 'Generar Remision de Pedido
	        Remision = Venta.lgVenta.GenerarDocVenta(Pedido,3); //Remision
			if (Remision==null){
				Application.MouseDefault();
				Log("Error no se pudo crear la remisión.");
				return 0;
			}
			ThisObj.EditByObject(Remision);
			
	}else{   
			ThisObj.AddNew();
            ThisObj.SetTipoDocumento (3);  //Remision
			ThisObj.SetCliente(PKCliente);
			ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
			//Centro de Consumo Predetermidado
			ThisObj.CConsumoPredet = FXConfig.CConsumoPredeterminado();
	}
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.Frontera=FXConfig.UtilizarImpuestoFrontera();
	ThisObj.SetOwnerForm(Application.MainForm);	
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Ventas_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
	dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
	dlg.AddButton("Documentos Incluidos","P_Ventas_A09");		
	dlg.AddButton("Recalcular precios","P_Ventas_A25");
	
	//jv - Productos similares - 27/11/2013
	dlg.AddButton("Productos similares","P_Ventas_N01");
	
	dlg.ShowButtons();
	dlg.ZOrder();	
	Application.MouseDefault();
	return  ThisObj.ThisObj;
}

function GuardarCotizacion(objAction){
var ThisObj;
			
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();
	Application.MouseHourglass();
	if (ThisObj.CurrentAction!=3){
		if (ThisObj.Save()){			
			ThisObj.ViewByObject(ThisObj.ThisObj);
			objAction.Context.ActiveWindow.Caption="Cotización " +ThisObj.ThisObj.Referencia;	
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A12").Caption="Modificar Cotización";			
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=false;
			
			//jv - Productos similares - 27/11/2013
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=false;
			//objAction.Context.ActiveWindow.GetButtonByIDAction("_P_Ventas_N01").Enabled=false;
			
			Application.MouseDefault();
			if(eBasic.eMsgbox("La Cotización se guardó correctamente.¿Desea imprimir el documento?",4)==6){
				ImprimirDocumento(objAction.Context.ActiveWindow);
			}	
			return -1;
		}else{
			Log(ThisObj.LastErrDescrip);
			Application.MouseDefault();	
			return 0;
		}
	}else{
		ThisObj.EditByObject(ThisObj.ThisObj);		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A12").Caption="Guardar (F6)";			
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=true;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=true;				
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=true;
		
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=true;
		//objAction.Context.ActiveWindow.GetButtonByIDAction("_P_Ventas_N01").Enabled=true;
		Application.MouseDefault();	
		return 0;
	}
}




function GuardarRemision(objAction){
var ThisObj;
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();
	if (!ThisObj.Validate()) return 0;
	ThisObj.GetData();
	if (!ThisObj.OmitirExistencia)
		//Analizar Venta
	    if (!Venta.lgVenta.AnalizarVenta(ThisObj.ThisObj)){
	        eBasic.eMsgbox(Venta.lgVenta.LastErrorDescrip,6);
	        return 0;
	    }
	
	//Mostrar dialogo de cobro, --> Enviar  Categoria Predeterminada
	if (Venta.ShowDlgFormaPago(ThisObj.ThisObj,0,ThisObj.OmitirExistencia,ThisObj.ParentVenta,true,ThisObj.ColDocVentas)){		
		Application.eDoEvents();
		ThisObj.ViewByObject(ThisObj.ThisObj); 		
		Application.MouseHourglass();	
		//Cambiar la acción del boton guardar por modificar
		objAction.Context.ActiveWindow.SetActionToButton("P_Ventas_A12","P_Ventas_A19","Modificar Remisión");		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A09").Enabled=false; //Documentos incluidos		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A25").Enabled=false; //Documentos incluidos		
		
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=false; //Productos similares	
		//objAction.Context.ActiveWindow.GetButtonByIDAction("_P_Ventas_N01").Enabled=false;
		
		objAction.Context.ActiveWindow.AddButton("Cancelar Remisión","P_Ventas_A20");		
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A04")==null)
				objAction.Context.ActiveWindow.AddButton("Generar Factura","P_Ventas_A04");		
		//Cambiar titulo de ventana
		objAction.Context.ActiveWindow.Caption="Remisión "+ThisObj.ThisObj.Referencia;
		DesactivarAccionesProcesadas(objAction.Context.ActiveWindow.Parent);
		Application.MouseDefault();
		if(eBasic.eMsgbox("La Remisión se guardó correctamente.¿Desea imprimir el documento?",4)==6){
			ImprimirDocumento(objAction.Context.ActiveWindow);
		}		
		return -1;
	}else{
		if(Venta.LastErrorDescrip!="")
			eBasic.eMsgbox(Venta.LastErrorDescrip,6);
		else
			Log("Error al guardar Remisión");
			
		return 0;
	}
	
}

function CrearFactura(Remision,PKCliente,ObjFactura,ParentWindow){
var dlg;
var ThisObj;
var Factura;

if (Remision!=null){	
	if(EnProceso("IDVenta"+"_"+Remision.Referencia)==0)
		return 0;
}

//Recibe un objeto Remision o Pedido
if (Application.AXForms.AXForm("DlgFacturaVnt" + cntP)!=null)
		cntP++;
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormVenta","DlgFacturaVnt" + cntP);		
	dlg.CmdProxyEvent="UIVentas.CapturarEvento"; //eventos del AXventa		
	
	dlg.Caption = "Factura";
	dlg.TagData="IDVenta"; //identificador del tipo de documento
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";		
	dlg.CmdKeyDown="UIVentas.Command_KeyDown";
	
	AsignarCarpetaRepotes(dlg);
	
		//Asignar a ThisObj, el control Compra creado
	ThisObj = dlg.GetAXObject();
	//Inicializar venta
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos,Application.UIUsers);		
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	//Proviende de Remision
	if (Remision!=null){			
		dlg.TagData="IDVenta"+"_"+Remision.Referencia;
		if(ParentWindow!=null)
			dlg.SetParent(ParentWindow);
		ThisObj.SetParentVenta(Remision);		
		//Generar Factura
		Factura= ObjFactura;
		if (Factura==null)			
			Factura = Venta.lgVenta.GenerarDocVenta(Remision, 4); //cFactura		
        ThisObj.EditByObject(Factura);		
	}else{
		ThisObj.AddNew();
        ThisObj.SetTipoDocumento (4);  //Factura
		ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
		ThisObj.SetCliente(PKCliente);
		//Centro de Consumo Predetermidado
		ThisObj.CConsumoPredet=FXConfig.CConsumoPredeterminado();
	}
		
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.Frontera=FXConfig.UtilizarImpuestoFrontera();
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Ventas_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
	dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
	dlg.AddButton("Documentos Incluidos","P_Ventas_A09");	
	dlg.AddButton("Incluir Consignaciones","P_Ventas_A21");
	dlg.AddButton("Recalcular precios","P_Ventas_A25");
	
	//jv - Productos similares - 27/11/2013
	dlg.AddButton("Productos similares","P_Ventas_N01");
	dlg.AddButton("Totales CFDI","_P_Ventas_N01");
	dlg.ShowButtons();
	dlg.ZOrder();
	Application.MouseDefault();
}

function GuardarFactura(objAction){
var ThisObj;
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();
	if (!ThisObj.Validate()){
		Log("No se cumplieron las condiciones requeridas");
		return 0;
	}
	
	ThisObj.GetData();	
	if (!ThisObj.OmitirExistencia)
		//Analizar venta
	    if (!Venta.lgVenta.AnalizarVenta(ThisObj.ThisObj)){
	        eBasic.eMsgbox (Venta.lgVenta.LastErrorDescrip,6);
	        return 0;
	    }		
	
	if (Venta.ShowDlgFormaPago(ThisObj.ThisObj,0,ThisObj.OmitirExistencia,ThisObj.ParentVenta,true,ThisObj.ColDocVentas,ThisObj.ColConsignaciones)){        		   
		Application.eDoEvents();		
		ThisObj.ViewByObject(ThisObj.ThisObj); 
		Application.MouseHourglass();	
		objAction.Context.ActiveWindow.SetActionToButton("P_Ventas_A12","P_Ventas_A19","Modificar Factura");		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A09").Enabled=false; //Documentos incluidos
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A21").Enabled=false; //Incluid docs Consignados
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A25").Enabled=false; //Incluid docs Consignados
		
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_N01").Enabled=false; //Productos similares
		
		objAction.Context.ActiveWindow.AddButton("Cancelar Factura","P_Ventas_A20");				
		//Cambiar titulo de ventana
		objAction.Context.ActiveWindow.Caption="Factura "+ThisObj.ThisObj.Referencia;
		objAction.Context.ActiveWindow.TagData="IDVenta";

		DesactivarAccionesProcesadas(objAction.Context.ActiveWindow.Parent);
		
		//CREAR POLIZA
		Poliza.PolizaVentaFacturacion(ThisObj.ThisObj);
		Application.MouseDefault();
		
			if(parseInt(ThisObj.GetIstimbrado("maxicomercio"))==0){				
				return -1;
			}	
		if(parseInt(Configuracion.eApplicationVars.GetGlobalvar.GetNumVar("FXCA300xa",1))==5)//tipo comprobante a generar
		{
			//Código anterior
			if(eBasic.eMsgbox("La Factura se guardó correctamente.¿Desea imprimir el documento?",4)==6){
				ImprimirDocumento(objAction.Context.ActiveWindow);
			}
		}else{
			//if(gFunciones.CFDActivo()){  //CFD 2010						
				try{
					cfd.despuesGuardarVenta(ThisObj.ThisObj.Sys_PK,"La Factura se guardó correctamente.¿Desea crear el Comprobante Fiscal Digital?");
				}catch(e){
					Log("Error al ejecutar proceso: generación de CFD.");
					throw(e);
				}
			//}
		}
		
		if(ThisObj.ThisObj.FormaPago==3){//financiado
			if(eBasic.eMsgbox("¿Desea imprimir los pagarés creados por financiamiento?",4)==6){			
				if(CuentasXCobrar.Blogic.Resultado(Venta.lgVenta.GUICxC.Blogic.ResultadoLGCXC,0)!=1){ //si no es financiar documento
					eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
					return 0;
				}			
				var Pagares;			
				Pagares=UICxC.CrearListaPagares(Venta.lgVenta.GUICxC.Blogic.ResultadoLGCXC);
				if(Pagares==""){
					eBasic.eMsgbox("Error al obtener lista de pagarés.",6);
					return 0;
				}
				objAction.Context.ActiveWindow.ObjectTypeName="DCXC"; //cambiar temporalmente el nombre de objeto para poder imprimir reporte de pagares
				//El reporte de pagare debe tener un parámetro llamado pPagares donde se almacenarán las claves primarias de los pagares generados en una cadena separado por comas.
				Reportes.EjecutarReporte(FXConfig.FormatoPagare(),2,0,true,"","pPagares",Pagares);
				objAction.Context.ActiveWindow.ObjectTypeName="Venta";
			}	
		}
		return -1;
    }else{
		Log(Venta.LastErrorDescrip);
		return 0;
	}
	
}

function CrearNotaC(Documento,PKCliente,Copia,NoEditar){
	//Documento puede ser: Remision o factura
var dlg;
var ThisObj;
var Nota;

if(Copia==null)
	Copia=false;
if(NoEditar==null)
	NoEditar=false;
	
	//Recibe un objeto Remision o Pedido
	if (Application.AXForms.AXForm("DlgNotaVnt" + cntP)!=null)
		cntP++;
		
	Application.MouseHourglass();	
	dlg=Application.AXForms.CreateForm("FormVenta","DlgNotaVnt" + cntP);	
	dlg.CmdProxyEvent="UIVentas.CapturarEvento"; //eventos del AXventa		
	dlg.Caption = "Nota de Crédito";	
	dlg.CmdPreview="UIVentas.PrevisualizarDocumento";
	dlg.CmdPrint="UIVentas.ImprimirDocumento";
	dlg.CmdKeyDown="UIVentas.Command_KeyDown";
	AsignarCarpetaRepotes(dlg);
	
	ThisObj = dlg.GetAXObject();
	
	FXConfig.FormatoAXCompraVenta(ThisObj);
	//Inicializar Compra	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBVenta, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	if (Documento!=null){
		ThisObj.SetParentVenta(Documento);
		//Generar Nota de Credito
		Nota = Venta.lgVenta.GenerarDocVenta(Documento,5,Copia) //Nota de Credito		
		if(NoEditar)
			ThisObj.ViewByObject(Nota);
		else
			ThisObj.EditByObject(Nota);
		
	}
	else{
		ThisObj.AddNew();
        ThisObj.SetTipoDocumento (5);  //Nota de Credito
		ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
		ThisObj.SetCliente(PKCliente);
		//Centro de Consumo Predetermidado
		ThisObj.CConsumoPredet=FXConfig.CConsumoPredeterminado();
	}
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.Frontera=FXConfig.UtilizarImpuestoFrontera();
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Ventas_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	dlg.AddButton("Buscar producto/servicio","P_Ventas_A07");	
	dlg.AddButton("Catálogo de productos","P_Ventas_A07_1");
	//dlg.AddButton("Documentos Incluidos","P_Ventas_A09");	
	dlg.ShowButtons();
	
	if (NoEditar){
		dlg.GetButtonByIDAction("P_Ventas_A07").Enabled=false; //Agregar Producto y servicio
		//dlg.GetButtonByIDAction("P_Ventas_A09").Enabled=false; //Documentos incluidos
	}
		
	dlg.ZOrder();	
	Application.MouseDefault();
}

function GuardarNota(objAction){
var ThisObj;

	ThisObj = objAction.Context.ActiveWindow.GetAxObject();	
	if (!ThisObj.Validate()) return 0;	
	if (!ThisObj.GetData()){
		if(ThisObj.LastErrDescrip!="")
			eBasic.eMsgbox(ThisObj.LastErrDescrip,6);
		else
			Log("Error al cargar información del documento");
		return 0;
	}	
	
	if (Venta.lgVenta.DevolucionXNotaCredito(ThisObj.ThisObj,true,ThisObj.ParentVenta)){
		ThisObj.ViewByObject(ThisObj.ThisObj);		
		//Cambiar la acción del boton guardar por modificar
		Application.MouseHourglass();	
		objAction.Context.ActiveWindow.SetActionToButton("P_Ventas_A12","P_Ventas_A19","Modificar Nota de Crédito");		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A07_1").Enabled=false; //Agregar Producto y servicio
		//objAction.Context.ActiveWindow.GetButtonByIDAction("P_Ventas_A09").Enabled=false; //Documentos incluidos
		
		Poliza.PolizaVentaDevolucionXNotaCredito(ThisObj.ThisObj);	
		Application.MouseDefault();
		
		if(parseInt(Configuracion.eApplicationVars.GetGlobalvar.GetNumVar("FXCA300xa",1))==5)//tipo comprobante a generar
		{
			//Código anterior
			if(eBasic.eMsgbox("La Nota de Crédito se guardó correctamente.¿Desea imprimir el documento?",4)==6){
				ImprimirDocumento(objAction.Context.ActiveWindow);
			}
		}else {
			//if(gFunciones.CFDActivo()){  //CFD 2010						
				try{
					cfd.despuesGuardarVenta(ThisObj.ThisObj.Sys_PK,"La Nota de Crédito se guardó correctamente.¿Desea crear el Comprobante Fiscal Digital?");
				}catch(e){
					Log("Error al ejecutar proceso: generación de CFD.");
					throw(e);
				}
			//}
		}
				
		return -1;
	}else{
		if (Venta.lgVenta.LastErrorDescrip!="")
			eBasic.eMsgbox(Venta.lgVenta.LastErrorDescrip,6);
		else
			Log("Error al guardar documento");
		
		return 0;
	}
	
}

function DevolucionDeConsignacion(ObjVenta){
	if (Venta.DevolucionDeCosignacion(ObjVenta)){
		eBasic.eMsgbox("¡La devolución se hizo correctamente!",6);
		ActualizarQVentas();
	}
}
function crear_cfdi()
{
	try
	{
		var Brw;
		var PKVenta;
		Brw=null;

		InitVentas();

		Brw=Application.Browsers.GetBrowser("qVentas");
		if (Brw==null) return 0;

		PKVenta= Brw.PrimaryKeyValue;
		// NetCfdi33._timbrar=0;

		Application.MouseHourglass();
		NetCfdi33.GetDoctoVenta(PKVenta);
		Application.MouseDefault();

		if (NetCfdi33.GetIsError()) 
			throw new Error(NetCfdi33.GetMsgLastError());
		else
		{
			PrintCFDI(NetCfdi33.FolioSAT);
		}

		

		if (NetCfdi33.GetIsError()) 
			throw new Error(NetCfdi33.GetMsgLastError());
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
	
}
function PrintCFDI(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		var cmdData=ExecuteSQL("select coalesce(uf_rfc_emisor,'-') as RFCEmisor from ut_cfd where uf_FolioSAT='"+FolioSAT+"';");
		if(cmdData==null) throw new Error("El recurso solicitado no existe.");
		//DownloadCfdi(string IdSat, string Rfc, bool Force = false)
		var Rfc=cmdData("RFCEmisor");
		
		InitVentas();
		NetCfdi33.DownloadCfdi(FolioSAT,Rfc,false);
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());

		NetCfdi33.PrintCFDIs(FolioSAT);
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}
function ExecuteSQL(cmdSQL)
{
	var r=null;
	try
	{
		r=Application.ADOCnn.Execute(cmdSQL);
		if (!(r.EOF && r.BOF)) return r;
		r=null;
	}
	catch(e)
	{
		Log(e.message);
		return null;
	}
}
function OpcionesVentas(){
var Brw;
var ThisObj; //Objecto Venta
var PKVenta;
Brw=null;
Brw=Application.Browsers.GetBrowser("qVentas");

if (Brw==null) return 0;
	
	PKVenta= Brw.PrimaryKeyValue;
	if (PKVenta==null){
		OptVntNew();
		return 0;
	}
	ThisObj = Application.NewObject("EDOFx.Venta");
	
	if (ThisObj.LoadFromADOConnection (PKVenta,"", Application.adoCnn,3)){
		//Si el documento no es de solo lectura ó es una remisión pero esta parcialmente facturada
		if (!LBVenta.DocOnlyRead(ThisObj) || (ThisObj.Documento==3 && ThisObj.StatusFacturacion==2)) {
			switch(ThisObj.Documento){
				case 1:
					OptVntCotizacion(ThisObj);break;
				case 2:
					OptVntPedido(ThisObj);break;
				case 3:
					OptVntRemision(ThisObj);break;
				case 4:	
					OptVntFactura(ThisObj);break;
				case 5:
					OptVntNew(OptVntNew);break;
			}
		}else{
			OptVntNew(OptVntNew);
		}
	}
}

function OptVntCotizacion(ObjVenta){
var ask;
var opc;

	ask=Application.NewAsk();
	ask.SetOption(10,"Realizar Pedido de esta cotización","Se generá una remisión para la mercancía contenida en la cotización actualmente seleccionada.");
	ask.SetOption(20,"Realizar Remisión","Se generá una remisión para la mercancía contenida en la cotización actualmente seleccionada.");
	ask.SetOption(30,"Registrar y Facturar esta Cotización","Se generá una Factura para la mercancía contenida en en la cotización actualmente seleccionado.");
	ask.SetOption(40,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar un nuevo pedido.");
	//ask.SetOption(50,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10:	
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CrearPedido(ObjVenta,0);break;
		case 20:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CrearRemision(ObjVenta,0);break;
		case 30:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CrearFactura(ObjVenta,0,null);  break;
		case 40:
			CrearPedido(null,0); break;
		// case 50:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
	}
	ask=null;
}

function OptVntPedido(ObjVenta){
var ask;
var opc;

	ask=Application.NewAsk();
	if (ObjVenta.StatusAdministrativo!=99){
		if(ObjVenta.StatusEntrega==1){
			ask.SetOption(10,"Registrar Nota de remisión","Se generá una remisión para la mercancía contenida en el pedido actualmente seleccionado.");
			ask.SetOption(20,"Registrar y Facturar este Pedido","Se generá una Factura para la mercancía contenida en el pedido actualmente seleccionado.");
		}
	}
	ask.SetOption(30,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar un nuevo pedido.");
	//ask.SetOption(40,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10: 				
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CrearRemision(ObjVenta,0); break;
		case 20:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CrearFactura(ObjVenta,0,null);  break;
		case 30:
			CrearPedido(null,0); break;
		// case 40:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
	}
	ask=null;
}

function OptVntRemision(ObjVenta){
var ask;
var opc;

	ask=Application.NewAsk();
	
	if (ObjVenta.StatusAdministrativo!=99){
		if(ObjVenta.StatusFacturacion==1){
			ask.SetOption(10,"Facturar esta remisión","Se generá una factura que ampare la remisión actualmente seleccionada.");
		}else{
			if(ObjVenta.StatusFinanciero==3 && ObjVenta.StatusFacturacion==2)
				ask.SetOption(10,"Facturar productos restantes en consignación","Se generá una factura que ampare el resto de productos que no han sido facturados.");
		}
		if(ObjVenta.StatusFacturacion==1) //por facturar
			ask.SetOption(20,"Cancelar remisión","Elija esta opción si desea cancelar la remisión seleccionada.");//"El sistema cancelará  la remisión actualmente seleccionada y generará una nota de credito automáticamente cuando existan productos facturados.");
		
		if (ObjVenta.StatusFinanciero==3)
			ask.SetOption(50,"Devolver mercancía en consignación","El sistema generará una nota de credito por la devolución de la mercancía");
	}

		
	ask.SetOption(30,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar un nueva nota de credito.");
	//ask.SetOption(40,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	opc=ask.Ask();
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10: 				
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			
			if (ObjVenta.StatusFinanciero==3){	
				FacturarConsignacion(ObjVenta);
			}
			else{
				CrearFactura(ObjVenta,0,null);
			}
			break;
		case 20:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CancelarObjVenta(ObjVenta);break;     
		case 30:
			CrearRemision(null,0); break;
		// case 40:
			// eBasic.eMsgbox("Implementar Asistentes");break;
		case 50:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			DevolucionDeConsignacion(ObjVenta);break;			
	}
	ask=null;
}

function OptVntFactura(ObjVenta){
var ask;
var opc;

	ask=Application.NewAsk();
	if (ObjVenta.StatusAdministrativo!=99)
		ask.SetOption(10,"Cancelar la Factura Actual","Se generá una factura que ampare la remisión actualmente seleccionada.");
	
	ask.SetOption(20,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar un nueva nota de credito.");
	//ask.SetOption(30,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10:
			if(EnEdicion("EditVenta_PK" +ObjVenta.Sys_PK)==-1) return 0;
			CancelarObjVenta(ObjVenta);  break;     
		case 20:
			CrearFactura(null,0,null); break;
		// case 30:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
				
	}
	ask=null;
}

function OptVntNew(){
var ask;
var opc;

	ask=Application.NewAsk();
		ask.SetOption(10,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar una Cotización, Pedido, Remisión, Factura o Nota de credito.");
		//ask.SetOption(20,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10: 				
			CrearPedido(null,0); break;
		// case 20:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
					
	}
	ask=null;
}

function CancelarObjVenta_XAccion(ObjAction){
	//cancela un objeto cuando se oprime el boton cancela desde el formulario de documento
	CancelarDocumento(null,null,ObjAction);
}

function CancelarObjVenta(Obj){
	//Cancela un objeto compra
	CancelarDocumento(null,Obj);
}

function CancelarDocumento(PKVenta,ObjVenta,ObjAction){
var Brw;
	Brw=null;	
	Venta.lgVenta.NotaCreditoPorCancelacion=false;
	
	if(PKVenta!=null){		
		ObjVenta = Application.NewObject("EDOFx.Venta");
		if (!ObjVenta.LoadFromADOConnection (PKVenta,"", Application.adoCnn,3)){
			if(ObjVenta.lastErrDescrip!="")
				eBasic.eMsgbox(ObjVenta.lastErrDescrip,6);
			else
				eBasic.eMsgbox("Error al cancelar no su pudo cargar el documento.",6);
				
			return 0;
		}
			
	}else{
		if(ObjAction!=null){
			ObjVenta=ObjAction.Context.ActiveWindow.GetAxObject().ThisObj;
		}else{
			if(ObjVenta==null){
				eBasic.eMsgbox("Error al cancelar no ha indicado el documento.",6);
				return 0;
			}
		}
	}	
	
	
	if(EnProceso("IDVenta"+"_"+ObjVenta.Referencia)==0)
		return 0;
	
	if (!Venta.lgVenta.PermitirCancelarDocumento(ObjVenta)){
		eBasic.eMsgbox("No se puede cancelar el documento seleccionado. "+Venta.lgVenta.LastErrorDescrip,6);
		return 0;
	}
	else{
		//if (eBasic.eMsgbox("¿Está seguro que desea cancelar el documento actualmente seleccionado?", 4)==7)
		var Sys_PKDocto=Application.Database.OpenRecordset("select u.Sys_PK from ut_cfd as u inner join venta as v on v.Sys_PK = u.uf_IVenta where v.Sys_PK="+ObjVenta.Sys_PK,Application.adoCnn);
		var pagos=Application.Database.OpenRecordset("select Pagos from dcxc where IVenta="+ObjVenta.Sys_PK,Application.adoCnn);
		if (!(pagos.EOF && pagos.BOF))
			if(pagos.Fields("Pagos").Value > 0){
				eBasic.eMsgbox("No se puede cancelar el documento ya que cuenta con al menos un pago vigente.",6);
				return 0;
			}
		try{
			if(cfd.cancelarCFDI_deVenta(Sys_PKDocto.Fields("Sys_PK").Value, "cancelVenta") == false) return 0;
		}
		catch(e){
			eBasic.eMsgbox("El Documento se cancelará localmente. Ocurrio un error al cancelar CFDI con el SAT. Intente cancelar desde el módulo de Facturación Electrónica.",6);
		}
	}
	if (Venta.lgVenta.CancelarVenta(ObjVenta)){		
		if(ObjVenta.Documento==4){ //SI SE CANCELÓ UNA FACTURA
			Application.MouseHourglass();	
			Poliza.PolizaVentaCancelacionFactura(ObjVenta);
			Application.MouseDefault();
			eBasic.eMsgbox("¡El Documento se canceló correctamente!",6);
		}
		
		//Si el documento se cancela correctamente, entonces deshabilita el botón Cancelar
		if (ObjAction!=null){			
			ObjAction.Context.ActiveWindow.Title="Documento cancelado";
			ObjAction.Context.ActiveWindow.HideButtons();			
		}
		ActualizarQVentas();
		return -1;		
	}else{ 		
		if (Venta.lgVenta.NotaCreditoPorCancelacion){
			CrearNotaC(ObjVenta,null,true,true); //apartir de la factura,0,copiar,noeditar
		}else{
			if(Venta.lgVenta.LastErrorDescrip!="")
				eBasic.eMsgbox(Venta.lgVenta.LastErrorDescrip,6);
			else
				Log("Error al cancelar documento");
		}
		return 0;	
	}	 
}

function FacturarConsignacion(ObjVenta){
var Fact;
	Fact = null;
    Fact = Venta.GenerarFacturarDeConsignacion(ObjVenta);
		
	if (Fact!=null)
           CrearFactura(ObjVenta,0,Fact);
 }
 
 //Promociones ****************************
 
function QPromociones(){
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("qPromociones");
	
	if (Brw==null){
		
		if(!Application.UIUsers.CheckItem("FX1-10-250-001"))  //PERMITIR ACCESO
			return 0;
		
		Brw=Application.Browsers.CreateBrowser("qPromociones");
		Brw.Caption="Promociones";
		Brw.sqlCommand.CmdType=1;
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("TipoPromo",0));
		Brw.sqlCommand.CmdSQL=CmdSQLQPromociones;
		Brw.KeyField = "Sys_PK";
		Brw.CmdAfterRetriveFields="UIVentas.RedimensionarQPromociones";
		//Brw.CmdAfterRetriveFields="UIInventario.RedimensionarColumnas";
		
		Brw.CmdAddNew="UIVentas.AgregarPromocion";
		Brw.CmdEdit="UIVentas.EditarPromocion";
		Brw.CmdDelete = "UIVentas.EliminarPromocion";
		Brw.CmdDblClick=Brw.CmdEdit;
		
		Brw.ReportsFolder=Reportes.CarpetaVentas;		
		Brw.ObjectTypeName="Promocion";
		
		Brw.AddButton("Agregar promoción","P_Ventas_P01");
		Brw.AddButton("Ver tipos de cupón","P_Ventas_P02");
		Brw.AddButton("Agregar tipo de cupón","P_Ventas_A15");
		Brw.AddButton("Crear cupón","P_Ventas_A16");
		Brw.AddButton("Aplicar cupón de puntos","P_Ventas_A17");		
	
		Brw.ShowToolBar();
		Brw.ShowFindBar();
	
		Brw.Execute();		
		//Ocultar columnas
		Brw.HideFields("Sys_PK;uf_Color");
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_Color";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="Promocion";
				
	}else			
		Brw.Zorder();
	
 }
function RedimensionarQPromociones(BrwName){
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser(BrwName);
	
	if (Brw!=null){
		Brw.SetColumnWidth("Codigo",80);
		Brw.SetColumnWidth("Activa",50);
		Brw.SetColumnWidth("Tipo",100);		
		Brw.SetColumnWidth("Nombre",250);
		Brw.SetColumnWidth("Vigencia",100);
		Brw.SetColumnWidth("FechaInicio",80);
		Brw.SetColumnWidth("FechaVigencia",80);		
		Brw.SetColumnWidth("Ambito",80);
		Brw.SetColumnWidth("Excepcion",80);
		Brw.SetColumnWidth("Restriccion",80);		
		Brw.SetColumnWidth("Excluyente",80);
		Brw.SetColumnWidth("LibreEleccion",80);
		Brw.SetGroup("Tipo");
	}else
		Log("Error al redimensionar columnas de promociones");

} 
 
 
 function QTipoCupon(){
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("qTipoCupon");	
	if (Brw==null){
		Brw=Application.Browsers.CreateBrowser("qTipoCupon");
		Brw.Caption="Tipos de cupón";
		Brw.sqlCommand.CmdType=1;
		//Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("TipoPromo",0));
		Brw.sqlCommand.CmdSQL=CmdSQLQTipoCupon;
		Brw.KeyField = "Sys_PK";
		Brw.CmdAfterRetriveFields="UIVentas.RedimensionarQTipoCupon";
				
		Brw.CmdAddNew="UIVentas.AgregarTipoCupon";
		Brw.CmdEdit="UIVentas.ModificarTipoCupon";
		Brw.CmdDelete = "UIVentas.EliminarTipoCupon";
		Brw.CmdDblClick=Brw.CmdEdit;
		
		Brw.ReportsFolder=Reportes.CarpetaVentas;		
		Brw.ObjectTypeName="TipoCupon";			
		Brw.ShowToolBar();
		Brw.ShowFindBar();
	
		Brw.Execute();		
		//Ocultar columnas
		Brw.HideFields("Sys_PK;uf_Color");
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="ut_Color";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="TipoCupon";
				
	}else			
		Brw.Zorder();
	
 }
 
function RedimensionarQTipoCupon(BrwName){
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser(BrwName);	
	if (Brw!=null){
		Brw.SetColumnWidth("Nombre",200);
		Brw.SetColumnWidth("Tipo",100);
		Brw.SetColumnWidth("Caducidad",70);
		Brw.SetColumnWidth("Valor",90);		
		Brw.SetColumnWidth("UsoIlimitado",80);
		Brw.SetColumnWidth("Notas",250);	
		Brw.SetCaptionByFieldName("UsoIlimitado","Uso ilimitado");
		Brw.SetCaptionByFieldName("Caducidad","Caducidad(Días)");
		Brw.SetGroup("Tipo");
		Brw.Subtitle2="Tipos de cupón";
	}else
		Log("Error al redimensionar columnas de Tipos de cupón");
 } 
 function AgregarTipoCupon(){
	if (Promocion.AgregarTipoCupon()!=null)
		return -1;
	else{
		Log(Promocion.LastErrorDescrip);
		return 0;
	}
 } 
 function ModificarTipoCupon(PK){
	if(Promocion.ModificarTipoCupon(PK)!=null)
		return -1;
	else{
		Log(Promocion.LastErrorDescrip);
		return 0;
	}
 } 
 function EliminarTipoCupon(PK){	
	if (Promocion.EliminarTipoCupon(PK))		
		return -1;
	else{
		Log(Promocion.LastErrorDescrip);
		return 0;
	}
 }
 
 function CrearCupon(){
	if (Promocion.AgregarCupon()==null)
		Log(Promocion.LastErrorDescrip);
 }
 function AplicarCuponPuntos(){
	if(!Promocion.AgregarPuntos())
		Log(Promocion.LastErrorDescrip);
 }
 
 function AgregarPromocion(){	
	if (Promocion.AgregarPromocion()==null)
		return 0;
	else
		return -1;
 }
 
 function EditarPromocion(PK){
	if (Promocion.ModificarPromocion(PK)==null)
		return 0;
	else
		return -1;
 }
 function EliminarPromocion(PK){
	if (Promocion.EliminarPromocion(PK))		
		return -1;
	else{
		Log(Promocion.LastErrorDescrip);
		return 0;
	}
 }
 
 function ModificarDocumento(ObjAction){
	var Documento;
	Documento=ObjAction.Context.ActiveWindow.GetAxObject().ThisObj;
	if(Documento==null){
		Log("Error al obtener el Documento");
		return 0;
	}		
	if(Venta.ModificarDocumento(Documento)){
		Application.eDoEvents();
		ObjAction.Context.ActiveWindow.GetAxObject().ViewByObject(Documento);
		ObjAction.Context.ActiveWindow.Caption = "Documento: " + Documento.Referencia;		
	}else{
		Log(Venta.LastErrorDescrip);
	}
	
 }
 
function EnProceso(TagData){
var Opendlg;
var Documento;
	Opendlg=null;
	Opendlg=Application.AXForms.FindAXFormByTagData(TagData);
	if(Opendlg!=null){
		switch(Opendlg.GetAxObject().GetCurrentDocument()){
			//case 1:
			case 2:Documento="un Pedido";break;
			case 3:Documento="una Remisión";break;
			case 4:Documento="una Factura";break;
			//case 5:
		}
		if (Documento==null)
			Documento="un proceso";
		eBasic.eMsgbox("No fue posible continuar, actualmente se está realizando "+ Documento +" del documento seleccionado.",6);
		Opendlg.Zorder();
		return 0;
	}		
	return -1;
 }
 
 function EnEdicion(AXFormName){
	var dlg;		
	dlg=Application.AXForms.AXForm(AXFormName);
	if (dlg!=null){		
		eBasic.eMsgbox("No se pude continuar porque el documento está actualmente abierto.\nCierre el documento e intentelo de nuevo.",6);
		return -1;
	}else
		return 0;		
 }
 
 
 function DesactivarAccionesProcesadas(AXForm){
	if(AXForm==null)
		return 0;
		
	switch(AXForm.GetAxObject().GetCurrentDocument()){
		case 1: //cotizacion
			break;
		case 2: //pedido
			AXForm.GetButtonByIDAction("P_Ventas_A03").Enabled=false; //generar remision
			AXForm.GetButtonByIDAction("P_Ventas_A04").Enabled=false;//generar factura			
			AXForm.SetActionToButton("P_Ventas_A12","P_Ventas_A19","Modificar Pedido");			
			break;
		case 3: //remision
			AXForm.GetButtonByIDAction("P_Ventas_A20").Enabled=false; //cancelar remision
			AXForm.GetButtonByIDAction("P_Ventas_A04").Enabled=false;//generar factura
			break;
	}	
 }
 
 function AsignarCarpetaRepotes(Window){
	Window.ReportsFolder=Reportes.CarpetaVentas;
	Window.ObjectTypeName="Venta";
 }
 
 function ImprimirDocumento(AXForm){
	ProcesarReporte(AXForm,2);
}

function PrevisualizarDocumento(AXForm){
	ProcesarReporte(AXForm,1);
}

function ProcesarReporte(AXForm,Destino){
var ThisObj;
var Formato;
	if(AXForm==null || Destino==null)
		return 0;
	ThisObj=null;
	ThisObj=AXForm.GetAxObject().ThisObj;
	if(ThisObj==null){
		Log("Error al acceder al documento");
		return 0;
	}
	if(ThisObj.Sys_PK==0){
		eBasic.eMsgbox("Primero debe guardar el documento.",6);
		return 0;
	}
	Formato="";	
	switch(ThisObj.Documento){
		case 1:Formato=FXConfig.FormatoCotizacion();break;
		case 2:Formato=FXConfig.FormatoPedido();break;
		case 3:Formato=FXConfig.FormatoRemision();break;
		case 4:Formato=FXConfig.FormatoFactura();break;
		case 5:Formato=FXConfig.FormatoNotaCredito();break;
	}
	if(Formato==""){
		Log("No se encontro el formato de reporte del documento.");
		return 0;
	}
	Reportes.EjecutarReporte(Formato,Destino,ThisObj.Sys_PK,true);
	ThisObj=null;
}

function Command_KeyDown(KeyCode){
	if(KeyCode==null) return 0;
	
	var id="";
	
	switch(KeyCode){
		case 117: //F6
			id="P_Ventas_A12";break;
		case 119: //F8
			id="P_Ventas_A22";break;		
	}	
	if(id!="") 	Application.ActiveWindow().ExecuteButtonAction(id);
}


function CambioTipoDocumento(AX){	
var Doc;
	Doc=AX.GetAXObject().DocumentoSeleccionado;	
	AX.ClearButtonsBar();	
	if(Doc==null){
		eBasic.eMsgbox("Error al obtener tipo de documento.",6);
		return 0;
	}
	AX.AddButton("Guardar (F6)","P_Ventas_A12");
	AX.AddButton("Guardar y cerrar (F8)","P_Ventas_A22");
	AX.AddButton("Buscar producto/servicio","P_Ventas_A07");
	AX.AddButton("Catálogo de productos","P_Ventas_A07_1");
	
	switch(Doc){		
		case 1: //Cotización
			AX.Caption="Cotización";break;
		case 2: //Pedido			
			AX.Caption="Pedido";
			AX.AddButton("Recalcular precios","P_Ventas_A25");
			break;
		case 3: //Remisión						
			AX.Caption="Remisión";
			AX.AddButton("Documentos Incluidos","P_Ventas_A09");
			AX.AddButton("Recalcular precios","P_Ventas_A25");
			break;
		case 4: //Factura		
			AX.Caption="Factura";
			AX.AddButton("Documentos Incluidos","P_Ventas_A09");	
			AX.AddButton("Incluir Consignaciones","P_Ventas_A21");
			AX.AddButton("Recalcular precios","P_Ventas_A25");
			break;
		case 5: //NCrédito		
			AX.Caption="Nota de Crédito";
	}		
}

function CapturarEvento(ID){
	var AX;
	AX=Application.ActiveWindow();
	switch(ID){
		case "DocTypeChange": CambioTipoDocumento(AX);break;		
	}
}

function Nuevo(objAction){
var Ax;	
	try{
		Ax=objAction.Context.ActiveWindow.GetAxObject();
		switch(Ax.ThisObj.Documento){
			case 1: CrearCotizacion(0); break;		
			case 2: CrearPedido(null,0); break;
			case 3: CrearRemision(null,0); break;
			case 4: CrearFactura(null,0,null); break;
			case 5: CrearNotaC(null); break;
		}
		return -1;
	}catch(e){
		Log("Error al crear nuevo documento");
		throw(e);
		return 0;
	}
}

function CopiarDocumento(objAction){
	var Ax;
	var NAx;
	var AW;
	var NV;
	
	try{
		//DOCUMENTO ACTUAL
		Ax=objAction.Context.ActiveWindow.GetAxObject();
		NV=Ax.MakeCopy(false);
		if(NV==null){
			Log("No se pudo crear el documento");
			return 0;
		}
		
		//NUEVO DOCUMENTO
		if(Nuevo(objAction)){
			AW=Application.ActiveWindow();		
			if(AW!=null){
				NAx=AW.GetAxObject();
				NAx.LoadIn(NV);
			}else{
				Log("Error al acceder a nuevo documento.");
				return 0;
			}
		}else{
			Log("No se pudo crear el nuevo documento.");
			return 0;
		}
	}catch(e){
		Log("Error al copiar documento.");
		throw(e);
		return 0;
	}
}

function RecalcularPrecios(objAction){
	var Ax;
	try{
		Ax=objAction.Context.ActiveWindow.GetAxObject();
		if(Ax==null){
			Log("Error al acceder a objeto.");
			return 0;
		}
		Ax.ReLoadPrice();
		return -1;
	}catch(e){
		Log("Error al recalcular precios");
		throw(e);
	}
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}
function VistaPreviaCFDI(objAction)
{
		if (objAction.Context.ActiveWindow!=null){
		if (objAction.Context.ActiveWindow.GetAxObject().CurrentAction==3) return 0;
			objAction.Context.ActiveWindow.GetAxObject().TotalesCFDI();
	}
}

//jv - Productos similares - 27/11/2013
function BuscarSimilares(objAction)
{
	var Code = "";
	var r = null;
	var dlgSimilares = "";
	var PK = 0;
	var Grupo = 0;
	var PKCConsumo = 0;
	var PKAlmacen = 0;
	var PKProducto = 0;
	var SQL = "";
	
	try
	{
		if (objAction.Context.ActiveWindow!=null){		
			Code = objAction.Context.ActiveWindow.GetAxObject().ObtenerProductoSeleccionado;
			PKCConsumo =  objAction.Context.ActiveWindow.GetAxObject().ObtenerCCSeleccionado();
			
			if(Code=="")
			{
				PKProducto = objAction.Context.ActiveWindow.GetAxObject().GetNewElement;
				if(PKProducto==0)
				{
					return -1;
				}
				SQL = "SELECT Sys_PK, uf_gruposimilares as Grupo FROM Producto WHERE Sys_PK="+PKProducto;
			}
			else
			{
				SQL = "SELECT Sys_PK, uf_gruposimilares as Grupo FROM Producto WHERE Codigo='"+Code+"'";
			}
			
			if(PKCConsumo > 0)
			{
				r=Application.Database.OpenRecordset(SQL);
				if (!(r.EOF && r.BOF))
				{
					PK=r.Fields("Sys_PK").Value;
					Grupo=r.Fields("Grupo").Value;
					r.Close();
					r = null;
				}
				else
				{
					Log("Error al obtener datos del producto seleccionado");
					return -1;
				}
				
				r=Application.Database.OpenRecordset("select IAlmacen from cconsumo WHERE Sys_PK="+PKCConsumo);
				if (!(r.EOF && r.BOF))
				{
					PKAlmacen=r.Fields("IAlmacen").Value;
					r.Close();
					r = null;
				}
				else
				{
					Log("Error al obtener del almacén relacionado al centro de consumo.");
					return -1;
				}
				
				dlgSimilares = Application.NewObject("dSimilares.Actions");
				
				if(dlgSimilares==null)
				{
					Log("Error al crear objeto de productos similares.");
					return -1;
				}
				
				if(Grupo!=null && PKAlmacen > 0)
				{
					dlgSimilares.SetObjects(Application.adoCnn, MXCAsistentes);
					if(dlgSimilares.showdlgsimilares(Grupo, PKAlmacen, PK, true))
					{
						objAction.Context.ActiveWindow.GetAxObject().ReplaceElement(dlgSimilares.PKProductoR);
						objAction.Context.ActiveWindow.GetAxObject().setFocusGrid();
					}
				}
				dlgSimilares = null;
				
			}
			else
			{
				Log("Es seleccionar el centro de consumo para realizar la búsqueda.");
				return -1;
			}
		}
	}
	catch(e)
	{
		Log(e.description)
		return -1;
	}
}