function OrganizarProveedoresXGrupo(){	
    var Struct;
	Catalogos=Application.InternalObject("Catalogos");
    Struct=Catalogos.StructProve();
    Catalogos.ShowDlgOrgGpo(Struct,Application.adoCnn, "Organizar proveedores por grupo");		
}
OrganizarProveedoresXGrupo();