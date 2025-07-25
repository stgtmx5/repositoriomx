function PolizaDeAjusteCambiario(){	
    var Contabilidad;
	var gFunciones;
	var EdoFX;
	var Procesos;
	var Finanzas;
	var Poliza;
	var HTC;
	var Config;
	Contabilidad=Application.InternalObject("Contabilidad");	
	gFunciones=Application.InternalObject("gFunciones");	
	Finanzas=Application.InternalObject("UIFinanzas");	
	EdoFX=Application.InternalObject("DataAccess");
	HTC=Application.InternalObject("HTCambio");
	Config=Application.InternalObject("FXConfig");
	if(Contabilidad==null || gFunciones==null || Finanzas==null || EdoFX==null || HTC==null || Config==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}
	
	Procesos=Application.NewObject("ProcCC.lgProcCC");		
	if(Procesos==null){
		eBasic.eMsgbox("Error al crear ProcCC.lgProcCC",6);
		return 0;
	}	
	Procesos.SetObjects(Contabilidad.DataObjects,Contabilidad,gFunciones,EdoFX,HTC,Application.UIUsers,eBasic);	
	Procesos.DecPreMontos=Config.NDecsMonto();
	
	Poliza=Procesos.PolizaAjusteCambiario();
	if(Poliza!=null){	
		eBasic.eMsgbox("La póliza se creó correctamente.",6);
		Finanzas.ModificarPoliza(Poliza.Sys_PK);		
	}else{
		if(Procesos.LastErrCode!=0)
			eBasic.eMsgbox(Procesos.LastErrDescrip,6);		
		return 0;
	}
	return -1;
}
PolizaDeAjusteCambiario();