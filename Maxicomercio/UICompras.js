//Versión: 3.2
//Déminus
var Diot=null;
//var CmdSQLQCompras = "SELECT * FROM qryCompras WHERE Mes=@Mes AND Anio=@Anio;";
var CmdSQLQCompras = "Select qryCompras.*, cFormasPago.Const as DFormaPago, cStatusAdministrativos.Const as DstatusAdmin,Compra.uf_color FROM qryCompras Inner Join ((Compra INNER JOIN cStatusAdministrativos ON Compra.StatusAdministrativo=cStatusAdministrativos.ID) Inner Join  cFormasPago ON Compra.FormaPago = cFormasPago.ID) ON qryCompras.Sys_PK = Compra.Sys_PK  WHERE Mes=@Mes AND Anio=@Anio;";

//var CmdSQLQComprasTodos= "SELECT * FROM qryCompras WHERE Anio=@Anio;";
var CmdSQLQComprasTodos= "Select qryCompras.*, cFormasPago.Const as DFormaPago, cStatusAdministrativos.Const as DstatusAdmin,Compra.uf_color FROM qryCompras Inner Join ((Compra INNER JOIN cStatusAdministrativos ON Compra.StatusAdministrativo=cStatusAdministrativos.ID) Inner Join  cFormasPago ON Compra.FormaPago = cFormasPago.ID) ON qryCompras.Sys_PK = Compra.Sys_PK WHERE Anio=@Anio;";
var cntP;
function CrearPanel(){
	Application.UIShortCuts.CreatePane("P_Compras","Compras","","","ICON_COMPRAS","",0);
	
	Application.UIShortCuts.Pane("P_Compras").CreateGroup(2,"P_Compras_G_01","Ver","","",0);
	Application.UIShortCuts.Pane("P_Compras").CreateGroup(2,"P_Compras_G_02","Acciones","","",0);

	Application.UIShortCuts.CreateAction("P_Compras_A01","Explorar documentos",0,"","","","UICompras.QCompras",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A02","Nuevo Pedido",0,"","","","UICompras.CrearPedido1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A03","Nueva Remisión",0,"","","","UICompras.CrearRemision1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A04","Nueva Factura",0,"","","","UICompras.CrearFactura1",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A05","Nueva Nota de crédito",0,"","","","UICompras.CrearNotaC1",0,"","","",0);
	
	
	Application.UIShortCuts.CreateAction("P_Compras_A06","GuardarPedido",0,"","","","UICompras.GuardarPedido",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A07","AgregarProducto",0,"","","","UICompras.AgregarProducto",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A07_1","Catálogo de Productos",0,"","","","UICompras.CatalogoProductos",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A08","GuardarRemision",0,"","","","UICompras.GuardarRemision",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A09","DocIncluidos",0,"","","","UICompras.DocIncluidos",0,"","","",0);	
	Application.UIShortCuts.CreateAction("P_Compras_A10","GuardarFactura",0,"","","","UICompras.GuardarFactura",0,"","","",0);		
	Application.UIShortCuts.CreateAction("P_Compras_A11","GuardarNota",0,"","","","UICompras.GuardarNota",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A12","GuardarCompra",0,"","","","UICompras.GuardarCompra",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A13","Generar Documento",0,"","","","UICompras.OpcionesCompra",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A14","CancelarDocumento",0,"","","","UICompras.CancelarDocumento",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A15","ModificarDocumento",0,"","","","UICompras.ModificarDocumento",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A16","CancelarObjCompra_XAccion",0,"","","","UICompras.CancelarObjCompra_XAccion",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A17","InsertarConsignaciones",0,"","","","UICompras.InsertarConsignaciones",0,"","","",0);	
	
	//Application.UIShortCuts.CreateAction("P_Compras_A15","ModificarDocumento",0,"","","","UICompras.ModificarDocumento",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A22","Guardar y cerrar",0,"","","","UICompras.GuardarCerrar",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A23","Nuevo documento en blanco",0,"","","","UICompras.Nuevo",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A24","Nuevo igual a éste",0,"","","","UICompras.CopiarDocumento",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A25","Cargar CFD",0,"","","","UICompras.CargarCFD",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_A26","Archivos",0,"","","","UICompras.ArchivosCompra",0,"","","",0);
	
	Application.UIShortCuts.CreateAction("P_Compras_A27","Importar archivo mvi",0,"","","","UICompras.ImportarMVI",0,"","","",0); //15102011
	
	//jv - Productos similares - 27/11/2013
	Application.UIShortCuts.CreateAction("P_Compras_N01","Productos similares",0,"","","","UICompras.BuscarSimilares",0,"","","",0);
	Application.UIShortCuts.CreateAction("P_Compras_N02","Datos generales DIOT",0,"","","","UICompras.DIOT_",0,"","","",0);
	//Agregar Accion al grupo de  panel
	Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_01").AddItem("P_Compras_A01");
    Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_02").AddItem("P_Compras_A02");
	Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_02").AddItem("P_Compras_A03");
	Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_02").AddItem("P_Compras_A04");
	Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_02").AddItem("P_Compras_A05");
	//Application.UIShortCuts.Pane("P_Compras").Group("P_Compras_G_02").AddItem("P_Compras_A13");
	cntP=1;
}

function QCompras(){
var Brw;
var Fecha;

Brw=null;

Brw=Application.Browsers.GetBrowser("qCompras");
if (Brw==null)
	{
		if(!Application.UIUsers.CheckItem("FX1-20-20-001"))  //PERMITIR ACCESO
			return 0;
			
		Brw=Application.Browsers.CreateBrowser("qCompras");
		Brw.Caption="Compras";
		Brw.sqlCommand.CmdType=1;				
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Mes",1));
		Brw.sqlCommand.Parameters.Add(Brw.sqlCommand.NewNumericParameter("Anio"));				
		Brw.KeyField = "Sys_PK";
		Brw.sqlCommand.CmdSQL=CmdSQLQCompras;	
		Brw.CmdAfterRetriveFields="UICompras.RedimensionarColumnas";
		
		Brw.CmdAddNew="UICompras.OpcionesCompra";
		Brw.CmdEdit="UICompras.EditarCompra";
		Brw.CmdDelete = "UICompras.CancelarDocumento";
		Brw.CmdRowChanged = "UICompras.TituloCompra";
		Brw.CmdDblClick=Brw.CmdEdit;
		
		AsignarCarpetaRepotes(Brw);
		
		Brw.ShowToolBar();
		
		Brw.AddButton("Nuevo Pedido","P_Compras_A02");
		Brw.AddButton("Nueva Remisión","P_Compras_A03");
		Brw.AddButton("Nueva Factura","P_Compras_A04");
		Brw.AddButton("Nueva Nota de Credito","P_Compras_A05");
		Brw.AddButton("Cancelar","P_Compras_A14");
		Brw.AddButton("Generar Documento","P_Compras_A13");
		Brw.AddButton("Archivos","P_Compras_A26"); //gb02062011
		
		Brw.BottomTabParameter="Mes";		
		Brw.CmdBottomTabClick="UICompras.ConfigurarConsulta";
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
		//Asignar nombre de Columna
		//Brw.SetCaptionByFieldName("Estado","Estado Financiero");
		//Brw.SetCaptionByFieldName("Codigo","Código");
		Brw.HideFields("Sys_PK;Mes;Anio;ID;IProveedor;CodigoProveedor;TipoDocumento;StatusFinanciero;StatusFacturacion;StatusEntrega;StatusAdministrativo;Estado;uf_Color");		
				
		//Funcionalidad del Panel de detalle 25-01-2010
		Brw.DetailFunction="UICompras.Detail";
		Application.GetDetailPanel().DoWith(Brw.PrimaryKeyValue);
		
		Brw.ColorFieldName="uf_Color";
		Brw.ColorTableName="Compra";
		Brw.BrwKeyFieldName="Sys_PK";
		Brw.BrwTableName="Compra";
		try
		{
			Diot=eBasic.eCreateObject("Diot.cMain");
			if(Diot==null)
			{
				eBasic.eMsgbox("Error al crear componentes de la DIOT.", 6);
				return -1;
			}
			Diot.SetObjects(DataAccess);	
		}
		catch(e)
		{
		
		}
	}
	else
		Brw.Zorder();
		
		
TituloCompra(Brw.PrimaryKeyValue);
}

