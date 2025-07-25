function OrganizarProductosXMarca(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeMarcas();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar productos por marca");
}
OrganizarProductosXMarca();