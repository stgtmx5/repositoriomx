
function Log(Error){
	if (Error!="")
		Application.FireEventLog(Error);
}

function Initialize()
{
	try
	{
		
		var qname="";
		if (Application.cAppInfo.Name=="MaxiComercio")
			qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
		else if (Application.cAppInfo.Name=="Deminus")
			qname=Application.CurrCnnInfo.Name+"@Deminus.R5";
		else if (Application.cAppInfo.Name=="ContaBlink")
			qname=Application.CurrCnnInfo.Name+"@ContaBlink.R5";
		else
			qname=Application.CurrCnnInfo.Name+"@MaxiComercio.R5";
		
		
		NetCfdi33.AplicationName = Application.cAppInfo.Name;
		NetCfdi33.CnnQName = qname;
		NetCfdi33.PathXsltCadOriCfdi = "cadenaoriginal.xslt";
		
		vbgeUICFD.AppRepositoryPath=GetRepository();
		vbgeUICFD.AppReportsPath=eBasic.AddSlashPath(GetRepository())+"Reports";		
		vbgeUICFD.ApplicationName="Maxicomercio R5";
	}
	catch(e)
	{
		Log(e.message);
	}
}

function ExistMovApply(AplicadoA)
{
	try
	{
		if(AplicadoA==undefined || AplicadoA==null)
		{
			Log("Es necesario seleccionar un registro.");
			return 0;
		}
		
		Initialize();
		return NetCfdi33.ExistMovApply(AplicadoA);
	}
	catch(e)
	{
		Log(e.message);
		return 0;
	}
}


