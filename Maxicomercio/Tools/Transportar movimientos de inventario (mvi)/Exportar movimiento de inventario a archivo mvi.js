exportar_movimiento_inventario();
function exportar_movimiento_inventario(){
	var mviUI=eBasic.eCreateObject("com_maxicomercio_mvi.mvi_ui");
	if(mviUI==null){
		eBasic.eMsgbox("Error al crear objeto com_maxicomercio_mvi.mvi_ui");
		return 0;
	}
	mviUI.setObjects(Application.ADOCnn);
	mviUI.setUM(Application.UIUsers);
	mviUI.dlg_GenMVI();
	mviUI=null;
}