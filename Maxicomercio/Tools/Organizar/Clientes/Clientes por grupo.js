function OrganizarClientesXGrupo(){	
    var Struct;
	Catalogos=Application.InternalObject("Catalogos");
    Struct=Catalogos.StructClient();
    Catalogos.ShowDlgOrgGpo(Struct,Application.adoCnn, "Organizar clientes por grupo");			
}
OrganizarClientesXGrupo();