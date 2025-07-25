function OrganizarProductosXMarca(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeClient();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar clientes por tipo");
}
OrganizarProductosXMarca();