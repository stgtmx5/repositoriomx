function OrganizarProductosXMarca(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeZonasC();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar clientes por zona");
}
OrganizarProductosXMarca();