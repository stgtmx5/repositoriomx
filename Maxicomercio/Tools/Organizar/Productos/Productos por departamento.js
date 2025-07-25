function OrganizarProductosXDepartamento(){	
    var Struct; 
	var Catalogos;
	Catalogos=Application.InternalObject("Catalogos");	
    Struct=Catalogos.StructTypeDepartamentos();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar productos por departamento");				
}
OrganizarProductosXDepartamento();