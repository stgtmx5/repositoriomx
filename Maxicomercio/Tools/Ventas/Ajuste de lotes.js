function EntregaSeries(){	    
	var EdoFX;		
	var ProcSeriesLotes;	
	EdoFX=Application.InternalObject("DataAccess");			
	if(EdoFX==null){
		eBasic.eMsgbox("Error al acceder a componentes internos",6);
		return 0;
	}	
	ProcSeriesLotes=Application.NewObject("UIEntregaSeries.cAcciones");		
	if(ProcSeriesLotes==null){
		eBasic.eMsgbox("Error al crear UIEntregaSeries.cAcciones",6);
		return 0;
	}
	
	ProcSeriesLotes.SetConnection(EdoFX);
	ProcSeriesLotes.SetUIUser(Application.UIUsers);	
	ProcSeriesLotes.AjusteLotes(0,0,true);		 
}
EntregaSeries();