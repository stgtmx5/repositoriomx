var UIP;

function ActualizarListaPrecios(){

	var IProducto;
	var EFile;
	var ESheet;
	var lgItems;
	var itRows;
	var stFile;
	var itCount=0;
	
	stFile=Application.OpenFile("Archivos de excel (*.xls)|*.xls");
	
	if (stFile==""){
		return false;
	}
		
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando lista de precios"
	UIP.Min=0;
	
	EFile=Application.NewObject("Excel.Application");
	EFile.WorkBooks.Open (stFile);
	IProducto=Application.NewObject("EDOFx.Producto");
	IProducto.ADOCnn=Application.adoCnn;

    // si es la versión de Excel 97, asigna la hoja activa ( ActiveSheet )
	if (EFile.Application.Version>=8){
		ESheet = EFile.ActiveSheet;
	}
	else{
		ESheet = EFile;
	}
	
	itRows=ESheet.UsedRange.Rows.Count;
	UIP.Max=itRows;
	UIP.Show();
	
	Application.MouseHourglass();
	
	var vp;
	
	for (lgItems=2;lgItems<=itRows;lgItems++){
		try{		
		
			if (IProducto.LoadFromADOCByCodigo(ESheet.Cells(lgItems,1))==true){
				
				UIP.TopTitle="Actualizando precio de "+IProducto.Descripcion;
				
				vp=numero(ESheet.Cells(lgItems,2));
				if(vp>=0) IProducto.CostoUltimo=vp;
				
				vp=numero(ESheet.Cells(lgItems,3));
				if(vp>=0) IProducto.Precio1=vp;
				
				vp=numero(ESheet.Cells(lgItems,4));
				if(vp>=0) IProducto.Precio2=vp;
				
				vp=numero(ESheet.Cells(lgItems,5));
				if(vp>=0) IProducto.Precio3=vp;
				
				vp=numero(ESheet.Cells(lgItems,6));
				if(vp>=0) IProducto.Precio4=vp;
				
				vp=numero(ESheet.Cells(lgItems,7));
				if(vp>=0) IProducto.Precio5=vp;
				
				if (!IProducto.Update()){
					Log("Error al procesar fila "+lgItems+". Error al actualizar producto ("+IProducto.Descripcion+") "+IProducto.lastErrDescrip);
				}
				else{
					itCount=itCount+1;
				}
			}else{
				Log("Error al procesar fila "+lgItems+". No se pudo cargar el producto: "+ESheet.Cells(lgItems,1));
			}
		
		
		}catch(e){
			Log("Error al procesar fila "+lgItems);
		}
		
		UIP.Value=lgItems;
		Application.eDoEvents();
	}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();	
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 	
	
	EFile.ActiveWorkBook.Close (false);
	EFile.Quit();
	IProducto=null;
	EFile=null;
	ESheet=null;	
	return true;	
}

function numero(v){
	if(v=="") v=-1;
	if(v==null) v=-1;
	return v;
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}



function Procesar(){
	try{
		return ActualizarListaPrecios();
	}catch(e)
	{
		if(UIP!=null){
			Application.CloseUIProgress(UIP);
			Application.MouseDefault();
		}
		Log("Error al ejecutar subprograma");
		throw e;
		return false;
	}
}
Procesar();