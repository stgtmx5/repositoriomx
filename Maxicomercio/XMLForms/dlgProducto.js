var PS=null;
var UN=null;
var wpCatSat=null;
var wpCatSatVb=null;

function initInterface()
{
	try
	{
		ThisForm.FillList("cuf_GrupoSimilares1",ADOCnn,"SELECT Sys_PK,Nombre FROM grupoproductos ORDER BY Nombre","Nombre","Sys_PK");
		
		PS=ThisForm.ControlObject("cuf_sat_proser");
		PS.ReadOnly=true;
		UN=ThisForm.ControlObject("cuf_sat_uniproser");
		UN.ReadOnly=true;
		
		wpCatSat=eBasic.eCreateObject("induxsoft.cfdi.v33.COM.Wrapper_CfdiV33Cat");
		wpCatSat.ClaveProdServCreate();
		wpCatSat.ClaveUnidadCreate();
		
		wpCatSatVb=eBasic.eCreateObject("WrapperCfdiV33.cMain");
		
	}
	catch(ex)
	{
		eBasic.eMsgbox(ex.message);
	}
}

function OnPutData()
{//Al cargar
	try
	{
		wpCatSat.ClaveProdServGetCve(PS.Value);
		PS.Tag = wpCatSat.Clave;
		PS.Value = wpCatSat.Clave + " - " + wpCatSat.Descripcion;
		
		wpCatSat.ClaveUnidadGetCve(UN.Value);
		UN.Tag = wpCatSat.Clave;
		UN.Value = wpCatSat.Clave + " - " + wpCatSat.Descripcion;
		
	}
	catch(ex)
	{
		eBasic.eMsgbox(ex.message);
	}
}

function OnGetData()
{//Al guardar
	try
	{	
		ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_sat_proser") = PS.Tag;
		PS.Value = PS.Tag;
		
		ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_sat_uniproser") = UN.Tag;
		UN.Value = UN.Tag;
	}
	catch(ex)
	{
		eBasic.eMsgbox(ex.message);
	}
}

function ControlEvent(CName, EName)
{
	try
	{
		//eBasic.eMsgbox("CName: "+CName+" EName: "+EName);
		if(CName=="btnProSer" && EName=="Click") 
			wpCatSatVb.SeleccionarProductoServicioSat(PS,wpCatSat);
		else if(CName=="btnUniProSer" && EName=="Click")
			wpCatSatVb.SeleccionarUnidadProductoServicioSat(UN,wpCatSat);
	}
	catch(ex)
	{
		eBasic.eMsgbox(ex.message);
	}
	
}