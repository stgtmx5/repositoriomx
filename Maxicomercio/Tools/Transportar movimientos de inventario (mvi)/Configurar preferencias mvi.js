ConfigurarMVI();

function ConfigurarMVI(){
//PERMITIR ACCESO
if(!Application.UIUsers.CheckItem("FX2-MVI-00-000"))  return 0;
	var T=eBasic.eCreateObject("cfgmvi.cfg");	
	var Reg=eBasic.eCreateObject("geRunTime.eHKCurUser");

	if(T==null){
		eBasic.eMsgbox("Error al crear objecto cfgmvi.cfg.",6);
		return 0;
	}
	
	if(Reg==null){
		eBasic.eMsgbox("Error al crear objecto geRunTime.eHKCurUser.",6);
		return 0;
	}	

	var m1=Reg.EGetSetting("Maxicomercio","NodeVars","mvi0001","0");
	var m2=Reg.EGetSetting("Maxicomercio","NodeVars","mvi0002","0");
	var m3=Reg.EGetSetting("Maxicomercio","NodeVars","mvi0003","");
	var m4=Reg.EGetSetting("Maxicomercio","NodeVars","mvi0004","0");
	var m5=Reg.EGetSetting("Maxicomercio","NodeVars","mvi0005","0");

	T.SetDato(m1,m2,m3,m4,m5);
	if(T.ShowCfg()==0) return 0;
	
	Reg.ESaveSetting("Maxicomercio","NodeVars","mvi0001",T.mvi01);
	Reg.ESaveSetting("Maxicomercio","NodeVars","mvi0002",T.mvi02);
	Reg.ESaveSetting("Maxicomercio","NodeVars","mvi0003",T.mvi03);
	Reg.ESaveSetting("Maxicomercio","NodeVars","mvi0004",T.mvi04);
	Reg.ESaveSetting("Maxicomercio","NodeVars","mvi0005",T.mvi05);
	
	return 0;
}