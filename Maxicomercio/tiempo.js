function EjecucionPDM()
{
	try
	{
		var obj; 
		var form;
		var gettiempo;
		var settimempo;
		var tiempo;
		var Ok;
		gettiempo= NodeVars.EGetSetting("Maxicomercio","Config","tiempoProdMinimos","0" );
		form= eBasic.eCreateObject("ge_sdk_uidlg.UIDlg");
		obj=form.CreateParamDialog("Configurar alertas de productos debajo del mínimmo ");
		obj.SetHeight(2000);
		obj.Setwidth(4000);
		settiempo = obj.CreateNumber("cTiempo","Defina el tiempo en segundos: ",2500);
		settiempo.ControlObject.Buttons(0).Visible=false;
		obj.Controls("cTiempo").Value=gettiempo;
		
		Ok=obj.ShowDialog();
		
		if (!Ok)
		{
			return 0;
		}
		else
		{
			
			tiempo=obj.GetValue("cTiempo");
			NodeVars.ESaveSetting("Maxicomercio","Config","tiempoProdMinimos",tiempo);
			eBasic.eMsgbox("Configuración guardada con exito",6);

		}
	}
	catch(e)
	{
		eBasic.eMsgbox("Error, intentelo nuevamente "+e.description);
		
	}
}