function ConfigurarConsulta(Tab){	
var Brw;
Brw=null;
Brw=Application.Browsers.GetBrowser("qCompras");
	if (Brw!=null){
		if (Tab==0) //Todos los meses
			Brw.sqlCommand.CmdSQL=CmdSQLQComprasTodos;
		else //por mes
			Brw.sqlCommand.CmdSQL=CmdSQLQCompras;
	}else{
		Log("Error al asignar consulta");
	}	

}

function RedimensionarColumnas(){
	var Brw;
	Brw=null;

	Brw=Application.Browsers.GetBrowser("qCompras");	
	if (Brw!=null){					
		Brw.SetColumnWidth("Documento",90);
		Brw.SetColumnWidth("Referencia",100);
		Brw.SetColumnWidth("Fecha",70);
		Brw.SetColumnWidth("Nombre",190);
		Brw.SetColumnWidth("Vencimiento",70);
		Brw.SetColumnWidth("Divisa",60);
		Brw.SetColumnWidth("TipoCambio",85);
		Brw.SetColumnWidth("Total",100);
		
		Brw.SetColumnWidth("Estado",100);
		Brw.SetColumnWidth("DFormaPago",100);
		Brw.SetColumnWidth("DstatusAdmin",115);
		
		Brw.SetCaptionByFieldName("TipoCambio","Tipo de cambio");
		Brw.SetCaptionByFieldName("Nombre","Proveedor");
		
				
		Brw.SetCaptionByFieldName("Estado","Estado Financiero");
		Brw.SetCaptionByFieldName("DFormaPago","Forma de Pago");
		Brw.SetCaptionByFieldName("DstatusAdmin","Estado Administrativo");
		
		try{
			Brw.SetColumnFormat("Total",FXConfig.NDecsMonto(),FXConfig.FormatoMonto());				
		}catch(e){}
	}
	Brw.SetTitle(" ");
	TituloCompra(Brw.PrimaryKeyValue);
}

function AgregarProducto(objAction){
	//Pemirte Explorar los productos existentes
	if (objAction.Context.ActiveWindow!=null){
		if (objAction.Context.ActiveWindow.GetAxObject().CurrentAction==3) return 0;
		//objAction.Context.ActiveWindow.GetAxObject().BrwProductos();
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
		
		if(ThisObj.ThisObj.IProveedor.Sys_PK<1){
			eBasic.eMsgbox("Por favor seleccione un proveedor.",6);
			return;
		}
		
		
		tmp = Compra.InsertarConsignaciones(ThisObj.ThisObj);
		if (tmp!=null){
			objAction.Context.ActiveWindow.GetAxObject().EditByObject(tmp);
			objAction.Context.ActiveWindow.GetAxObject().SetColConsignaciones(Compra.Consignaciones);
			Compra.DisposeConsignaciones();
		}
	}
 }

 //Antes GuardarCompra
function GuardarCompra(objAction){
	/*  Utilizada para guardar la compra validando el tipo de documento que se ha seleccionado en el control active x      */
var ThisObj;
var isB;


ThisObj = objAction.Context.ActiveWindow.GetAxObject();	
if (!ThisObj.Validate())
	return 0;

	//evento
	var res;
	try{
		res=Eventos.EvAntesCompra(ThisObj.ThisObj);
	}catch(e){			
		res=true;
	}
	if(!res)
		return 0;
	//fin evento
	
switch(ThisObj.GetCurrentDocument())
	{
		case 2:
			//"Pedido"		
			isB=GuardarPedido(objAction);
			break;
		case 3:
			//"Remisión"	
			isB=GuardarRemision(objAction);
			break;
		case 4:
			//"Factura"
			isB=GuardarFactura(objAction);
			break;
		case 5:
		//"Nota de crédito"
			isB=GuardarNota(objAction);
			break;
	}
	// Actualizar browser principal si se encuentra disponible
	if (isB==-1){
		try{
			//Actualizar Lista de precios
			if(ThisObj.ThisObj.Documento==3 || ThisObj.ThisObj.Documento==4) ActualizarProductos(ThisObj.ThisObj); //26052010
		}
		catch(e){
		}
		
		//evento
		try{
			Eventos.EvDespuesCompra(ThisObj.ThisObj);
		}catch(e){			
		}
		//fin evento
		
		ActualizarQCompras();
	}
	
	return isB;
}

// ANTES GuardarCerrar
function GuardarCerrar(objAction){
	var r;
	var Ax;
	var dlg;
	var documento=0;
	r=GuardarCompra(objAction);	
	try{
		if(!r){
			return 0;
		}		
		//if (eBasic.eMsgbox("¿Desea crear un nuevo documento?", 4)==7){
			objAction.Context.ActiveWindow.UnloadMe();
			return 0;
		//}
		/*dlg=objAction.Context.ActiveWindow;
		dlg.DelParent();
		Ax=objAction.Context.ActiveWindow.GetAxObject();	
		documento=Ax.ThisObj.Documento;
		Ax.PredDivisa = FXConfig.DivisaPredeterminada();					
		Ax.NewDocument();
				
		switch(documento){
			case 1: //Cotización				
				break;
			case 2:
				dlg.ClearButtonsBar();
				dlg.Caption="Pedido";
				dlg.AddButton("Guardar (F6)","P_Compras_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
				dlg.AddButton("Buscar producto/servicio","P_Compras_A07");
				dlg.AddButton("Catálogo de productos","P_Compras_A07_1");	
				dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares", "P_Compras_N01");
				Ax.SetReferencia(gFunciones.ReferenciaAleatoria());
				break;
			case 3:
				dlg.ClearButtonsBar();
				dlg.Caption="Remisión";				
				dlg.AddButton("Guardar (F6)","P_Compras_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
				dlg.AddButton("Buscar producto/servicio","P_Compras_A07");
				dlg.AddButton("Catálogo de productos","P_Compras_A07_1");	
				dlg.AddButton("Documentos Incluidos","P_Compras_A09");		
				dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011		

				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares", "P_Compras_N01");

						
				break;
			case 4:
				dlg.ClearButtonsBar();
				dlg.Caption="Factura";				
				dlg.AddButton("Guardar (F6)","P_Compras_A12");
				dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
				dlg.AddButton("Buscar producto/servicio","P_Compras_A07");	
				dlg.AddButton("Catálogo de productos","P_Compras_A07_1");	
				dlg.AddButton("Documentos Incluidos","P_Compras_A09");	
				dlg.AddButton("Incluir Consignaciones","P_Compras_A17");
				dlg.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011	
				dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares", "P_Compras_N01");
				break;
			case 5:
				dlg.ClearButtonsBar();
				dlg.Caption="Nota de crédito";
				dlg.AddButton("Guardar (F6)","P_Compras_A12");	
				dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
				dlg.AddButton("Buscar producto/servicio","P_Compras_A07");	
				dlg.AddButton("Catálogo de productos","P_Compras_A07_1");
				dlg.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011	
				dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
				//jv - Productos similares - 27/11/2013
				dlg.AddButton("Productos similares", "P_Compras_N01");
				Ax.SetReferencia(gFunciones.ReferenciaAleatoria());
				break;
		}*/
		return -1;
	}catch(e){
		Log("Ocurrió un error al cerrar");
		throw(e);
		return 0;
	}
}


function ActualizarProductos(ObjCompra)
{
var ItemCount=0;
var DCompra;

ItemCount = ObjCompra.Detalle.Elements.Count();
if(ItemCount<1) return 0;

Application.MouseHourglass();

	for (var i=1;i<=ItemCount;i++)
	{
		DCompra  = ObjCompra.Detalle.Elements(i);
		try{
		UpdPrecioProd(DCompra.IProducto.Sys_PK);
		}catch(e){}
		
	}

Application.MouseDefault();

}

