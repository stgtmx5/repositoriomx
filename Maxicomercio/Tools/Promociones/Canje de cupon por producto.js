function CanjeCuponXProducto(){	    
	var EdoFX;	
	var CanjeCupon;
	var Config;
	var Inventario;
	Config=Application.InternalObject("FXConfig");	
	EdoFX=Application.InternalObject("DataAccess");	
	Inventario=Application.InternalObject("Inventario");	
	
	if(EdoFX==null || Config==null || Inventario==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	CanjeCupon=Application.NewObject("UICanjeCupon.lgCanjeCupon");		
	if(CanjeCupon==null){
		eBasic.eMsgbox("Error al crear UICanjeCupon.lgCanjeCupon",6);
		return 0;
	}
	
	CanjeCupon.SetConnection(EdoFX);
	CanjeCupon.SetInventario(Inventario);
	CanjeCupon.CategoriaPredeterminada=Config.CategoriaInventarioPromociones();
	return CanjeCupon.CanjeCuponProductos("",0,true);					
}

CanjeCuponXProducto();