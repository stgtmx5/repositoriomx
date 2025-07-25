var configuracion = Application.InternalObject("Configuracion");

function ccReports(){

	var doc_flujo = Application.InternalObject("UIRequisiciones");
	var ccReports = eBasic.eCreateObject("ccReports.cMain");

	ccReports.setDBAccess(doc_flujo.blDocFlujo.obDriver);

		try
		{
			if(configuracion.eLocalVars.FXCT116)
			{
				ccReports.TImpuesto = false;
			}
			
			if(!configuracion.eLocalVars.FXCT116)
			{
				ccReports.TImpuesto = true;
			}
		}
		catch(e)
		{
			eBasic.eMsgbox(e.description);
		}

	ccReports.reporteVentasDiaMes();
}

ccReports();