//Versión: 0.9.0.4

//Topicos de ayuda conocidos
var CHM_HOME=20000;

//Iconos incluidos en la aplicación
//var ICON32_HOME="ICON32_HOME";
//SMICON_FLD1
var inDataBaseType = 0;

function CreateShortCuts(){
	
		
		Application.UIShortCuts.Clear();
		UIMiEmpresa.CrearPanel();
		UIFinanzas.CrearPanel();
		UIVentas.CrearPanel();
		UICxC.CrearPanel();
		UIInventario.CrearPanel();
		UICompras.CrearPanel();
		UICxP.CrearPanel();
				
		try{
			UIEjercicio.CrearPanel(); //agregado
			//if(gFunciones.CFDActivo()) 
			cfd.CrearPanel();	//agregado mayo-2010
			UIGastos.CrearPanel(); //jun 2011
			MaxicomercioBI.CrearPanel(); //dic 2011
		}catch(e){
			if(e.description!=null) eBasic.eMsgbox("Error "+e.description);
		}
		
		//Version 2014 - JV 
		try{
			UICRM.AddControlCRM(); //Módulo de CRM
			UICRM.AddControlAdmonCRM();
			UIRequisiciones.CrearPanel(); //Módulo de requisiciones
		}catch(e){
		}
		
		try
		{
			UIFoliosPolizas.CrearPanel(); //Tipos de póliza
			Contabilidad.SetObjectFld(UIFoliosPolizas.FoliosPolizas);	
		}
		catch(e)
		{
			
		}
		
		
		//evento
		try{
			Eventos.AIIU();
		}catch(e){			
		}
		//fin evento
	Application.BuildUI();
	GetDataBaseType();
}

/*
function Dispose(){
//Elimina los objetos cargados por el sistema
	eBasic.eMsgbox("aqui estoy");
	Application.SetNothing(Compra);
/*	
	DataAccess
	Catalogos=null;
	Paises=null;
	LBEfectivo=null;
	LBInventario=null;
	Inventario=null;
	LBCXC=null;
	CuentasXCobrar=null;
	CuentasXPagar=null;
	LBCxP=null;
	Impuestos=null;
	LBCompra=null;
	Compra=null;
	DataAccessConta=null;
	LBContabilidad=null;
	Contabilidad=null;
	gFunciones=null;
	LBVenta=null;
	Venta=null;
	Promocion=null;
	LBPromocion=null;
	Configuracion=null;
	Expediente=null;
	DocAccess=null;
	Imagenes=null; 
}*/



function FillComboYears(Brw,Top,SelectedMoth,SelectedYear){
	var i;
	var Fecha;
	for (i=1900;i<=2050;i++){
		if (Top) 
			Brw.TopComboAdd(i,i+"");
		else
			Brw.BottomComboAdd(i,i+"");
	}
	
	Fecha=new Date();
	if (Top){
		if (SelectedMoth) Brw.SelectTopTab(Fecha.getMonth());						
		if (SelectedYear) Brw.TopComboItem(Fecha.getYear());	
	}else{
		if (SelectedMoth) Brw.SelectBottomTab(Fecha.getMonth());						
		if (SelectedYear) Brw.BottomComboItem(Fecha.getYear());	
	}
}

function GetDataBaseType(){

		var sql;
		var R = eBasic.eCreateObject("ADODB.Recordset");
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
			
			inDataBaseType = 2;
			return 1;
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
			inDataBaseType = 1;
			return 1;
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
			
			inDataBaseType = 3;
			//Access
			return -1;
		}
		catch(e)
		{
			//Finaliza
		}		
}