function SincronizarPrecio(Prod){

var Cnn;
var sql;
var R;
	Cnn = Application.ADOCnn;
	sql= "Select flagUtilidad FROM Producto Where Sys_PK =" + Prod ;
	
	R=Cnn.Execute(sql);
	
	if (R==null) return false;
	if (R.EOF && R.BOF) return false;
	
	if(R("flagUtilidad").Value!=0) return true;
	return false;
}


function UpdPrecioProd(PK){
var sql="";
var R;
var p=0;
	try{
		//if (!SincronizarPrecio(PK)) return 0;
		sql= "Select flagUtilidad,CostoUltimo,Util1,Util2,Util3,Util4,Util5,Precio1,Precio2,Precio3,Precio4,Precio5 FROM Producto Where Sys_PK =" + PK;
		R=Application.ADOCnn.Execute(sql);
		if (R==null) return 0;
		if (R.EOF && R.BOF) return 0;	
		
		if(numValue(R,"flagUtilidad")!=0 && numValue(R,"CostoUltimo")>0){			
			sql="";
			if(numValue(R,"Util1")>0){
				p=0;
				p=numValue(R,"CostoUltimo")*(1+(numValue(R,"Util1")*0.01));
				p=p.toFixed(LBCompra.DecPreMontos);				
				sql="Precio1="+p;
			}
			if(numValue(R,"Util2")>0){
				p=0;
				p=numValue(R,"CostoUltimo")*(1+(numValue(R,"Util2")*0.01));
				p=p.toFixed(LBCompra.DecPreMontos);
				if(sql!="") sql=sql+",";
				sql=sql+"Precio2="+p;
			}
			if(numValue(R,"Util3")>0){
				p=0;
				p=numValue(R,"CostoUltimo")*(1+(numValue(R,"Util3")*0.01));
				p=p.toFixed(LBCompra.DecPreMontos);
				if(sql!="") sql=sql+",";
				sql=sql+"Precio3="+p;
			}
			if(numValue(R,"Util4")>0){
				p=0;
				p=numValue(R,"CostoUltimo")*(1+(numValue(R,"Util4")*0.01));
				p=p.toFixed(LBCompra.DecPreMontos);
				if(sql!="") sql=sql+",";
				sql=sql+"Precio4="+p;
			}
			if(numValue(R,"Util5")>0){
				p=0;
				p=numValue(R,"CostoUltimo")*(1+(numValue(R,"Util5")*0.01));
				p=p.toFixed(LBCompra.DecPreMontos);
				if(sql!="") sql=sql+",";
				sql=sql+"Precio5="+p;
			}		
			
			if(sql!=""){
				Application.ADOCnn.Execute("UPDATE Producto SET "+sql+" WHERE Sys_PK="+PK);
			}
			
		}					
			
	}catch(e){
		Log("No se actualizarón los precios con respecto a la utilidad. Realice el proceso manualmente.");
	}

}

function numValue(R,field){
	try{
		if(R==null) return 0;
		if(R(field).Value==null) return 0;
		return R(field).Value;
	}catch(e){
	}	
}

function ActualizarQCompras(){
	var Brw;
	Brw=null;		
	Brw=Application.Browsers.GetBrowser("qCompras");
	if (Brw!=null) 
		Brw.RefreshRst();
}

function CrearPedido1(objAction){
	//eBasic.eMsgbox(objAction.Context.ActiveWindow.MyName);
	//if (objAction.Context.ActiveWindow==null)
		CrearPedido(null,0);
} 

