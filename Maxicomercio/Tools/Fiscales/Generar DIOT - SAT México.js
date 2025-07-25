function Carga_batch()
{
	var DIOT;
	var EDO;
	DIOT=Application.NewObject("GenerateDIOT.cMain");
	EDO=Application.InternalObject("DataAccess");
	if(DIOT==null || EDO==null)
	{
		eBasic.eMsgbox("Error al acceder a componentes internos.",6);
		return 0;
	}
	DIOT.setObjects(EDO);
	DIOT.elegirFecha();
}
Carga_batch();