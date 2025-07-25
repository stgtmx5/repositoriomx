
function PolizaDeCierre(){	
    var Contabilidad;
	var gFunciones;
	var EdoFX;
	var Procesos;
	var Finanzas;
	var Poliza;
	var Config;
	var HTC;
	Contabilidad=Application.InternalObject("Contabilidad");	
	gFunciones=Application.InternalObject("gFunciones");	
	Finanzas=Application.InternalObject("UIFinanzas");	
	EdoFX=Application.InternalObject("DataAccess");
	Config=Application.InternalObject("FXConfig");
	HTC=Application.InternalObject("HTCambio");
	if(Contabilidad==null || gFunciones==null || Finanzas==null || EdoFX==null || Config==null || HTC==null){
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
	
	Poliza=Procesos.PolizaCierre();
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
PolizaDeCierre();