function CrearRemision1(objAction){
	if (objAction.Context.ActiveWindow==null || objAction.Context.ActiveWindow.FormType==2)
		CrearRemision(null);
	else
		CrearRemision(objAction.Context.ActiveWindow.GetAxObject().ThisObj,0,objAction.Context.ActiveWindow);
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

function ModificarDocumento(ObjAction){	
	var Documento;
	Documento=ObjAction.Context.ActiveWindow.GetAxObject().ThisObj;
	if(Documento==null){
		Log("Error al obtener el Documento");
		return 0;
	}		
	if(Compra.ModificarDocumento(Documento)){
		Application.eDoEvents();
		ObjAction.Context.ActiveWindow.GetAxObject().ViewByObject(Documento);
		ObjAction.Context.ActiveWindow.Caption = "Documento: " + Documento.Referencia;		
	}else{
		Log(Compra.LastErrorDescrip);
	}
}

function EditarCompra(PK){
var dlg;
var ThisObj;
var ObjCompra;

	
//if (Application.AXForms.AXForm("EditCompra" + cntP)!=null)
	//cntP++;	
	Application.MouseHourglass();
	dlg=Application.AXForms.AXForm("EditCompra_PK" + PK);
	if(dlg!=null){
		Application.MouseDefault();
		dlg.Zorder();
		return 0;
	}
	
	if (PK > 0){
		ObjCompra = Application.NewObject("EDOFx.Compra");
		if (!ObjCompra.LoadFromADOConnection (PK,"",Application.adoCnn)){
			Log(ObjCompra.lastErrDescrip);
			Application.MouseDefault();
			return 0;
		}			
	}else{
		Log("Falta la clave del documento");
		Application.MouseDefault();
		return 0;
	}	
	
	//dlg=Application.AXForms.CreateForm("FormCompra","EditCompra" + cntP);
	dlg=Application.AXForms.CreateForm("FormCompra","EditCompra_PK" + PK);
	
	dlg.Hide();
	Application.eDoEvents();	
	switch(ObjCompra.Documento){
		case 1:
		 dlg.Caption = "Cotización: " + ObjCompra.Referencia;break;
		case 2:
		dlg.Caption = "Pedido: " + ObjCompra.Referencia;break;
		case 3:
		dlg.Caption = "Remisión: " + ObjCompra.Referencia;break;
		case 4:
		dlg.Caption = "Factura: " + ObjCompra.Referencia;break;
		case 5:
		dlg.Caption = "Nota de crédito: " + ObjCompra.Referencia;break;
	}
	AsignarCarpetaRepotes(dlg);
	
	//Asignar a ThisObj, el control Compra creado
	ThisObj = dlg.GetAXObject();
	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	//Inicializar Compra
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBCompra, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	
		switch (ObjCompra.Documento){
			case 3:
			case 4:
			case 5:
				dlg.AddButton("Nuevo documento en blanco","P_Compras_A23");
				dlg.AddButton("Nuevo igual a éste","P_Compras_A24");
				dlg.AddButton("Modificar Documento","P_Compras_A15");
				//jv - Implementación para mofificar datos generales de la DIOT.
				if(ObjCompra.Documento==4 && ObjCompra.StatusAdministrativo!=99)
				{
					dlg.AddButton("Datos generales DIOT", "P_Compras_N02");
				}
				if ((ObjCompra.Documento==4 && ObjCompra.StatusAdministrativo!=99) || (ObjCompra.Documento==3 && ObjCompra.StatusFacturacion==1 && ObjCompra.StatusAdministrativo!=99)){
				//if ((ObjCompra.Documento==3)||(ObjCompra.Documento==4)){
					//if (ObjCompra.StatusAdministrativo!=99){					
						dlg.AddButton("Cancelar Documento","P_Compras_A16");
					//}
				}
												
				ThisObj.ViewByObject(ObjCompra);
				dlg.Title = ThisObj.GetEstadoCompra();
				break;
			default:				
				ThisObj.SetOwnerForm(Application.MainForm);
				if(ObjCompra.StatusAdministrativo!=99 && ObjCompra.AplicadoA.Sys_PK==0){
					dlg.AddButton("Guardar (F6)","P_Compras_A12");
					dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
					dlg.AddButton("Buscar producto/servicio","P_Compras_A07");
					dlg.AddButton("Catálogo de Productos","P_Compras_A07_1");
					dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
					dlg.CmdKeyDown="UICompras.Command_KeyDown";
					//jv Productos similares - 27/11/2013
					dlg.AddButton("Productos similares","P_Compras_N01");			
					
					ThisObj.EditByObject(ObjCompra);
				}else{
					dlg.AddButton("Nuevo documento en blanco","P_Compras_A23");
					dlg.AddButton("Nuevo igual a éste","P_Compras_A24");
					dlg.AddButton("Modificar Documento","P_Compras_A15");
					ThisObj.ViewByObject(ObjCompra);
					dlg.Title = ThisObj.GetEstadoCompra();
				}
								
				break;
		}
		
	dlg.ShowButtons();	
	dlg.Show();	
	Application.MouseDefault();
	return -1;
}

function CrearPedido(Remision,PKProveedor){
var dlg;
var ThisObj;

	if (Application.AXForms.AXForm("DlgPedido" + cntP)!=null)
		cntP++;
		
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormCompra","DlgPedido" + cntP);
	dlg.CmdProxyEvent="UICompras.CapturarEvento"; //eventos del AXCompra	
	dlg.Caption = "Pedido";
	dlg.CmdKeyDown="UICompras.Command_KeyDown";
	
	AsignarCarpetaRepotes(dlg);
	
	//Asignar a ThisObj, el control Compra creado
	ThisObj = dlg.GetAXObject();
	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	//Inicializar Compra	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBCompra, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	//Si el pedido proviene de una remision, Asignar a Parent
	if (Remision!=null)
		dlg.GetAXObject().SetParentCompra(Remision); 
    
	//'Indicar que es un nuevo documento de compra
	ThisObj.AddNew();
	//Indicar documento a crear
	ThisObj.SetTipoDocumento (2);
	ThisObj.SetProveedor(PKProveedor);
	ThisObj.SetReferencia(gFunciones.ReferenciaAleatoria());
	//Divisa Predeterminada
	ThisObj.PredDivisa =FXConfig.DivisaPredeterminada();
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	dlg.AddButton("Guardar (F6)","P_Compras_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
	dlg.AddButton("Buscar producto/servicio","P_Compras_A07");
	dlg.AddButton("Catálogo de productos","P_Compras_A07_1");	
	dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
	
	//jv - Productos similares
	dlg.AddButton("Productos similares", "P_Compras_N01");
	dlg.ShowButtons();		
	dlg.ZOrder();	
	Application.MouseDefault();
			//Devuelve el Objeto COMPRA 
    
	
	return  ThisObj.ThisObj;

}

function GuardarPedido(objAction){
var ThisObj;
	//eBasic.eMsgbox(objAction.Context.ActiveWindow.MyName);
	 
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();
	
	Application.MouseHourglass();
	if (ThisObj.CurrentAction!=3){		
		if (ThisObj.Save()){			
			ThisObj.ViewByObject(ThisObj.ThisObj); 
			Application.MouseHourglass();
			objAction.Context.ActiveWindow.Caption="Pedido " +ThisObj.ThisObj.Referencia;			
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A12").Caption="Modificar Pedido";			
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A22").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07_1").Enabled=false;
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A27").Enabled=false;//15102011
			
			//jv - Productos similares - 27/11/2013
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_N01").Enabled=false; //Productos similares	
			if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A03")==null) 
				objAction.Context.ActiveWindow.AddButton("Generar Remisión","P_Compras_A03");
			else
				objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A03").Enabled=true;
				
			if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A04")==null) 
				objAction.Context.ActiveWindow.AddButton("Generar Factura","P_Compras_A04");
			else
				objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A04").Enabled=true;
				
			Application.MouseDefault();	
			
			eBasic.eMsgbox("¡El Pedido se guardó correctamente!",6);					
			return -1;
		}else{
			Application.MouseDefault();	
			return 0;
		}
	}else{
		if(EnProceso("IDCompra"+"_"+ThisObj.ThisObj.Referencia)==0){
			Application.MouseDefault();	
			return 0;
		}
			
		ThisObj.EditByObject(ThisObj.ThisObj);
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A12").Caption="Guardar (F6)";			
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07").Enabled=true;		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07_1").Enabled=true;
		
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A03")!=null) //botón generar remisión
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A03").Enabled=false;
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A04")!=null) //botón generar factura
			objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A04").Enabled=false;
			
		Application.MouseDefault();			
		return 0;
	}
	Application.MouseDefault();	
}

function CrearRemision(Pedido,PKProveedor,ParentWindow){
var dlg;
var ThisObj;
var Remision;

if (Pedido!=null){	
	if(EnProceso("IDCompra"+"_"+Pedido.Referencia)==0)
		return 0;
}


	if (Application.AXForms.AXForm("DlgRemision" + cntP)!=null)
		cntP++;
	
	Application.MouseHourglass();
	dlg = Application.AXForms.CreateForm("FormCompra","DlgRemision" + cntP);
	if (dlg==null){
		Application.MouseDefault();
		eBasic.eMsgbox("Error al crear compra");		
		return 0;
	}
	dlg.CmdProxyEvent="UICompras.CapturarEvento"; //eventos del AXCompra	
	dlg.Caption = "Remisión"
	dlg.TagData="IDCompra";
	dlg.CmdKeyDown="UICompras.Command_KeyDown";
	AsignarCarpetaRepotes(dlg);
	
	ThisObj = dlg.GetAXObject();
	//Inicializar compra
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects (Catalogos.GetEWFSourcePath(),LBCompra, Catalogos, Impuestos,Application.UIUsers);
    ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	// 'Proviene de un pedido
    if (Pedido!=null){
			dlg.TagData="IDCompra"+"_"+Pedido.Referencia;
			if(ParentWindow!=null)
				dlg.SetParent(ParentWindow);
			
			ThisObj.SetParentCompra(Pedido);
	          // 'Generar Remision de Pedido
	        Remision = Compra.lgBuy.GenerarDocCompra(Pedido, 3); //Remision
	        ThisObj.EditByObject (Remision);
	}else{   
			ThisObj.AddNew();
            ThisObj.SetTipoDocumento (3);  //Remision
			ThisObj.PredDivisa =FXConfig.DivisaPredeterminada();
			if (PKProveedor!=null)	ThisObj.SetProveedor(PKProveedor);
	}
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Compras_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
	dlg.AddButton("Buscar producto/servicio","P_Compras_A07");
	dlg.AddButton("Catálogo de Productos","P_Compras_A07_1");	
	dlg.AddButton("Documentos Incluidos","P_Compras_A09");	
	dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
	//jv - Productos similares
	dlg.AddButton("Productos similares", "P_Compras_N01");
	dlg.ShowButtons();		
	dlg.ZOrder();	
	Application.MouseDefault();
			//Devuelve el Objeto COMPRA 
	return  ThisObj.ThisObj;
}

