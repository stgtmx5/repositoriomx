
Transformacion();

function Transformacion(){

if(!Application.UIUsers.CheckItem("FX2-TRA-00-002"))  return 0;

	var T;
	var gF=Application.InternalObject("gFunciones");
	var EDO=Application.InternalObject("DataAccess");
	var lInv=Application.InternalObject("LBInventario");
	
	T=eBasic.eCreateObject("dmTools.cMain");
	if(T==null){
		eBasic.eMsgbox("Error al crear objecto dmTools.cMain.",6);
		return 0;
	}
	T.SetObjects(EDO,lInv,gF);
	T.setUM(Application.UIUsers);
	T.Transform();
}
