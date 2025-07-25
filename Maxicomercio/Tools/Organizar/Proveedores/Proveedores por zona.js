function OrganizarProductosXMarca(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeZonasProv();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar proveedores por zona");
}
OrganizarProductosXMarca();