function GuardarRemision(objAction){
var ThisObj;
var sPedido;
	
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();
	if (!ThisObj.Validate()) return 0;
	
	ThisObj.GetData();
	//Mostrar dialogo de cobro, --> Enviar  Categoria Predeterminada
	if (Compra.ShowDlgFormaPago(ThisObj.ThisObj,0,ThisObj.ParentCompra,true,ThisObj.ColDocCompra)){				
		Application.eDoEvents();
		ThisObj.ViewByObject(ThisObj.ThisObj);	
		Application.MouseHourglass();			
		//Cambiar la acción del boton guardar por modificar
		objAction.Context.ActiveWindow.SetActionToButton("P_Compras_A12","P_Compras_A15","Modificar Remisión");
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07_1").Enabled=false; //Agregar Producto y servicio
		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A09").Enabled=false; //Documentos incluidos
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A27").Enabled=false;//15102011
		
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_N01").Enabled=false; //Productos similares	
		objAction.Context.ActiveWindow.AddButton("Cancelar Remisión","P_Compras_A16");		
		if (objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A04")==null)
				objAction.Context.ActiveWindow.AddButton("Generar Factura","P_Compras_A04");
		
		//Camibar titulo
		objAction.Context.ActiveWindow.Caption="Remisión "+ThisObj.ThisObj.Referencia;
		DesactivarAccionesProcesadas(objAction.Context.ActiveWindow.Parent);
		Application.MouseDefault();
		eBasic.eMsgbox("¡La Remisión se guardó correctamente!",6);				
		return -1;
	}else{
		if(Compra.LastErrorDescrip!="")
			eBasic.eMsgbox(Compra.LastErrorDescrip,6);
		else
			Log("Error al guardar Remisión");
		
		return 0;
	}
			

}

function CrearFactura(Remision,PKProveedor,ObjFactura,ParentWindow){
var dlg;
var ThisObj;
var Factura;

if (Remision!=null){	
	if(EnProceso("IDCompra"+"_"+Remision.Referencia)==0)
		return 0;
}


	//Recibe un objeto Remision o Pedido
	if (Application.AXForms.AXForm("DlgFactura" + cntP)!=null)
		cntP++;
		
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormCompra","DlgFactura" + cntP);		
	dlg.CmdProxyEvent="UICompras.CapturarEvento"; //eventos del AXCompra	
	dlg.Caption = "Factura";
	dlg.TagData="IDCompra";
	
	dlg.CmdKeyDown="UICompras.Command_KeyDown";
	
	AsignarCarpetaRepotes(dlg);
	
	//Asignar a ThisObj, el control Compra creado
	ThisObj = dlg.GetAXObject();
	//Inicializar Compra	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBCompra, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	//Proviende de Remision
	if (Remision!=null){		
		dlg.TagData="IDCompra"+"_"+Remision.Referencia;
		if(ParentWindow!=null)
			dlg.SetParent(ParentWindow);
		ThisObj.SetParentCompra(Remision);
			Factura=ObjFactura;
			//Generar Factura a partir de Remision, siempre que Factura sea nulo.
			if (Factura==null) Factura = Compra.lgBuy.GenerarDocCompra(Remision, 4); //cFactura
        ThisObj.EditByObject (Factura);
	}else{
		ThisObj.AddNew();
        ThisObj.SetTipoDocumento (4);  //Factura		
		ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
		ThisObj.SetProveedor(PKProveedor);
	}
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Compras_A12");
	dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
	dlg.AddButton("Buscar producto/servicio","P_Compras_A07");	
	dlg.AddButton("Catálogo de Productos","P_Compras_A07_1");	
	dlg.AddButton("Documentos Incluidos","P_Compras_A09");	
	dlg.AddButton("Incluir Consignaciones","P_Compras_A17");
	dlg.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011	
	dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
	//jv - Productos similares
	dlg.AddButton("Productos similares", "P_Compras_N01");
	dlg.AddButton("Datos generales DIOT", "P_Compras_N02");
	
	dlg.GetButtonByIDAction("P_Compras_N02").Enabled = false;
	dlg.ShowButtons();		
	dlg.ZOrder();	
	Application.MouseDefault();
}

function GuardarFactura(objAction){
var ThisObj;
	ThisObj = objAction.Context.ActiveWindow.GetAxObject();	
	
	if (!ThisObj.Validate()) return 0;
	
	ThisObj.GetData();	
	
	if (Compra.ShowDlgFormaPago(ThisObj.ThisObj,0,ThisObj.ParentCompra,true,ThisObj.ColDocCompra,ThisObj.ColConsignaciones,ThisObj.ExtInfoLotesSeriesCol)){        
		Application.eDoEvents();
		ThisObj.ViewByObject(ThisObj.ThisObj); 
		Application.MouseHourglass();	
		//Cambiar la acción del boton guardar por modificar
		objAction.Context.ActiveWindow.SetActionToButton("P_Compras_A12","P_Compras_A15","Modificar Factura");		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07_1").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A09").Enabled=false; //Documentos incluidos
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A17").Enabled=false; //Incluir Consignaciones		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A25").Enabled=false; //cargar cfd//gb02062011
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A27").Enabled=false;//15102011
		
		objAction.Context.ActiveWindow.AddButton("Cancelar Factura","P_Compras_A16");				
		//jv - Productos similares - 27/11/2013
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_N01").Enabled=false; //Productos similares	
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_N02").Enabled=true; //Productos similares
		
		
		//objAction.Context.ActiveWindow.AddButton("Imprimir","P_Compras_A20");				
		
		//cambiar titulo
		objAction.Context.ActiveWindow.Caption="Factura "+ThisObj.ThisObj.Referencia;
		objAction.Context.ActiveWindow.TagData="IDCompra"; //Esto permite crear mas facturas de una remisión en consignación.
		DesactivarAccionesProcesadas(objAction.Context.ActiveWindow.Parent);
		
		//CREAR PÓLIZA
		Poliza.PolizaCompraFacturacion(ThisObj.ThisObj);
		Application.MouseDefault();
		eBasic.eMsgbox("¡La factura se guardó correctamente!",6);
		
		//Guardar en Diot
		DIOT(ThisObj.ThisObj.Sys_PK, false);
		// aca debe ir la impresion
		var Formato = eBasic.AddSlashPath(Application.GetPath(0)) + "Reports\\Compras\\Factura_Compra.xpd";
		Reportes.EjecutarReporte(Formato,1,0,false,"","pPrimarykey",ThisObj.ThisObj.Sys_PK,null);
		return -1;
		
    }else{
		Log(Compra.LastErrorDescrip);
		return 0;
	}
	
}

function CrearNotaC(Documento,PKProveedor,Copia,NoEditar){
	//Documento puede ser: Remision o factura
var dlg;
var ThisObj;
var Nota;

if(Copia==null)
	Copia=false;
if(NoEditar==null)
	NoEditar=false;
	
	//Recibe un objeto Remision o Pedido
	if (Application.AXForms.AXForm("DlgNota" + cntP)!=null)
		cntP++;
		
	Application.MouseHourglass();
	dlg=Application.AXForms.CreateForm("FormCompra","DlgNota" + cntP);	
	dlg.CmdProxyEvent="UICompras.CapturarEvento"; //eventos del AXCompra	
	dlg.Caption = "Nota de Crédito";		
	dlg.CmdKeyDown="UICompras.Command_KeyDown";
	AsignarCarpetaRepotes(dlg);
	
	ThisObj = dlg.GetAXObject();
	//Inicializar Compra	
	FXConfig.FormatoAXCompraVenta(ThisObj);	
	ThisObj.SetObjects(Catalogos.GetEWFSourcePath(),LBCompra, Catalogos, Impuestos,Application.UIUsers);
	ThisObj.SetUIAsistentes(MXCAsistentes);
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	if (Documento!=null){
		ThisObj.SetParentCompra(Documento);
		//Generar Nota de Credito
		Nota = Compra.lgBuy.GenerarDocCompra(Documento,5,Copia) //Nota de Credito
		if(NoEditar)
			ThisObj.ViewByObject(Nota);
		else
			ThisObj.EditByObject(Nota);
		
	}
	else{
		ThisObj.AddNew();
        ThisObj.SetTipoDocumento (5);  //Nota de Credito
		ThisObj.PredDivisa = FXConfig.DivisaPredeterminada();
		ThisObj.SetProveedor(PKProveedor);
		ThisObj.SetReferencia(gFunciones.ReferenciaAleatoria());
	}
	
	// Metodo de Calculo para la compra
	ThisObj.SetMtdPorcentaje (FXConfig.MtdCalculoP());
	ThisObj.SetOwnerForm(Application.MainForm);
	dlg.SetProxyEvents(ThisObj.ProxyEvent()); //asignar manejador de eventos
	
	dlg.AddButton("Guardar (F6)","P_Compras_A12");	
	dlg.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
	dlg.AddButton("Buscar producto/servicio","P_Compras_A07");	
	dlg.AddButton("Catálogo de Productos","P_Compras_A07_1");	
	dlg.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011
	dlg.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011

	//jv - Productos similares
	dlg.AddButton("Productos similares", "P_Compras_N01");
	//dlg.AddButton("Documentos Incluidos","P_Compras_A09");	
	dlg.ShowButtons();
	
	if (NoEditar){
		dlg.GetButtonByIDAction("P_Compras_A07").Enabled=false; //Agregar Producto y servicio
		//dlg.GetButtonByIDAction("P_Compras_A09").Enabled=false; //Documentos incluidos
	}		
	dlg.ZOrder();	
	Application.MouseDefault();
}

