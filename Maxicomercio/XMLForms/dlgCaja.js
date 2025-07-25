function initInterface(){
	//if(Deminus)	ThisForm.ControlObject("cUf_lim_vntliber1").Visible=False;
	
	
}

function OnPutData(){
	ThisForm.SetControlProperty("cUF_horacorte11","Value",eBasic.eFormat(ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_horacorte1"),"Hh:mm:ss"));
	ThisForm.SetControlProperty("cUF_horacorte12","Value",eBasic.eFormat(ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_horacorte2"),"Hh:mm:ss"));
	ThisForm.SetControlProperty("cUF_horacorte13","Value",eBasic.eFormat(ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_horacorte3"),"Hh:mm:ss"));
	ThisForm.SetControlProperty("cUF_horacorte14","Value",eBasic.eFormat(ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_horacorte4"),"Hh:mm:ss"));
	ThisForm.SetControlProperty("cUF_horacorte15","Value",eBasic.eFormat(ThisForm.ThisVBForm.ThisObj.FieldbyName("uf_horacorte5"),"Hh:mm:ss"));
}

function OnGetData(){
	ThisForm.ControlObject("cUF_horacorte11").Caption="La";
	ThisForm.ControlObject("cUF_horacorte12").Caption="Le";
	ThisForm.ControlObject("cUF_horacorte13").Caption="Li";
	ThisForm.ControlObject("cUF_horacorte14").Caption="Lo";
	ThisForm.ControlObject("cUF_horacorte15").Caption="Lu";
}