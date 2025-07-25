function OrganizarGrupoSimilares(){	
    var frm;
	var Tmp;
	
	frm=Application.NewObject("dSimilares.Actions");
    
	if(frm==null)
	{
		eBasic.eMsgbox("Error al crear objeto.", 6);
		return -1;
	}
	
	Tmp = Application.InternalObject("UIDef");
	
	if(Tmp==null)
	{
		eBasic.eMsgbox("Error al crear objeto UIDef");
		return -1;
	}
	
    frm.setObjects(Application.adoCnn);
	frm.EngyneType = Tmp.inDataBaseType;
	frm.ShowDlgOrgGpo();
	frm = null;
	Tmp = null;
}
OrganizarGrupoSimilares();