function GuardarNota(objAction){
var ThisObj;

	ThisObj = objAction.Context.ActiveWindow.GetAxObject();	
	if (!ThisObj.Validate()) return 0;
	
	ThisObj.GetData();
	if(Compra.lgBuy.DevolucionXNotaCredito(ThisObj.ThisObj,true,ThisObj.ParentCompra)){
		ThisObj.ViewByObject(ThisObj.ThisObj); 	
		Application.MouseHourglass();	
		//Cambiar la acción del boton guardar por modificar
		objAction.Context.ActiveWindow.SetActionToButton("P_Compras_A12","P_Compras_A15","Modificar Nota de Crédito");		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A22").Enabled=false;
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A07_1").Enabled=false; //Agregar Producto y servicio
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A25").Enabled=false; //cargar cfd//gb02062011
		//objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A09").Enabled=false; //Documentos incluidos
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A27").Enabled=false;//15102011
		
		Poliza.PolizaCompraDevolucionXNotaCredito(ThisObj.ThisObj);
		Application.MouseDefault();
		eBasic.eMsgbox("¡La Nota de Crédito se guardó correctamente!",6);
// aca debe ir la impresion
		var Formato = eBasic.AddSlashPath(Application.GetPath(0)) + "Reports\\Compras\\NCredito_Compra.xpd";
		Reportes.EjecutarReporte(Formato,1,0,false,"","pPrimarykey",ThisObj.ThisObj.Sys_PK,null);		
		return -1;
	}else{
		if(Compra.lgBuy.LastErrorDescrip!="")
			eBasic.eMsgbox(Compra.lgBuy.LastErrorDescrip,6);
		else
			Log("Error no se pudo guardar la Nota de Crédito");
		return 0;
	}
}


function DevolucionDeConsignacion(ObjCompra){
	if(Compra.DevolucionDeCosignacion(ObjCompra)){
		eBasic.eMsgbox("¡La devolución se hizo correctamente!",6);
		ActualizarQCompras();
	}
}

function OpcionesCompra(){
var Brw;
var ThisObj; //Objecto Compra
var PKCompra;
Brw=null;
PKCompra=null;
Brw=Application.Browsers.GetBrowser("qCompras");

	
if (Brw==null) return 0;
	
	PKCompra= Brw.PrimaryKeyValue;
	if (PKCompra==null){
		OptVntNew();
		return 0;
	}
	
	ThisObj = Application.NewObject("EDOFx.Compra");
		
	if (ThisObj.LoadFromADOConnection (PKCompra,"", Application.adoCnn,3))
	{
		//Si el documento no es de solo lectura ó es una remisión pero esta parcialmente facturada
		if (!Compra.lgBuy.DocOnlyRead(ThisObj) || (ThisObj.Documento==3 && ThisObj.StatusFacturacion==2)) {
			switch(ThisObj.Documento){
				case 2:
				    OptVntPedido(ThisObj);break;
				case 3:
					OptVntRemision(ThisObj);break;
				case 4:
					OptVntFactura(ThisObj);break;
				case 5:
					OptVntNew();break;
			} 
		}else{
				OptVntNew();
		}
	}
	
}

