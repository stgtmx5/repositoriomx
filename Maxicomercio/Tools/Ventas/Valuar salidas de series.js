function ValuarSalidasDeSeries(){    
	var ProcVentas;
	var EDOFX;
	var LBInventario;		
	
	LBInventario=Application.InternalObject("LBInventario");		
	EDOFX=Application.InternalObject("DataAccess");	
	
	if(EDOFX==null || LBInventario==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	ProcVentas=Application.NewObject("geProcVntXSalir.Actions");
	if(ProcVentas==null){
		eBasic.eMsgbox("Error al crear objeto geProcVntXSalir.Actions",6);
		return 0;
	}
	ProcVentas.SetObjects(EDOFX,LBInventario,Application.UIUsers);		
	ProcVentas.ShowValuarSeries();
}
ValuarSalidasDeSeries();