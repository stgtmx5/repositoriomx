
function OrganizarProductosXLinea(){	
    var Struct;
	Catalogos=Application.InternalObject("Catalogos");		
    Struct=Catalogos.StructTypeProductos();	
    Catalogos.ShowDlgOneToMany(Struct,Application.adoCnn, "Organizar productos por línea");	
}
OrganizarProductosXLinea();