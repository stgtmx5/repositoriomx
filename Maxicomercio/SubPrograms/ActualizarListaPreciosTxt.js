var UIP;
function ActualizarListaPrecios(){	
	var IProducto;
	var FSystem;
	var TextStream;
	var stArray=new Array();
	var stFile;
	var stLine;
	var itLines;
	var itCount=0;
	
	UIP=Application.NewUIProgress();
	UIP.Caption="Actualizando lista de precios"
	UIP.Min=0;
	
	stFile=Application.OpenFile("Archivos de texto (*.txt)|*.txt");

	if (stFile==""){
		return false;
	}
	
	FSystem=Application.NewObject("Scripting.FileSystemObject");
	IProducto=Application.NewObject("EDOFx.Producto");
	IProducto.ADOCnn=Application.adoCnn;
	TextStream=FSystem.OpenTextFile(stFile);
	
	if (FSystem.FileExists(stFile)==false){
		return false;
	}
	
	itLines=LinesCount(stFile, FSystem);
	UIP.Max=itLines+1;
	UIP.Show();
	itLines=1;
	
	Application.MouseHourglass();
	
	var vp;
	
	while (TextStream.AtEndOfStream==false){
		try{
	
			stLine=TextStream.ReadLine();
			stArray=stLine.split("|");

			if (IProducto.LoadFromADOCByCodigo(stArray[0])==true){			
				
				UIP.TopTitle="Actualizando precio de "+IProducto.Descripcion;
				
				vp=numero(stArray[1]);			
				if(vp>=0) IProducto.CostoUltimo=vp;
				
				vp=numero(stArray[2]);
				if(vp>=0) IProducto.Precio1=vp;
				
				vp=numero(stArray[3]);
				if(vp>=0) IProducto.Precio2=vp;
				
				vp=numero(stArray[4]);
				if(vp>=0) IProducto.Precio3=vp;
				
				vp=numero(stArray[5]);
				if(vp>=0) IProducto.Precio4=vp;
				
				vp=numero(stArray[6]);
				if(vp>=0) IProducto.Precio5=vp;
				
				if (!IProducto.Update()){
					Log("Error al procesar fila "+itLines+". Error al actualizar producto ("+IProducto.Descripcion+") "+IProducto.lastErrDescrip);
				}
				else{
					itCount=itCount+1;
				}
			}else{
				Log("Error al procesar fila "+itLines+". No se pudo cargar el producto: "+stArray[0]);
			}
			
		}catch(e){
			Log("Error al procesar fila "+itLines);
		}
		itLines=itLines+1;
		UIP.Value=itLines;		
		Application.eDoEvents();
	}
	Application.CloseUIProgress(UIP);
	Application.MouseDefault();	
	eBasic.eMsgbox ("Cantidad de registros actualizados: "+itCount,6); 		
	TextStream.Close();
	IProducto=null;
	FSystem=null;
	TextStream=null;
	stArray=null;	
	return true;	
}

function numero(v){
	if(v=="") v=-1;
	if(v==null) v=-1;
	return parseFloat(v);
}

function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function LinesCount(strFile, FSystemO){
	var StreamO;
	var itCount=0;

	StreamO=FSystemO.OpenTextFile(strFile);
	
	while (StreamO.AtEndOfStream==false){
		itCount=itCount+1;
		StreamO.SkipLine();
	}
	
	StreamO.Close();
	StreamO=null;
	return itCount;
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