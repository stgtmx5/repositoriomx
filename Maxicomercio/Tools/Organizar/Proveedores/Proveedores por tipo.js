function OrganizarProductosXMarca(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeProveedores();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar proveedores por tipo");
}
OrganizarProductosXMarca();