function TimbrarVtaCfdi33(PkVenta)
{
	try
	{
		if(PkVenta==undefined || PkVenta==null || PkVenta=="" || PkVenta<=0) throw new Error("Se esperaba el identificador correspondiente a la venta. Imposible continuar...");
		
		Initialize();
		
		Application.MouseHourglass();
		NetCfdi33.GetDoctoVenta(PkVenta);
		Application.MouseDefault();
		
		if (NetCfdi33.GetIsError()) 
			throw new Error(NetCfdi33.GetMsgLastError());
		else
			RegenerarRepresentacionCFDI(NetCfdi33.FolioSAT);//eBasic.eMsgbox("El documento se ha timbrado correctamente");
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function TimbrarPagoCfdi33(PkVenta)
{
	try
	{
		Application.MouseHourglass();
		if(PkVenta==undefined || PkVenta==null || PkVenta=="" || PkVenta<=0) throw new Error("El registro seleccionado no corresponde a un documento de venta.");
		
		Initialize();
		Application.MouseHourglass();
		NetCfdi33.GetDoctoPago(PkVenta);
		Application.MouseDefault();
		
		if (NetCfdi33.GetIsError()) 
			throw new Error(NetCfdi33.GetMsgLastError());
		else
		{
			Application.MouseDefault();
			//eBasic.eMsgbox("El documento se ha timbrado correctamente");
			RegenerarRepresentacionCFDI(NetCfdi33.FolioSAT);
		}
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function CancelarVta(PkVenta, docCancel)
{
	var rst=false;
	try
	{
		Application.MouseHourglass();
		Initialize();

		rst=NetCfdi33.CancelarVta(PkVenta, docCancel);
		Application.MouseDefault();
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
	
	return rst;
}

function CancelarPago(pkcxc)
{
	try
	{
		if (eBasic.eMsgbox("¿Está seguro que desea cancelar el documento actualmente seleccionado? Se creará un movimiento de compensación sin folio fiscal.", 4)==7) return 0;
	
		Initialize();
		
		if(!NetCfdi33.CancelarPago(pkcxc)) return 0;
		Application.MouseHourglass();
		
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
		var data=NetCfdi33.Data.split("|");//Importe|UUID
		var ImporteDocto=Number(data[0]);
		
		var EDO=Application.InternalObject("DataAccess");
		var CXC=eBasic.eCreateObject("EDOFX.DCXC");
		if(!CXC.LoadFromADOConnection(pkcxc,"",EDO.ADOCnn,1)){
			Log("Error al cargar documento CXC");
			return false;
		}
		
		var nref=CXC.Referencia+"_XCFD";
		if(vbgeUICFD.ValorCampo("SELECT Count(Sys_PK) AS numero FROM DCXC WHERE Referencia='"+nref+"'","numero")>0)
		{
			Application.MouseDefault();
			if (eBasic.eMsgbox("Ya existe un documento con la referencia de cancancelación ("+nref+") de éste documento ¿Está seguro que desea continuar y generar un nuevo movimiento de compensación?", 4)==7) return false;
			Application.MouseHourglass();
		}
		
		EDO.BeginTrans();	
		
		CXC.Haber=ImporteDocto;
		CXC.porImpuestoCap=0;
		
		switch(CXC.Documento){
			case 5: //nota de crédito
				//crear nota de cargo
				var nc=LBCXC.NotaCargo(CXC.ICliente.Sys_PK, Application.CurrentDate(), Application.CurrentDate(), "Cancelación de documento con referencia "+CXC.Referencia, CXC.Haber, CXC.TipoCambio, 17, false, nref, "", 0, CXC.porImpuestoCap, vbgeUICFD.CrearObjetoNothing(), false, true);
				if(nc==null){					
					EDO.RollbackTrans(false);
					Log("Error al crear nota de cargo.");
					Application.MouseDefault();
					return false;
				}
				break;
			case 17: //nota de cargo
				//crear nota de crédito
				var ncre=LBCXC.NotaCredito(CXC.ICliente.Sys_PK,  Application.CurrentDate(),  Application.CurrentDate(), "Cancelación de documento con referencia "+CXC.Referencia, CXC.Debe, CXC.TipoCambio, 5, false, nref, "", 0, CXC.porImpuestoCap, vbgeUICFD.CrearObjetoNothing(), false);
				
				if(ncre==null){
					EDO.RollbackTrans(false);
					Log("Error al crear nota de crédito.");
					Application.MouseDefault();
					return false;
				}
				break;
			default:
				EDO.RollbackTrans(false);
				//Log("Documento no soportado.");
				Application.MouseDefault();
				eBasic.eMsgbox("Documento cancelado correctamente.",6);
				return true;
		}
		
		EDO.CommitTrans(false);
		eBasic.eMsgbox("Documento cancelado correctamente.",6);
		
		return true;
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
		return false;
	}
}

function MarcarCFDICancelado(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		if (eBasic.eMsgbox("¿Está seguro que desea marcar como cancelado el documento actualmente seleccionado?", 4)==7) return;
		Application.MouseHourglass();
		ExecuteNonQry("update ut_cfd set uf_CanceladoSAT=1 where uf_FolioSAT='"+FolioSAT+"';");
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function EliminarCFDI(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		if (eBasic.eMsgbox("¿Está seguro que desea eliminar el documento timbrado actualmente seleccionado?", 4)==7) return;
		Application.MouseHourglass();
		ExecuteNonQry("delete from ut_cfd where uf_FolioSAT='"+FolioSAT+"';");
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function RegenerarRepresentacionCFDI(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		var cmdData=ExecuteSQL("select coalesce(uf_rfc_emisor,'-') as RFCEmisor from ut_cfd where uf_FolioSAT='"+FolioSAT+"';");
		if(cmdData==null) throw new Error("El recurso solicitado no existe.");
		
		//DownloadCfdi(string IdSat, string Rfc, bool Force = false)
		var Rfc=cmdData("RFCEmisor");
		
		Initialize();
		NetCfdi33.DownloadCfdi(FolioSAT,Rfc,false);
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
		
		//void PrintCFDIs(string IdSat)
		NetCfdi33.PrintCFDIs(FolioSAT);
		
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function ExportarCfdi(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		Initialize();
		
		NetCfdi33.ExpotarFiles(FolioSAT);
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function SendMail(FolioSAT)
{
	try
	{
		if(FolioSAT==undefined || FolioSAT==null || FolioSAT=="") return;
		Initialize();
		
		if(!vbgeUICFD.PermitirAcceso("FXCA320x",Application.UIUsers.CurrentUser)) return 0;
		
		NetCfdi33.SenMailCfdi(FolioSAT);
		if (NetCfdi33.GetIsError()) throw new Error(NetCfdi33.GetMsgLastError());
		eBasic.eMsgbox("Correo enviado correctamente");
	}
	catch(e)
	{
		Application.MouseDefault();
		Log(e.message);
	}
}

function ExecuteSQL(cmdSQL)
{
	var r=null;
	try
	{
		r=Application.ADOCnn.Execute(cmdSQL);
		if (!(r.EOF && r.BOF)) return r;
		r=null;
	}
	catch(e)
	{
		Log(e.message);
		return null;
	}
}

function ExecuteNonQry(cmdSQL)
{
	var r=false;
	try
	{
		Application.ADOCnn.Execute(cmdSQL);
		r=true;
	}
	catch(e)
	{
		Log(e.message);
		r=false;
	}
	return r;
}

function GetRepository(){
var sp="";
	try{
		sp=Application.ScrAdmin.GetPath(0);
	}catch(e){
		sp=Application.SourceAdmin.GetPath(0);
	}
	return sp;
}

function dd()
{
	try
	{
		
		
		return 0;
	}
	catch(e)
	{
		Log(e.message);
		return 0;
	}
}