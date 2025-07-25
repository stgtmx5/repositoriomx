function ImportaDesdeMC2008(){    
	var Importar;
	var EDOFX;
	var Config;
	var TProv=0;
	var Cat=0;
	var TCliente=0;
	EDOFX=Application.InternalObject("DataAccess");	
	Config=Application.InternalObject("FXConfig");
	if(EDOFX==null || Config==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	Importar=Application.NewObject("MC20062008.lgImportar");
	if(Importar==null){
		eBasic.eMsgbox("Error al crear MC20062008.lgImportar",6);
		return 0;
	}
	
	Importar.SetTarget(EDOFX);
	Importar.SetCiudadPredet("000");	
	Importar.SetTasaIVA(1);
	
	TProv=BuscarSys_PK("TipoProveedor","");
	if(TProv<=0){
		if(eBasic.eMsgbox("No existe un tipo de proveedor en la base de datos de la versión actual \nEsto puede ocacionar problemas al importar proveedores desde la versión 2006.\n¿Desea continuar?",4)==7)
			return 0;
	}
	Importar.SetTipoProveedorPredet(TProv);
	
	Cat=BuscarSys_PK("Categoria"," WHERE Codigo='<EVA>'");
    if(Cat<=0){
		if(eBasic.eMsgbox("No se encontró la categoria 'EVA-Existencias de versión anterior' en la base de datos de la versión actual \nEsto puede ocacionar problemas al importar existencias desde la versión 2006.\n¿Desea continuar?",4)==7)
			return 0;
	}
	
	Importar.SetCatInventario(Cat);
	
	TCliente=BuscarSys_PK("TipoCliente","");
    if(TCliente<=0){
		if(eBasic.eMsgbox("No existe un tipo de cliente en la base de datos de la versión actual \nEsto puede ocacionar problemas al importar clientes desde la versión 2006.\n¿Desea continuar?",4)==7)
			return 0;
	}
	Importar.SetTipoClientePredet(TCliente);
	
	
	if(Importar.ShowDialog())
		return -1;
	else
		return 0;
		
}
function BuscarSys_PK(Tabla,sWhere){
	var R;
	R=Application.Database.OpenRecordset("SELECT Sys_PK FROM "+ Tabla +sWhere);
	if(R==null)
		return 0;
	if(!(R.BOF && R.EOF)){
		return (R.Fields("Sys_PK"));
	}else{
		return 0;
	}

}

ImportaDesdeMC2008();