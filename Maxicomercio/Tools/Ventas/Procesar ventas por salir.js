function ProcesarVentasXSalir(){    
	var ProcVentas;
	var EDOFX;
	var LBInventario;	
	var Config;
	
	LBInventario=Application.InternalObject("LBInventario");		
	EDOFX=Application.InternalObject("DataAccess");	
	Config=Application.InternalObject("FXConfig");
	if(EDOFX==null || LBInventario==null || Config==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	ProcVentas=Application.NewObject("geProcVntXSalir.Actions");
	if(ProcVentas==null){
		eBasic.eMsgbox("Error al crear objeto geProcVntXSalir.Actions",6);
		return 0;
	}
	ProcVentas.SetObjects(EDOFX,LBInventario,Application.UIUsers);			
	ProcVentas.SetCat(Config.CategoriaInventarioVentas()); //Categoria predeterminada de inventario para ventas
	ProcVentas.ShowVntXSalir();
}
ProcesarVentasXSalir();