function CanjePuntosXProducto(){	    
	var EdoFX;	
	var Catalogos;
	var AutoCodigo;
	var CanjePuntos;
	var Config;
	Config=Application.InternalObject("FXConfig");	
	EdoFX=Application.InternalObject("DataAccess");	
	Catalogos=Application.InternalObject("Catalogos");	
	AutoCodigo=Application.InternalObject("AutoCodigo");	
	if(EdoFX==null || Config==null || Catalogos==null || AutoCodigo==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	CanjePuntos=Application.NewObject("UICanjePuntos.lgCanjePuntos");		
	if(CanjePuntos==null){
		eBasic.eMsgbox("Error al crear UICanjePuntos.lgCanjePuntos",6);
		return 0;
	}
	
	CanjePuntos.SetConnection(EdoFX,Catalogos,AutoCodigo);
	CanjePuntos.CategoriaPredeterminada=Config.CategoriaInventarioPromociones();
	CanjePuntos.FormatoMontos=Config.FormatoMonto();
	
	return CanjePuntos.CanjePuntosProductos("",0,true);		 
}
CanjePuntosXProducto();