facturacionMasiva();
function facturacionMasiva(){
	try{
		var fms;
		var FXCfg;
		
		if(!Application.UIUsers.CheckItem("FX1-20-30-900"))  //PERMITIR ACCESO
			return 0;
		
		fms=eBasic.eCreateObject("geFacMasivaServ.cMain");
		if(fms==null){
			eBasic.eMsgbox("Error al crear objeto geFacMasivaServ.cMain");
			return 0;
		}
		
		fms.SetObjects(Application.InternalObject("DataAccess"),Application.InternalObject("LBVenta"),Application.InternalObject("cfd"),Application.InternalObject("Poliza"));
		
		FXCfg=Application.InternalObject("Configuracion");
		fms.DivisaPredeterminada=FXCfg.eApplicationVars.FXCA013;
		fms.CConsumoPredeterminado=FXCfg.eApplicationVars.FXCA022;
		fms.DecMontos=FXCfg.eApplicationVars.FXCA001; //2;
		fms.FormatoMontos=FXCfg.eApplicationVars.FXCA003; //"$ #,#.00";
		fms.AsistenteFacturacion();
	}catch(e){
		eBasic.eMsgbox("Error al ejecutar herramienta");
		return 0;
	}
}