function OrganizarProductosXGrupo(){	
    var Struct;
	Catalogos=Application.InternalObject("Catalogos");
    Struct=Catalogos.StructProd();
    Catalogos.ShowDlgOrgGpo(Struct,Application.adoCnn, "Organizar productos por grupo");		
}
OrganizarProductosXGrupo();