function OptVntPedido(ObjCompra){
var ask;
var opc;

	
	ask=Application.NewAsk();
	if (ObjCompra.StatusAdministrativo!=99){
		if(ObjCompra.StatusEntrega==1){
			ask.SetOption(10,"Registrar la recepción de mercancías","Se generá una remisión para la mercancía contenida en el pedido actualmente seleccionado.");
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
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			CrearRemision(ObjCompra,0); break;
		case 20:
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			CrearFactura(ObjCompra,0,null);  break;
		case 30:
			CrearPedido(null,0); break;
		// case 40:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
	}
	ask=null;
}

function OptVntRemision(ObjCompra){
var ask;
var opc;
	
	ask=Application.NewAsk();		
	if (ObjCompra.StatusAdministrativo!=99){
		if(ObjCompra.StatusFacturacion==1){			
			ask.SetOption(10,"Facturar esta remisión","Se generá una factura que ampare la remisión actualmente seleccionada.");
		}else{			
			if(ObjCompra.StatusFinanciero==3 && ObjCompra.StatusFacturacion==2)
				ask.SetOption(10,"Facturar productos restantes en consignación","Se generá una factura que ampare el resto de productos que no han sido facturados.");
		}		
		
		if(ObjCompra.StatusFacturacion==1)			
			ask.SetOption(20,"Cancelar remisión","Elija esta opción si desea cancelar la remisión seleccionada.");
		
		//Validar si el Documento se encuentra en consignacionn
		if (ObjCompra.StatusFinanciero==3)
			ask.SetOption(50,"Devolver mercancía en consignación","El sistema generará una nota de credito por la devolución de la mercancía");
	}
			
	ask.SetOption(30,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a realizar un nuevo documento.");
	//ask.SetOption(40,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	opc = ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10: 	
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			//Validar si Documento esta en consignación 
			if (ObjCompra.StatusFinanciero==3){	
				FacturarConsignacion(ObjCompra);
			}
			else{
				CrearFactura(ObjCompra,0,null);
			}
			break;
		case 20:
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			CancelarObjCompra(ObjCompra);  break;     
		case 30:
			CrearRemision(null,0); break;
		// case 40:
			// eBasic.eMsgbox("Implementar Asistentes"); break;
		case 50:
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			DevolucionDeConsignacion(ObjCompra);break;
	}
	ask=null;
}

function OptVntFactura(ObjCompra){
var ask;
var opc;

	ask=Application.NewAsk();
	if (ObjCompra.StatusAdministrativo!=99)
		ask.SetOption(10,"Cancelar la Factura Actual","Se generá una factura que ampare la Factura actualmente seleccionada.");
	
	ask.SetOption(20,"Nuevo Documento en Blanco","Eliga esta opción si desea empezar a registrar un nueva nota de credito.");
	//ask.SetOption(30,"Asistente para nuevos Documentos","Eliga esta opción si desea que un asistente le guie para realizar un nuevo documento");	
	
	
	opc=ask.Ask();	
	if(opc==0) return 0;
	
	switch(opc)
	{
		case 10: 	
			if(EnEdicion("EditCompra_PK" +ObjCompra.Sys_PK)==-1) return 0;
			CancelarObjCompra(ObjCompra);  break;     
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

function CancelarObjCompra_XAccion(ObjAction){
	//cancela un objeto cuando se oprime el boton cancela desde el formulario de documento
	CancelarDocumento(null,null,ObjAction);
}

function CancelarObjCompra(Obj){
	//Cancela un objeto compra
	CancelarDocumento(null,Obj);
}

function CancelarDocumento(PKCompra,ObjCompra,ObjAction){
var Brw;

	Brw=null;
	Compra.lgBuy.NotaCreditoPorCancelacion=false;
	
	if(PKCompra!=null){		
		ObjCompra = Application.NewObject("EDOFx.Compra");
		if (!ObjCompra.LoadFromADOConnection (PKCompra,"", Application.adoCnn,3)){
			if(ObjCompra.lastErrDescrip!="")
				eBasic.eMsgbox(ObjCompra.lastErrDescrip,6);
			else
				eBasic.eMsgbox("Error al cancelar no su pudo cargar el documento.",6);
				
			return 0;
		}
			
	}else{
		if(ObjAction!=null){
			ObjCompra=ObjAction.Context.ActiveWindow.GetAxObject().ThisObj;
		}else{
			if(ObjCompra==null){
				eBasic.eMsgbox("Error al cancelar no ha indicado el documento.",6);
				return 0;
			}
		}
	}	
	
	if(EnProceso("IDCompra"+"_"+ObjCompra.Referencia)==0)
		return 0;	
	
	if (!Compra.lgBuy.PermitirCancelarDocumento(ObjCompra)){
		eBasic.eMsgbox("No se puede cancelar el documento seleccionado.",6);
		return 0;
	}else{
		if (eBasic.eMsgbox("¿Está seguro que desea cancelar el documento actualmente seleccionado?", 4)==7)
			return 0;
	}
	
	if (Compra.lgBuy.CancelarCompra(ObjCompra)){					
		if(ObjCompra.Documento==4){ //SI SE CANCELÓ UNA FACTURA
			Application.MouseHourglass();	
			Poliza.PolizaCompraCancelacionFactura(ObjCompra);
			Application.MouseDefault();
		}
	
		eBasic.eMsgbox("¡El Documento se canceló correctamente!",6);
		//Si el documento se cancela correctamente, entonces deshabilita el botón Cancelar
		 if (ObjAction!=null){
			 ObjAction.Context.ActiveWindow.Title="Documento cancelado";
			 ObjAction.Context.ActiveWindow.HideButtons();
		}
		ActualizarQCompras();	
		return -1;
	}else{
		if (Compra.lgBuy.NotaCreditoPorCancelacion){
			CrearNotaC(ObjCompra,null,true,true); //apartir de la factura,0,copiar,noeditar
		}else{
			if (Compra.lgBuy.LastErrorDescrip!="")
				eBasic.eMsgbox(Compra.lgBuy.LastErrorDescrip,6);			
			else			
				Log("Error al cancelar documento");
		}
		return 0;
	}
	
 	
}

function FacturarConsignacion(ObjCompra){
var Fact;
	Fact = null;
    Fact = Compra.GenerarFacturarDeConsignacion(ObjCompra);
		
	if (Fact!=null)
           CrearFactura(ObjCompra,0,Fact);
 }

function TituloCompra(SysPK){
var ThisObj;
var OtherObj;
var Brw;
Brw=null;
if (SysPK==null) return 0;
	
	ThisObj = Application.NewObject("EDOFx.M_Compra");// EDOFx.M_Compra
	if (ThisObj.LoadFromADOConnection (SysPK,"", Application.adoCnn)){
			
		if (ThisObj.FK_AplicadoA!=0 && ThisObj.FK_AplicadoA!=null){
			//Existe una relacion
			OtherObj = Application.NewObject("EDOFx.M_Compra");
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
			ThisObj = Application.NewObject("EDOFx.Compra");
			if (!ThisObj.LoadFromADOConnection (SysPK,"", Application.adoCnn)){
				Log(ThisObj.lastErrDescrip);
				return 0;				
			}
		}
		
		Brw=Application.Browsers.GetBrowser("qCompras");
		if (Brw!=null){		
			switch (ThisObj.Documento){
				case 1: 
					TituloCotizacion(OtherObj,Brw);break;
				case 2: 
					TituloPedido(ThisObj,OtherObj,Brw);break;
				case 3:
					TituloRemision(ThisObj,OtherObj,Brw);break;
				case 4:
					TituloFactura(ThisObj,OtherObj,Brw);break;
				case 5:
					Brw.SetTitle("Nota de crédito procesada");break;
			}
		}else
			Log("Error al obtener el estado actual del documento.");
	}else{
		Log(ThisObj.lastErrDescrip);
	}
}

function TituloCotizacion(OtherObj,Brw){
//Si esta aplicado : Cotizacion incluida en el documento :OtherObj.Referencia
// No aplicado : Cotización 
	if (OtherObj!=null){
		Brw.SetTitle("Cotización incluida en el documento: " + OtherObj.Referencia);			
	}else
		Brw.SetTitle("Cotización");		
}
function TituloPedido(ThisObj,OtherObj,Brw){
	
	if (OtherObj!=null){
		Brw.SetTitle("Pedido recibido, según consta el documento: " + OtherObj.Referencia);			
	}else{
		if(ThisObj.StatusEntrega==1){
			Brw.SetTitle("Pedido por Recibir");	
		}else{
			if(ThisObj.StatusAdministrativo==99)
				Brw.SetTitle("Pedido Cancelado");	
			else
				Brw.SetTitle("Pedido");	
		}
	}
}

function TituloRemision(ThisObj,OtherObj,Brw){
//Remision Pagada,, Remision Credito, Remison Consignacion, Remision esta Facturada segunb doc
// eBasic.eMsgbox("Doc:"+ThisObj.Referencia +"   Relac:"+OtherObj.Referencia);
// eBasic.eMsgbox("Doc:"+ThisObj.Documento +"   Relac:"+OtherObj.Documento);
	if (OtherObj!=null){
		//Existe una relacion		
		Brw.SetTitle("Remisión Facturada, según consta el documento: " + OtherObj.Referencia);			
	}else{				
		switch (ThisObj.StatusFinanciero){
			case 0:
				Brw.SetTitle("");break;
			case 1:
				Brw.SetTitle("Remisión con adeudo");break;
			case 2:
				Brw.SetTitle("Remisión pagada el "+Application.DateToString(ThisObj.FLiquidacion));break;
			case 3:				
				Brw.SetTitle("Remisión en consignación");break;
		}
		if (ThisObj.StatusAdministrativo==99){
			Brw.SetTitle("Remisión cancelada");
		}
	}

}

function TituloFactura(ThisObj,OtherObj,Brw){
// statusFinanciero = 1  Factura a Credito
// statusFinanciero = 2  Factura Pagada
// Si esta aplicado a un documento y statusadmnistrativo = 99--- Factura Cancelada Segun Documento : otherobj.referencia
	if (OtherObj!=null && ThisObj.StatusAdministrativo==99){
		//Existe una relacion
		Brw.SetTitle("Facturada cancelada, según consta el documento: " + OtherObj.Referencia);			
	}else{
		switch (ThisObj.StatusFinanciero){
			case 0:
				Brw.SetTitle(" ");break;
			case 1:
				Brw.SetTitle("Factura a crédito");break;
			case 2:
				Brw.SetTitle("Factura pagada el " +Application.DateToString(ThisObj.FLiquidacion));break;			
		}
		if (ThisObj.StatusAdministrativo==99){
			Brw.SetTitle("Factura cancelada");
		}
	}
}

function ImprimirDocumento(AXForm){
	UIVentas.ProcesarReporte(AXForm,2);
}

function PrevisualizarDocumento(AXForm){
	UIVentas.ProcesarReporte(AXForm,1);
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
			AXForm.GetButtonByIDAction("P_Compras_A03").Enabled=false; //generar remision
			AXForm.GetButtonByIDAction("P_Compras_A04").Enabled=false;//generar factura
			AXForm.SetActionToButton("P_Compras_A12","P_Compras_A15","Modificar Pedido");		
			break;
		case 3: //remision
			AXForm.GetButtonByIDAction("P_Compras_A16").Enabled=false; //cancelar remision
			AXForm.GetButtonByIDAction("P_Compras_A04").Enabled=false;//generar factura
			break;
	}	
 }

 function AsignarCarpetaRepotes(Window){
	Window.ReportsFolder=Reportes.CarpetaCompras;
	Window.ObjectTypeName="Compra";	
 }
 
 function Command_KeyDown(KeyCode){
	if(KeyCode==null) return 0;
	
	var id="";	
	
	switch(KeyCode){
		case 117: //F6
			id="P_Compras_A12";break;
		case 119: //F8
			id="P_Compras_A22";break;		
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
	AX.AddButton("Guardar (F6)","P_Compras_A12");
	AX.AddButton("Guardar y cerrar (F8)","P_Compras_A22");
	AX.AddButton("Buscar producto/servicio","P_Compras_A07");
	AX.AddButton("Catálogo de Productos","P_Compras_A07_1");
	switch(Doc){				
		case 2: //Pedido						
			AX.Caption="Pedido";break;				
		case 3: //Remisión						
			AX.Caption="Remisión";			
			AX.AddButton("Documentos Incluidos","P_Compras_A09");	
			break;
		case 4: //Factura		
			AX.Caption="Factura";						
			AX.AddButton("Documentos Incluidos","P_Compras_A09");	
			AX.AddButton("Incluir Consignaciones","P_Compras_A17");
			AX.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011
			break;
		case 5: //NCrédito					
			AX.Caption="Nota de Crédito";
			AX.AddButton("Cargar CFD","P_Compras_A25"); //gb02062011
	}

	AX.AddButton("Importar archivo mvi","P_Compras_A27"); //15102011
}

function CapturarEvento(ID){
	var AX;
	AX=Application.ActiveWindow();
	switch(ID){
		case "DocTypeChange": CambioTipoDocumento(AX);break;		
	}
}

//************************** 2010*****
function Detail(){

	var r=null;
	var p;
	try
	{

		p=Application.GetDetailPanel();
		p.SetCaption("Detalle de la Compra: " + GetReferencia(p.CurrentValue));
		r=Application.Database.OpenRecordset("Select DCompra.Sys_PK,Producto.Descripcion as Producto,DCompra.Cantidad,DCompra.Unidad,DCompra.Precio*DCompra.Cantidad as Subtotal,DCompra.Descuento1+DCompra.Descuento2 as Descuentos, DCompra.Impuesto1+DCompra.Impuesto2+DCompra.Impuesto3+DCompra.Impuesto4 as Impuestos,(DCompra.Precio*DCompra.Cantidad)-DCompra.Descuento1-DCompra.Descuento2+DCompra.Impuesto1+DCompra.Impuesto2+DCompra.Impuesto3+DCompra.Impuesto4 as Total FRom DCompra INNER JOIN Producto ON DCompra.IProducto=Producto.Sys_PK  Where DCompra.FK_Compra_Detalle="+p.CurrentValue,Application.adoCnn);
		
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
		return;
	}
}

function GetReferencia(PK){

	var r=null;
	var s;
	try
	{
		r=Application.Database.OpenRecordset("SELECT Referencia FROM Compra WHERE Sys_PK="+PK,Application.adoCnn);
		if (!(r.EOF && r.BOF))
			s=r.Fields("Referencia").Value;
		else
			s="No se encontró la compra";
		r.Close();
		return s;
	}
	catch(e)
	{
		return "Error al buscar la compra";
	}
}
//**************************

function Nuevo(objAction){
var Ax;	
	try{
		Ax=objAction.Context.ActiveWindow.GetAxObject();
		switch(Ax.ThisObj.Documento){
			//case 1: CrearCotizacion(0); break;		
			case 2: CrearPedido(null,0); break;
			case 3: CrearRemision(null); break;
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
		if(NV.Documento==2) NV.Referencia=gFunciones.ReferenciaAleatoria();
		
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



function CargarCFD(objAction){ //gb02062011
	var AxObj;
	var str,c,xml,fmt,xmlopt,fmtopt;
	
	str=Compra.SeleccionarArchivosCFD();
	if(str==null) str="";
	if(str=="") return 0;
	c=str.split("|");
	xml=c[0];
	if(xml==null || xml=="") return 0;
	xmlopt=parseInt(c[1]);
	
	fmt=c[2];
	if(fmt==null) fmt="";
	fmtopt=parseInt(c[3]);
	if(!Compra.RegistrarProductosDesdeCFD(xml)){
		Log("No se puede continuar porque algunos productos no se encuentran registrados en el sistema.");
		return 0;
	}
	Application.eDoEvents();
	AxObj=objAction.Context.ActiveWindow.GetAXObject();
	if(AxObj.LoadCFD(xml)){
		AxObj.xmlCFD=xml;
		AxObj.fmtCFD=fmt;
		AxObj.xmlopt=xmlopt;
		AxObj.fmtopt=fmtopt;		
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A09").Enabled=false; //Documentos incluidos
		objAction.Context.ActiveWindow.GetButtonByIDAction("P_Compras_A17").Enabled=false; //Incluir Consignaciones		
	}
}

function GuardarCFDRelacionado(objAction){
	try{
		var AxObj=objAction.Context.ActiveWindow.GetAXObject();
		var xurl=false;
		var furl=false;
		if(AxObj.ThisObj.Documento!=4 && AxObj.ThisObj.Documento!=5) return 0;
		
		if(AxObj.xmlCFD!="" && AxObj.xmlopt!=3){
			 if(AxObj.xmlopt==2) xurl=true;
			 Compra.GuardarXmlCFD(AxObj.ThisObj.Sys_PK,AxObj.xmlCFD,xurl);
		}
		if(AxObj.fmtCFD!="" && AxObj.fmtopt!=3){
			if(AxObj.fmtopt==2) furl=true;			
			Compra.GuardarRepresentacionImpresaCFD(AxObj.ThisObj.Sys_PK,AxObj.fmtCFD,furl);
		}		
	}catch(e){
		Log("Error al intentar guardar archivos del CFD relacionados a la compra.");		
	}
}

function ArchivosCompra(){
	var Brw,PKCompra,r;
	try{
		Brw=Application.Browsers.GetBrowser("qCompras");	
		if (Brw==null) return 0;	
		PKCompra= Brw.PrimaryKeyValue;
		if(PKCompra==null) PKCompra=0;
		if(PKCompra==0){
			Log("Seleccione una compra.");
			return 0;
		}
		r=Application.Database.OpenRecordset("SELECT Sys_GUID,Referencia FROM Compra WHERE Sys_PK="+PKCompra,Application.ADOCnn);
		if(r==null){
			Log("No fue posible acceder al expediente");
			return 0;
		}
		if(r.EOF && r.BOF){
			Log("No se encontró el registro.");
			return 0;
		}
		
		Expediente.CanAddDocument="FX1-20-20-601";
		Expediente.CanAddLink = "FX1-20-20-602";
		Expediente.CanEdit = "FX1-20-20-603";
		Expediente.CanDeleteDocument = "FX1-20-20-604";
		Expediente.CanDeleteLink = "FX1-20-20-605";
		Expediente.BrowseDlg(r("Sys_GUID").Value,r("Referencia").Value,"Compra");
		r.Close();
		r=null;
	}catch(e){
	}
}

function ImportarMVI(A){ //15102011
	var ctr=A.Context.ActiveWindow.GetAXObject();
	ctr.ImportarArchivoMVI();
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

//Nueva implementación de métodos 2014
//Autor: jv 
//Fecha: 27-11-2013
function BuscarSimilares(objAction)
{
	var Code = "";
	var r = null;
	var dlgSimilares = "";
	var PK = 0;
	var Grupo = 0;
	var PKAlmacen = 0;
	var PKProducto = 0;
	var SQL = "";
	
	try
	{
		if (objAction.Context.ActiveWindow!=null){		
			Code = objAction.Context.ActiveWindow.GetAxObject().ObtenerProductoSeleccionado;
			PKAlmacen =  objAction.Context.ActiveWindow.GetAxObject().ObtenerAlmacenSeleccionado();
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
			
			if(PKAlmacen > 0)
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

function DIOT_(ObjAction)
{
	var Documento;
	Documento=ObjAction.Context.ActiveWindow.GetAxObject().ThisObj;
	if(Documento==null){
		Log("Error al obtener el Documento");
		return 0;
	}
	DIOT(Documento.Sys_PK, true);
}

function DIOT(pkCompra, edit)
{
	try
	{
		if(!edit)
		{
			var pkDiot=Diot.GuardarDiotCompra(pkCompra, false);
			if(pkDiot>0)
			{
				Diot.EditarDiot(pkDiot);
			}
		}
		else
		{
			Diot.EditByPrimary(pkCompra, "ICompra");
		}
	}
	catch(e)
	{	
		eBasic.eMsgbox("Error. "+e.description);
	}
}
