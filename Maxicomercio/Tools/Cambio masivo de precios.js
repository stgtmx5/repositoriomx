function CambioMasivoDePrecios(){    
	var CambioPrecios;
	var	Opt;
	var Ubicacion;
	var CodigoImportar;
	CambioPrecios=Application.NewObject("fxCmbPrecios.CmbPrecios");
	if(CambioPrecios==null){
		eBasic.eMsgbox("Error al crear fxCmbPrecios.CmbPrecios",6);
		return 0;
	}
	CambioPrecios.SetObjects(Application.adoCnn,Application.UIUsers);	
	Opt=CambioPrecios.ShowCambioPrecios();
	if(Opt==2){ //Importar desde archivo.
		Ubicacion=eBasic.AddSlashPath(Application.ReplaceMacros("$AppPath$"))+"Subprograms\\ActualizarListaPreciosTxt.js";		
		CodigoImportar= Application.VerifyFileSource(Ubicacion);
		if(CodigoImportar==""){
			eBasic.eMsgbox("Error al cargar script "+Ubicacion);
			return 0;
		}
		eval(CodigoImportar);						
	}
	return -1;
}
CambioMasivoDePrecios();