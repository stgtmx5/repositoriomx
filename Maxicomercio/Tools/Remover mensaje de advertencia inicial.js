function RemoveMessage(){    
	if(eBasic.eMsgbox("¿Seguro que desea remover el mensaje de advertencia inicial?",4)==6)
	{
		var HK;
		HK = Application.NewObject("geRuntime.eHKCurUser");
		if(HK!=null)
		{
			HK.ESaveSetting("Maxicomercio","Config","MAF","0");
			HK = null;
		}
	}
}
RemoveMessage();