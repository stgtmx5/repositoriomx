function HistorialTipoCambio(){    
	var HTC;
	var	FXConfig;
	HTC=Application.InternalObject("HTCambio");
	FXConfig=Application.InternalObject("FXConfig");
	
	if(HTC==null || FXConfig==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	HTC.SetDivisaPred(FXConfig.DivisaPredeterminada());
	HTC.RegTCambio();	
}
HistorialTipoCambio();