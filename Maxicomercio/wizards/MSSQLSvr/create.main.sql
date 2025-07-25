CREATE TABLE Agente (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Agente_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(10) NOT NULL  UNIQUE , CodNomina VARCHAR(50), eMail VARCHAR(50), Nombre VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , PComision float , Telefono VARCHAR(150), Domicilio1 Int, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Almacen (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Almacen_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodCuenta VARCHAR(50), Codigo VARCHAR(10) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , eMail VARCHAR(50), Fax VARCHAR(150), Telefonos VARCHAR(150), WebSite VARCHAR(150), Domicilio1 Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE AplCxC (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_AplCxC_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Destino Int  NOT NULL , Fecha Datetime  NOT NULL , Importe money , AplicadoA Int  NOT NULL , FK_DCxC_AplicadoA Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE AplCxP (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_AplCxP_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Destino Int  NOT NULL , Fecha Datetime  NOT NULL , Importe money , AplicadoA Int  NOT NULL , FK_DCxP_AplicadoA Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Banco (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Banco_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , WebSite VARCHAR(150), Contacto Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE BlockDocumentos (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_BlockDocumentos_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Activo Bit  NOT NULL , Datos VARCHAR(255), Documento Int  NOT NULL , FInicial Int  NOT NULL , Fiscal Bit  NOT NULL , FUltimo Int  NOT NULL , IDControl VARCHAR(32), NumControl Int , Serie VARCHAR(10) NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Caja (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Caja_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodCuenta VARCHAR(50), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(50), Notas VARCHAR(MAX) , CentroConsumo Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Cajero (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Cajero_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(10) NOT NULL  UNIQUE , CodNomina VARCHAR(50), Contrasena VARCHAR(32) NOT NULL , eMail VARCHAR(50), Nombre VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Telefono VARCHAR(150), Domicilio1 Int, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Cardex (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Cardex_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicado Bit , Descripcion VARCHAR(MAX) , Fecha Datetime , Referencia VARCHAR(250) NOT NULL  UNIQUE , Valuado Bit , DocCompra Int , DocOrden Int , DocVenta Int , ICategoria Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Categoria (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Categoria_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodCuenta VARCHAR(50), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , PMensual money , Tipo Int , Padre Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CConsumo (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CConsumo_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Precio Int , IAlmacen Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE cfgImpuesto (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_cfgImpuesto_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), I1Compra VARCHAR(MAX) , I1Venta VARCHAR(MAX) , I2Compra VARCHAR(MAX) , I2Venta VARCHAR(MAX) , I3Compra VARCHAR(MAX) , I3Venta VARCHAR(MAX) , I4Compra VARCHAR(MAX) , I4Venta VARCHAR(MAX) , Nombre VARCHAR(25) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Chequera (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Chequera_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CLABE VARCHAR(18), CodCuenta VARCHAR(50), Nombre VARCHAR(25) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , NumCuenta VARCHAR(25), IBanco Int , IDivisa Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Ciudad (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Ciudad_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(8) NOT NULL  UNIQUE , CodigoTel VARCHAR(5), Nombre VARCHAR(50) NOT NULL , Estado Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Cliente (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Cliente_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodCuenta VARCHAR(50), Codigo VARCHAR(35) NOT NULL  UNIQUE , CURP VARCHAR(25), Descuento float , DiasCredito Int , eMail VARCHAR(80), Fax VARCHAR(150), LimiteCredito money , Monedero money , Nombre VARCHAR(150) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Precio Int , Puntos money , RFC VARCHAR(15), Saldo money , SaldoPuntos money , Status Int , Telefonos VARCHAR(150), WebSite VARCHAR(150), Agente Int , Contacto1 Int , Contacto2 Int , Contacto3 Int , Domicilio1 Int , Domicilio2 Int , Domicilio3 Int , IDivisa Int  NOT NULL , Tipo Int  NOT NULL , Zona Int, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE CLoteXAlmacen (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CLoteXAlmacen_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float  NOT NULL , IAlmacen Int  NOT NULL , FK_Lote_ExisXAlmacen Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Compra (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Compra_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Auditado Bit , Contabilizado Bit , Descuento1 money , Descuento2 money , Directos money , Documento Int  NOT NULL , Fecha Datetime , FEmbarque Datetime , FEntrega Datetime , FLiquidacion Datetime , FormaPago Int  NOT NULL , FUltimoPago Datetime , Impuesto1 money  NOT NULL , Impuesto2 money  NOT NULL , Impuesto3 money  NOT NULL , Impuesto4 money  NOT NULL , Indirectos money , Notas VARCHAR(MAX) , Partida VARCHAR(32), Poliza VARCHAR(32), Referencia VARCHAR(25) NOT NULL , StatusAdministrativo Int  NOT NULL , StatusEntrega Int  NOT NULL , StatusFacturacion Int  NOT NULL , StatusFinanciero Int  NOT NULL , Subtotal money  NOT NULL , TipoCambio money  NOT NULL , Vencimiento Datetime , AplicadoA Int , IAlmacen Int  NOT NULL , IDivisa Int  NOT NULL , IMovCaja Int , IMovChequera Int , IProveedor Int  NOT NULL, uf_Color Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Contacto (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Contacto_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Apellidos VARCHAR(50) NOT NULL , eMail1 VARCHAR(50), eMail2 VARCHAR(50), eMail3 VARCHAR(50), eMail4 VARCHAR(50), Empresa VARCHAR(50), Nombre VARCHAR(50) NOT NULL , Notas VARCHAR(MAX) , Puesto VARCHAR(30), Tel1 VARCHAR(50), Tel2 VARCHAR(50), Tel3 VARCHAR(50), Tratamiento VARCHAR(5), WebSite VARCHAR(150), Domicilio1 Int , Domicilio2 Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Corte (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Corte_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cerrado Bit , FApertura Datetime  NOT NULL , FCierre Datetime , HApertura Datetime  NOT NULL , HCierre Datetime , ICaja Int  NOT NULL , ICajero Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CProduccion (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CProduccion_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(30) NOT NULL  UNIQUE , AlmacenMP Int  NOT NULL , AlmacenPT Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Cupon (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Cupon_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(32) NOT NULL  UNIQUE , FechaAlta Datetime , FechaUso Datetime , Status Int  NOT NULL , Tipo Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DAdicionales (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DAdicionales_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float , CDirecto money , CIndirecto money , CManoObra money , CMaquinaria money , Notas VARCHAR(255), IProducto Int  NOT NULL , FK_DOrden_Adicionales Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCantidades (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCantidades_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad Int  NOT NULL , IProducto Int  NOT NULL , FK_DOrden_CantidadesVariadas Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCapa (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCapa_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float  NOT NULL , Costo money  NOT NULL , PKEntrada Int  NOT NULL , FK_DCardex_Capas Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCardex (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCardex_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Abonos float , Auditado Bit , Cargos float , Contabilizado Bit , CPromedio money , Entradas float , Partida VARCHAR(32), Poliza VARCHAR(32), Referencia VARCHAR(30), Resto float , Salidas float , TipoCambio money  NOT NULL , Valuado Bit , IAlmacen Int  NOT NULL , ILote Int , IProducto Int  NOT NULL , ISerie Int , RCompra Int , RVenta Int , FK_Cardex_Movimientos Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCheques (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCheques_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Banco VARCHAR(50) NOT NULL , Beneficiario VARCHAR(250) NOT NULL , Emisor VARCHAR(50) NOT NULL , Importe money  NOT NULL , Notas VARCHAR(50), Numero VARCHAR(5) NOT NULL , TipoCambio money  NOT NULL , IDivisa Int  NOT NULL , Retiro Int , FK_MovCaja_DetalleCheques Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCompra (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCompra_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float  NOT NULL , CostoTotal money , Descuento1 money , Descuento2 money , Factor float , Impuesto1 money , Impuesto2 money , Impuesto3 money , Impuesto4 money , Notas VARCHAR(255), Precio money , Status Int  NOT NULL , TipoCambio money  NOT NULL , Unidad VARCHAR(10) NOT NULL , XFacturar float , Documento Int , IProducto Int  NOT NULL , FK_Compra_Detalle Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCxC (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCxC_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicable Bit , Aplicacion Datetime , Auditado Bit , BaseCM Int , Bonificaciones money , Contabilizado Bit , Debe money , Documento Int  NOT NULL , Fecha Datetime , FUltMoratorios Datetime , Haber money , IntFinancieros money , IntMoratorios money , Notas VARCHAR(MAX) , Pagos money , Partida VARCHAR(32), Poliza VARCHAR(32), porImpuestoCap float , porImpuestoFin float , porImpuestoMor float , Referencia VARCHAR(50) NOT NULL , RelacionadoA Int , TasaMoratorios float , TipoCambio money , XAplicar money , ICliente Int  NOT NULL , IFolio Int , IFolioIFin Int , IMovCaja Int , IVenta Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DCxP (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DCxP_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicable Bit , Aplicacion Datetime  NOT NULL , Auditado Bit , BaseCM Int , Bonificaciones money , Contabilizado Bit , Debe money , Documento Int  NOT NULL , Fecha Datetime  NOT NULL , FUltMoratorios Datetime , Haber money , IntFinancieros money , IntMoratorios money , Notas VARCHAR(MAX) , Pagos money , Partida VARCHAR(32), Poliza VARCHAR(32), porImpuestoCap float , porImpuestoFin float , porImpuestoMor float , Referencia VARCHAR(50) NOT NULL , RelacionadoA Int , TasaMoratorios float , TipoCambio money  NOT NULL , XAplicar money , ICompra Int , IMovCaja Int , IMovChequera Int , IProveedor Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DDepositos (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DDepositos_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Banco VARCHAR(50) NOT NULL , Fecha Datetime  NOT NULL , Importe money  NOT NULL , Referencia VARCHAR(50), TipoCambio money  NOT NULL , IDivisa Int  NOT NULL , Retiro Int , FK_MovCaja_DetalleDepositos Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Departamento (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Departamento_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Comision1 float , Comision2 float , Comision3 float , Comision4 float , Comision5 float , Descripcion VARCHAR(50) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Divisa (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Divisa_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(30) NOT NULL  UNIQUE , TCambio float  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Domicilio (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Domicilio_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodPos VARCHAR(10), Colonia VARCHAR(150), Direccion VARCHAR(MAX) , Notas VARCHAR(150), Telefonos VARCHAR(150), ICiudad Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DOrden (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DOrden_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float , CDirecto money , CIndirecto money , CManoObra money , CMaquinaria money , D1 money , D2 money , Especificaciones VARCHAR(MAX) , Precio money , TiempoProduccion Int , TiempoServicio Int , TipoCambio money  NOT NULL , IDivisa Int  NOT NULL , IProducto Int  NOT NULL , FK_Orden_Detalle Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DTabla (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DTabla_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Col1 float , Col10 float , Col2 float , Col3 float , Col4 float , Col5 float , Col6 float , Col7 float , Col8 float , Col9 float , Etiqueta VARCHAR(50), FK_Tabla_Filas Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DTarjeta (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DTarjeta_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Autorizacion VARCHAR(50), CVV VARCHAR(10), Domicilio VARCHAR(MAX) , Importe money  NOT NULL , Nombre VARCHAR(50), Numero VARCHAR(32), TipoCambio money  NOT NULL , IDivisa Int  NOT NULL , Retiro Int , Tipo Int  NOT NULL , FK_MovCaja_DetalleTarjetas Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DVales (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DVales_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Fecha Datetime , Importe money , Notas VARCHAR(50), Referencia VARCHAR(50) NOT NULL , TipoCambio money , IDivisa Int  NOT NULL , Retiro Int , FK_MovCaja_DetalleVales Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE DVenta (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DVenta_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cantidad float , Descuento1 money , Descuento2 money , Factor float , Impuesto1 money , Impuesto2 money , Impuesto3 money , Impuesto4 money , Notas VARCHAR(255), Precio money  NOT NULL , Status Int  NOT NULL , TipoCambio money  NOT NULL , Unidad VARCHAR(10), XFacturar float , XSalir float , Documento Int , IAlmacen Int  NOT NULL , IProducto Int  NOT NULL , FK_Venta_Detalle Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE EdoProv (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_EdoProv_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(8) NOT NULL  UNIQUE , Nombre VARCHAR(50) NOT NULL , IPais Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Existencias (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Existencias_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Existencia float , Saldo money , IAlmacen Int  NOT NULL , FK_Producto_IExistencias Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE FoliosDocumentos (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_FoliosDocumentos_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Cancelado Bit  NOT NULL , Fecha Datetime  NOT NULL , Folio Int  NOT NULL , Block Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE GrupoClientes (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GrupoClientes_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(25) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE GrupoProductos (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GrupoProductos_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Comision1 float , Comision2 float , Comision3 float , Comision4 float , Comision5 float , Nombre VARCHAR(25) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE GrupoProveedores (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GrupoProveedores_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(25) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Guia (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Guia_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Alto float , Ancho float , Costo money , Deducible money , Dias Int , EnAtencion VARCHAR(50), Estado Int  NOT NULL , FCompra Datetime , FEmbarque Datetime , FEntrega Datetime , Largo float , Notas VARCHAR(MAX) , Numero VARCHAR(50) NOT NULL  UNIQUE , Peso float , SumaAsegurada money , IDivisa Int , IDomicilio Int  NOT NULL , IPorteador Int  NOT NULL , IRepartidor Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE IEnsamble (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_IEnsamble_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CantDemasiado float , Cantidad float  NOT NULL , CantMucho float , CantPoco float , Omitible Bit , Elemento Int  NOT NULL , Reemplazo Int , FK_Producto_Elementos Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE IVariable (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_IVariable_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CDirectoProm money , CIndirectoProm money , CManoObraProm money , CMaquinariaProm money , Descripcion VARCHAR(35), Factor float , Maximo float , Minimo float , Grupo Int, FK_Producto_IVariables Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Linea (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Linea_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Clase Int  NOT NULL , Codigo VARCHAR(15) NOT NULL  UNIQUE , Color Int , Comision1 float , Comision2 float , Comision3 float , Comision4 float , Comision5 float , Descripcion VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Visible Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Lote (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Lote_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Entradas float , Existencia float , FCaducidad Datetime , FEntrada Datetime , Numero VARCHAR(50) NOT NULL  UNIQUE , IProducto Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Marca (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Marca_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Monedero (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Monedero_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Descripcion VARCHAR(35), Fecha Datetime , Puntos money , ICliente Int  NOT NULL , IVenta Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE MovCaja (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_MovCaja_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Auditado Bit , Cheques money , Contabilizado Bit , Depositos money , Documento Int  NOT NULL , Efectivo money , Fecha Datetime  NOT NULL , Hora Datetime  NOT NULL , Notas VARCHAR(255), Partida VARCHAR(32), Poliza VARCHAR(32), Referencia VARCHAR(50) NOT NULL , Tarjetas money , TipoCambio money  NOT NULL , Vales money , ICategoria Int  NOT NULL , ICorte Int  NOT NULL , IDivisa Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE MovCuenta (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_MovCuenta_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicacion Datetime , Auditado Bit , Beneficiario VARCHAR(150), Cancelado Bit , Conciliado Bit , Contabilizado Bit , Egreso money , Fecha Datetime , Ingreso money , Notas VARCHAR(MAX)  NOT NULL , Partida VARCHAR(32), Poliza VARCHAR(32), Referencia VARCHAR(50) NOT NULL  UNIQUE , Tipo Int  NOT NULL , ICategoria Int  NOT NULL , ICuenta Int  NOT NULL, uf_Color Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Orden (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Orden_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Auditada Bit , CDirecto money , CIndirecto money , CManoObra money , CMaquinaria money , Contabilizada Bit , D1 money , D2 money , Fecha Datetime , FPrevista Datetime , FProduccion Datetime , Hora Datetime , HPrevista Datetime , HProduccion Datetime , Importe money , Notas VARCHAR(MAX) , Partida VARCHAR(32), Poliza VARCHAR(32), Referencia VARCHAR(50), Status Int  NOT NULL , TiempoProduccion Int , TiempoServicio Int , TipoCambio money , IAgente Int , ICConsumo Int  NOT NULL , ICProduccion Int  NOT NULL , IDivisa Int , IVenta Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Pais (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Pais_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(8) NOT NULL  UNIQUE , CodigoTel VARCHAR(5), Nombre VARCHAR(50) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Porteador (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Porteador_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , IProveedor Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE PrecioVenta (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_PrecioVenta_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Limite float , Precio money , Producto Int  NOT NULL , FK_Cliente_ListaPrecios Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Producto (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Producto_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Adicional Bit , CDirecto money  NOT NULL , CIndirecto money  NOT NULL , CManoObra money  NOT NULL , CMaquinaria money  NOT NULL , CodBar1 VARCHAR(35), CodBar2 VARCHAR(35), CodBar3 VARCHAR(35), Codigo VARCHAR(35) NOT NULL  UNIQUE , Color Int , Comision float , Comision1 float , Comision2 float , Comision3 float , Comision4 float , Comision5 float , CostoPromedio money , CostoUltimo money  NOT NULL , Data1 VARCHAR(MAX) , Data2 VARCHAR(MAX) , Data3 VARCHAR(MAX) , Desc2 float , Desc3 float , Desc4 float , Desc5 float , Descripcion VARCHAR(150) NOT NULL  UNIQUE , DiasEntrega Int , Existencia float , FactorB float  NOT NULL , FactorC float , FactorD float , FactorE float , flagLimites Bit , flagUtilidad Bit , FormaComision Int , IClase Int  NOT NULL , ITipo Int  NOT NULL , Lim2 float , Lim3 float , Lim4 float , Lim5 float , Maximo float , MetodoValuacion Int  NOT NULL , Minimo float , Notas VARCHAR(MAX) , PAdic1 money , PAdic2 money , PAdic3 money , PAdic4 money , PAdic5 money , PPuntos money , Precio1 money  NOT NULL , Precio2 money  NOT NULL , Precio3 money  NOT NULL , Precio4 money  NOT NULL , Precio5 money  NOT NULL , PuntoRO float , ReqLote Bit  NOT NULL , ReqSerie Bit  NOT NULL , Saldo money  NOT NULL , TipoComision Int , Unidad VARCHAR(10) NOT NULL , UnidadB VARCHAR(10), UnidadC VARCHAR(10), UnidadD VARCHAR(10), UnidadE VARCHAR(10), Util1 float , Util2 float , Util3 float , Util4 float , Util5 float , UtilMin float , VincularData Bit , Visible Bit , IDepartamento Int , IDivisa Int  NOT NULL , ILinea Int  NOT NULL , IMarca Int , Impuestos Int  NOT NULL , IVariables Int , Proveedor1 Int , Proveedor2 Int , Proveedor3 Int, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Promocion (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Promocion_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Activa Bit , Ambito Int  NOT NULL , CantidadVigencia float , Codigo VARCHAR(15) NOT NULL  UNIQUE , Domingo Bit , DomingoFinal Datetime , DomingoInicio Datetime , Excepcion Int  NOT NULL , Excluyente Bit , FechaInicio Datetime  NOT NULL , FechaVigencia Datetime , ItemAmbito VARCHAR(32), ItemExcepcion VARCHAR(32), ItemRestriccion VARCHAR(32), Jueves Bit , JuevesFinal Datetime , JuevesInicio Datetime , LibreEleccion Bit , Lunes Bit , LunesFinal Datetime , LunesInicio Datetime , Martes Bit , MartesFinal Datetime , MartesInicio Datetime , Miercoles Bit , MiercolesFinal Datetime , MiercolesInicio Datetime , Nombre VARCHAR(50) NOT NULL  UNIQUE , Restriccion Int  NOT NULL , Sabado Bit , SabadoFinal Datetime , SabadoInicio Datetime , Tipo Int  NOT NULL , Var1 float , Var2 float , Viernes Bit , ViernesFinal Datetime , ViernesInicio Datetime , Vigencia Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Proveedor (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Proveedor_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), CodCuenta VARCHAR(50), Codigo VARCHAR(35) NOT NULL  UNIQUE , CURP VARCHAR(35), DiasCredito Int , DiasEntrega Int , eMail VARCHAR(50), Fax VARCHAR(50), LimiteCredito money , Nombre VARCHAR(150) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , RFC VARCHAR(15), Saldo money , Status Int , TasaIVA Int  NOT NULL , Telefonos VARCHAR(50), WebSite VARCHAR(150), Contacto1 Int , Contacto2 Int , Contacto3 Int , Domicilio1 Int , Domicilio2 Int , Domicilio3 Int , IDivisa Int  NOT NULL , IZona Int , Tipo Int  NOT NULL, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Repartidor (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Repartidor_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , CodNomina VARCHAR(50), eMail VARCHAR(50), Nombre VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Telefono VARCHAR(50), Domicilio1 Int, Uf_Sys_Baja Bit,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Serie (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Serie_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), FEntrada Datetime , FVenta Datetime , Notas VARCHAR(MAX) , Numero VARCHAR(50) NOT NULL  UNIQUE , Status Int  NOT NULL , DocCompra Int , DocVenta Int , IAlmacen Int , IEnsamble Int , ILote Int , IProducto Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Tabla (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Tabla_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Col1 VARCHAR(15), Col10 VARCHAR(15), Col2 VARCHAR(15), Col3 VARCHAR(15), Col4 VARCHAR(15), Col5 VARCHAR(15), Col6 VARCHAR(15), Col7 VARCHAR(15), Col8 VARCHAR(15), Col9 VARCHAR(15), Etiqueta Bit , nColumnas Int , nFilas Int , Nombre VARCHAR(10) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TarjetaCredito (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TarjetaCredito_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(5) NOT NULL  UNIQUE , Descripcion VARCHAR(25) NOT NULL  UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TasaFija (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TasaFija_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(10) NOT NULL  UNIQUE , Valor float,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TasaVariable (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TasaVariable_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(10) NOT NULL  UNIQUE , ITabla Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TipoCliente (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TipoCliente_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(15) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TipoCupon (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TipoCupon_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Caducidad Int , Nombre VARCHAR(25) NOT NULL  UNIQUE , Notas VARCHAR(MAX) , Tipo Int , UsoIlimitado Bit , Valor float , IDivisa Int , IProducto Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE TipoProveedor (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_TipoProveedor_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(15) NOT NULL  UNIQUE , Descripcion VARCHAR(50) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Venta (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Venta_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Auditado Bit , Contabilizado Bit , Descuento1 money , Descuento2 money , dmnsMesa VARCHAR(45), dmnsNota VARCHAR(255), dmnsPersonas Int , Documento Int  NOT NULL , DomicilioEntrega VARCHAR(255), Fecha Datetime  NOT NULL , FEmbarque Datetime , FEntrega Datetime , FLiquidacion Datetime , FormaPago Int  NOT NULL , FUltimoCobro Datetime , ImporteAdicional money , Impuesto1 money , Impuesto2 money , Impuesto3 money , Impuesto4 money , Notas VARCHAR(MAX) , Partida VARCHAR(32), PComision float , Poliza VARCHAR(32), Referencia VARCHAR(25) NOT NULL  UNIQUE , StatusAdministrativo Int , StatusEntrega Int , StatusFacturacion Int , StatusFinanciero Int , Subtotal money , TipoCambio money  NOT NULL , TipoDomicilio Int , txtGuia VARCHAR(150), Vencimiento Datetime , AplicadoA Int , IAgente Int , ICaja Int , ICConsumo Int  NOT NULL , ICliente Int  NOT NULL , ICorte Int , IDivisa Int  NOT NULL , IFolio Int  NOT NULL , IGuia Int , IMovCaja Int , IPorteador Int , IRepartidor Int, uf_Color Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE Zona (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Zona_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Nombre VARCHAR(30) NOT NULL  UNIQUE , Notas VARCHAR(255),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE CConsumo_CProduccion_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CConsumo_CProduccion__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , ICProduccion Int  NOT NULL , IConsumo Int  NOT NULL );
CREATE TABLE Cliente_GrupoClientes_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Cliente_GrupoClientes__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , IGrupos Int  NOT NULL , IClientes Int  NOT NULL );
CREATE TABLE CProduccion_Producto_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CProduccion_Producto__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , IProductos Int  NOT NULL , ICentrosProduccion Int  NOT NULL );
CREATE TABLE GrupoProductos_Producto_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GrupoProductos_Producto__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , IProductos Int  NOT NULL , IGrupos Int  NOT NULL );
CREATE TABLE GrupoProveedores_Proveedor_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_GrupoProveedores_Proveedor__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , IProveedores Int  NOT NULL , IGrupos Int  NOT NULL );
CREATE TABLE cAmbitoPromociones (ID Int  NOT NULL CONSTRAINT IDX_cAmbitoPromociones_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cBCIMoratorios (ID Int  NOT NULL CONSTRAINT IDX_cBCIMoratorios_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cCantidades (ID Int  NOT NULL CONSTRAINT IDX_cCantidades_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cClaseProducto (ID Int  NOT NULL CONSTRAINT IDX_cClaseProducto_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cDiasXMes (ID Int  NOT NULL CONSTRAINT IDX_cDiasXMes_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cDocumentos (ID Int  NOT NULL CONSTRAINT IDX_cDocumentos_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cExcepcionPromociones (ID Int  NOT NULL CONSTRAINT IDX_cExcepcionPromociones_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cFormaComisionProducto (ID Int  NOT NULL CONSTRAINT IDX_cFormaComisionProducto_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cFormasPago (ID Int  NOT NULL CONSTRAINT IDX_cFormasPago_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cMetodosValuacion (ID Int  NOT NULL CONSTRAINT IDX_cMetodosValuacion_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cPeriodicidades (ID Int  NOT NULL CONSTRAINT IDX_cPeriodicidades_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cRestriccionPromociones (ID Int  NOT NULL CONSTRAINT IDX_cRestriccionPromociones_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusAdministrativos (ID Int  NOT NULL CONSTRAINT IDX_cStatusAdministrativos_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusCupon (ID Int  NOT NULL CONSTRAINT IDX_cStatusCupon_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusDetalleCompra (ID Int  NOT NULL CONSTRAINT IDX_cStatusDetalleCompra_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusDetalleVenta (ID Int  NOT NULL CONSTRAINT IDX_cStatusDetalleVenta_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusEntrega (ID Int  NOT NULL CONSTRAINT IDX_cStatusEntrega_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusFacturacion (ID Int  NOT NULL CONSTRAINT IDX_cStatusFacturacion_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusFinancieros (ID Int  NOT NULL CONSTRAINT IDX_cStatusFinancieros_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusGuias (ID Int  NOT NULL CONSTRAINT IDX_cStatusGuias_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusOrdenProduccion (ID Int  NOT NULL CONSTRAINT IDX_cStatusOrdenProduccion_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusOrg (ID Int  NOT NULL CONSTRAINT IDX_cStatusOrg_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cStatusSeries (ID Int  NOT NULL CONSTRAINT IDX_cStatusSeries_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTasasIVA (ID Int  NOT NULL CONSTRAINT IDX_cTasasIVA_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTipoProducto (ID Int  NOT NULL CONSTRAINT IDX_cTipoProducto_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposCategorias (ID Int  NOT NULL CONSTRAINT IDX_cTiposCategorias_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposComisionesProducto (ID Int  NOT NULL CONSTRAINT IDX_cTiposComisionesProducto_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposInteres (ID Int  NOT NULL CONSTRAINT IDX_cTiposInteres_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposPromociones (ID Int  NOT NULL CONSTRAINT IDX_cTiposPromociones_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposRegalos (ID Int  NOT NULL CONSTRAINT IDX_cTiposRegalos_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTipoValorCupon (ID Int  NOT NULL CONSTRAINT IDX_cTipoValorCupon_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cVigenciasPromociones (ID Int  NOT NULL CONSTRAINT IDX_cVigenciasPromociones_PK PRIMARY KEY , Const VARCHAR(255));


ALTER TABLE Agente ADD CONSTRAINT RLAgenteDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Almacen ADD CONSTRAINT RLAlmacenDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE AplCxC ADD CONSTRAINT RLAplCxCAplicadoA_DCxCSys_PK FOREIGN KEY  (AplicadoA ) REFERENCES DCxC(Sys_PK);
ALTER TABLE AplCxP ADD CONSTRAINT RLAplCxPAplicadoA_DCxPSys_PK FOREIGN KEY  (AplicadoA ) REFERENCES DCxP(Sys_PK);
ALTER TABLE Banco ADD CONSTRAINT RLBancoContacto_ContactoSys_PK FOREIGN KEY  (Contacto ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Caja ADD CONSTRAINT RLCajaCentroConsumo_CConsumoSys_PK FOREIGN KEY  (CentroConsumo ) REFERENCES CConsumo(Sys_PK);
ALTER TABLE Cajero ADD CONSTRAINT RLCajeroDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Cardex ADD CONSTRAINT RLCardexDocCompra_CompraSys_PK FOREIGN KEY  (DocCompra ) REFERENCES Compra(Sys_PK);
ALTER TABLE Cardex ADD CONSTRAINT RLCardexDocOrden_OrdenSys_PK FOREIGN KEY  (DocOrden ) REFERENCES Orden(Sys_PK);
ALTER TABLE Cardex ADD CONSTRAINT RLCardexDocVenta_VentaSys_PK FOREIGN KEY  (DocVenta ) REFERENCES Venta(Sys_PK);
ALTER TABLE Cardex ADD CONSTRAINT RLCardexICategoria_CategoriaSys_PK FOREIGN KEY  (ICategoria ) REFERENCES Categoria(Sys_PK);
ALTER TABLE Categoria ADD CONSTRAINT RLCategoriaPadre_CategoriaSys_PK FOREIGN KEY  (Padre ) REFERENCES Categoria(Sys_PK);
ALTER TABLE CConsumo ADD CONSTRAINT RLCConsumoIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE Chequera ADD CONSTRAINT RLChequeraIBanco_BancoSys_PK FOREIGN KEY  (IBanco ) REFERENCES Banco(Sys_PK);
ALTER TABLE Chequera ADD CONSTRAINT RLChequeraIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Ciudad ADD CONSTRAINT RLCiudadEstado_EdoProvSys_PK FOREIGN KEY  (Estado ) REFERENCES EdoProv(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteAgente_AgenteSys_PK FOREIGN KEY  (Agente ) REFERENCES Agente(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteContacto1_ContactoSys_PK FOREIGN KEY  (Contacto1 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteContacto2_ContactoSys_PK FOREIGN KEY  (Contacto2 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteContacto3_ContactoSys_PK FOREIGN KEY  (Contacto3 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteDomicilio2_DomicilioSys_PK FOREIGN KEY  (Domicilio2 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteDomicilio3_DomicilioSys_PK FOREIGN KEY  (Domicilio3 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteTipo_TipoClienteSys_PK FOREIGN KEY  (Tipo ) REFERENCES TipoCliente(Sys_PK);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteZona_ZonaSys_PK FOREIGN KEY  (Zona ) REFERENCES Zona(Sys_PK);
ALTER TABLE CLoteXAlmacen ADD CONSTRAINT RLCLoteXAlmacenIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraAplicadoA_CompraSys_PK FOREIGN KEY  (AplicadoA ) REFERENCES Compra(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraIMovCaja_MovCajaSys_PK FOREIGN KEY  (IMovCaja ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraIMovChequera_MovCuentaSys_PK FOREIGN KEY  (IMovChequera ) REFERENCES MovCuenta(Sys_PK);
ALTER TABLE Compra ADD CONSTRAINT RLCompraIProveedor_ProveedorSys_PK FOREIGN KEY  (IProveedor ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE Contacto ADD CONSTRAINT RLContactoDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Contacto ADD CONSTRAINT RLContactoDomicilio2_DomicilioSys_PK FOREIGN KEY  (Domicilio2 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Corte ADD CONSTRAINT RLCorteICaja_CajaSys_PK FOREIGN KEY  (ICaja ) REFERENCES Caja(Sys_PK);
ALTER TABLE Corte ADD CONSTRAINT RLCorteICajero_CajeroSys_PK FOREIGN KEY  (ICajero ) REFERENCES Cajero(Sys_PK);
ALTER TABLE CProduccion ADD CONSTRAINT RLCProduccionAlmacenMP_AlmacenSys_PK FOREIGN KEY  (AlmacenMP ) REFERENCES Almacen(Sys_PK);
ALTER TABLE CProduccion ADD CONSTRAINT RLCProduccionAlmacenPT_AlmacenSys_PK FOREIGN KEY  (AlmacenPT ) REFERENCES Almacen(Sys_PK);
ALTER TABLE Cupon ADD CONSTRAINT RLCuponTipo_TipoCuponSys_PK FOREIGN KEY  (Tipo ) REFERENCES TipoCupon(Sys_PK);
ALTER TABLE DAdicionales ADD CONSTRAINT RLDAdicionalesIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE DCantidades ADD CONSTRAINT RLDCantidadesIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexILote_LoteSys_PK FOREIGN KEY  (ILote ) REFERENCES Lote(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexISerie_SerieSys_PK FOREIGN KEY  (ISerie ) REFERENCES Serie(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexRCompra_DCompraSys_PK FOREIGN KEY  (RCompra ) REFERENCES DCompra(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexRVenta_DVentaSys_PK FOREIGN KEY  (RVenta ) REFERENCES DVenta(Sys_PK);
ALTER TABLE DCheques ADD CONSTRAINT RLDChequesIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE DCheques ADD CONSTRAINT RLDChequesRetiro_MovCajaSys_PK FOREIGN KEY  (Retiro ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DCompra ADD CONSTRAINT RLDCompraDocumento_CompraSys_PK FOREIGN KEY  (Documento ) REFERENCES Compra(Sys_PK);
ALTER TABLE DCompra ADD CONSTRAINT RLDCompraIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCICliente_ClienteSys_PK FOREIGN KEY  (ICliente ) REFERENCES Cliente(Sys_PK);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCIFolio_FoliosDocumentosSys_PK FOREIGN KEY  (IFolio ) REFERENCES FoliosDocumentos(Sys_PK);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCIFolioIFin_FoliosDocumentosSys_PK FOREIGN KEY  (IFolioIFin ) REFERENCES FoliosDocumentos(Sys_PK);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCIMovCaja_MovCajaSys_PK FOREIGN KEY  (IMovCaja ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCIVenta_VentaSys_PK FOREIGN KEY  (IVenta ) REFERENCES Venta(Sys_PK);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPICompra_CompraSys_PK FOREIGN KEY  (ICompra ) REFERENCES Compra(Sys_PK);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPIMovCaja_MovCajaSys_PK FOREIGN KEY  (IMovCaja ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPIMovChequera_MovCuentaSys_PK FOREIGN KEY  (IMovChequera ) REFERENCES MovCuenta(Sys_PK);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPIProveedor_ProveedorSys_PK FOREIGN KEY  (IProveedor ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE DDepositos ADD CONSTRAINT RLDDepositosIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE DDepositos ADD CONSTRAINT RLDDepositosRetiro_MovCajaSys_PK FOREIGN KEY  (Retiro ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE Domicilio ADD CONSTRAINT RLDomicilioICiudad_CiudadSys_PK FOREIGN KEY  (ICiudad ) REFERENCES Ciudad(Sys_PK);
ALTER TABLE DOrden ADD CONSTRAINT RLDOrdenIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE DOrden ADD CONSTRAINT RLDOrdenIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE DTarjeta ADD CONSTRAINT RLDTarjetaIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE DTarjeta ADD CONSTRAINT RLDTarjetaRetiro_MovCajaSys_PK FOREIGN KEY  (Retiro ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DTarjeta ADD CONSTRAINT RLDTarjetaTipo_TarjetaCreditoSys_PK FOREIGN KEY  (Tipo ) REFERENCES TarjetaCredito(Sys_PK);
ALTER TABLE DVales ADD CONSTRAINT RLDValesIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE DVales ADD CONSTRAINT RLDValesRetiro_MovCajaSys_PK FOREIGN KEY  (Retiro ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DVenta ADD CONSTRAINT RLDVentaDocumento_VentaSys_PK FOREIGN KEY  (Documento ) REFERENCES Venta(Sys_PK);
ALTER TABLE DVenta ADD CONSTRAINT RLDVentaIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE DVenta ADD CONSTRAINT RLDVentaIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE EdoProv ADD CONSTRAINT RLEdoProvIPais_PaisSys_PK FOREIGN KEY  (IPais ) REFERENCES Pais(Sys_PK);
ALTER TABLE Existencias ADD CONSTRAINT RLExistenciasIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE FoliosDocumentos ADD CONSTRAINT RLFoliosDocumentosBlock_BlockDocumentosSys_PK FOREIGN KEY  (Block ) REFERENCES BlockDocumentos(Sys_PK);
ALTER TABLE Guia ADD CONSTRAINT RLGuiaIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Guia ADD CONSTRAINT RLGuiaIDomicilio_DomicilioSys_PK FOREIGN KEY  (IDomicilio ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Guia ADD CONSTRAINT RLGuiaIPorteador_PorteadorSys_PK FOREIGN KEY  (IPorteador ) REFERENCES Porteador(Sys_PK);
ALTER TABLE Guia ADD CONSTRAINT RLGuiaIRepartidor_RepartidorSys_PK FOREIGN KEY  (IRepartidor ) REFERENCES Repartidor(Sys_PK);
ALTER TABLE IEnsamble ADD CONSTRAINT RLIEnsambleElemento_ProductoSys_PK FOREIGN KEY  (Elemento ) REFERENCES Producto(Sys_PK);
ALTER TABLE IEnsamble ADD CONSTRAINT RLIEnsambleReemplazo_ProductoSys_PK FOREIGN KEY  (Reemplazo ) REFERENCES Producto(Sys_PK);
ALTER TABLE IVariable ADD CONSTRAINT RLIVariableGrupo_GrupoProductosSys_PK FOREIGN KEY  (Grupo ) REFERENCES GrupoProductos(Sys_PK);
ALTER TABLE Lote ADD CONSTRAINT RLLoteIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE Monedero ADD CONSTRAINT RLMonederoICliente_ClienteSys_PK FOREIGN KEY  (ICliente ) REFERENCES Cliente(Sys_PK);
ALTER TABLE Monedero ADD CONSTRAINT RLMonederoIVenta_VentaSys_PK FOREIGN KEY  (IVenta ) REFERENCES Venta(Sys_PK);
ALTER TABLE MovCaja ADD CONSTRAINT RLMovCajaICategoria_CategoriaSys_PK FOREIGN KEY  (ICategoria ) REFERENCES Categoria(Sys_PK);
ALTER TABLE MovCaja ADD CONSTRAINT RLMovCajaICorte_CorteSys_PK FOREIGN KEY  (ICorte ) REFERENCES Corte(Sys_PK);
ALTER TABLE MovCaja ADD CONSTRAINT RLMovCajaIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE MovCuenta ADD CONSTRAINT RLMovCuentaICategoria_CategoriaSys_PK FOREIGN KEY  (ICategoria ) REFERENCES Categoria(Sys_PK);
ALTER TABLE MovCuenta ADD CONSTRAINT RLMovCuentaICuenta_ChequeraSys_PK FOREIGN KEY  (ICuenta ) REFERENCES Chequera(Sys_PK);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenIAgente_AgenteSys_PK FOREIGN KEY  (IAgente ) REFERENCES Agente(Sys_PK);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenICConsumo_CConsumoSys_PK FOREIGN KEY  (ICConsumo ) REFERENCES CConsumo(Sys_PK);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenICProduccion_CProduccionSys_PK FOREIGN KEY  (ICProduccion ) REFERENCES CProduccion(Sys_PK);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenIVenta_VentaSys_PK FOREIGN KEY  (IVenta ) REFERENCES Venta(Sys_PK);
ALTER TABLE Porteador ADD CONSTRAINT RLPorteadorIProveedor_ProveedorSys_PK FOREIGN KEY  (IProveedor ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE PrecioVenta ADD CONSTRAINT RLPrecioVentaProducto_ProductoSys_PK FOREIGN KEY  (Producto ) REFERENCES Producto(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoIDepartamento_DepartamentoSys_PK FOREIGN KEY  (IDepartamento ) REFERENCES Departamento(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoILinea_LineaSys_PK FOREIGN KEY  (ILinea ) REFERENCES Linea(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoIMarca_MarcaSys_PK FOREIGN KEY  (IMarca ) REFERENCES Marca(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoImpuestos_cfgImpuestoSys_PK FOREIGN KEY  (Impuestos ) REFERENCES cfgImpuesto(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoIVariables_IVariableSys_PK FOREIGN KEY  (IVariables ) REFERENCES IVariable(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoProveedor1_ProveedorSys_PK FOREIGN KEY  (Proveedor1 ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoProveedor2_ProveedorSys_PK FOREIGN KEY  (Proveedor2 ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE Producto ADD CONSTRAINT RLProductoProveedor3_ProveedorSys_PK FOREIGN KEY  (Proveedor3 ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorContacto1_ContactoSys_PK FOREIGN KEY  (Contacto1 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorContacto2_ContactoSys_PK FOREIGN KEY  (Contacto2 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorContacto3_ContactoSys_PK FOREIGN KEY  (Contacto3 ) REFERENCES Contacto(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorDomicilio2_DomicilioSys_PK FOREIGN KEY  (Domicilio2 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorDomicilio3_DomicilioSys_PK FOREIGN KEY  (Domicilio3 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorIZona_ZonaSys_PK FOREIGN KEY  (IZona ) REFERENCES Zona(Sys_PK);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorTipo_TipoProveedorSys_PK FOREIGN KEY  (Tipo ) REFERENCES TipoProveedor(Sys_PK);
ALTER TABLE Repartidor ADD CONSTRAINT RLRepartidorDomicilio1_DomicilioSys_PK FOREIGN KEY  (Domicilio1 ) REFERENCES Domicilio(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieDocCompra_CompraSys_PK FOREIGN KEY  (DocCompra ) REFERENCES Compra(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieDocVenta_VentaSys_PK FOREIGN KEY  (DocVenta ) REFERENCES Venta(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieIAlmacen_AlmacenSys_PK FOREIGN KEY  (IAlmacen ) REFERENCES Almacen(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieIEnsamble_SerieSys_PK FOREIGN KEY  (IEnsamble ) REFERENCES Serie(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieILote_LoteSys_PK FOREIGN KEY  (ILote ) REFERENCES Lote(Sys_PK);
ALTER TABLE Serie ADD CONSTRAINT RLSerieIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE TasaVariable ADD CONSTRAINT RLTasaVariableITabla_TablaSys_PK FOREIGN KEY  (ITabla ) REFERENCES Tabla(Sys_PK);
ALTER TABLE TipoCupon ADD CONSTRAINT RLTipoCuponIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE TipoCupon ADD CONSTRAINT RLTipoCuponIProducto_ProductoSys_PK FOREIGN KEY  (IProducto ) REFERENCES Producto(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaAplicadoA_VentaSys_PK FOREIGN KEY  (AplicadoA ) REFERENCES Venta(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIAgente_AgenteSys_PK FOREIGN KEY  (IAgente ) REFERENCES Agente(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaICaja_CajaSys_PK FOREIGN KEY  (ICaja ) REFERENCES Caja(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaICConsumo_CConsumoSys_PK FOREIGN KEY  (ICConsumo ) REFERENCES CConsumo(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaICliente_ClienteSys_PK FOREIGN KEY  (ICliente ) REFERENCES Cliente(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaICorte_CorteSys_PK FOREIGN KEY  (ICorte ) REFERENCES Corte(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIFolio_FoliosDocumentosSys_PK FOREIGN KEY  (IFolio ) REFERENCES FoliosDocumentos(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIGuia_GuiaSys_PK FOREIGN KEY  (IGuia ) REFERENCES Guia(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIMovCaja_MovCajaSys_PK FOREIGN KEY  (IMovCaja ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIPorteador_PorteadorSys_PK FOREIGN KEY  (IPorteador ) REFERENCES Porteador(Sys_PK);
ALTER TABLE Venta ADD CONSTRAINT RLVentaIRepartidor_RepartidorSys_PK FOREIGN KEY  (IRepartidor ) REFERENCES Repartidor(Sys_PK);
ALTER TABLE DCardex ADD CONSTRAINT RLDCardexFK_Cardex_Movimientos_CardexSys_PK FOREIGN KEY  (FK_Cardex_Movimientos ) REFERENCES Cardex(Sys_PK);
ALTER TABLE CConsumo_CProduccion_ ADD CONSTRAINT RLCConsumo_CProduccion_ICProduccion_CConsumoSys_PK FOREIGN KEY  (ICProduccion ) REFERENCES CProduccion(Sys_PK);
ALTER TABLE CConsumo_CProduccion_ ADD CONSTRAINT RLCConsumo_CProduccion_IConsumo_CProduccionSys_PK FOREIGN KEY  (IConsumo ) REFERENCES CConsumo(Sys_PK);
ALTER TABLE Cliente_GrupoClientes_ ADD CONSTRAINT RLCliente_GrupoClientes_IGrupos_ClienteSys_PK FOREIGN KEY  (IGrupos ) REFERENCES GrupoClientes(Sys_PK);
ALTER TABLE Cliente_GrupoClientes_ ADD CONSTRAINT RLCliente_GrupoClientes_IClientes_GrupoClientesSys_PK FOREIGN KEY  (IClientes ) REFERENCES Cliente(Sys_PK);
ALTER TABLE PrecioVenta ADD CONSTRAINT RLPrecioVentaFK_Cliente_ListaPrecios_ClienteSys_PK FOREIGN KEY  (FK_Cliente_ListaPrecios ) REFERENCES Cliente(Sys_PK);
ALTER TABLE DCompra ADD CONSTRAINT RLDCompraFK_Compra_Detalle_CompraSys_PK FOREIGN KEY  (FK_Compra_Detalle ) REFERENCES Compra(Sys_PK);
ALTER TABLE CProduccion_Producto_ ADD CONSTRAINT RLCProduccion_Producto_IProductos_CProduccionSys_PK FOREIGN KEY  (IProductos ) REFERENCES Producto(Sys_PK);
ALTER TABLE CProduccion_Producto_ ADD CONSTRAINT RLCProduccion_Producto_ICentrosProduccion_ProductoSys_PK FOREIGN KEY  (ICentrosProduccion ) REFERENCES CProduccion(Sys_PK);
ALTER TABLE DCapa ADD CONSTRAINT RLDCapaFK_DCardex_Capas_DCardexSys_PK FOREIGN KEY  (FK_DCardex_Capas ) REFERENCES DCardex(Sys_PK);
ALTER TABLE AplCxC ADD CONSTRAINT RLAplCxCFK_DCxC_AplicadoA_DCxCSys_PK FOREIGN KEY  (FK_DCxC_AplicadoA ) REFERENCES DCxC(Sys_PK);
ALTER TABLE AplCxP ADD CONSTRAINT RLAplCxPFK_DCxP_AplicadoA_DCxPSys_PK FOREIGN KEY  (FK_DCxP_AplicadoA ) REFERENCES DCxP(Sys_PK);
ALTER TABLE DAdicionales ADD CONSTRAINT RLDAdicionalesFK_DOrden_Adicionales_DOrdenSys_PK FOREIGN KEY  (FK_DOrden_Adicionales ) REFERENCES DOrden(Sys_PK);
ALTER TABLE DCantidades ADD CONSTRAINT RLDCantidadesFK_DOrden_CantidadesVariadas_DOrdenSys_PK FOREIGN KEY  (FK_DOrden_CantidadesVariadas ) REFERENCES DOrden(Sys_PK);
ALTER TABLE GrupoProductos_Producto_ ADD CONSTRAINT RLGrupoProductos_Producto_IProductos_GrupoProductosSys_PK FOREIGN KEY  (IProductos ) REFERENCES Producto(Sys_PK);
ALTER TABLE GrupoProductos_Producto_ ADD CONSTRAINT RLGrupoProductos_Producto_IGrupos_ProductoSys_PK FOREIGN KEY  (IGrupos ) REFERENCES GrupoProductos(Sys_PK);
ALTER TABLE GrupoProveedores_Proveedor_ ADD CONSTRAINT RLGrupoProveedores_Proveedor_IProveedores_GrupoProveedoresSys_PK FOREIGN KEY  (IProveedores ) REFERENCES Proveedor(Sys_PK);
ALTER TABLE GrupoProveedores_Proveedor_ ADD CONSTRAINT RLGrupoProveedores_Proveedor_IGrupos_ProveedorSys_PK FOREIGN KEY  (IGrupos ) REFERENCES GrupoProveedores(Sys_PK);
ALTER TABLE CLoteXAlmacen ADD CONSTRAINT RLCLoteXAlmacenFK_Lote_ExisXAlmacen_LoteSys_PK FOREIGN KEY  (FK_Lote_ExisXAlmacen ) REFERENCES Lote(Sys_PK);
ALTER TABLE DCheques ADD CONSTRAINT RLDChequesFK_MovCaja_DetalleCheques_MovCajaSys_PK FOREIGN KEY  (FK_MovCaja_DetalleCheques ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DDepositos ADD CONSTRAINT RLDDepositosFK_MovCaja_DetalleDepositos_MovCajaSys_PK FOREIGN KEY  (FK_MovCaja_DetalleDepositos ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DTarjeta ADD CONSTRAINT RLDTarjetaFK_MovCaja_DetalleTarjetas_MovCajaSys_PK FOREIGN KEY  (FK_MovCaja_DetalleTarjetas ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DVales ADD CONSTRAINT RLDValesFK_MovCaja_DetalleVales_MovCajaSys_PK FOREIGN KEY  (FK_MovCaja_DetalleVales ) REFERENCES MovCaja(Sys_PK);
ALTER TABLE DOrden ADD CONSTRAINT RLDOrdenFK_Orden_Detalle_OrdenSys_PK FOREIGN KEY  (FK_Orden_Detalle ) REFERENCES Orden(Sys_PK);
ALTER TABLE IEnsamble ADD CONSTRAINT RLIEnsambleFK_Producto_Elementos_ProductoSys_PK FOREIGN KEY  (FK_Producto_Elementos ) REFERENCES Producto(Sys_PK);
ALTER TABLE Existencias ADD CONSTRAINT RLExistenciasFK_Producto_IExistencias_ProductoSys_PK FOREIGN KEY  (FK_Producto_IExistencias ) REFERENCES Producto(Sys_PK);
ALTER TABLE DTabla ADD CONSTRAINT RLDTablaFK_Tabla_Filas_TablaSys_PK FOREIGN KEY  (FK_Tabla_Filas ) REFERENCES Tabla(Sys_PK);
ALTER TABLE DVenta ADD CONSTRAINT RLDVentaFK_Venta_Detalle_VentaSys_PK FOREIGN KEY  (FK_Venta_Detalle ) REFERENCES Venta(Sys_PK);
ALTER TABLE Promocion ADD CONSTRAINT RLPromocionAmbito_cAmbitoPromocionesID FOREIGN KEY  (Ambito ) REFERENCES cAmbitoPromociones(ID);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCBaseCM_cBCIMoratoriosID FOREIGN KEY  (BaseCM ) REFERENCES cBCIMoratorios(ID);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPBaseCM_cBCIMoratoriosID FOREIGN KEY  (BaseCM ) REFERENCES cBCIMoratorios(ID);
ALTER TABLE DCantidades ADD CONSTRAINT RLDCantidadesCantidad_cCantidadesID FOREIGN KEY  (Cantidad ) REFERENCES cCantidades(ID);
ALTER TABLE Linea ADD CONSTRAINT RLLineaClase_cClaseProductoID FOREIGN KEY  (Clase ) REFERENCES cClaseProducto(ID);
ALTER TABLE Producto ADD CONSTRAINT RLProductoIClase_cClaseProductoID FOREIGN KEY  (IClase ) REFERENCES cClaseProducto(ID);
ALTER TABLE BlockDocumentos ADD CONSTRAINT RLBlockDocumentosDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE DCxC ADD CONSTRAINT RLDCxCDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE MovCaja ADD CONSTRAINT RLMovCajaDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE MovCuenta ADD CONSTRAINT RLMovCuentaTipo_cDocumentosID FOREIGN KEY  (Tipo ) REFERENCES cDocumentos(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaDocumento_cDocumentosID FOREIGN KEY  (Documento ) REFERENCES cDocumentos(ID);
ALTER TABLE Promocion ADD CONSTRAINT RLPromocionExcepcion_cExcepcionPromocionesID FOREIGN KEY  (Excepcion ) REFERENCES cExcepcionPromociones(ID);
ALTER TABLE Producto ADD CONSTRAINT RLProductoFormaComision_cFormaComisionProductoID FOREIGN KEY  (FormaComision ) REFERENCES cFormaComisionProducto(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraFormaPago_cFormasPagoID FOREIGN KEY  (FormaPago ) REFERENCES cFormasPago(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaFormaPago_cFormasPagoID FOREIGN KEY  (FormaPago ) REFERENCES cFormasPago(ID);
ALTER TABLE Producto ADD CONSTRAINT RLProductoMetodoValuacion_cMetodosValuacionID FOREIGN KEY  (MetodoValuacion ) REFERENCES cMetodosValuacion(ID);
ALTER TABLE Promocion ADD CONSTRAINT RLPromocionRestriccion_cRestriccionPromocionesID FOREIGN KEY  (Restriccion ) REFERENCES cRestriccionPromociones(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraStatusAdministrativo_cStatusAdministrativosID FOREIGN KEY  (StatusAdministrativo ) REFERENCES cStatusAdministrativos(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaStatusAdministrativo_cStatusAdministrativosID FOREIGN KEY  (StatusAdministrativo ) REFERENCES cStatusAdministrativos(ID);
ALTER TABLE Cupon ADD CONSTRAINT RLCuponStatus_cStatusCuponID FOREIGN KEY  (Status ) REFERENCES cStatusCupon(ID);
ALTER TABLE DCompra ADD CONSTRAINT RLDCompraStatus_cStatusDetalleCompraID FOREIGN KEY  (Status ) REFERENCES cStatusDetalleCompra(ID);
ALTER TABLE DVenta ADD CONSTRAINT RLDVentaStatus_cStatusDetalleVentaID FOREIGN KEY  (Status ) REFERENCES cStatusDetalleVenta(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraStatusEntrega_cStatusEntregaID FOREIGN KEY  (StatusEntrega ) REFERENCES cStatusEntrega(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaStatusEntrega_cStatusEntregaID FOREIGN KEY  (StatusEntrega ) REFERENCES cStatusEntrega(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraStatusFacturacion_cStatusFacturacionID FOREIGN KEY  (StatusFacturacion ) REFERENCES cStatusFacturacion(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaStatusFacturacion_cStatusFacturacionID FOREIGN KEY  (StatusFacturacion ) REFERENCES cStatusFacturacion(ID);
ALTER TABLE Compra ADD CONSTRAINT RLCompraStatusFinanciero_cStatusFinancierosID FOREIGN KEY  (StatusFinanciero ) REFERENCES cStatusFinancieros(ID);
ALTER TABLE Venta ADD CONSTRAINT RLVentaStatusFinanciero_cStatusFinancierosID FOREIGN KEY  (StatusFinanciero ) REFERENCES cStatusFinancieros(ID);
ALTER TABLE Guia ADD CONSTRAINT RLGuiaEstado_cStatusGuiasID FOREIGN KEY  (Estado ) REFERENCES cStatusGuias(ID);
ALTER TABLE Orden ADD CONSTRAINT RLOrdenStatus_cStatusOrdenProduccionID FOREIGN KEY  (Status ) REFERENCES cStatusOrdenProduccion(ID);
ALTER TABLE Cliente ADD CONSTRAINT RLClienteStatus_cStatusOrgID FOREIGN KEY  (Status ) REFERENCES cStatusOrg(ID);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorStatus_cStatusOrgID FOREIGN KEY  (Status ) REFERENCES cStatusOrg(ID);
ALTER TABLE Serie ADD CONSTRAINT RLSerieStatus_cStatusSeriesID FOREIGN KEY  (Status ) REFERENCES cStatusSeries(ID);
ALTER TABLE Proveedor ADD CONSTRAINT RLProveedorTasaIVA_cTasasIVAID FOREIGN KEY  (TasaIVA ) REFERENCES cTasasIVA(ID);
ALTER TABLE Producto ADD CONSTRAINT RLProductoITipo_cTipoProductoID FOREIGN KEY  (ITipo ) REFERENCES cTipoProducto(ID);
ALTER TABLE Categoria ADD CONSTRAINT RLCategoriaTipo_cTiposCategoriasID FOREIGN KEY  (Tipo ) REFERENCES cTiposCategorias(ID);
ALTER TABLE Producto ADD CONSTRAINT RLProductoTipoComision_cTiposComisionesProductoID FOREIGN KEY  (TipoComision ) REFERENCES cTiposComisionesProducto(ID);
ALTER TABLE Promocion ADD CONSTRAINT RLPromocionTipo_cTiposPromocionesID FOREIGN KEY  (Tipo ) REFERENCES cTiposPromociones(ID);
ALTER TABLE TipoCupon ADD CONSTRAINT RLTipoCuponTipo_cTipoValorCuponID FOREIGN KEY  (Tipo ) REFERENCES cTipoValorCupon(ID);
ALTER TABLE Promocion ADD CONSTRAINT RLPromocionVigencia_cVigenciasPromocionesID FOREIGN KEY  (Vigencia ) REFERENCES cVigenciasPromociones(ID);
INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (1,'cGrupoProductos')

INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (2,'cLinea')

INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (3,'cMarca')

INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (4,'cDepartamento')

INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (5,'cProducto')

INSERT INTO cAmbitoPromociones (ID,Const)  VALUES (6,'cTodos')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (0,'cSaldo_insoluto_capital')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (1,'cSaldo_insoluto_capital_IF')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (2,'cSaldo_insoluto_capital_IM')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (3,'cSaldo_insoluto_documento')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (4,'cCapital_inicial')

INSERT INTO cBCIMoratorios (ID,Const)  VALUES (5,'cCapital_IF')

INSERT INTO cCantidades (ID,Const)  VALUES (0,'cEstandar')

INSERT INTO cCantidades (ID,Const)  VALUES (1,'cPoco')

INSERT INTO cCantidades (ID,Const)  VALUES (2,'cMucho')

INSERT INTO cCantidades (ID,Const)  VALUES (3,'cDemasiado')

INSERT INTO cCantidades (ID,Const)  VALUES (99,'cOmitir')

INSERT INTO cClaseProducto (ID,Const)  VALUES (1,'cMateria_prima')

INSERT INTO cClaseProducto (ID,Const)  VALUES (2,'cReceta')

INSERT INTO cClaseProducto (ID,Const)  VALUES (3,'cServicio')

INSERT INTO cClaseProducto (ID,Const)  VALUES (4,'cArtículo')

INSERT INTO cClaseProducto (ID,Const)  VALUES (5,'cEnsamble')

INSERT INTO cClaseProducto (ID,Const)  VALUES (6,'cManufactura')

INSERT INTO cClaseProducto (ID,Const)  VALUES (7,'cTrabajo')

INSERT INTO cClaseProducto (ID,Const)  VALUES (8,'cArrendamiento')

INSERT INTO cClaseProducto (ID,Const)  VALUES (9,'cCosto_indirecto')

INSERT INTO cClaseProducto (ID,Const)  VALUES (33,'cMaquinaria_o_equipo')

INSERT INTO cClaseProducto (ID,Const)  VALUES (34,'cRecurso_humano')

INSERT INTO cClaseProducto (ID,Const)  VALUES (35,'cEquipo_de_transporte')

INSERT INTO cClaseProducto(ID,Const) VALUES (999,'cBaja')

INSERT INTO cDiasXMes (ID,Const)  VALUES (0,'cEfectivos')

INSERT INTO cDiasXMes (ID,Const)  VALUES (1,'c28Dias')

INSERT INTO cDiasXMes (ID,Const)  VALUES (2,'c30Dias')

INSERT INTO cDocumentos (ID,Const)  VALUES (1,'cCotización')

INSERT INTO cDocumentos (ID,Const)  VALUES (2,'cPedido')

INSERT INTO cDocumentos (ID,Const)  VALUES (3,'cRemisión')

INSERT INTO cDocumentos (ID,Const)  VALUES (4,'cFactura')

INSERT INTO cDocumentos (ID,Const)  VALUES (5,'cNota_de_crédito')

INSERT INTO cDocumentos (ID,Const)  VALUES (6,'cTicket')

INSERT INTO cDocumentos (ID,Const)  VALUES (17,'cNota_de_cargo')

INSERT INTO cDocumentos (ID,Const)  VALUES (18,'cPagaré')

INSERT INTO cDocumentos (ID,Const)  VALUES (19,'cRecibo')

INSERT INTO cDocumentos (ID,Const)  VALUES (33,'cIngreso')

INSERT INTO cDocumentos (ID,Const)  VALUES (34,'cEgreso')

INSERT INTO cDocumentos (ID,Const)  VALUES (65,'cDepósito')

INSERT INTO cDocumentos (ID,Const)  VALUES (66,'cCheque')

INSERT INTO cDocumentos (ID,Const)  VALUES (67,'cRetiro')

INSERT INTO cExcepcionPromociones (ID,Const)  VALUES (1,'cNinguna')

INSERT INTO cExcepcionPromociones (ID,Const)  VALUES (2,'cGrupo_de_clientes')

INSERT INTO cExcepcionPromociones (ID,Const)  VALUES (3,'cTipo_de_clientes')

INSERT INTO cExcepcionPromociones (ID,Const)  VALUES (4,'cCliente')

INSERT INTO cFormaComisionProducto (ID,Const)  VALUES (0,'cNinguna')

INSERT INTO cFormaComisionProducto (ID,Const)  VALUES (1,'cPorProducto')

INSERT INTO cFormaComisionProducto (ID,Const)  VALUES (2,'cPorPrecio')

INSERT INTO cFormaComisionProducto (ID,Const)  VALUES (3,'cPorVendedor')

INSERT INTO cFormasPago (ID,Const)  VALUES (0,'cNo_aplica')

INSERT INTO cFormasPago (ID,Const)  VALUES (1,'cContado')

INSERT INTO cFormasPago (ID,Const)  VALUES (2,'cCrédito')

INSERT INTO cFormasPago (ID,Const)  VALUES (3,'cFinanciado')

INSERT INTO cFormasPago (ID,Const)  VALUES (4,'cConsignado')

INSERT INTO cMetodosValuacion (ID,Const)  VALUES (1,'PEPS')

INSERT INTO cMetodosValuacion (ID,Const)  VALUES (2,'UEPS')

INSERT INTO cMetodosValuacion (ID,Const)  VALUES (3,'Promedio')

INSERT INTO cMetodosValuacion (ID,Const)  VALUES (4,'Identificado')

INSERT INTO cMetodosValuacion (ID,Const)  VALUES (99,'Ninguno')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (0,'cDiario')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (1,'cSemanal')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (2,'cQuincenal')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (3,'cMensual')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (4,'cBimestral')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (5,'cTrimestral')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (6,'cCuatrimestral')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (7,'cSemestral')

INSERT INTO cPeriodicidades (ID,Const)  VALUES (8,'cAnual')

INSERT INTO cRestriccionPromociones (ID,Const)  VALUES (1,'cTodos_los_clientes')

INSERT INTO cRestriccionPromociones (ID,Const)  VALUES (2,'cTipo_de_clientes')

INSERT INTO cRestriccionPromociones (ID,Const)  VALUES (3,'cGrupo_de_clientes')

INSERT INTO cRestriccionPromociones (ID,Const)  VALUES (4,'cCliente')

INSERT INTO cStatusAdministrativos (ID,Const)  VALUES (0,'cNo_aplica')

INSERT INTO cStatusAdministrativos (ID,Const)  VALUES (1,'cAbierto')

INSERT INTO cStatusAdministrativos (ID,Const)  VALUES (2,'cCerrado')

INSERT INTO cStatusAdministrativos (ID,Const)  VALUES (3,'cProcesado')

INSERT INTO cStatusAdministrativos (ID,Const)  VALUES (99,'cCancelado')

INSERT INTO cStatusCupon (ID,Const)  VALUES (1,'cDisponible')

INSERT INTO cStatusCupon (ID,Const)  VALUES (2,'cUsado')

INSERT INTO cStatusCupon (ID,Const)  VALUES (3,'cCaducado')

INSERT INTO cStatusCupon (ID,Const)  VALUES (4,'cCancelado')

INSERT INTO cStatusDetalleCompra (ID,Const)  VALUES (0,'cNo_Aplica')

INSERT INTO cStatusDetalleCompra (ID,Const)  VALUES (1,'cPor_recibir')

INSERT INTO cStatusDetalleCompra (ID,Const)  VALUES (2,'cRecibido')

INSERT INTO cStatusDetalleCompra (ID,Const)  VALUES (3,'cFacturado')

INSERT INTO cStatusDetalleCompra (ID,Const)  VALUES (4,'cDevuelto')

INSERT INTO cStatusDetalleVenta (ID,Const)  VALUES (0,'cNo_Aplica')

INSERT INTO cStatusDetalleVenta (ID,Const)  VALUES (1,'cPor_entregar')

INSERT INTO cStatusDetalleVenta (ID,Const)  VALUES (2,'cEntregado')

INSERT INTO cStatusDetalleVenta (ID,Const)  VALUES (3,'cFacturado')

INSERT INTO cStatusDetalleVenta (ID,Const)  VALUES (4,'cDevuelto')

INSERT INTO cStatusEntrega (ID,Const)  VALUES (0,'cNo_aplica')

INSERT INTO cStatusEntrega (ID,Const)  VALUES (1,'cPor_Entregar')

INSERT INTO cStatusEntrega (ID,Const)  VALUES (3,'cEntregado')

INSERT INTO cStatusFacturacion (ID,Const)  VALUES (0,'cNo_Aplica')

INSERT INTO cStatusFacturacion (ID,Const)  VALUES (1,'cPor_facturar')

INSERT INTO cStatusFacturacion (ID,Const)  VALUES (2,'cParcialmente_facturado')

INSERT INTO cStatusFacturacion (ID,Const)  VALUES (3,'cFacturado')

INSERT INTO cStatusFinancieros (ID,Const)  VALUES (0,'cNo_aplica')

INSERT INTO cStatusFinancieros (ID,Const)  VALUES (1,'cCon_adeudo')

INSERT INTO cStatusFinancieros (ID,Const)  VALUES (2,'cSaldado')

INSERT INTO cStatusFinancieros (ID,Const)  VALUES (3,'cConsignado')

INSERT INTO cStatusGuias (ID,Const)  VALUES (1,'cDisponible')

INSERT INTO cStatusGuias (ID,Const)  VALUES (2,'cEn_tránsito')

INSERT INTO cStatusGuias (ID,Const)  VALUES (3,'cEntregada')

INSERT INTO cStatusGuias (ID,Const)  VALUES (4,'cDevuelta')

INSERT INTO cStatusGuias (ID,Const)  VALUES (5,'cPerdida')

INSERT INTO cStatusGuias (ID,Const)  VALUES (6,'cCancelada')

INSERT INTO cStatusOrdenProduccion (ID,Const)  VALUES (0,'cEn_espera')

INSERT INTO cStatusOrdenProduccion (ID,Const)  VALUES (1,'cEn_proceso')

INSERT INTO cStatusOrdenProduccion (ID,Const)  VALUES (2,'cParcialmente_terminada')

INSERT INTO cStatusOrdenProduccion (ID,Const)  VALUES (3,'cTerminada')

INSERT INTO cStatusOrdenProduccion (ID,Const)  VALUES (4,'cCancelada')

INSERT INTO cStatusOrg (ID,Const)  VALUES (1,'cNormal')

INSERT INTO cStatusOrg (ID,Const)  VALUES (2,'cBloqueado')

INSERT INTO cStatusSeries (ID,Const)  VALUES (1,'cDisponible')

INSERT INTO cStatusSeries (ID,Const)  VALUES (2,'cVendido')

INSERT INTO cStatusSeries (ID,Const)  VALUES (3,'cDevuelto_a_proveedor')

INSERT INTO cStatusSeries (ID,Const)  VALUES (4,'cDevuelto_por_el_cliente')

INSERT INTO cStatusSeries (ID,Const)  VALUES (5,'cEnsamblado')

INSERT INTO cTasasIVA (ID,Const)  VALUES (1,'cInterior')

INSERT INTO cTasasIVA (ID,Const)  VALUES (2,'cFrontera')

INSERT INTO cTipoProducto (ID,Const)  VALUES (1,'cNo_inventariable')

INSERT INTO cTipoProducto (ID,Const)  VALUES (2,'cInventariable')

INSERT INTO cTiposCategorias (ID,Const)  VALUES (1,'cIngreso')

INSERT INTO cTiposCategorias (ID,Const)  VALUES (2,'cEgreso')

INSERT INTO cTiposCategorias (ID,Const)  VALUES (3,'cInventario')

INSERT INTO cTiposComisionesProducto (ID,Const)  VALUES (0,'cSinComision')

INSERT INTO cTiposComisionesProducto (ID,Const)  VALUES (1,'cEnDinero')

INSERT INTO cTiposComisionesProducto (ID,Const)  VALUES (2,'cEnPorcentaje')

INSERT INTO cTiposInteres (ID,Const)  VALUES (0,'cSimple')

INSERT INTO cTiposInteres (ID,Const)  VALUES (1,'cCompuesto')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (0,'cDescuento')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (1,'cXxY')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (2,'cDtoXVolumen')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (3,'cDtoXMonto')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (4,'cRegaloXVolumen')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (5,'cRegaloXMonto')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (6,'cFactorMonedero')

INSERT INTO cTiposPromociones (ID,Const)  VALUES (7,'cFactorPuntos')

INSERT INTO cTiposRegalos (ID,Const)  VALUES (1,'cProducto')

INSERT INTO cTiposRegalos (ID,Const)  VALUES (2,'cPuntos')

INSERT INTO cTiposRegalos (ID,Const)  VALUES (3,'cMonedero')

INSERT INTO cTiposRegalos (ID,Const)  VALUES (4,'cCupon')

INSERT INTO cTipoValorCupon (ID,Const)  VALUES (1,'cDinero')

INSERT INTO cTipoValorCupon (ID,Const)  VALUES (2,'cPorcentaje')

INSERT INTO cTipoValorCupon (ID,Const)  VALUES (3,'cPuntos')

INSERT INTO cTipoValorCupon (ID,Const)  VALUES (4,'cProducto')

INSERT INTO cVigenciasPromociones (ID,Const)  VALUES (1,'cSiempreVigente')

INSERT INTO cVigenciasPromociones (ID,Const)  VALUES (2,'cFecha_limite')

INSERT INTO cVigenciasPromociones (ID,Const)  VALUES (3,'cHasta_agotar_existencias')

INSERT INTO cVigenciasPromociones (ID,Const)  VALUES (5,'cFechaLimiteOAgotarExistencias')







CREATE TABLE CConcepto (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CConcepto_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(15) NOT NULL  UNIQUE , Descripcion VARCHAR(255) NOT NULL );
CREATE TABLE CContable (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CContable_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), APAC Bit , Codigo VARCHAR(35) NOT NULL  UNIQUE , D01 money , D02 money , D03 money , D04 money , D05 money , D06 money , D07 money , D08 money , D09 money , D10 money , D11 money , D12 money , Departamental Bit  NOT NULL , Descripcion VARCHAR(150) NOT NULL , Detalle Bit  NOT NULL , DFinal money , H01 money , H02 money , H03 money , H04 money , H05 money , H06 money , H07 money , H08 money , H09 money , H10 money , H11 money , H12 money , HFinal money , P_Anual money , P01 money , P02 money , P03 money , P04 money , P05 money , P06 money , P07 money , P08 money , P09 money , P10 money , P11 money , P12 money , S01 money , S02 money , S03 money , S04 money , S05 money , S06 money , S07 money , S08 money , S09 money , S10 money , S11 money , S12 money , SFinal money , SInicial money , Tipo Int  NOT NULL , Contrapartida Int , ICuenta Int , IDivisa Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CDepartamento (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CDepartamento_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(15) NOT NULL  UNIQUE , Descripcion VARCHAR(150),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE CDPoliza (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CDPoliza_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Concepto VARCHAR(255), Debe money  NOT NULL , Haber money  NOT NULL , Referencia VARCHAR(255), TCambio money , ICuenta Int  NOT NULL , IDepto Int , FK_CPoliza_Detalle Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CHTCambio (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CHTCambio_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Fecha Datetime  NOT NULL , TCambio money  NOT NULL , IDivisa Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CPoliza (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CPoliza_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Aplicada Bit , Auditada Bit , Concepto VARCHAR(255) NOT NULL , Debe money , Fecha Datetime  NOT NULL , Haber money , Notas VARCHAR(MAX) , Periodo Int , Referencia VARCHAR(35) NOT NULL  UNIQUE , Tipo Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CRubro (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CRubro_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Codigo VARCHAR(10) NOT NULL  UNIQUE , Color Int , Descripcion VARCHAR(100) NOT NULL  UNIQUE , Notas VARCHAR(MAX),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );
CREATE TABLE CtaDepto (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CtaDepto_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), D01 money , D02 money , D03 money , D04 money , D05 money , D06 money , D07 money , D08 money , D09 money , D10 money , D11 money , D12 money , DFinal money , H01 money , H02 money , H03 money , H04 money , H05 money , H06 money , H07 money , H08 money , H09 money , H10 money , H11 money , H12 money , HFinal money , P01 money , P02 money , P03 money , P04 money , P05 money , P06 money , P07 money , P08 money , P09 money , P10 money , P11 money , P12 money , S01 money , S02 money , S03 money , S04 money , S05 money , S06 money , S07 money , S08 money , S09 money , S10 money , S11 money , S12 money , SFinal money , SInicial money , ICuenta Int  NOT NULL , FK_CDepartamento_Cuentas Int  NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE CContable_CRubro_ (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_CContable_CRubro__PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Rubros Int  NOT NULL , Cuentas Int  NOT NULL );
CREATE TABLE cTiposCC (ID Int  NOT NULL CONSTRAINT IDX_cTiposCC_PK PRIMARY KEY , Const VARCHAR(255));
CREATE TABLE cTiposPolizas (ID Int  NOT NULL CONSTRAINT IDX_cTiposPolizas_PK PRIMARY KEY , Const VARCHAR(255));


ALTER TABLE CContable ADD CONSTRAINT RLCContableContrapartida_CContableSys_PK FOREIGN KEY  (Contrapartida ) REFERENCES CContable(Sys_PK);
ALTER TABLE CContable ADD CONSTRAINT RLCContableICuenta_CContableSys_PK FOREIGN KEY  (ICuenta ) REFERENCES CContable(Sys_PK);
ALTER TABLE CContable ADD CONSTRAINT RLCContableIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE CDPoliza ADD CONSTRAINT RLCDPolizaICuenta_CContableSys_PK FOREIGN KEY  (ICuenta ) REFERENCES CContable(Sys_PK);
ALTER TABLE CDPoliza ADD CONSTRAINT RLCDPolizaIDepto_CDepartamentoSys_PK FOREIGN KEY  (IDepto ) REFERENCES CDepartamento(Sys_PK);
ALTER TABLE CHTCambio ADD CONSTRAINT RLCHTCambioIDivisa_DivisaSys_PK FOREIGN KEY  (IDivisa ) REFERENCES Divisa(Sys_PK);
ALTER TABLE CtaDepto ADD CONSTRAINT RLCtaDeptoICuenta_CContableSys_PK FOREIGN KEY  (ICuenta ) REFERENCES CContable(Sys_PK);
ALTER TABLE CContable_CRubro_ ADD CONSTRAINT RLCContable_CRubro_Rubros_CContableSys_PK FOREIGN KEY  (Rubros ) REFERENCES CRubro(Sys_PK);
ALTER TABLE CContable_CRubro_ ADD CONSTRAINT RLCContable_CRubro_Cuentas_CRubroSys_PK FOREIGN KEY  (Cuentas ) REFERENCES CContable(Sys_PK);
ALTER TABLE CtaDepto ADD CONSTRAINT RLCtaDeptoFK_CDepartamento_Cuentas_CDepartamentoSys_PK FOREIGN KEY  (FK_CDepartamento_Cuentas ) REFERENCES CDepartamento(Sys_PK);
ALTER TABLE CDPoliza ADD CONSTRAINT RLCDPolizaFK_CPoliza_Detalle_CPolizaSys_PK FOREIGN KEY  (FK_CPoliza_Detalle ) REFERENCES CPoliza(Sys_PK);
ALTER TABLE CContable ADD CONSTRAINT RLCContableTipo_cTiposCCID FOREIGN KEY  (Tipo ) REFERENCES cTiposCC(ID);
ALTER TABLE CPoliza ADD CONSTRAINT RLCPolizaTipo_cTiposPolizasID FOREIGN KEY  (Tipo ) REFERENCES cTiposPolizas(ID);
INSERT INTO cTiposCC (ID,Const)  VALUES (0,'cDeudora')

INSERT INTO cTiposCC (ID,Const)  VALUES (1,'cAcreedora')

INSERT INTO cTiposPolizas (ID,Const)  VALUES (0,'cIngreso')

INSERT INTO cTiposPolizas (ID,Const)  VALUES (1,'cEgreso')

INSERT INTO cTiposPolizas (ID,Const)  VALUES (2,'cDiario')








CREATE TABLE DocLink (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_DocLink_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), FK_Doc VARCHAR(32), FK_Parent VARCHAR(32), Sis Bit , TypeParent VARCHAR(50),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);
CREATE TABLE Docs (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_Docs_PK PRIMARY KEY , Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL UNIQUE, Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32), Data Binary , Description VARCHAR(MAX) , MiniData Binary , Name VARCHAR(50), TypeData VARCHAR(5), Words VARCHAR(200),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);








CREATE UNIQUE INDEX IDX_FOLIOS ON FoliosDocumentos (Folio, Block);

 
CREATE TABLE InfoLote (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_InfoLote PRIMARY KEY , Cantidad float  NOT NULL , Fecha Datetime  NOT NULL , Notas VARCHAR(150), PKAlmacen Int  NOT NULL , PKLote Int  NOT NULL , PKProducto Int  NOT NULL , Referencia VARCHAR(32) NOT NULL ); 

CREATE PROCEDURE NullSerieCompra AS BEGIN UPDATE Serie SET DocCompra = NULL; END

CREATE PROCEDURE NullCardexCompra AS BEGIN UPDATE Cardex SET DocCompra = NULL; END

CREATE PROCEDURE NullCardexVenta AS BEGIN UPDATE Cardex SET DocVenta = NULL; END

CREATE PROCEDURE NullCompraCaja AS BEGIN UPDATE Compra SET IMovCaja = NULL; END

CREATE PROCEDURE NullCompraCuenta AS BEGIN UPDATE Compra SET IMovChequera = NULL; END

CREATE PROCEDURE NullDCxCCaja AS BEGIN UPDATE DCxC SET IMovCaja = NULL; END

CREATE PROCEDURE NullDCxCVenta AS BEGIN UPDATE DCxC SET IVenta = NULL; END

CREATE PROCEDURE NullDCxPCaja AS BEGIN UPDATE DCxP SET IMovCaja = NULL; END

CREATE PROCEDURE NullDCxPCompra AS BEGIN UPDATE DCxP SET ICompra = NULL; END

CREATE PROCEDURE NullDCxPCuenta AS BEGIN UPDATE DCxP SET IMovChequera = NULL; END

CREATE PROCEDURE NullMonedero AS BEGIN UPDATE Monedero SET IVenta = NULL; END

CREATE PROCEDURE NullOrden AS BEGIN UPDATE Orden SET IVenta = NULL; END

CREATE PROCEDURE NullSerieVenta AS BEGIN UPDATE Serie SET DocVenta = NULL; END

CREATE PROCEDURE NullVentaCaja AS BEGIN UPDATE Venta SET IMovCaja = NULL; END

CREATE PROCEDURE DelAplCxC AS BEGIN DELETE FROM AplCxC; END

CREATE PROCEDURE DelAplCxP AS BEGIN DELETE FROM AplCxP; END

CREATE PROCEDURE DelCardex AS BEGIN DELETE FROM Cardex; END

CREATE PROCEDURE DelCompra AS BEGIN DELETE FROM Compra; END

CREATE PROCEDURE DelCorte AS BEGIN DELETE FROM Corte; END

CREATE PROCEDURE DelDCardex AS BEGIN DELETE FROM DCardex; END

CREATE PROCEDURE DelDCompra AS BEGIN DELETE FROM DCompra; END

CREATE PROCEDURE DelDCxC AS BEGIN DELETE FROM DCxC; END

CREATE PROCEDURE DelDCxP AS BEGIN DELETE FROM DCxP; END

CREATE PROCEDURE DelDVenta AS BEGIN DELETE FROM DVenta; END

CREATE PROCEDURE DelExistencias AS BEGIN DELETE FROM Existencias; END

CREATE PROCEDURE DelMovCaja AS BEGIN DELETE FROM MovCaja; END

CREATE PROCEDURE DelMovCuenta AS BEGIN DELETE FROM MovCuenta; END

CREATE PROCEDURE DelVenta AS BEGIN DELETE FROM Venta; END

CREATE PROCEDURE NullDCardexVenta AS BEGIN UPDATE DCardex SET RVenta = Null; END

CREATE PROCEDURE NullDCardexCompra AS BEGIN UPDATE DCardex SET RCompra = NULL; END

CREATE PROCEDURE NullSaldoCliente AS BEGIN UPDATE Cliente SET Saldo = 0; END

CREATE PROCEDURE NullExistenciaProducto AS BEGIN UPDATE Producto SET Existencia = 0; END

CREATE PROCEDURE NullSaldoProveedor AS BEGIN UPDATE Proveedor SET Saldo = 0; END

CREATE PROCEDURE DelDTarjetas AS BEGIN DELETE FROM DTarjeta; END

CREATE PROCEDURE DelDCheques AS BEGIN DELETE FROM DCheques; END

CREATE PROCEDURE DelDDepositos AS BEGIN DELETE FROM DDepositos; END

CREATE PROCEDURE DelDVales AS BEGIN DELETE FROM DVales; END

CREATE PROCEDURE DelCContableRubro AS BEGIN DELETE FROM CContable_CRubro_; END

CREATE PROCEDURE DelCContable AS BEGIN DELETE FROM CContable; END

CREATE PROCEDURE DelCDPoliza AS BEGIN DELETE FROM CDPoliza; END

CREATE PROCEDURE DelCPoliza AS BEGIN DELETE FROM CPoliza; END

CREATE PROCEDURE NullSaldoCContable AS BEGIN UPDATE CContable SET D01 = 0, D02 = 0, D03 = 0, D04 = 0, D05 = 0, D06 = 0, D07 = 0, D08 = 0, D09 = 0, D10 = 0, D11 = 0, D12 = 0, H01 = 0, H02 = 0, H03 = 0, H04 = 0, H05 = 0, H06 = 0, H07 = 0, H08 = 0, H09 = 0, H10 = 0, H11 = 0, H12 = 0, S01 = 0, S02 = 0, S03 = 0, S04 = 0, S05 = 0, S06 = 0, S07 = 0, S08 = 0, S09 = 0, S10 = 0, S11 = 0, S12 = 0, DFinal = 0, HFinal = 0, SInicial = 0, SFinal = 0; END

CREATE PROCEDURE NullSaldoProducto AS BEGIN UPDATE Producto SET Saldo = 0; END

CREATE PROCEDURE DelDCapa AS BEGIN DELETE FROM DCapa; END

CREATE PROCEDURE DelCtaDepto AS BEGIN DELETE FROM CtaDepto; END

 CREATE PROCEDURE qryTicketActual (@P INT, @Q INT) AS BEGIN SELECT Venta.Sys_PK FROM Venta WHERE Venta.StatusAdministrativo=1 And Venta.ICaja=@P and Venta.Documento=@Q; END 

 CREATE PROCEDURE UpdCajaFree (@p INT) AS BEGIN UPDATE Venta SET ICaja = null WHERE Sys_PK=@p; END 

 CREATE PROCEDURE UpdFLiquidacionCompra (@Anio INT, @Mes INT, @Dia INT, @PK INT) AS BEGIN UPDATE Compra SET StatusFinanciero=2, FLiquidacion = CONVERT(DATETIME, CAST(@Dia AS VARCHAR)+'/'+CAST(@Mes AS VARCHAR)+'/'+CAST(@Anio AS VARCHAR), 103) WHERE SYS_PK = @PK; END 

 CREATE PROCEDURE UpdFLiquidacionVenta (@Anio INT, @Mes INT, @Dia INT, @PK INT) AS BEGIN UPDATE Venta SET StatusFinanciero=2, FLiquidacion = CONVERT(DATETIME, CAST(@Dia AS VARCHAR)+'/'+CAST(@Mes AS VARCHAR)+'/'+CAST(@Anio AS VARCHAR), 103) WHERE SYS_PK = @PK; END 

CREATE PROCEDURE DelSerie AS BEGIN DELETE FROM Serie; END

CREATE PROCEDURE DelLote AS BEGIN DELETE FROM Lote; END

CREATE PROCEDURE NullVentaAplicado AS BEGIN UPDATE Venta SET AplicadoA=NULL; END

CREATE PROCEDURE DelCLoteXAlmacen AS BEGIN DELETE FROM CLoteXAlmacen; END

CREATE PROCEDURE NullCompraAplicado AS BEGIN UPDATE Compra SET AplicadoA = NULL; END

CREATE PROCEDURE NullCContableAplicado AS BEGIN UPDATE CContable SET ICuenta=NULL, Contrapartida=NULL; END

 CREATE PROCEDURE UpdCPoliza(@Bo TinyInt,@PK int) AS BEGIN UPDATE CPOLIZA SET APLICADA = @Bo WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE UpdAuditarCPoliza (@Bo TINYINT, @PK INT) AS BEGIN UPDATE CPOLIZA SET AUDITADA = @Bo WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE UpdCancelarMovCuenta (@PK INT) AS BEGIN UPDATE MovCuenta SET Cancelado=1 WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE UpdConciliarMovCuenta (@C TINYINT, @PK INT) AS BEGIN UPDATE MovCuenta SET Conciliado = @C WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE UpdVincularProducto (@R1 VARCHAR(500), @R2 VARCHAR(500), @Bo TINYINT, @PK INT) AS BEGIN UPDATE PRODUCTO SET DATA1 = @R1, DATA2 = @R2, VINCULARDATA = @Bo WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE UpdFechaNumeroSerie(@S INT, @pCompra INT, @pVenta INT, @anio INT, @mes INT, @dia INT, @pAlmacen INT, @Num VARCHAR(50)) AS BEGIN UPDATE SERIE SET STATUS=@S, DOCCOMPRA = CASE WHEN @pCompra = 0 THEN Null ELSE @pCompra END, DOCVENTA = CASE WHEN @pVenta = 0 THEN Null ELSE @pVenta END, FVenta = CASE WHEN @anio>0 AND @mes>0 AND @dia>0 THEN CONVERT(DATETIME, CAST(@Dia AS VARCHAR)+'/'+CAST(@Mes AS VARCHAR)+'/'+CAST(@Anio AS VARCHAR), 103) ELSE FVenta END, IALMACEN = CASE WHEN @pAlmacen > 0 THEN @pAlmacen ELSE IALMACEN END WHERE Numero=@Num; END 

 CREATE PROCEDURE UpdFechaPKSerie(@S INT, @pCompra INT, @pVenta INT, @anio INT, @mes INT, @dia INT, @PK Int)  AS BEGIN  UPDATE SERIE SET STATUS = @S,  DOCCOMPRA = CASE WHEN @pCompra=0 THEN NULL ELSE @pCompra END , DOCVENTA = CASE WHEN @pVenta=0 THEN NULL ELSE @pVenta END, FVenta = CASE WHEN @anio>0 and @mes>0 and @dia>0 THEN CONVERT(DATETIME, CAST(@Dia AS VARCHAR)+'/'+CAST(@Mes AS VARCHAR)+'/'+CAST(@Anio AS VARCHAR), 103) ELSE FVenta END WHERE SYS_PK=@PK; END 

 CREATE PROCEDURE qryProductosLikeII (@P VARCHAR(255), @Q VARCHAR(255), @R VARCHAR(255), @S VARCHAR(255), @T VARCHAR(255), @A INT, @M VARCHAR(255), @L VARCHAR(255), @D VARCHAR(255)) AS  BEGIN SELECT Producto.Sys_PK, Producto.Codigo, Producto.Descripcion, Producto.CodBar1, Producto.CodBar2, Producto.CodBar3, Producto.Precio1, Producto.Precio2, Producto.Precio3, Producto.Precio4, Producto.Precio5, Existencias.Existencia, Marca.Descripcion as Marca, Linea.Descripcion as Linea, Departamento.Descripcion as Departamento FROM Producto LEFT JOIN Existencias ON Producto.Sys_PK=Existencias.FK_Producto_IExistencias LEFT JOIN Linea on Producto.ILinea = Linea.Sys_PK LEFT JOIN Departamento ON Producto.IDepartamento = Departamento.Sys_PK LEFT JOIN Marca on Producto.IMarca = Marca.Sys_PK WHERE Producto.Visible<>0 And (Producto.Codigo Like @P Or Producto.CodBar1 Like @Q Or Producto.CodBar2 Like @R Or Producto.CodBar3 Like @S Or Producto.Descripcion Like @T Or Marca.Descripcion Like @M Or Linea.Descripcion Like @L Or Departamento.Descripcion Like @D) And (Existencias.IAlmacen=@A OR (Existencias.IAlmacen is null)) ORDER BY Producto.Descripcion; END
 
 CREATE TRIGGER tupdExistenciaProducto ON Producto after Insert,Update As DECLARE @nExis FLOAT DECLARE @pk INT IF UPDATE(Existencia) BEGIN SELECT @nExis=i.Existencia,@pk=i.Sys_PK From inserted i IF @nExis<0 BEGIN IF ROUND(@nExis,6)=0 BEGIN UPDATE Producto SET Existencia=0 WHERE Sys_PK=@pk AND Existencia<0 END ELSE BEGIN RAISERROR ('Existencia insuficiente', 16, 1) END END END RETURN

CREATE VIEW qryCatProductos AS SELECT TOP 100 PERCENT Producto.Sys_PK, Linea.Sys_PK AS KLinea, Departamento.Sys_PK AS PKDepartamento, Producto.Codigo AS Codigo, Producto.Descripcion AS Descripcion, Marca.Descripcion AS Marca, Producto.Unidad AS Unidad, Producto.Existencia AS Existencia, Producto.Precio1 AS Precio1, Producto.Precio2 AS Precio2, Producto.Precio3 AS Precio3, Producto.Precio4 AS Precio4, Producto.Precio5 AS Precio5, Producto.Saldo AS Saldo, Divisa.Descripcion AS Divisa, Linea.Descripcion as Linea,producto.ITipo AS TipoProducto,producto.CostoUltimo AS CostoUltimo,Producto.IClase,Replace(substring(cClaseProducto.Const,2,len(cClaseProducto.Const)),'_',' ') as Clase FROM Linea INNER JOIN (Divisa INNER JOIN (((Producto INNER JOIN cClaseProducto ON Producto.IClase=cClaseProducto.ID) LEFT JOIN Departamento ON Producto.IDepartamento=Departamento.Sys_PK) LEFT JOIN Marca ON Producto.IMarca=Marca.Sys_PK) ON Divisa.Sys_PK=Producto.IDivisa) ON Linea.Sys_PK=Producto.ILinea WHERE Producto.IClase=3 OR Producto.IClase=4 OR Producto.IClase=5 ORDER BY Producto.Descripcion; 
 
CREATE VIEW PEPSINFO AS SELECT TOP 100 PERCENT DCARDEX.IPRODUCTO AS PRODUCTO, DCARDEX.SYS_PK AS SYS_PK, DCARDEX.CARGOS AS CARGOS, DCARDEX.RESTO AS CANTIDAD, DCARDEX.ENTRADAS AS ENTRADAS FROM DCARDEX INNER JOIN CARDEX ON DCARDEX.FK_Cardex_Movimientos=CARDEX.SYS_PK WHERE DCARDEX.RESTO>0 ORDER BY DCARDEX.IPRODUCTO, CARDEX.FECHA, DCARDEX.SYS_PK 

CREATE VIEW UEPSINFO AS SELECT TOP 100 PERCENT DCARDEX.IPRODUCTO AS PRODUCTO, DCARDEX.SYS_PK AS SYS_PK, DCARDEX.CARGOS AS CARGOS, DCARDEX.RESTO AS CANTIDAD, DCARDEX.ENTRADAS AS ENTRADAS FROM DCARDEX INNER JOIN CARDEX ON DCARDEX.FK_Cardex_Movimientos=CARDEX.SYS_PK WHERE DCARDEX.RESTO>0 ORDER BY DCARDEX.IPRODUCTO, CARDEX.FECHA DESC , DCARDEX.SYS_PK DESC 

CREATE VIEW COSTOSPROD AS SELECT IENSAMBLE.FK_Producto_Elementos AS IPRODUCTO, SUM(PRODUCTO.COSTOULTIMO*DIVISA.TCAMBIO) AS COSTO, SUM(PRODUCTO.COSTOPROMEDIO*DIVISA.TCAMBIO) AS COSTOPROM, SUM(PRODUCTO.CDIRECTO*DIVISA.TCAMBIO) AS CDIRECTO, SUM(PRODUCTO.CINDIRECTO*DIVISA.TCAMBIO) AS CINDIRECTO, SUM(PRODUCTO.CMANOOBRA*DIVISA.TCAMBIO) AS CMANOOBRA, SUM(PRODUCTO.CMAQUINARIA*DIVISA.TCAMBIO) AS CMAQUINARIA FROM (PRODUCTO INNER JOIN DIVISA ON PRODUCTO.IDIVISA=DIVISA.SYS_PK) INNER JOIN IENSAMBLE ON PRODUCTO.SYS_PK=IENSAMBLE.ELEMENTO GROUP BY IENSAMBLE.FK_Producto_Elementos 

CREATE VIEW qLotesXAlmacen AS SELECT CLoteXAlmacen.IAlmacen, CLoteXAlmacen.Cantidad, Lote.Numero, Lote.FCaducidad, Lote.Sys_PK AS PKLote, Producto.Sys_PK AS PKProducto, Producto.Descripcion, Producto.Unidad FROM Producto INNER JOIN (Lote INNER JOIN CLoteXAlmacen ON Lote.Sys_PK=CLoteXAlmacen.FK_Lote_ExisXAlmacen) ON Producto.Sys_PK=Lote.IProducto 

CREATE VIEW qryCatProveedores AS SELECT DISTINCT TOP 100 PERCENT Proveedor.Sys_PK, Tipoproveedor.Sys_PK AS PKTipoProveedor, Proveedor.Codigo AS Codigo, Proveedor.Nombre AS Nombre, Proveedor.RFC AS RFC, Domicilio.Direccion AS Direccion, Domicilio.Colonia AS Colonia, Domicilio.CodPos AS Codigo_postal, Domicilio.Telefonos AS Telefono, Proveedor.eMail AS eMail, Proveedor.Saldo AS Saldo FROM Domicilio RIGHT JOIN (Proveedor LEFT JOIN Tipoproveedor ON Proveedor.Tipo = Tipoproveedor.Sys_PK) ON Domicilio.Sys_PK = Proveedor.Domicilio1 WHERE isnull(Proveedor.uf_sys_baja,0)=0 ORDER BY Proveedor.Nombre; 

CREATE VIEW qryCatClientes AS SELECT DISTINCT TOP 100 PERCENT Cliente.Sys_PK, Tipocliente.Sys_PK AS PKTipoCliente, Cliente.Codigo AS Codigo, Cliente.Nombre AS Nombre, Cliente.RFC AS RFC, Domicilio.Direccion AS Direccion, Domicilio.Colonia AS Colonia, Domicilio.CodPos AS Codigo_Postal, Domicilio.Telefonos as Telefono, Cliente.eMail AS eMail, Cliente.Saldo AS Saldo FROM Domicilio RIGHT JOIN (Cliente LEFT JOIN Tipocliente ON Cliente.Tipo = Tipocliente.Sys_PK) ON Domicilio.Sys_PK = Cliente.Domicilio1 WHERE isnull(Cliente.uf_sys_baja,0)=0 ORDER BY Cliente.Nombre; 

CREATE VIEW qryCatCajas AS SELECT Caja.Sys_PK, Caja.Codigo, Caja.Descripcion, Caja.CodCuenta, CConsumo.Descripcion AS CentroConsumo, Caja.Notas FROM CConsumo INNER JOIN Caja ON CConsumo.Sys_PK=Caja.CentroConsumo 

CREATE VIEW qryCatChequera AS SELECT Chequera.Sys_PK, Chequera.CodCuenta, Chequera.NumCuenta, Chequera.Nombre, Divisa.Codigo AS Divisa, Banco.Nombre AS Banco, Chequera.CLABE, Chequera.Notas FROM Divisa INNER JOIN (Banco RIGHT JOIN Chequera ON Banco.Sys_PK=Chequera.IBanco) ON Divisa.Sys_PK=Chequera.IDivisa 

CREATE VIEW qryEstadoCuentaProveedor AS SELECT TOP 100 PERCENT DCXP.Sys_PK, DCXP.IProveedor AS Proveedor, cDocumentos.Const AS Documento, DCXP.Referencia, DCXP.Fecha, DCXP.Aplicacion AS Vencimiento, DCXP.Haber AS Importe, DCXP.IntMoratorios AS Cargos, DCXP.Bonificaciones, DCXP.Pagos AS Cobros, (DCXP.Haber+DCXP.IntMoratorios-DCXP.Bonificaciones-DCXP.Pagos) AS Saldo FROM cDocumentos INNER JOIN DCXP ON cDocumentos.ID=DCXP.Documento WHERE DCXP.Aplicable<>0 AND  (DCXP.Haber+DCXP.IntMoratorios-DCXP.Bonificaciones- DCXP.Pagos)>0 ORDER BY DCXP.Aplicacion, DCXP.Haber DESC; 

CREATE VIEW qryMovimientosProveedor AS SELECT TOP 100 PERCENT DCxP.Sys_PK, cDocumentos.Const AS Documento, DCxP.Referencia, DCxP.Fecha, DCxP.Aplicacion AS Vencimiento, DCxP.Debe, DCxP.Haber, DCxP.Notas AS Concepto, DCxP.IProveedor AS Proveedor, DCxP.Aplicable, Day(DCxP.Aplicacion) AS Dia, Month(DCxP.Aplicacion) AS Mes, Year(DCxP.Aplicacion) AS Anio, (Year(DCxP.Aplicacion)*10000)+(Month(DCxP.Aplicacion)*100)+(Day(DCxP.Aplicacion)) AS ND_Aplicacion, DCxP.IntMoratorios, DCxP.Bonificaciones, DCxP.Pagos, Proveedor.IZona, Proveedor.Tipo FROM Proveedor INNER JOIN (cDocumentos INNER JOIN DCxP ON cDocumentos.ID = DCxP.Documento) ON Proveedor.Sys_PK = DCxP.IProveedor ORDER BY DCxP.Aplicacion, DCxP.Haber DESC , DCxP.Debe DESC; 

CREATE VIEW qryEstadoCuentaCliente AS SELECT TOP 100 PERCENT DCXC.Sys_PK, DCXC.ICliente AS Cliente, cDocumentos.Const AS Documento, DCXC.Referencia, DCXC.Fecha, DCXC.Aplicacion AS Vencimiento, DCXC.Debe AS Importe, DCXC.IntMoratorios AS Cargos, DCXC.Bonificaciones, DCXC.Pagos AS Cobros, (DCXC.Debe+DCXC.IntMoratorios-DCXC.Bonificaciones-DCXC.Pagos) AS Saldo FROM cDocumentos INNER JOIN DCXC ON cDocumentos.ID=DCXC.Documento WHERE DCXC.Aplicable<>0 AND (DCXC.Debe+DCXC.IntMoratorios-DCXC.Bonificaciones-DCXC.Pagos) >0 ORDER BY DCXC.Aplicacion, DCXC.Debe DESC; 

CREATE VIEW qryMovimientosCliente AS SELECT TOP 100 PERCENT DCxC.Sys_PK, cDocumentos.Const AS Documento, DCxC.Referencia, DCxC.Fecha, DCxC.Aplicacion AS Vencimiento, DCxC.Debe, DCxC.Haber, DCxC.IntMoratorios, DCxC.Bonificaciones, DCxC.Pagos, DCxC.Notas AS Concepto, DCxC.ICliente AS Cliente, DCxC.Aplicable, Day(DCxC.Aplicacion) AS Dia, Month(DCxC.Aplicacion) AS Mes, Year(DCxC.Aplicacion) AS Anio, (Year(DCxC.Aplicacion)*10000)+(Month(DCxC.Aplicacion)*100)+(Day(DCxC.Aplicacion)) AS ND_Aplicacion, Cliente.Tipo, Cliente.Zona FROM Cliente INNER JOIN (cDocumentos INNER JOIN DCxC ON cDocumentos.ID = DCxC.Documento) ON Cliente.Sys_PK = DCxC.ICliente ORDER BY DCxC.Aplicacion, DCxC.Debe DESC , DCxC.Haber DESC; 

CREATE VIEW qryCuentasXRubro AS SELECT CContable.*, (CContable.D01+CContable.D02+CContable.D03+CContable.D04+CContable.D05+CContable.D06+CContable.D07+CContable.D08+CContable.D09+CContable.D10+CContable.D11+CContable.D12+CContable.DFinal) AS DTotal, (CContable.H01+CContable.H02+CContable.H03+CContable.H04+CContable.H05+CContable.H06+CContable.H07+CContable.H08+CContable.H09+CContable.H10+CContable.H11+CContable.H12+CContable.HFinal) AS HTotal, CRubro.Sys_PK AS RPK, CRubro.Codigo AS RCodigo, CRubro.Descripcion AS RDescripcion FROM CRubro INNER JOIN (CContable INNER JOIN CContable_CRubro_ ON CContable.Sys_PK=CContable_CRubro_.Cuentas) ON CRubro.Sys_PK=CContable_CRubro_.Rubros; 

CREATE VIEW qryCuentasXDepto AS SELECT CContable.*, (CContable.D01+CContable.D02+CContable.D03+CContable.D04+CContable.D05+CContable.D06+CContable.D07+CContable.D08+CContable.D09+CContable.D10+CContable.D11+CContable.D12+CContable.DFinal) AS DTotal, (CContable.H01+CContable.H02+CContable.H03+CContable.H04+CContable.H05+CContable.H06+CContable.H07+CContable.H08+CContable.H09+CContable.H10+CContable.H11+CContable.H12+CContable.HFinal) AS HTotal, CDepartamento.Sys_PK AS DPK, CDepartamento.Codigo AS DCodigo, CDepartamento.Descripcion AS Departamento, CContable_CRubro_.Rubros FROM (CContable LEFT JOIN CContable_CRubro_ ON CContable.Sys_PK=CContable_CRubro_.Cuentas) INNER JOIN (CDepartamento INNER JOIN CtaDepto ON CDepartamento.Sys_PK=CtaDepto.FK_CDepartamento_Cuentas) ON CContable.Sys_PK=CtaDepto.ICuenta; 

CREATE VIEW qryDeptoXCuenta AS SELECT DISTINCT CDepartamento.*, ISNULL(CtaDepto.ICuenta,0) AS IDC, CtaDepto.Sys_PK as CtaDeptoPK FROM CDepartamento LEFT JOIN CtaDepto ON CDepartamento.Sys_PK=CtaDepto.FK_CDepartamento_Cuentas; 

CREATE VIEW qryRubrosXCuenta AS SELECT DISTINCT CRubro.*, ISNULL(CContable_CRubro_.Cuentas,0) AS IDC FROM CRubro LEFT JOIN CContable_CRubro_ ON CRubro.Sys_PK=CContable_CRubro_.Rubros; 

CREATE VIEW qryMovCuentasCheques AS SELECT TOP 100 PERCENT MovCuenta.Sys_PK, cDocumentos.Const AS Documento, MovCuenta.Referencia, MovCuenta.Aplicacion, MovCuenta.Ingreso, MovCuenta.Egreso, Categoria.Descripcion AS Categoria, MovCuenta.Beneficiario, MovCuenta.Auditado, MovCuenta.Conciliado, MovCuenta.Contabilizado, MovCuenta.Cancelado, MovCuenta.Partida, MovCuenta.Poliza, MovCuenta.Fecha AS Creado, MovCuenta.Notas, MovCuenta.ICuenta, Month(MovCuenta.Fecha) AS Mes, Year(MovCuenta.Fecha) AS Anio,Month(MovCuenta.Aplicacion) AS MesAplicacion, Year(MovCuenta.Aplicacion) AS AnioAplicacion FROM cDocumentos INNER JOIN (MovCuenta INNER JOIN Categoria ON MovCuenta.ICategoria=Categoria.SYS_PK) ON cDocumentos.ID=MovCuenta.Tipo ORDER BY MovCuenta.Aplicacion, MovCuenta.Ingreso DESC , MovCuenta.Egreso DESC;

CREATE VIEW qryLoteByDCompra AS SELECT Lote.Existencia, Lote.Sys_PK, DCardex.RCompra,DCardex.Entradas FROM Lote INNER JOIN DCardex ON Lote.Sys_PK=DCardex.ILote WHERE DCardex.RCompra Is Not Null; 

CREATE VIEW qryLoteByDVenta AS SELECT Lote.Existencia, Lote.Sys_PK, DCardex.RVenta,DCardex.Salidas FROM Lote INNER JOIN DCardex ON Lote.Sys_PK=DCardex.ILote WHERE DCardex.RVenta Is Not Null; 

CREATE VIEW qryDetalleCorte AS SELECT TOP 100 PERCENT MovCaja.Sys_PK AS Folio, MovCaja.Fecha AS Fecha, MovCaja.Hora AS Hora, MovCaja.Referencia AS Referencia, Categoria.Descripcion AS Categoria, cDocumentos.Const AS Documento, MovCaja.Efectivo AS Efectivo, MovCaja.Cheques AS Cheques, MovCaja.Tarjetas AS Tarjetas, MovCaja.Vales AS Vales, MovCaja.Depositos AS Depositos, Divisa.Descripcion AS Divisa, (MovCaja.Efectivo+MovCaja.Cheques+MovCaja.Tarjetas+MovCaja.Vales+MovCaja.Depositos) AS Total, MovCaja.Notas, MovCaja.ICorte, Corte.ICaja FROM Divisa INNER JOIN (Corte INNER JOIN (Categoria INNER JOIN (cDocumentos INNER JOIN MovCaja ON cDocumentos.ID = MovCaja.Documento) ON Categoria.Sys_PK = MovCaja.ICategoria) ON Corte.Sys_PK = MovCaja.ICorte) ON Divisa.Sys_PK = MovCaja.IDivisa ORDER BY MovCaja.Fecha, MovCaja.Hora; 

CREATE VIEW qryBancos AS SELECT Banco.Sys_PK, Banco.Nombre, (Contacto.Nombre+' '+ Contacto.Apellidos) AS NombreC FROM Contacto RIGHT JOIN Banco ON Contacto.Sys_PK = Banco.Contacto; 

CREATE VIEW qryCajas AS SELECT Caja.SYS_PK, Caja.Codigo, Caja.Descripcion, Caja.CodCuenta, CConsumo.Descripcion AS CConsumo FROM CConsumo INNER JOIN Caja ON CConsumo.Sys_PK = Caja.CentroConsumo; 

CREATE VIEW qryCategorias AS SELECT TOP 100 PERCENT Categoria.Sys_PK, Categoria.Codigo, Categoria.Descripcion, Categoria.CodCuenta, cTiposCategorias.Const AS Tipo, cTiposCategorias.ID FROM cTiposCategorias INNER JOIN Categoria ON cTiposCategorias.ID = Categoria.Tipo ORDER BY   cTiposCategorias.ID, Categoria.Descripcion; 

CREATE VIEW qryChequera AS SELECT Chequera.Sys_PK, Chequera.Nombre, Divisa.Descripcion AS Divisa FROM Divisa INNER JOIN Chequera ON Divisa.Sys_PK = Chequera.IDivisa; 

CREATE VIEW qryLineas AS SELECT Linea.Sys_PK, Linea.Codigo, Linea.Descripcion, cClaseProducto.Const AS Clase FROM cClaseProducto INNER JOIN Linea ON cClaseProducto.ID = Linea.Clase; 

CREATE VIEW qryPromociones AS SELECT Promocion.Sys_PK, Promocion.Activa, Promocion.Codigo, Promocion.Nombre,cVigenciasPromociones.Const AS Vigencia, Promocion.FechaInicio, Promocion.FechaVigencia, cTiposPromociones.Const AS Tipo, cAmbitoPromociones.Const AS Ambito, cRestriccionPromociones.Const AS Restriccion, cExcepcionPromociones.Const AS Excepcion, Promocion.Excluyente AS Excluyente, Promocion.LibreEleccion FROM cExcepcionPromociones INNER JOIN (cVigenciasPromociones INNER JOIN (cTiposPromociones INNER JOIN (cRestriccionPromociones INNER JOIN (cAmbitoPromociones INNER JOIN Promocion ON cAmbitoPromociones.ID=Promocion.Ambito) ON cRestriccionPromociones.ID=Promocion.Restriccion) ON cTiposPromociones.ID=Promocion.Tipo) ON cVigenciasPromociones.ID=Promocion.Vigencia) ON cExcepcionPromociones.ID=Promocion.Excepcion; 

CREATE VIEW qryPromocionesActivas AS SELECT TOP 100 PERCENT Sys_PK,Vigencia,FechaVigencia FROM Promocion WHERE Activa<>0 ORDER BY Excluyente, LibreEleccion; 

CREATE VIEW qryTipoCupon AS SELECT TipoCupon.Sys_PK, TipoCupon.Nombre, cTipoValorCupon.Const AS Tipo, TipoCupon.Caducidad, TipoCupon.Valor, TipoCupon.UsoIlimitado, TipoCupon.Notas FROM cTipoValorCupon INNER JOIN TipoCupon ON cTipoValorCupon.ID=TipoCupon.Tipo 

CREATE VIEW qrySaldoCuentaAl AS SELECT Ingreso, Egreso, (year(Aplicacion)*10000)+(month(Aplicacion)*100)+(day(Aplicacion)) AS ND_Fecha, ICuenta  FROM MovCuenta WHERE Cancelado=0;

CREATE VIEW qryVentas AS SELECT TOP 100 PERCENT Venta.Sys_PK, cDocumentos.Const AS Documento, Venta.Referencia, Venta.Fecha, Cliente.Nombre, Venta.Vencimiento, Divisa.Codigo AS Divisa, Venta.TipoCambio, (Venta.Subtotal-Venta.Descuento1-venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total, Month(Venta.Fecha) AS Mes, Year(Venta.Fecha) AS Anio, cStatusFinancieros.Const AS Estado, cStatusFinancieros.ID AS ID, Venta.StatusAdministrativo, Venta.StatusEntrega, Venta.StatusFacturacion, Venta.StatusFinanciero, Venta.Documento AS TipoDocumento, Venta.ICliente, Cliente.Codigo AS CodigoCliente FROM cStatusFinancieros INNER JOIN (Cliente INNER JOIN (Divisa RIGHT JOIN (cDocumentos INNER JOIN Venta ON cDocumentos.ID=Venta.Documento) ON Divisa.Sys_PK=Venta.IDivisa) ON Cliente.Sys_PK=Venta.ICliente) ON cStatusFinancieros.ID=Venta.StatusFinanciero WHERE Venta.Documento<>6 ORDER BY Venta.Sys_PK; 

CREATE VIEW qryVentaByCliente AS SELECT TOP 100 PERCENT cDocumentos.Const AS Documento, Venta.Sys_PK, Venta.Fecha, Cliente.Nombre, Cliente.Sys_PK AS Cliente, Venta.Referencia, cDocumentos.ID AS IDOC, Venta.StatusFinanciero FROM Cliente INNER JOIN (cDocumentos INNER JOIN Venta ON cDocumentos.ID=Venta.Documento) ON Cliente.Sys_PK=Venta.ICliente Where Venta.StatusAdministrativo<>99 and  Not Venta.AplicadoA Is Not Null Order By Venta.Sys_PK  

CREATE VIEW qryCompras AS SELECT TOP 100 PERCENT Compra.Sys_PK, cDocumentos.Const AS Documento, Compra.Referencia, Compra.Fecha, Proveedor.Nombre, Compra.Vencimiento, Divisa.Codigo AS Divisa, Compra.TipoCambio, (Compra.Subtotal-Compra.Descuento1-Compra.Descuento2+Compra.Impuesto1+Compra.Impuesto2+Compra.Impuesto3+Compra.Impuesto4) AS Total, Month(Compra.Fecha) AS Mes, Year(Compra.Fecha) AS Anio, cStatusFinancieros.Const AS Estado, cStatusFinancieros.ID AS ID, Compra.StatusAdministrativo, Compra.StatusEntrega, Compra.StatusFacturacion, Compra.StatusFinanciero, Compra.Documento AS TipoDocumento, Compra.IProveedor, Proveedor.Codigo AS CodigoProveedor FROM cStatusFinancieros INNER JOIN (Proveedor INNER JOIN (Divisa RIGHT JOIN (cDocumentos INNER JOIN Compra ON cDocumentos.ID=Compra.Documento) ON Divisa.Sys_PK=Compra.IDivisa) ON Proveedor.Sys_PK=Compra.IProveedor) ON cStatusFinancieros.ID=Compra.StatusFinanciero ORDER BY Compra.Sys_PK; 

CREATE VIEW qryCompraByProveedor AS SELECT TOP 100 PERCENT cDocumentos.Const AS Documento, cDocumentos.ID AS IDDoc, Compra.Sys_PK, Compra.Fecha, Proveedor.Nombre, Proveedor.Sys_PK AS Proveedor, Compra.Referencia, Compra.StatusFinanciero FROM Proveedor INNER JOIN (cDocumentos INNER JOIN Compra ON cDocumentos.ID=Compra.Documento) ON Proveedor.Sys_PK=Compra.IProveedor WHERE NOT Compra.AplicadoA Is Not Null and Compra.statusAdministrativo<>99 ORDER BY COmpra.Sys_PK; 

CREATE VIEW qryTicketsAbiertos AS SELECT Venta.Sys_PK, Venta.Fecha, Cliente.Nombre, Venta.Referencia, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2 +Venta.Impuesto1+ Venta.Impuesto2+ Venta.Impuesto3+ Venta.Impuesto4) AS Total FROM Cliente INNER JOIN Venta ON Cliente.Sys_PK=Venta.ICliente WHERE Venta.StatusAdministrativo=1 and isnull(Venta.ICaja,0)<1; 


CREATE VIEW qryVentas2 AS SELECT TOP 100 PERCENT Venta.Sys_PK, cDocumentos.Const AS Documento, Venta.Referencia, Venta.Fecha, Cliente.Nombre, Venta.Vencimiento, Divisa.Codigo AS Divisa, Venta.TipoCambio, (Venta.Subtotal-Venta.Descuento1-venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total, Month(Venta.Fecha) AS Mes, Year(Venta.Fecha) AS Anio, cStatusFinancieros.Const AS Estado, cStatusFinancieros.ID AS ID, Venta.StatusAdministrativo, Venta.StatusEntrega, Venta.StatusFacturacion, Venta.StatusFinanciero, Venta.Documento AS TipoDocumento, Venta.ICliente, Cliente.Codigo AS CodigoCliente FROM cStatusFinancieros INNER JOIN (Cliente INNER JOIN (Divisa RIGHT JOIN (cDocumentos INNER JOIN Venta ON cDocumentos.ID=Venta.Documento) ON Divisa.Sys_PK=Venta.IDivisa) ON Cliente.Sys_PK=Venta.ICliente) ON cStatusFinancieros.ID=Venta.StatusFinanciero ORDER BY Venta.Sys_PK;

CREATE VIEW qryVentasProductos AS SELECT TOP 100 PERCENT qryVentas2.Sys_PK AS PKVenta, qryVentas2.Nombre, qryVentas2.ICliente, qryVentas2.CodigoCliente, qryVentas2.Documento, qryVentas2.Referencia, qryVentas2.Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DVenta.Unidad, DVenta.Cantidad, DVenta.Precio, DVenta.Descuento1, DVenta.Descuento2, DVenta.Impuesto1, DVenta.Impuesto2, DVenta.Impuesto3, DVenta.Impuesto4, qryVentas2.Divisa AS CDivisa, qryVentas2.TipoCambio, qryVentas2.Anio, qryVentas2.Mes, qryCatProductos.Unidad AS UE, DVenta.Factor, DVenta.Factor*DVenta.Cantidad AS CantidadE, DVenta.Sys_PK AS PKDVenta,qrycatproductos.TipoProducto AS TipoProducto,qrycatproductos.CostoUltimo AS CostoU FROM qryCatProductos INNER JOIN (DVenta INNER JOIN qryVentas2 ON DVenta.FK_Venta_Detalle=qryVentas2.Sys_PK) ON qryCatProductos.Sys_PK=DVenta.IProducto WHERE ( (qryVentas2.TipoDocumento=3 And qryVentas2.StatusFacturacion=1 ) Or (qryVentas2.TipoDocumento=6 And qryVentas2.StatusFacturacion=1 ) Or (qryVentas2.TipoDocumento=4)) And qryVentas2.StatusAdministrativo=3 ORDER BY qryVentas2.Sys_PK, qryCatProductos.Sys_PK;
 

CREATE VIEW qryUltimaVentaProducto AS SELECT qryVentasProductos.PKProducto, qryVentasProductos.Nombre, qryVentasProductos.ICliente, qryVentasProductos.CodigoCliente, qryVentasProductos.Codigo, qryVentasProductos.Descripcion, qryVentasProductos.Unidad, qryVentasProductos.Cantidad, qryVentasProductos.Precio, qryVentasProductos.Descuento1, qryVentasProductos.Descuento2, qryVentasProductos.Impuesto1, qryVentasProductos.Impuesto2, qryVentasProductos.Impuesto3, qryVentasProductos.Impuesto4, qryVentasProductos.PKVenta, qryVentasProductos.Documento, qryVentasProductos.Referencia, qryVentasProductos.CDivisa, qryVentasProductos.TipoCambio, Max(qryVentasProductos.Fecha) AS Fecha FROM qryVentasProductos GROUP BY qryVentasProductos.PKProducto, qryVentasProductos.Nombre, qryVentasProductos.ICliente, qryVentasProductos.CodigoCliente, qryVentasProductos.Codigo, qryVentasProductos.Descripcion, qryVentasProductos.Unidad, qryVentasProductos.Cantidad, qryVentasProductos.Precio, qryVentasProductos.Descuento1, qryVentasProductos.Descuento2, qryVentasProductos.Impuesto1, qryVentasProductos.Impuesto2, qryVentasProductos.Impuesto3, qryVentasProductos.Impuesto4, qryVentasProductos.PKVenta, qryVentasProductos.Documento, qryVentasProductos.Referencia, qryVentasProductos.CDivisa, qryVentasProductos.TipoCambio; 

CREATE VIEW qryComprasProductos AS SELECT TOP 100 PERCENT qryCompras.Sys_PK AS PKCompra, qryCompras.Nombre, qryCompras.IProveedor, qryCompras.CodigoProveedor, qryCompras.Documento, qryCompras.Referencia, qryCompras.Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DCompra.Unidad, DCompra.Cantidad, DCompra.Precio, DCompra.Descuento1, DCompra.Descuento2, DCompra.Impuesto1, DCompra.Impuesto2, DCompra.Impuesto3, DCompra.Impuesto4, qryCompras.Divisa AS CDivisa, qryCompras.TipoCambio, qryCompras.Anio, qryCompras.Mes, qryCatProductos.Unidad as UE,DCompra.Factor, DCompra.Factor*DCompra.Cantidad As CantidadE,DCompra.Sys_PK as PKDCompra FROM (DCompra INNER JOIN qryCompras ON DCompra.FK_Compra_Detalle=qryCompras.Sys_PK) INNER JOIN qryCatProductos ON DCompra.IProducto=qryCatProductos.Sys_PK WHERE ((qryCompras.TipoDocumento=3 And (qryCompras.StatusFacturacion=1)) Or (qryCompras.TipoDocumento=4)) And qryCompras.StatusAdministrativo<>99 ORDER BY qryCompras.Sys_PK, qryCatProductos.Sys_PK; 

CREATE VIEW qryUltimaCompraProducto AS SELECT qryComprasProductos.PKProducto, qryComprasProductos.Nombre, qryComprasProductos.IProveedor, qryComprasProductos.CodigoProveedor, qryComprasProductos.Codigo, qryComprasProductos.Descripcion, qryComprasProductos.Unidad, qryComprasProductos.Cantidad, qryComprasProductos.Precio, qryComprasProductos.Descuento1, qryComprasProductos.Descuento2, qryComprasProductos.Impuesto1, qryComprasProductos.Impuesto2, qryComprasProductos.Impuesto3, qryComprasProductos.Impuesto4, qryComprasProductos.PKCompra, qryComprasProductos.Documento, qryComprasProductos.Referencia, qryComprasProductos.CDivisa, qryComprasProductos.TipoCambio, max(qryComprasProductos.Fecha) AS Fecha FROM qryComprasProductos GROUP BY qryComprasProductos.PKProducto, qryComprasProductos.Codigo, qryComprasProductos.Descripcion, qryComprasProductos.Unidad, qryComprasProductos.Cantidad, qryComprasProductos.Precio, qryComprasProductos.Descuento1, qryComprasProductos.Descuento2, qryComprasProductos.Impuesto1, qryComprasProductos.Impuesto2, qryComprasProductos.Impuesto3, qryComprasProductos.Impuesto4, qryComprasProductos.PKCompra, qryComprasProductos.Documento, qryComprasProductos.Referencia, qryComprasProductos.Nombre, qryComprasProductos.IProveedor, qryComprasProductos.CodigoProveedor, qryComprasProductos.CDivisa, qryComprasProductos.TipoCambio;  

CREATE VIEW qryJoin AS SELECT Docs.Sys_DTCreated, Docs.Sys_PK, DocLink.Fk_Parent, Docs.Words, Docs.Sys_GUID, Docs.Sys_TimeStamp, Docs.Description, Docs.Name, Docs.TypeData, Doclink.Sis FROM Docs, DocLink WHERE Docs.Sys_GUID=DocLink.FK_Doc 

CREATE VIEW qryExistenciasByAlmacen AS SELECT TOP 100 PERCENT Almacen.Descripcion as Almacen, Producto.Unidad, Existencias.Existencia, Producto.CostoUltimo, Producto.Sys_PK AS PkProducto, Producto.Descripcion as Producto, Almacen.Sys_PK AS PKAlmacen FROM Almacen INNER JOIN (Producto INNER JOIN Existencias ON Producto.Sys_PK=Existencias.FK_Producto_IExistencias) ON Almacen.Sys_PK=Existencias.IAlmacen ORDER BY Producto.Sys_PK; 

CREATE VIEW qryProductoExistencia AS SELECT Producto.Sys_PK, Producto.Codigo, Producto.Descripcion, Producto.Precio1, Producto.Existencia AS ExistenciaTotal, Existencias.Existencia AS ExistenciadeAlmacen, Producto.CodBar1, Producto.Precio2, Producto.Precio3, Producto.Precio4, Producto.Precio5, Existencias.IAlmacen AS Almacen FROM Producto INNER JOIN Existencias ON Producto.Sys_PK=Existencias.FK_Producto_IExistencias 

 CREATE PROCEDURE qryClienteLike (@N VARCHAR(255), @C VARCHAR(255), @CU VARCHAR(255), @R VARCHAR(255)) AS BEGIN SELECT Sys_PK FROM  CLIENTE WHERE  Nombre LIKE @N or Codigo LIKE @C or Curp LIKE @CU or RFC LIKE @R; END 

 CREATE PROCEDURE qryAgenteLike (@N VARCHAR(255), @C VARCHAR(255)) AS BEGIN SELECT Sys_PK From Agente WHERE Nombre LIKE @N or Codigo LIKE @C; END 

CREATE VIEW qryTicketsProcesados AS SELECT Venta.Sys_PK, Venta.Fecha, Cliente.Nombre, Venta.Referencia, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total FROM Cliente INNER JOIN Venta ON Cliente.Sys_PK=Venta.ICliente WHERE Venta.StatusAdministrativo=3 and Venta.StatusFacturacion=1 and Venta.Documento=6; 

 CREATE PROCEDURE qryProductosLike (@P VARCHAR(255), @Q VARCHAR(255), @R VARCHAR(255), @S VARCHAR(255), @T VARCHAR(255)) AS BEGIN SELECT TOP 100 PERCENT Codigo, Descripcion, CodBar1, CodBar2, CodBar3, Precio1, Existencia, Sys_PK FROM Producto  WHERE Visible<>0 And (Codigo Like @P Or CodBar1 Like @Q Or CodBar2 Like @R Or CodBar3 Like @S Or Descripcion Like @T) ORDER BY Descripcion; END 

CREATE VIEW qryCardex AS SELECT Cardex.Fecha, DCardex.IAlmacen, Almacen.Descripcion AS Almacen, DCardex.IProducto, Producto.Descripcion AS Producto, SUM(DCardex.Entradas) AS Entradas, SUM(DCardex.Salidas) AS Salidas, SUM(DCardex.Entradas-DCardex.Salidas) AS Resto, SUM(DCardex.Cargos) AS Debe, SUM(DCardex.Abonos) AS Haber, Producto.CostoPromedio, DCardex.TipoCambio, Month(Cardex.Fecha) AS Mes, Year(Cardex.Fecha) AS Anio FROM Producto RIGHT JOIN (Almacen INNER JOIN (Cardex INNER JOIN DCardex ON Cardex.Sys_PK=DCardex.FK_Cardex_Movimientos) ON Almacen.Sys_PK=DCardex.IAlmacen) ON Producto.Sys_PK=DCardex.IProducto GROUP BY Producto.Descripcion, DCardex.IProducto, DCardex.IAlmacen, Almacen.Descripcion, Cardex.Fecha,DCardex.TipoCambio, Producto.CostoPromedio; 

CREATE VIEW qryCardexXProducto AS SELECT TOP 100 PERCENT Cardex.Fecha, DCardex.IAlmacen, Almacen.Descripcion AS Almacen, Categoria.Descripcion AS Categoria,Cardex.Referencia, DCardex.IProducto, Producto.Descripcion AS Producto, DCardex.Entradas, DCardex.Salidas, DCardex.Cargos AS Debe, DCardex.Abonos AS Haber, Producto.CostoPromedio, Divisa.Codigo AS Divisa, DCardex.TipoCambio, (DCardex.Cargos*DCardex.TipoCambio) AS Debe_DivisaPred, (DCardex.Abonos*DCardex.TipoCambio) AS Haber_DivisaPred, Cardex.Descripcion AS Notas, Month(Cardex.Fecha) AS Mes, Year(Cardex.Fecha) AS Anio FROM Divisa INNER JOIN (Producto INNER JOIN (Categoria INNER JOIN (Almacen INNER JOIN (Cardex INNER JOIN DCardex ON Cardex.Sys_PK=DCardex.FK_Cardex_Movimientos) ON Almacen.Sys_PK=DCardex.IAlmacen) ON Categoria.Sys_PK=Cardex.ICategoria) ON Producto.Sys_PK=DCardex.IProducto) ON Divisa.Sys_PK=Producto.IDivisa ORDER BY Cardex.Fecha, DCardex.Entradas DESC , Cardex.Sys_PK; 

CREATE VIEW qryLotes AS SELECT TOP 100 PERCENT Lote.Sys_PK, Lote.Numero, Almacen.Descripcion AS Almacen, CLoteXAlmacen.Cantidad AS Existencia, Lote.FEntrada, Lote.FCaducidad, Lote.IProducto FROM Almacen INNER JOIN (lote INNER JOIN CLoteXAlmacen ON lote.Sys_PK=CLoteXAlmacen.FK_Lote_ExisXAlmacen) ON Almacen.Sys_PK=CLoteXAlmacen.IAlmacen ORDER BY Lote.Numero; 

CREATE VIEW qrySeries AS SELECT TOP 100 PERCENT Serie.Sys_PK, Serie.Numero, Almacen.Descripcion AS Almacen, Serie.Status AS IDStatus, cStatusSeries.Const AS Estatus, Serie.FEntrada, Serie.FVenta, Lote.Numero AS Lote, Serie.IProducto FROM cStatusSeries INNER JOIN (Lote RIGHT JOIN (Almacen INNER JOIN Serie ON Almacen.Sys_PK = Serie.IAlmacen) ON Lote.Sys_PK = Serie.ILote) ON cStatusSeries.ID = Serie.Status ORDER BY Serie.Numero; 

CREATE VIEW qryRepClientes AS SELECT Cliente.Codigo as codcli, Cliente.Nombre as clinom, Cliente.eMail as email, Cliente.RFC as rfc, TipoCliente.Descripcion as tipo, Zona.Nombre as zona, GrupoClientes.Nombre as grupo, Domicilio.Colonia as colonia, Domicilio.Direccion as direccion, Domicilio.Telefonos as telefono FROM Domicilio INNER JOIN (GrupoClientes RIGHT JOIN ((Zona RIGHT JOIN (TipoCliente INNER JOIN Cliente ON TipoCliente.Sys_PK = Cliente.Tipo) ON Zona.Sys_PK = Cliente.Zona) LEFT JOIN Cliente_GrupoClientes_ ON Cliente.Sys_PK = Cliente_GrupoClientes_.IClientes) ON GrupoClientes.Sys_PK = Cliente_GrupoClientes_.IGrupos) ON Domicilio.Sys_PK = Cliente.Domicilio1; 

CREATE VIEW qryProveedores AS SELECT Proveedor.Sys_PK, Proveedor.Codigo, Proveedor.Nombre, Divisa.Descripcion AS Divisa, cTasasIVA.Const AS TasaIva, TipoProveedor.Descripcion AS Tipo FROM TipoProveedor INNER JOIN (cTasasIVA INNER JOIN (Divisa INNER JOIN Proveedor ON Divisa.Sys_PK = Proveedor.IDivisa) ON cTasasIVA.ID = Proveedor.TasaIVA) ON TipoProveedor.Sys_PK = Proveedor.Tipo; 

CREATE VIEW qryPVenta AS SELECT PrecioVenta.Sys_PK, Producto.Descripcion, PrecioVenta.Limite, PrecioVenta.Precio FROM Producto INNER JOIN PrecioVenta ON Producto.Sys_PK = PrecioVenta.Producto; 

CREATE VIEW qryBrwPromociones  AS SELECT Promocion.Sys_PK, Promocion.Codigo, Promocion.Nombre, cAmbitoPromociones.Const AS Ambito, cExcepcionPromociones.Const AS Excepcion, Promocion.FechaInicio, cRestriccionPromociones.Const AS Restriccion, cTiposPromociones.Const AS Tipo, cVigenciasPromociones.Const AS Vigencia FROM cVigenciasPromociones INNER JOIN (cTiposPromociones INNER JOIN (cRestriccionPromociones INNER JOIN (cExcepcionPromociones INNER JOIN (cAmbitoPromociones INNER JOIN Promocion ON cAmbitoPromociones.ID = Promocion.Ambito) ON cExcepcionPromociones.ID = Promocion.Excepcion) ON cRestriccionPromociones.ID = Promocion.Restriccion) ON cTiposPromociones.ID = Promocion.Tipo) ON cVigenciasPromociones.ID = Promocion.Vigencia; 


CREATE VIEW qryCostoVentas AS SELECT qryVentasProductos.PKVenta, qryVentasProductos.PKDVenta, qryVentasProductos.PKProducto, qryVentasProductos.Codigo, qryVentasProductos.Descripcion, (CASE WHEN isnull(DCardex.ISerie,0)=0 THEN qryVentasProductos.CantidadE ELSE DCardex.Salidas END) AS CantidadE, qryVentasProductos.UE,(qryVentasProductos.Precio/qryVentasProductos.Factor) AS Precio, (CASE WHEN isnull(DCardex.ISerie,0)=0 THEN (qryVentasProductos.Precio*qryVentasProductos.Cantidad)-qryVentasProductos.Descuento1-qryVentasProductos.Descuento2 ELSE (qryVentasProductos.Precio/qryVentasProductos.Factor)-((qryVentasProductos.Descuento1+qryVentasProductos.Descuento2)/qryVentasProductos.CantidadE) END) AS Importe, (CASE WHEN isnull(DCardex.ISerie,0)=0 THEN (qryVentasProductos.Impuesto1+qryVentasProductos.Impuesto2+qryVentasProductos.Impuesto3+qryVentasProductos.Impuesto4) ELSE (qryVentasProductos.Impuesto1+qryVentasProductos.Impuesto2+qryVentasProductos.Impuesto3+qryVentasProductos.Impuesto4)/qryVentasProductos.CantidadE END) AS Impuestos, (DCardex.Abonos/DCardex.Salidas*(CASE WHEN isnull(DCardex.ISerie,0)=0 THEN qryVentasProductos.CantidadE ELSE DCardex.Salidas END)) AS Abonos, DCardex.Valuado, DCardex.IAlmacen, DCardex.Sys_PK AS PKDCardex, DCardex.FK_Cardex_Movimientos AS PKCardex, qryVentasProductos.Anio, qryVentasProductos.Mes, qryVentasProductos.Fecha, qryVentasProductos.Referencia, (year(qryVentasProductos.Fecha)*10000)+(month(qryVentasProductos.Fecha)*100)+(day(qryVentasProductos.Fecha)) AS ND_Fecha FROM qryVentasProductos LEFT JOIN DCardex ON qryVentasProductos.PKDVenta=DCardex.RVenta;


CREATE VIEW qryVentasProductoMes AS SELECT TOP 100 PERCENT Anio, Mes, PKProducto, UE, Sum(CantidadE) as Cantidad, Sum(Importe) as Ventas, Sum(Abonos) as Costo, Anio & '/' & Mes as Leyenda FROM qryCostoVentas  Group By Anio, Mes, PKProducto, UE ORDER BY PKProducto, Anio, Mes; 

CREATE VIEW qryComprasProductoMes AS SELECT TOP 100 PERCENT qryComprasProductos.Anio, qryComprasProductos.Mes, qryComprasProductos.PKProducto, Sum(qryComprasProductos.CantidadE) as Cantidad, Sum( (qryComprasProductos.Precio*qryComprasProductos.Cantidad)-qryComprasProductos.Descuento1-qryComprasProductos.Descuento2) as Total, qryComprasProductos.Anio & '/' & qryComprasProductos.Mes as leyenda From qryComprasProductos Group By qryComprasProductos.Anio, qryComprasProductos.Mes, qryComprasProductos.PKProducto Order By qryComprasProductos.PKProducto, qryComprasProductos.Anio,qryComprasProductos.Mes; 

CREATE VIEW qryDevComprasProductos AS SELECT TOP 100 PERCENT qryCompras.Sys_PK AS PKCompra, qryCompras.Nombre, qryCompras.IProveedor, qryCompras.CodigoProveedor, qryCompras.Documento, qryCompras.Referencia, qryCompras.Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DCompra.Unidad,isnull(DCompra.Cantidad,0) AS Cantidad,isnull(DCompra.Precio,0) AS Precio,isnull(DCompra.Descuento1,0) AS Descuento1,isnull(DCompra.Descuento2,0) AS Descuento2,isnull(DCompra.Impuesto1,0) AS Impuesto1,isnull(DCompra.Impuesto2,0) AS Impuesto2,isnull(DCompra.Impuesto3,0) AS Impuesto3,isnull(DCompra.Impuesto4,0) AS Impuesto4, qryCompras.Divisa AS CDivisa, qryCompras.TipoCambio, qryCompras.Anio, qryCompras.Mes, qryCatProductos.Unidad AS UE,isnull(DCompra.Factor,0) AS Factor,isnull(DCompra.Factor*DCompra.Cantidad,0) AS CantidadE, DCompra.Sys_PK AS PKDCompra FROM (DCompra INNER JOIN qryCompras ON DCompra.FK_Compra_Detalle=qryCompras.Sys_PK) INNER JOIN qryCatProductos ON DCompra.IProducto=qryCatProductos.Sys_PK WHERE qryCompras.TipoDocumento=5 And qryCompras.StatusAdministrativo<>99 ORDER BY qryCompras.Sys_PK, qryCatProductos.Sys_PK; 


CREATE VIEW qryDevComprasProductosMes AS SELECT TOP 100 PERCENT qryDevComprasProductos.Anio, qryDevComprasProductos.Mes, qryDevComprasProductos.PKProducto, Sum(qryDevComprasProductos.CantidadE) AS Cantidad, Sum((qryDevComprasProductos.Precio*qryDevComprasProductos.Cantidad)-qryDevComprasProductos.Descuento1-qryDevComprasProductos.Descuento2) AS Total, qryDevComprasProductos.Anio & '/' & qryDevComprasProductos.Mes AS leyenda FROM qryDevComprasProductos GROUP BY qryDevComprasProductos.Anio, qryDevComprasProductos.Mes, qryDevComprasProductos.PKProducto ORDER BY qryDevComprasProductos.PKProducto, qryDevComprasProductos.Anio, qryDevComprasProductos.Mes; 

CREATE VIEW qryDevVentasProductos AS SELECT TOP 100 PERCENT qryVentas.Sys_PK AS PKVenta, qryVentas.Nombre, qryVentas.ICliente, qryVentas.CodigoCliente, qryVentas.Documento, qryVentas.Referencia, qryVentas.Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DVenta.Unidad, isnull(DVenta.Cantidad,0) AS Cantidad,isnull(DVenta.Precio,0) AS Precio,isnull(DVenta.Descuento1,0) AS Descuento1,isnull(DVenta.Descuento2,0) AS Descuento2, isnull(DVenta.Impuesto1,0) AS Impuesto1,isnull(DVenta.Impuesto2,0) AS Impuesto2,isnull(DVenta.Impuesto3,0) AS Impuesto3,isnull(DVenta.Impuesto4,0) AS Impuesto4,qryVentas.Divisa AS CDivisa, qryVentas.TipoCambio, qryVentas.Anio, qryVentas.Mes, qryCatProductos.Unidad AS UE, isnull(DVenta.Factor,0) AS Factor,isnull(DVenta.Factor*DVenta.Cantidad,0) AS CantidadE, DVenta.Sys_PK AS PKDVenta FROM (qryCatProductos INNER JOIN (DVenta INNER JOIN qryVentas ON DVenta.FK_Venta_Detalle=qryVentas.Sys_PK) ON qryCatProductos.Sys_PK=DVenta.IProducto) LEFT JOIN Venta ON DVenta.Documento=Venta.Sys_PK WHERE qryVentas.TipoDocumento=5 And qryVentas.StatusAdministrativo<>99 And (Venta.Documento<>6 OR (Venta.Documento=6 And Venta.StatusFacturacion=1)) ORDER BY qryVentas.Sys_PK, qryCatProductos.Sys_PK;    


CREATE VIEW qryDevCostoVenta AS SELECT qryDevVentasProductos.PKVenta, qryDevVentasProductos.PKDVenta, qryDevVentasProductos.PKProducto, qryDevVentasProductos.Codigo, qryDevVentasProductos.Descripcion, qryDevVentasProductos.CantidadE, qryDevVentasProductos.UE, qryDevVentasProductos.Precio, (qryDevVentasProductos.Precio*qryDevVentasProductos.Cantidad)-qryDevVentasProductos.Descuento1-qryDevVentasProductos.Descuento2 AS Importe, (qryDevVentasProductos.Impuesto1+qryDevVentasProductos.Impuesto2+qryDevVentasProductos.Impuesto3+qryDevVentasProductos.Impuesto4) AS Impuestos, DCardex.Cargos, DCardex.Valuado, DCardex.IAlmacen, DCardex.Sys_PK AS PKDCardex, FK_Cardex_Movimientos AS PKCardex, qryDevVentasProductos.Anio, qryDevVentasProductos.Mes, qryDevVentasProductos.Fecha, qryDevVentasProductos.Referencia, (year(qryDevVentasProductos.Fecha)*10000)+(month(qryDevVentasProductos.Fecha)*100)+(day(qryDevVentasProductos.Fecha)) AS ND_Fecha FROM qryDevVentasProductos LEFT JOIN DCardex ON qryDevVentasProductos.PKDVenta=DCardex.RVenta;   

CREATE VIEW qryDevVentasProductoMes AS SELECT TOP 100 PERCENT Anio, Mes, PKProducto, UE, Sum(CantidadE) AS Cantidad, Sum(Importe) AS Ventas, Sum(qryDevCostoVenta.Cargos) AS Costo, Anio + '/' + Mes AS leyenda FROM qryDevCostoVenta GROUP BY Anio, Mes, PKProducto, UE ORDER BY PKProducto, Anio, Mes; 

CREATE VIEW qryCortes AS SELECT Corte.Sys_PK AS Sys_PK, Caja.Descripcion AS Descripcion, Cajero.Nombre AS Nombre, Corte.Cerrado, Corte.FApertura AS FApertura, Corte.FCierre AS FCierre, Corte.HApertura AS HApertura, Corte.HCierre AS HCierre, Corte.ICaja AS ICaja, Corte.ICajero AS ICajero FROM Cajero INNER JOIN (Caja INNER JOIN Corte ON Caja.Sys_PK=Corte.ICaja) ON Cajero.Sys_PK=Corte.ICajero; 

CREATE VIEW qryVentasXSalir AS SELECT Venta.Sys_PK AS PKVENTA, Venta.ICliente, Venta.Documento, DVenta.Sys_PK AS PKDVENTA, DVenta.IProducto, DVenta.IAlmacen, DVenta.Cantidad, DVenta.XFacturar, DVenta.XSalir, Producto.Descripcion FROM Producto INNER JOIN (Venta INNER JOIN DVenta ON Venta.Sys_PK=DVenta.FK_Venta_Detalle) ON Producto.Sys_PK=DVenta.IProducto; 

CREATE VIEW qryCuentasDetalle AS SELECT TOP 100 PERCENT CContable.Sys_PK, CContable.Codigo, CContable.Descripcion, CContable.Tipo, CContable.IDivisa, CContable.Departamental FROM CContable WHERE CContable.Detalle<>0 ORDER BY CContable.Codigo; 

CREATE VIEW qrySaldosCaja AS SELECT Corte.ICaja, MovCaja.IDivisa, SUM(MovCaja.Efectivo) AS Efectivo, SUM(MovCaja.Cheques) AS Cheques, SUM(MovCaja.Depositos) AS Depositos, SUM(MovCaja.Tarjetas) AS Tarjetas, SUM(MovCaja.Vales) AS Vales FROM Corte INNER JOIN MovCaja ON Corte.Sys_PK = MovCaja.ICorte GROUP BY Corte.ICaja, MovCaja.IDIvisa; 

 CREATE PROCEDURE qrySaldoCuenta(@PK INT) AS BEGIN SELECT Sum(MovCuenta.Ingreso) AS Ingresos, Sum(MovCuenta.Egreso) AS Egresos FROM MovCuenta WHERE MovCuenta.Cancelado=0 AND MovCuenta.ICuenta=@PK; END 

 CREATE PROCEDURE qrySaldoCuentaConciliado(@PK INT) AS BEGIN SELECT Sum(MovCuenta.Ingreso) AS Ingresos, Sum(MovCuenta.Egreso) AS Egresos FROM MovCuenta WHERE MovCuenta.Cancelado=0 AND MovCuenta.Conciliado=1 AND MovCuenta.ICuenta=@PK; END 

CREATE VIEW qryContacto AS SELECT TOP 100 PERCENT Contacto.Sys_PK, Contacto.Tratamiento, (Contacto.Nombre + ' ' + Contacto.Apellidos) AS Nombre, Contacto.Empresa, Contacto.Puesto, Contacto.Tel1 AS Telefono, (Domicilio.Direccion + ', ' + Domicilio.Colonia + ', ' + Ciudad.Nombre) AS Domicilio, Contacto.WebSite, Contacto.eMail1 AS eMail, Contacto.Tel2, Contacto.Tel3, Contacto.eMail2, Contacto.eMail3, Contacto.eMail4, Contacto.Notas FROM Ciudad RIGHT JOIN (Domicilio RIGHT JOIN Contacto ON Domicilio.Sys_PK=Contacto.Domicilio1) ON Ciudad.Sys_PK=Domicilio.ICiudad ORDER BY Contacto.Nombre; 

CREATE VIEW qryBusquedaContacto AS SELECT SYS_PK, Nombre, (Nombre+' '+Apellidos) AS Nombres, eMail1, Puesto, Tel1 FROM Contacto;  

CREATE VIEW qryDetalleTicket AS SELECT DVenta.Sys_PK, DVenta.Cantidad, DVenta.Descuento1, DVenta.Descuento2,(DVenta.Descuento1+DVenta.Descuento2) AS Descuentos, DVenta.Impuesto1, DVenta.Impuesto2, DVenta.Impuesto3, DVenta.Impuesto4,(DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+ DVenta.Impuesto4) AS Impuestos, DVenta.Precio, DVenta.Unidad,DVenta.Factor, DVenta.TipoCambio, DVenta.FK_Venta_Detalle AS Venta, DVenta.XSalir, DVenta.Notas,DVenta.IProducto, Producto.Codigo, Producto.Descripcion, Producto.IClase, Producto.ITipo,Producto.Precio1,Producto.Precio2,Producto.Precio3,Producto.Precio4,Producto.Precio5, Producto.PPuntos, Producto.IDivisa, Producto.ReqSerie, Producto.ReqLote FROM Producto INNER JOIN DVenta ON Producto.Sys_PK = DVenta.IProducto;

 CREATE PROCEDURE qryDocumentoCXC (@PK INT) AS BEGIN SELECT TOP 1 SYS_PK FROM DCXC WHERE ICliente=@PK AND Haber>0 AND XAplicar>0 ORDER BY Aplicacion; END 

 CREATE PROCEDURE qryDocumentoCXP (@PK INT) AS BEGIN SELECT TOP 1 SYS_PK FROM DCxP WHERE IProveedor=@PK AND Debe>0 AND XAplicar>0 ORDER BY Aplicacion; END 

CREATE VIEW qAEHistoricoTCambio AS SELECT CHTCambio.Sys_PK, CHTCambio.Sys_TimeStamp, CHTCambio.Sys_GUID, CHTCambio.Fecha, CHTCambio.TCambio, Divisa.Sys_GUID AS IDivisa FROM Divisa INNER JOIN CHTCambio ON Divisa.Sys_PK=CHTCambio.IDivisa; 

CREATE VIEW qAEDetallePoliza AS SELECT CDPoliza.Sys_PK, CDPoliza.Sys_TimeStamp, CDPoliza.Sys_GUID, CDPoliza.Concepto, CDPoliza.Debe, CDPoliza.Haber, CDPoliza.Referencia, CDPoliza.TCambio, CContable.Sys_GUID AS ICuenta, CDepartamento.Sys_GUID AS IDepto, CPoliza.Sys_GUID AS FK_CPoliza_Detalle FROM CDepartamento RIGHT JOIN (CPoliza INNER JOIN (CContable INNER JOIN CDPoliza ON CContable.Sys_PK=CDPoliza.ICuenta) ON CPoliza.Sys_PK=CDPoliza.FK_CPoliza_Detalle) ON CDepartamento.Sys_PK=CDPoliza.IDepto; 

CREATE VIEW qAECuentasRubros AS SELECT CContable_CRubro_.Sys_PK, CContable_CRubro_.Sys_TimeStamp, CRubro.Sys_GUID AS Rubros, CContable.Sys_GUID AS Cuentas FROM CRubro INNER JOIN (CContable INNER JOIN CContable_CRubro_ ON CContable.Sys_PK=CContable_CRubro_.Cuentas) ON CRubro.Sys_PK=CContable_CRubro_.Rubros; 

CREATE VIEW qAECuentasDepartamentos AS SELECT CtaDepto.Sys_PK, CtaDepto.Sys_TimeStamp, CtaDepto.Sys_GUID, CtaDepto.D01, CtaDepto.D02, CtaDepto.D03, CtaDepto.D04, CtaDepto.D05, CtaDepto.D06, CtaDepto.D07, CtaDepto.D08, CtaDepto.D09, CtaDepto.D10, CtaDepto.D11, CtaDepto.D12, CtaDepto.DFinal, CtaDepto.H01, CtaDepto.H02, CtaDepto.H03, CtaDepto.H04, CtaDepto.H05, CtaDepto.H06, CtaDepto.H07, CtaDepto.H08, CtaDepto.H09, CtaDepto.H10, CtaDepto.H11, CtaDepto.H12, CtaDepto.HFinal, CtaDepto.P01, CtaDepto.P02, CtaDepto.P03, CtaDepto.P04, CtaDepto.P05, CtaDepto.P06, CtaDepto.P07, CtaDepto.P08, CtaDepto.P09, CtaDepto.P10, CtaDepto.P11, CtaDepto.P12, CtaDepto.S01, CtaDepto.S02, CtaDepto.S03, CtaDepto.S04, CtaDepto.S05, CtaDepto.S06, CtaDepto.S07, CtaDepto.S08, CtaDepto.S09, CtaDepto.S10, CtaDepto.S11, CtaDepto.S12, CtaDepto.SFinal, CtaDepto.SInicial, CContable.Sys_GUID AS ICuenta, CDepartamento.Sys_GUID AS FK_CDepartamento_Cuentas FROM CDepartamento INNER JOIN (CContable INNER JOIN  CtaDepto ON CContable.Sys_PK=CtaDepto.ICuenta) ON CDepartamento.Sys_PK=CtaDepto.FK_CDepartamento_Cuentas; 

CREATE VIEW qAECuentas AS SELECT TOP 100 PERCENT CContable.Sys_PK, CContable.Sys_TimeStamp, CContable.Sys_GUID, CContable.APAC, CContable.Codigo, CContable.D01, CContable.D02, CContable.D03, CContable.D04, CContable.D05, CContable.D06, CContable.D07, CContable.D08, CContable.D09, CContable.D10, CContable.D11, CContable.D12, CContable.Departamental, CContable.Descripcion, CContable.Detalle AS Detalle, CContable.DFinal, CContable.H01, CContable.H02, CContable.H03, CContable.H04, CContable.H05, CContable.H06, CContable.H07, CContable.H08, CContable.H09, CContable.H10, CContable.H11, CContable.H12, CContable.HFinal, CContable.P_Anual, CContable.P01, CContable.P02, CContable.P03, CContable.P04, CContable.P05, CContable.P06, CContable.P07, CContable.P08, CContable.P09, CContable.P10, CContable.P11, CContable.P12, CContable.S01, CContable.S02, CContable.S03, CContable.S04, CContable.S05, CContable.S06, CContable.S07, CContable.S08, CContable.S09, CContable.S10, CContable.S11, CContable.S12, CContable.SFinal, CContable.SInicial, CContable.Tipo, CContable_2.Sys_GUID AS Contrapartida, CContable_1.Sys_GUID AS ICuenta, Divisa.Sys_GUID AS IDivisa FROM ((CContable LEFT JOIN CContable AS CContable_1 ON CContable.ICuenta = CContable_1.Sys_PK) LEFT JOIN Divisa ON CContable.IDivisa = Divisa.Sys_PK) LEFT JOIN CContable AS CContable_2 ON CContable.Contrapartida = CContable_2.Sys_PK ORDER BY CContable.ICuenta, CContable.Contrapartida; 

CREATE VIEW qrySalidasXProcesar AS SELECT DISTINCT Venta.Sys_PK, cDocumentos.Const AS Documento, Venta.Referencia, Venta.Fecha, Cliente.Nombre, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) AS Total, Cliente.Sys_PK AS ClientePK,((YEAR (Venta.Fecha) * 10000) + (MONTH (Venta.Fecha) * 100) + DAY (Venta.Fecha)) as Flong FROM Cliente INNER JOIN (cDocumentos INNER JOIN (Venta INNER JOIN DVenta ON Venta.Sys_PK = DVenta.FK_Venta_Detalle) ON cDocumentos.ID = Venta.Documento) ON Cliente.Sys_PK = Venta.ICliente WHERE (DVenta.XSalir)>0; 

CREATE VIEW qryCContable AS SELECT CContable.*, (CContable.D01+CContable.D02+CContable.D03+CContable.D04+CContable.D05+CContable.D06+CContable.D07+CContable.D08+CContable.D09+CContable.D10+CContable.D11+CContable.D12+CContable.DFinal) AS DTotal, (CContable.H01+CContable.H02+CContable.H03+CContable.H04+CContable.H05+CContable.H06+CContable.H07+CContable.H08+CContable.H09+CContable.H10+CContable.H11+CContable.H12+CContable.HFinal) AS HTotal FROM CContable; 

CREATE VIEW qClienteXGrupo AS SELECT Cliente.*, Cliente_GrupoClientes_.IGrupos AS PKGrupo, GrupoClientes.Nombre AS NombreGrupo FROM GrupoClientes INNER JOIN (Cliente INNER JOIN Cliente_GrupoClientes_ ON Cliente.Sys_PK = Cliente_GrupoClientes_.IClientes) ON GrupoClientes.Sys_PK = Cliente_GrupoClientes_.IGrupos; 

CREATE VIEW qProveedorXGrupo AS SELECT Proveedor.*, GrupoProveedores_Proveedor_.IGrupos AS PKGrupo, GrupoProveedores.Nombre AS NombreGrupo FROM GrupoProveedores INNER JOIN (Proveedor INNER JOIN GrupoProveedores_Proveedor_ ON Proveedor.Sys_PK=GrupoProveedores_Proveedor_.IProveedores) ON GrupoProveedores.Sys_PK=GrupoProveedores_Proveedor_.IGrupos; 

 CREATE PROCEDURE qryCajaUtilizada(@PKCaja INT) AS BEGIN SELECT TOP 1 Corte.Sys_PK FROM Corte WHERE Corte.ICaja=@PKCaja; END 

 CREATE PROCEDURE qryChequeraUtilizada(@PKChequera INT) AS BEGIN SELECT TOP 1 MovCuenta.Sys_PK FROM MovCuenta WHERE MovCuenta.ICuenta=@PKChequera; END 

CREATE VIEW qryMovimientosClienteGrupo AS SELECT DCxC.Sys_PK, cDocumentos.Const AS Documento, DCxC.Referencia, DCxC.Fecha, DCxC.Aplicacion AS Vencimiento, DCxC.Debe, DCxC.Haber, DCxC.IntMoratorios, DCxC.Bonificaciones, DCxC.Pagos, DCxC.Notas AS Concepto, DCxC.ICliente AS Cliente, DCxC.Aplicable, Day(DCxC.Aplicacion) AS Dia, Month(DCxC.Aplicacion) AS Mes, Year(DCxC.Aplicacion) AS Anio, (Year(DCxC.Aplicacion)*10000)+(Month(DCxC.Aplicacion)*100)+(Day(DCxC.Aplicacion)) AS ND_Aplicacion, Cliente.Tipo, Cliente.Zona, Cliente_GrupoClientes_.IGrupos AS PKGrupo FROM (Cliente INNER JOIN (cDocumentos INNER JOIN DCxC ON cDocumentos.ID=DCxC.Documento) ON Cliente.Sys_PK=DCxC.ICliente) INNER JOIN Cliente_GrupoClientes_ ON Cliente.Sys_PK=Cliente_GrupoClientes_.IClientes; 

CREATE VIEW qryMovimientosProveedorGrupo AS SELECT TOP 100 PERCENT DCxP.Sys_PK, cDocumentos.Const AS Documento, DCxP.Referencia, DCxP.Fecha, DCxP.Aplicacion AS Vencimiento, DCxP.Debe, DCxP.Haber, DCxP.Notas AS Concepto, DCxP.IProveedor AS Proveedor, DCxP.Aplicable, Day(DCxP.Aplicacion) AS Dia, Month(DCxP.Aplicacion) AS Mes, Year(DCxP.Aplicacion) AS Anio, (Year(DCxP.Aplicacion)*10000)+(Month(DCxP.Aplicacion)*100)+(Day(DCxP.Aplicacion)) AS ND_Aplicacion, DCxP.IntMoratorios, DCxP.Bonificaciones, DCxP.Pagos, Proveedor.IZona, Proveedor.Tipo, GrupoProveedores_Proveedor_.IGrupos AS PKGrupo FROM (Proveedor INNER JOIN (cDocumentos INNER JOIN DCxP ON cDocumentos.ID=DCxP.Documento) ON Proveedor.Sys_PK=DCxP.IProveedor) INNER JOIN GrupoProveedores_Proveedor_ ON Proveedor.Sys_PK=GrupoProveedores_Proveedor_.IProveedores ORDER BY DCxP.Aplicacion, DCxP.Haber DESC , DCxP.Debe DESC; 

CREATE VIEW qryVentasProductosGrupo AS SELECT qryVentasProductos.*, GrupoProductos_Producto_.IGrupos FROM qryVentasProductos INNER JOIN GrupoProductos_Producto_ ON qryVentasProductos.PKProducto=GrupoProductos_Producto_.IProductos; 

CREATE VIEW qFoliosVentas AS SELECT TOP 100 PERCENT Venta.Sys_PK, FoliosDocumentos.Folio, Venta.Fecha, Venta.Referencia, Venta.Documento, Venta.ICliente, Cliente.Nombre, Venta.StatusAdministrativo, Venta.StatusEntrega, Venta.StatusFacturacion, Venta.StatusFinanciero, Venta.IDivisa, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4) As Total, Venta.TipoCambio, Venta.Vencimiento FROM FoliosDocumentos INNER JOIN (Cliente INNER JOIN Venta ON Cliente.Sys_PK = Venta.ICliente) ON FoliosDocumentos.Sys_PK = Venta.IFolio ORDER BY Venta.Sys_PK; 

CREATE VIEW qryComprasProductosGrupo AS SELECT qryComprasProductos.*, GrupoProductos_Producto_.IGrupos FROM qryComprasProductos INNER JOIN GrupoProductos_Producto_ ON qryComprasProductos.PKProducto=GrupoProductos_Producto_.IProductos;

CREATE VIEW qryDevVentasProductosGrupos AS SELECT qryDevVentasProductos.*, GrupoProductos_Producto_.IGrupos FROM qryDevVentasProductos INNER JOIN GrupoProductos_Producto_ ON qryDevVentasProductos.PKProducto = GrupoProductos_Producto_.IProductos; 

CREATE VIEW qryDevComprasProductosGrupos AS SELECT qryDevComprasProductos.*, GrupoProductos_Producto_.IGrupos FROM qryDevComprasProductos INNER JOIN GrupoProductos_Producto_ ON qryDevComprasProductos.PKProducto=GrupoProductos_Producto_.IProductos; 

CREATE VIEW qryLotesXAlmacen AS SELECT CLoteXAlmacen.IAlmacen, CLoteXAlmacen.Cantidad, Lote.Numero, Lote.FCaducidad, Lote.Sys_PK AS PKLote, Producto.Sys_PK AS PKProducto, Producto.Descripcion, Producto.Unidad FROM Producto INNER JOIN (Lote INNER JOIN CLoteXAlmacen ON Lote.Sys_PK=CLoteXAlmacen.FK_Lote_ExisXAlmacen) ON Producto.Sys_PK=Lote.IProducto; 

 CREATE PROCEDURE qryVentaRelacionada(@PKVenta INT, @Doc INT) AS BEGIN SELECT TOP 1 DVenta.Documento FROM Venta INNER JOIN DVenta ON Venta.Sys_PK = DVenta.Documento WHERE DVenta.FK_Venta_Detalle=@PKVenta AND Venta.Documento=@Doc AND DVenta.Documento>0; END 

 CREATE PROCEDURE qryCompraRelacionada(@PKCompra INT, @Doc INT) AS BEGIN SELECT TOP 1 DCompra.Documento FROM Compra INNER JOIN DCompra ON Compra.Sys_PK = DCompra.Documento WHERE DCompra.Documento>0 AND DCompra.FK_Compra_Detalle=@PKCompra AND Compra.Documento=@Doc; END 

CREATE VIEW qryVntsXSalir AS SELECT TOP 100 PERCENT Venta.Sys_PK AS PKVenta, (Year(Venta.Fecha)*10000)+(Month(Venta.Fecha)*100)+(Day(Venta.Fecha)) AS ND_Fecha, Venta.Fecha AS Fecha, Venta.Referencia AS Referencia, Venta.ICliente AS ICliente, Cliente.Nombre AS Nombre, Venta.IDivisa AS IDivisa, Venta.Subtotal AS Subtotal, Venta.Descuento1+Venta.Descuento2 As Descuentos, Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4 As Impuestos, DVenta.IAlmacen AS IAlmacen, DVenta.Cantidad AS Cantidad, DVenta.Factor AS Factor, DVenta.Descuento1 AS Descuento1, DVenta.Descuento2 AS Descuento2, DVenta.Impuesto1 AS Impuesto1, DVenta.Impuesto2 AS Impuesto2, DVenta.Impuesto3 AS Impuesto3, DVenta.Impuesto4 AS Impuesto4, DVenta.XFacturar AS XFacturar, DVenta.XSalir AS XSalir, DVenta.IProducto AS IProducto, Producto.Descripcion AS Descripcion, DVenta.Notas AS Notas, DVenta.Precio AS Precio, DVenta.Status AS Status, DVenta.Sys_PK AS PKDVenta, DVenta.TipoCambio AS TipoCambio, DVenta.Unidad AS Unidad, Producto.ReqLote AS ReqLote, Producto.ReqSerie AS ReqSerie, Venta.StatusEntrega AS StatusEntrega, Venta.StatusAdministrativo AS StatusAdministrativo, Venta.StatusFacturacion AS StatusFacturacion, Venta.StatusFinanciero AS StatusFinanciero, Venta.Documento AS Documento, Producto.CostoUltimo AS CostoUltimo FROM (((Venta INNER JOIN DVenta ON Venta.Sys_PK = DVenta.FK_Venta_Detalle)  INNER JOIN Producto ON Producto.Sys_PK = DVenta.IProducto)  INNER JOIN Cliente ON Cliente.Sys_PK = Venta.ICliente) WHERE (DVenta.XSalir >0) AND (Venta.StatusAdministrativo <>99)  AND (( (Venta.Documento=3 Or Venta.Documento=6) And Venta.FormaPago<>4 And Venta.StatusAdministrativo<>1) Or (Venta.Documento=4)) ORDER BY Venta.Sys_PK; 

CREATE VIEW qryVxSDocs AS SELECT DISTINCT top 100 percent qryvntsxsalir.PKVenta AS PKVenta, qryvntsxsalir.ND_Fecha AS ND_Fecha, qryvntsxsalir.Fecha AS Fecha, qryvntsxsalir.Referencia AS Referencia, qryvntsxsalir.ICliente AS ICliente, qryvntsxsalir.Nombre AS Nombre, qryvntsxsalir.IDivisa AS IDivisa, qryvntsxsalir.Subtotal AS Subtotal, qryvntsxsalir.Descuentos AS Descuentos, qryvntsxsalir.Impuestos AS Impuestos, qryvntsxsalir.StatusEntrega AS StatusEntrega, qryvntsxsalir.StatusAdministrativo AS StatusAdministrativo, qryvntsxsalir.StatusFacturacion AS StatusFacturacion, qryvntsxsalir.StatusFinanciero AS StatusFinanciero, qryvntsxsalir.Documento AS Documento FROM qryvntsxsalir ORDER BY qryvntsxsalir.PKVenta; 

CREATE VIEW qryHTC AS SELECT chtcambio.Sys_PK AS Sys_PK, chtcambio.Fecha AS Fecha, chtcambio.TCambio AS TCambio, chtcambio.IDivisa AS IDivisa, (Year(chtcambio.Fecha)*10000)+(Month(chtcambio.Fecha)*100)+(Day(chtcambio.Fecha)) AS ND_Fecha FROM chtcambio; 

 CREATE PROCEDURE qryVentaLike(@X VARCHAR(100)) AS BEGIN SELECT Venta.Sys_PK, cDocumentos.Const AS Documento, Venta.Referencia, Venta.Fecha, Venta.Vencimiento, Cliente.Nombre AS NombreCliente, ((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)+(Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)) AS Total FROM Cliente INNER JOIN (cDocumentos INNER JOIN Venta ON cDocumentos.ID=Venta.Documento) ON Cliente.Sys_PK=Venta.ICliente WHERE (Venta.Referencia Like '%'+@X+'%' OR Cliente.Nombre Like '%'+@X+'%') AND (Venta.Documento=3 Or Venta.Documento=4 Or Venta.Documento=6) AND Venta.StatusAdministrativo<>99; END 

 CREATE PROCEDURE qrySerieLike(@X VARCHAR(100), @Y INT) AS BEGIN SELECT Serie.Sys_PK, Producto.Codigo, Producto.Descripcion, Serie.ILote, Serie.IAlmacen, Serie.Numero FROM Producto INNER JOIN Serie ON Producto.Sys_PK=Serie.IProducto WHERE (((Serie.Numero) Like '%'+@X+'%') AND ((Serie.Status)=1 OR Serie.Status=4) AND ((Producto.Sys_PK)=@Y)); END 

CREATE VIEW qryVCtdXFac AS select venta.Sys_PK AS Sys_PK,venta.Fecha AS Fecha,venta.Documento AS Documento,venta.StatusFacturacion AS StatusFacturacion,venta.TipoCambio AS TipoCambio,venta.IDivisa AS IDivisa,venta.ICliente AS ICliente,venta.FormaPago AS FormaPago,(((year(venta.Fecha) * 10000) + (month(venta.Fecha) * 100)) + Day(venta.Fecha)) AS ND_Fecha from venta where (((venta.Documento = 3) or (venta.Documento = 6)) and (venta.StatusFacturacion < 3) and (venta.FormaPago = 1) and (venta.StatusAdministrativo <> 99)); 

 CREATE PROCEDURE qryBlockEnUso(@PK INT) AS BEGIN SELECT TOP 1 Sys_PK FROM FoliosDocumentos WHERE Block=@PK; END 

CREATE VIEW qryVSRxValuar AS SELECT Distinct TOP 100 PERCENT cardex.DocVenta AS PKVenta,cardex.Fecha FROM ((cardex INNER JOIN dcardex ON cardex.Sys_PK = dcardex.FK_Cardex_Movimientos)  INNER JOIN producto ON dcardex.IProducto = producto.Sys_PK)  Where Cardex.Aplicado<>0 And Producto.ReqSerie<>0 And (Not DCardex.Valuado<>0) And DCardex.Salidas>0 ORDER BY cardex.Fecha,cardex.DocVenta; 

CREATE VIEW qryNSxValuar AS SELECT Distinct TOP 100 PERCENT cardex.DocVenta AS PKVenta,DCardex.IProducto, DCardex.Salidas, DCardex.Sys_PK as PKDCardex,cardex.Fecha FROM ((cardex INNER JOIN dcardex ON cardex.Sys_PK = dcardex.FK_Cardex_Movimientos)  INNER JOIN producto ON dcardex.IProducto = producto.Sys_PK)  Where Cardex.Aplicado<>0 And Producto.ReqSerie<>0 And (Not DCardex.Valuado<>0) And DCardex.Salidas>0 And DCardex.ISerie=null ORDER BY cardex.Fecha,cardex.DocVenta; 

CREATE VIEW qryCuentasAjusteCambiario AS SELECT CContable.Sys_PK AS Cuenta, CContable.Codigo, CContable.Tipo, CContable.IDivisa, CPoliza.Periodo, CDPoliza.IDepto, SUM(CDPoliza.Debe) AS DPred, SUM(CDPoliza.Haber) AS HPred, SUM(CDPoliza.Debe/CDPoliza.TCambio) AS Debe, SUM(CDPoliza.Haber/CDPoliza.TCambio) AS Haber FROM CPoliza INNER JOIN (CContable INNER JOIN CDPoliza ON CContable.Sys_PK = CDPoliza.ICuenta) ON CPoliza.Sys_PK = CDPoliza.FK_CPoliza_Detalle WHERE CPoliza.Aplicada<>0 AND CDPoliza.TCambio<>1 AND CDPoliza.TCambio>0 AND CContable.APAC<>0 GROUP BY CContable.Sys_PK, CContable.Codigo, CContable.Tipo, CContable.IDivisa, CPoliza.Periodo, CDPoliza.IDepto; 

CREATE VIEW qryDetallePoliza AS SELECT TOP 100 PERCENT CPoliza.Sys_PK,CPoliza.Referencia, CPoliza.Fecha, (Year(CPoliza.Fecha)*10000)+(Month(CPoliza.Fecha)*100)+(Day(CPoliza.Fecha)) AS ND_Fecha, CPoliza.Tipo, CPoliza.Periodo, CPoliza.Concepto AS ConceptoPoliza, CPoliza.Debe, CPoliza.Haber, CContable.Codigo, CContable.Descripcion AS Cuenta, CDepartamento.Descripcion AS Departamento, CDPoliza.Concepto AS ConceptoDPoliza, CDPoliza.Debe AS DDebe, CDPoliza.Haber AS DHaber FROM CPoliza INNER JOIN (CDepartamento RIGHT JOIN (CContable RIGHT JOIN CDPoliza ON CContable.Sys_PK=CDPoliza.ICuenta) ON CDepartamento.Sys_PK=CDPoliza.IDepto) ON CPoliza.Sys_PK=CDPoliza.FK_CPoliza_Detalle WHERE CPoliza.Aplicada<>0 ORDER BY CPoliza.Referencia;  

CREATE VIEW qryDetalleVentaCliente AS SELECT Venta.Documento, Cliente.Nombre AS NombreCliente, qryVentasProductos.Fecha, qryVentasProductos.Referencia, qryVentasProductos.Codigo, qryVentasProductos.Descripcion, qryVentasProductos.Unidad, qryVentasProductos.Cantidad AS VentaBruta, qryDevVentasProductos.Cantidad AS Devoluciones, ((qryVentasProductos.Cantidad*qryVentasProductos.Precio)-qryVentasProductos.Descuento1-qryVentasProductos.Descuento2) AS VentaSubtotal, (qryVentasProductos.Impuesto1+qryVentasProductos.Impuesto2+qryVentasProductos.Impuesto3+qryVentasProductos.Impuesto4) AS VentaImpuestos, (((qryVentasProductos.Cantidad*qryVentasProductos.Precio)-qryVentasProductos.Descuento1-qryVentasProductos.Descuento2)+(qryVentasProductos.Impuesto1+qryVentasProductos.Impuesto2+qryVentasProductos.Impuesto3+qryVentasProductos.Impuesto4)) AS VentaTotal, ((qryDevVentasProductos.Cantidad*qryDevVentasProductos.Precio)-qryDevVentasProductos.Descuento1-qryDevVentasProductos.Descuento2) AS DevSubtotal, (qryDevVentasProductos.Impuesto1+qryDevVentasProductos.Impuesto2+qryDevVentasProductos.Impuesto3+qryDevVentasProductos.Impuesto4) AS DevImpuestos, (((qryDevVentasProductos.Cantidad*qryDevVentasProductos.Precio)-qryDevVentasProductos.Descuento1-qryDevVentasProductos.Descuento2)+(qryDevVentasProductos.Impuesto1+qryDevVentasProductos.Impuesto2+qryDevVentasProductos.Impuesto3+qryDevVentasProductos.Impuesto4)) AS DevTotal, ((Year(qryVentasProductos.Fecha)*10000)+(Month(qryVentasProductos.Fecha)*100)+Day(qryVentasProductos.Fecha)) AS ND_Fecha, Producto.ILinea, Producto.IMarca, Producto.IDepartamento, Cliente.Tipo, Venta.ICConsumo, qryVentasProductos.ICliente, cStatusAdministrativos.Const AS Status, cFormasPago.Const AS FPago FROM cFormasPago INNER JOIN (cStatusAdministrativos INNER JOIN ((((qryVentasProductos INNER JOIN Producto ON qryVentasProductos.PKProducto=Producto.Sys_PK) INNER JOIN Cliente ON qryVentasProductos.ICliente=Cliente.Sys_PK) INNER JOIN Venta ON qryVentasProductos.PKVenta=Venta.Sys_PK) LEFT JOIN qryDevVentasProductos ON qryVentasProductos.PKVenta=qryDevVentasProductos.PKVenta) ON cStatusAdministrativos.ID=Venta.StatusAdministrativo) ON cFormasPago.ID=Venta.FormaPago;  

CREATE VIEW qryDetalleCompraProveedor AS SELECT Compra.Documento, Proveedor.Nombre AS NombreProveedor, qryComprasProductos.Fecha, qryComprasProductos.Referencia, qryComprasProductos.Codigo, qryComprasProductos.Descripcion, qryComprasProductos.Unidad, qryComprasProductos.Cantidad AS VentaBruta, qryDevComprasProductos.Cantidad AS Devoluciones, ((qryComprasProductos.Cantidad*qryComprasProductos.Precio)-qryComprasProductos.Descuento1-qryComprasProductos.Descuento2) AS CompraSubtotal, (qryComprasProductos.Impuesto1+qryComprasProductos.Impuesto2+qryComprasProductos.Impuesto3+qryComprasProductos.Impuesto4) AS CompraImpuestos, (((qryComprasProductos.Cantidad*qryComprasProductos.Precio)-qryComprasProductos.Descuento1-qryComprasProductos.Descuento2)+(qryComprasProductos.Impuesto1+qryComprasProductos.Impuesto2+qryComprasProductos.Impuesto3+qryComprasProductos.Impuesto4)) AS CompraTotal, ((qryDevComprasProductos.Cantidad*qryDevComprasProductos.Precio)-qryDevComprasProductos.Descuento1-qryDevComprasProductos.Descuento2) AS DevSubtotal, (qryDevComprasProductos.Impuesto1+qryDevComprasProductos.Impuesto2+qryDevComprasProductos.Impuesto3+qryDevComprasProductos.Impuesto4) AS DevImpuestos, (((qryDevComprasProductos.Cantidad*qryDevComprasProductos.Precio)-qryDevComprasProductos.Descuento1-qryDevComprasProductos.Descuento2)+(qryDevComprasProductos.Impuesto1+qryDevComprasProductos.Impuesto2+qryDevComprasProductos.Impuesto3+qryDevComprasProductos.Impuesto4)) AS DevTotal, ((Year(qryComprasProductos.Fecha)*10000)+(Month(qryComprasProductos.Fecha)*100)+Day(qryComprasProductos.Fecha)) AS ND_Fecha, Producto.ILinea, Producto.IMarca, Producto.IDepartamento, Proveedor.Tipo, Compra.IAlmacen, qryComprasProductos.IProveedor, cStatusAdministrativos.Const AS Status, cFormasPago.Const AS FPago FROM cFormasPago INNER JOIN (cStatusAdministrativos INNER JOIN ((((qryComprasProductos INNER JOIN Producto ON qryComprasProductos.PKProducto=Producto.Sys_PK) INNER JOIN Proveedor ON qryComprasProductos.IProveedor=Proveedor.Sys_PK) INNER JOIN Compra ON qryComprasProductos.PKCompra=Compra.Sys_PK) LEFT JOIN qryDevComprasProductos ON qryComprasProductos.PKCompra=qryDevComprasProductos.PKCompra) ON cStatusAdministrativos.ID=Compra.StatusAdministrativo) ON cFormasPago.ID=Compra.FormaPago; 


CREATE VIEW qryRepCV AS SELECT TOP 100 PERCENT qryCostoVentas.Codigo, qryCostoVentas.Descripcion, qryCostoVentas.UE AS Unidad, qryCostoVentas.PKProducto, qryCostoVentas.CantidadE AS Ventas, qryCostoVentas.Importe AS Importe, qryCostoVentas.Impuestos AS Impuestos, qryCostoVentas.Abonos AS Costo, ((Year(qryCostoVentas.Fecha)*10000)+(Month(qryCostoVentas.Fecha)*100)+Day(qryCostoVentas.Fecha)) AS ND_Fecha, Venta.ICConsumo, Venta.ICliente, Cliente.Tipo FROM (Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) INNER JOIN qryCostoVentas ON qryCostoVentas.PKVenta=Venta.Sys_PK ORDER BY Venta.Sys_PK;  

CREATE VIEW qryRepCD AS SELECT TOP 100 PERCENT qryDevCostoVenta.Codigo, qryDevCostoVenta.Descripcion, qryDevCostoVenta.UE AS Unidad, qryDevCostoVenta.PKProducto, qryDevCostoVenta.CantidadE AS Ventas, qryDevCostoVenta.Importe AS Importe, qryDevCostoVenta.Impuestos AS Impuestos, qryDevCostoVenta.Cargos AS Costo, ((Year(qryDevCostoVenta.Fecha)*10000)+(Month(qryDevCostoVenta.Fecha)*100)+Day(qryDevCostoVenta.Fecha)) AS ND_Fecha, Venta.ICConsumo, Venta.ICliente, Cliente.Tipo FROM (Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) INNER JOIN qryDevCostoVenta ON qryDevCostoVenta.PKVenta=Venta.Sys_PK ORDER BY Venta.Sys_PK; 

CREATE VIEW qryRepC AS Select qryRepCV.PKProducto,qryRepCV.Codigo, qryRepCV.Descripcion, qryRepCV.Unidad, qryRepCV.ND_Fecha, qryRepCV.ICConsumo, qryRepCV.ICliente, qryRepCV.Tipo, Sum(qryRepCV.Ventas) As Ventas, Sum(qryRepCV.Importe) as Importe,Sum(qryRepCV.Impuestos) as ImpuestosVenta, Sum(qryRepCV.Costo) As Costo,0 as Devoluviones,0 as ImpDev,0 as  ImpuestosDev,0 as CostoDev From qryRepCV group by qryRepCV.PKProducto,qryRepCV.Codigo, qryRepCV.Descripcion, qryRepCV.Unidad, qryRepCV.ND_Fecha, qryRepCV.ICConsumo, qryRepCV.ICliente, qryRepCV.Tipo  UNION ALL Select qryRepCD.PKProducto,qryRepCD.Codigo, qryRepCD.Descripcion, qryRepCD.Unidad,qryRepCD.ND_Fecha, qryRepCD.ICConsumo, qryRepCD.ICliente, qryRepCD.Tipo, 0 As Ventas,0 As Importe,0 as ImpuestosVenta, 0 As Costo, Sum(qryRepCD.Ventas) As Devoluciones, Sum(qryRepCD.Importe) as ImpDev, Sum(qryRepCD.Impuestos) as ImpuestosDev, Sum(qryRepCD.Costo) As CostoDev From qryRepCD group by qryRepCD.PKProducto,qryRepCD.Codigo, qryRepCD.Descripcion, qryRepCD.Unidad, qryRepCD.ND_Fecha, qryRepCD.ICConsumo, qryRepCD.ICliente, qryRepCD.Tipo;  

CREATE VIEW qryRepCostoVentas AS SELECT TOP 100 PERCENT qryrepc.PKProducto, qryrepc.Codigo, qryrepc.Descripcion, qryrepc.Unidad, qryrepc.ND_Fecha, qryrepc.ICConsumo, qryrepc.ICliente, qryrepc.Tipo, sum(qryrepc.Ventas) AS Ventas, sum(qryrepc.Importe) AS Importe, sum(qryrepc.ImpuestosVenta) AS ImpuestosV, Sum(qryrepc.Costo) AS Costo, Sum(qryrepc.Devoluviones) AS Devoluciones, Sum(qryrepc.ImpDev) AS ImpDev, sum(qryrepc.ImpuestosDev) AS DevImpuestos, Sum(qryrepc.CostoDev) AS CtDev FROM qryrepc GROUP BY qryrepc.PKProducto, qryrepc.Codigo, qryrepc.Descripcion, qryrepc.Unidad, qryrepc.ND_Fecha, qryrepc.ICConsumo, qryrepc.ICliente, qryrepc.Tipo ORDER BY qryrepc.Descripcion;  

CREATE VIEW qryRepCostoVentasGrupos AS SELECT qryRepCostoVentas.*, GrupoProductos_Producto_.IGrupos FROM qryRepCostoVentas INNER JOIN GrupoProductos_Producto_ ON qryRepCostoVentas.PKProducto=GrupoProductos_Producto_.IProductos;  

CREATE VIEW qryUtilidadXLinea AS SELECT TOP 100 PERCENT Linea.Codigo, Linea.Descripcion, qryRepCostoVentas.Ventas AS CantidadE, qryRepCostoVentas.Devoluciones AS Devoluciones, qryRepCostoVentas.Costo, qryRepCostoVentas.CtDev AS DevCosto, qryRepCostoVentas.Importe AS Importe, qryRepCostoVentas.ImpDev AS DevImporte, qryRepCostoVentas.ND_Fecha, qryRepCostoVentas.ICConsumo, qryRepCostoVentas.ICliente, qryRepCostoVentas.Tipo FROM Linea INNER JOIN (qryRepCostoVentas INNER JOIN Producto ON qryRepCostoVentas.PKProducto=Producto.Sys_PK) ON Linea.Sys_PK=Producto.ILinea ORDER BY Linea.Descripcion;  

CREATE VIEW qryVentasXLinea AS SELECT TOP 100 PERCENT Linea.Codigo, Linea.Descripcion, qryRepCostoVentas.Importe AS VentaImporte, qryRepCostoVentas.ImpuestosV AS VentaImpuestos, qryRepCostoVentas.ImpDev AS DevImporte, qryRepCostoVentas.DevImpuestos, qryRepCostoVentas.ImpDev AS CompraImporte, qryRepCostoVentas.DevImpuestos AS CompraImpuestos, qryRepCostoVentas.ND_Fecha, qryRepCostoVentas.ICConsumo, qryRepCostoVentas.ICliente, qryRepCostoVentas.Tipo FROM Linea INNER JOIN (qryRepCostoVentas INNER JOIN Producto ON qryRepCostoVentas.PKProducto=Producto.Sys_PK) ON Linea.Sys_PK=Producto.ILinea ORDER BY Linea.Descripcion;  

CREATE VIEW qryRepVentasXCliente AS SELECT TOP 100 PERCENT qryVentas2.Sys_PK AS PKVenta, qryVentas2.Nombre, qryVentas2.ICliente, qryVentas2.CodigoCliente, qryVentas2.Documento, qryVentas2.TipoDocumento, qryVentas2.Referencia, qryVentas2.Fecha, ((Year(qryVentas2.Fecha)*10000)+(Month(qryVentas2.Fecha)*100)+Day(qryVentas2.Fecha)) AS ND_Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DVenta.Unidad, DVenta.Cantidad, DVenta.Precio, DVenta.Descuento1, DVenta.Descuento2, DVenta.Impuesto1, DVenta.Impuesto2, DVenta.Impuesto3, DVenta.Impuesto4, qryVentas2.Divisa AS CDivisa, qryVentas2.TipoCambio, qryVentas2.Anio, qryVentas2.Mes, qryCatProductos.Unidad AS UE, DVenta.Factor, DVenta.Factor*DVenta.Cantidad AS CantidadE, DVenta.Sys_PK AS PKDVenta FROM (qryCatProductos INNER JOIN (DVenta INNER JOIN qryVentas2 ON DVenta.FK_Venta_Detalle=qryVentas2.Sys_PK) ON qryCatProductos.Sys_PK=DVenta.IProducto) LEFT JOIN Venta ON DVenta.Documento=Venta.Sys_PK WHERE ((qryVentas2.TipoDocumento=3 And qryVentas2.StatusFacturacion=1) Or (qryVentas2.TipoDocumento=6 And qryVentas2.StatusFacturacion=1) Or (qryVentas2.TipoDocumento=4) or (qryVentas2.TipoDocumento=5 And (Venta.Documento<>6 OR (Venta.Documento=6 And Venta.StatusFacturacion=1)))) And qryVentas2.StatusAdministrativo<>99 ORDER BY qryVentas2.Sys_PK, qryCatProductos.Sys_PK;  

CREATE VIEW qryRepVentasXCliGrupo AS SELECT qryRepVentasXCliente.*, GrupoProductos_Producto_.IGrupos FROM qryRepVentasXCliente INNER JOIN GrupoProductos_Producto_ ON qryRepVentasXCliente.PKProducto = GrupoProductos_Producto_.IProductos;  

CREATE VIEW qryRepDevCompra AS SELECT TOP 100 PERCENT qryDevComprasProductos.Codigo, qryDevComprasProductos.Descripcion, qryDevComprasProductos.UE AS Unidad, qryDevComprasProductos.PKProducto, qryDevComprasProductos.CantidadE AS Cantidad, ((qryDevComprasProductos.Precio*qryDevComprasProductos.Cantidad)-qryDevComprasProductos.Descuento1-qryDevComprasProductos.descuento2) AS Importe, (qryDevComprasProductos.Impuesto1+qryDevComprasProductos.Impuesto2+qryDevComprasProductos.Impuesto3+qryDevComprasProductos.Impuesto4) AS Impuestos, ((Year(qryDevComprasProductos.Fecha)*10000)+(Month(qryDevComprasProductos.Fecha)*100)+Day(qryDevComprasProductos.Fecha)) AS ND_Fecha, Compra.IAlmacen, Compra.IProveedor, Proveedor.Tipo FROM (Compra INNER JOIN Proveedor ON Compra.IProveedor=Proveedor.Sys_PK) INNER JOIN qryDevComprasProductos ON qryDevComprasProductos.PKCompra=Compra.Sys_PK ORDER BY Compra.Sys_PK;

CREATE VIEW qryRepImpCompra AS SELECT TOP 100 PERCENT qryComprasProductos.Codigo, qryComprasProductos.Descripcion, qryComprasProductos.UE AS Unidad, qryComprasProductos.PKProducto, qryComprasProductos.CantidadE AS Cantidad, ((qryComprasProductos.Cantidad*qryComprasProductos.Precio)-qryComprasProductos.Descuento1-qryComprasProductos.Descuento2) AS Importe, (qryComprasProductos.Impuesto1+qryComprasProductos.Impuesto2+qryComprasProductos.Impuesto3+qryComprasProductos.Impuesto4) AS Impuestos, ((Year(qryComprasProductos.Fecha)*10000)+(Month(qryComprasProductos.Fecha)*100)+Day(qryComprasProductos.Fecha)) AS ND_Fecha, Compra.IAlmacen, Compra.IProveedor, Proveedor.Tipo FROM (Compra INNER JOIN Proveedor ON Compra.IProveedor=Proveedor.Sys_PK) INNER JOIN qryComprasProductos ON qryComprasProductos.PKCompra=Compra.Sys_PK ORDER BY Compra.Sys_PK;

CREATE VIEW qryRepUnionCompra AS Select qryRepImpCompra.PKProducto,qryRepImpCompra.Codigo, qryRepImpCompra.Descripcion, qryRepImpCompra.Unidad, qryRepImpCompra.ND_Fecha, qryRepImpCompra.IAlmacen, qryRepImpCompra.IProveedor, qryRepImpCompra.Tipo, Sum(qryRepImpCompra.Cantidad) As Compras, Sum(qryRepImpCompra.Importe) as Importe,Sum(qryRepImpCompra.Impuestos) as ImpuestosCompra, 0 as Devoluviones,0 as ImporDev,0 as  ImpuestosDev From qryRepImpCompra group by qryRepImpCompra.PKProducto,qryRepImpCompra.Codigo, qryRepImpCompra.Descripcion, qryRepImpCompra.Unidad, qryRepImpCompra.ND_Fecha, qryRepImpCompra.IAlmacen, qryRepImpCompra.IProveedor, qryRepImpCompra.Tipo  UNION ALL Select qryRepDevCompra.PKProducto,qryRepDevCompra.Codigo, qryRepDevCompra.Descripcion, qryRepDevCompra.Unidad,qryRepDevCompra.ND_Fecha, qryRepDevCompra.IAlmacen, qryRepDevCompra.IProveedor, qryRepDevCompra.Tipo, 0 As Compras,0 As Importe,0 as ImpuestosCompra,Sum(qryRepDevCompra.Cantidad) As Devoluciones, Sum(qryRepDevCompra.Importe) as ImporDev, Sum(qryRepDevCompra.Impuestos) as ImpuestosDev From qryRepDevCompra group by qryRepDevCompra.PKProducto,qryRepDevCompra.Codigo, qryRepDevCompra.Descripcion, qryRepDevCompra.Unidad,qryRepDevCompra.ND_Fecha, qryRepDevCompra.IAlmacen, qryRepDevCompra.IProveedor, qryRepDevCompra.Tipo;  

CREATE VIEW qryRepComprasNetas AS SELECT qryRepUnionCompra.PKProducto, qryRepUnionCompra.Codigo, qryRepUnionCompra.Descripcion, qryRepUnionCompra.Unidad, qryRepUnionCompra.ND_Fecha, qryRepUnionCompra.IAlmacen, qryRepUnionCompra.IProveedor, qryRepUnionCompra.Tipo, SUM(qryRepUnionCompra.Compras) AS Compras, SUM(qryRepUnionCompra.Importe) AS ImporteC, SUM(qryRepUnionCompra.ImpuestosCompra) AS ImpuestosC, SUM(qryRepUnionCompra.Devoluviones) AS Devoluciones, SUM(qryRepUnionCompra.ImporDev) AS DevImporte, SUM(qryRepUnionCompra.ImpuestosDev) AS DevImpuestos FROM qryRepUnionCompra GROUP BY qryRepUnionCompra.PKProducto, qryRepUnionCompra.Codigo, qryRepUnionCompra.Descripcion, qryRepUnionCompra.Unidad, qryRepUnionCompra.ND_Fecha, qryRepUnionCompra.IAlmacen, qryRepUnionCompra.IProveedor, qryRepUnionCompra.Tipo;  

CREATE VIEW qryRepComprasNetasGrupos AS SELECT qryRepComprasNetas.*, GrupoProductos_Producto_.IGrupos FROM qryRepComprasNetas INNER JOIN GrupoProductos_Producto_ ON qryRepComprasNetas.PKProducto=GrupoProductos_Producto_.IProductos;  

CREATE VIEW qryComprasXLinea AS SELECT TOP 100 PERCENT Linea.Codigo, Linea.Descripcion, qryRepComprasNetas.ImporteC AS CompraImporte, (qryRepComprasNetas.ImpuestosC) AS CompraImpuestos, qryRepComprasNetas.DevImporte AS DevImporte, qryRepComprasNetas.DevImpuestos AS DevImpuestos, qryRepComprasNetas.ND_Fecha, qryRepComprasNetas.IAlmacen, qryRepComprasNetas.IProveedor, qryRepComprasNetas.IProveedor AS ICliente, qryRepComprasNetas.Tipo FROM Linea INNER JOIN (qryRepComprasNetas INNER JOIN Producto ON qryRepComprasNetas.PKProducto=Producto.Sys_PK) ON Linea.Sys_PK=Producto.ILinea ORDER BY Linea.Descripcion;  

CREATE VIEW qryRepComprasXProv AS SELECT TOP 100 PERCENT qryCompras.Sys_PK AS PKCompra, qryCompras.Nombre, qryCompras.IProveedor, qryCompras.CodigoProveedor, qryCompras.Documento, qryCompras.TipoDocumento, qryCompras.Referencia, qryCompras.Fecha, ((Year(qryCompras.Fecha)*10000)+(Month(qryCompras.Fecha)*100)+Day(qryCompras.Fecha)) AS ND_Fecha, qryCatProductos.Sys_PK AS PKProducto, qryCatProductos.Codigo, qryCatProductos.Descripcion, DCompra.Unidad, DCompra.Cantidad, DCompra.Precio, DCompra.Descuento1, DCompra.Descuento2, DCompra.Impuesto1, DCompra.Impuesto2, DCompra.Impuesto3, DCompra.Impuesto4, qryCompras.Divisa AS CDivisa, qryCompras.TipoCambio, qryCompras.Anio, qryCompras.Mes, qryCatProductos.Unidad AS UE, DCompra.Factor, DCompra.Factor*DCompra.Cantidad AS CantidadE, DCompra.Sys_PK AS PKDCompra FROM (DCompra INNER JOIN qryCompras ON DCompra.FK_Compra_Detalle=qryCompras.Sys_PK) INNER JOIN qryCatProductos ON DCompra.IProducto=qryCatProductos.Sys_PK WHERE ((qryCompras.TipoDocumento=3 And (qryCompras.StatusFacturacion=1)) Or (qryCompras.TipoDocumento=4) or (qryCompras.TipoDocumento=5)) And qryCompras.StatusAdministrativo<>99 ORDER BY qryCompras.Sys_PK, qryCatProductos.Sys_PK;

CREATE VIEW qryRepComprasXProvGrupo AS SELECT qryRepComprasXProv.*, GrupoProductos_Producto_.IGrupos FROM qryRepComprasXProv INNER JOIN GrupoProductos_Producto_ ON qryRepComprasXProv.PKProducto=GrupoProductos_Producto_.IProductos;  

CREATE TABLE ut_HomePage (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_HomePage_PK PRIMARY KEY, Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32),uf_Tipo INT NOT NULL , uf_Titulo VARCHAR(255)  , uf_Imagen VARCHAR(255)  , uf_Funcion VARCHAR(255)  , uf_Orden INT NOT NULL,uf_grupos VARCHAR(4096),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

CREATE TABLE ut_autoload (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_autoload_PK PRIMARY KEY, Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime, Sys_Info VARCHAR(32),uf_Archivo VARCHAR(50) NOT NULL UNIQUE, uf_Orden INT NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_sis_swpaq (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_sis_swpaq_PK PRIMARY KEY, Sys_TimeStamp Datetime  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated Datetime , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported Datetime , Sys_Info VARCHAR(32),uf_Nombre VARCHAR(50) NOT NULL UNIQUE, uf_Descripcion VARCHAR(255) NOT NULL , uf_WinClientSide VARCHAR(1) NOT NULL , uf_Version FLOAT NOT NULL , uf_ID VARCHAR(32) NOT NULL UNIQUE, uf_URL VARCHAR(1024),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

CREATE TABLE ut_BitPromociones (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_BitPromociones_PK PRIMARY KEY, uf_PKVenta INT NOT NULL,uf_PKCliente INT NOT NULL,uf_Puntos FLOAT NOT NULL,uf_Monedero FLOAT NOT NULL);

CREATE TABLE ut_PolicyTemplate (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_PolicyTemplate_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Nombre VARCHAR(50) NOT NULL UNIQUE, uf_Datos VARCHAR(Max));



CREATE TABLE ut_CEjercicio (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_CEjercicio_PK PRIMARY KEY, uf_Nombre VARCHAR(255) NOT NULL UNIQUE, uf_Notas VARCHAR(4096)  , uf_Anio INT NOT NULL, uf_NombreBD VARCHAR(255) NOT NULL UNIQUE,uf_FK_EAnterior INT);

CREATE TABLE ut_color (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_color_PK PRIMARY KEY ,uf_Tabla Varchar(50),uf_PK Int,uf_Color Int);

CREATE TABLE ut_CFDinfo (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_UT_CFDinfo_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_noCertificado VARCHAR(20) NOT NULL UNIQUE, uf_Certificado VARCHAR(4096), uf_LlavePrivada VARCHAR(4096) NOT NULL, uf_Clave VARCHAR(4096) NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

CREATE TABLE ut_CFDfolio (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_CFDfolio PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Serie VARCHAR(10), uf_FolioInicial INT NOT NULL, uf_FolioFinal INT NOT NULL, uf_noAprobacion INT NOT NULL, uf_anoAprobacion INT NOT NULL, uf_CFDFolioAnterior INT, uf_CFDinfo INT NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_CFD (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_CFD PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_XML VARCHAR(MAX) NOT NULL, uf_CadenaOriginal VARCHAR(MAX) NOT NULL, uf_SelloDigital VARCHAR(MAX) NOT NULL , uf_Presentacion VARCHAR(MAX), uf_IVenta INT, uf_CFDfolio INT,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

CREATE TABLE ut_CFDbitacora (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_CFDbitacora PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Datos VARCHAR(MAX) NOT NULL , uf_Reportado BIT , uf_CFD INT NOT NULL UNIQUE,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_CFDInforme (Sys_PK INT  NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_CFDInforme PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), uf_Nombre VARCHAR(50), uf_Contenido VARCHAR(MAX), uf_Mes INT NOT NULL, uf_Anio INT NOT NULL, uf_fecha DATETIME,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );


ALTER TABLE Blockdocumentos ADD Uf_CFDfolio INT;

ALTER Table cfgImpuesto ADD uf_TipoI1 VARCHAR(25);
ALTER Table cfgImpuesto ADD uf_TipoI2 VARCHAR(25);
ALTER Table cfgImpuesto ADD uf_TipoI3 VARCHAR(25);
ALTER Table cfgImpuesto ADD uf_TipoI4 VARCHAR(25);

ALTER Table Cliente ADD uf_Addenda BIT;
ALTER Table Producto ADD uf_Complemento BIT;
ALTER Table Venta ADD uf_FechaCFD DATETIME;

ALTER TABLE CConsumo ADD uf_DomicilioCFD INT;

ALTER TABLE ut_CFDFolio ADD CONSTRAINT RLCFDFolioufCFDInfo_CFDInfoSys_PK FOREIGN KEY  (uf_CFDInfo) REFERENCES ut_CFDInfo(Sys_PK);
ALTER TABLE ut_CFD ADD CONSTRAINT RLCFDufIVenta_VentaSys_PK FOREIGN KEY  (uf_IVenta) REFERENCES Venta(Sys_PK);
ALTER TABLE ut_CFD ADD CONSTRAINT RLCFDufCFDFolio_CFDFolioSys_PK FOREIGN KEY  (uf_CFDFolio) REFERENCES ut_CFDFolio(Sys_PK);
ALTER TABLE ut_CFDBitacora ADD CONSTRAINT RLCFDBitacoraufCFD_CFDSys_PK FOREIGN KEY  (uf_CFD) REFERENCES ut_CFD(Sys_PK);

CREATE TABLE ut_MaxMin (Sys_PK Int  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_MaxMin_PK PRIMARY KEY, uf_Maximo Float, uf_Minimo Float, uf_PReorden Float, IAlmacen INT NOT NULL, IProducto INT NOT NULL);
ALTER TABLE ut_MaxMin ADD CONSTRAINT RLut_MaxMin_AlmacenSys_PK FOREIGN KEY (IAlmacen) REFERENCES Almacen(Sys_PK);
ALTER TABLE ut_MaxMin ADD CONSTRAINT RLut_MaxMin_ProductoSys_PK FOREIGN KEY (IProducto) REFERENCES Producto(Sys_PK);

ALTER TABLE Producto ADD  Precio106 FLOAT;
ALTER TABLE Producto ADD  Precio107 FLOAT;
ALTER TABLE Producto ADD  Precio108 FLOAT;
ALTER TABLE Producto ADD  Precio109 FLOAT;
ALTER TABLE Producto ADD  Precio110 FLOAT;
ALTER TABLE Producto ADD  Precio111 FLOAT;
ALTER TABLE Producto ADD  Precio112 FLOAT;
ALTER TABLE Producto ADD  Precio113 FLOAT;
ALTER TABLE Producto ADD  Precio114 FLOAT;
ALTER TABLE Producto ADD  Precio115 FLOAT;
ALTER TABLE Producto ADD  Precio116 FLOAT;
ALTER TABLE Producto ADD  Precio117 FLOAT;
ALTER TABLE Producto ADD  Precio118 FLOAT;
ALTER TABLE Producto ADD  Precio119 FLOAT;
ALTER TABLE Producto ADD  Precio120 FLOAT;

ALTER TABLE Producto ADD  Util106 FLOAT;
ALTER TABLE Producto ADD  Util107 FLOAT;
ALTER TABLE Producto ADD  Util108 FLOAT;
ALTER TABLE Producto ADD  Util109 FLOAT;
ALTER TABLE Producto ADD  Util110 FLOAT;
ALTER TABLE Producto ADD  Util111 FLOAT;
ALTER TABLE Producto ADD  Util112 FLOAT;
ALTER TABLE Producto ADD  Util113 FLOAT;
ALTER TABLE Producto ADD  Util114 FLOAT;
ALTER TABLE Producto ADD  Util115 FLOAT;
ALTER TABLE Producto ADD  Util116 FLOAT;
ALTER TABLE Producto ADD  Util117 FLOAT;
ALTER TABLE Producto ADD  Util118 FLOAT;
ALTER TABLE Producto ADD  Util119 FLOAT;
ALTER TABLE Producto ADD  Util120 FLOAT;

ALTER TABLE ut_CFD ADD uf_ExtPresentacion INT;
ALTER TABLE ut_CFD ADD uf_IDCxC INT;
ALTER TABLE ut_CFD ADD CONSTRAINT RlutCFD_ufIDCxC_DCXCSys_PK FOREIGN KEY (uf_IDCxC) REFERENCES DCXC(Sys_PK);
ALTER TABLE ut_CFD ADD uf_FechaHora DATETIME;
ALTER TABLE ut_CFD ADD uf_Tipo INT;
ALTER TABLE ut_CFD ADD uf_CFDI_Info INT;
ALTER TABLE ut_CFD ADD CONSTRAINT RlutCFD_ufCFDIInfo_CFDInfoSys_PK FOREIGN KEY (uf_CFDI_Info) REFERENCES ut_CFDInfo(Sys_PK);
ALTER TABLE ut_CFD ADD uf_CanceladoSAT INT;
ALTER TABLE ut_CFD ADD uf_CadenaOriginalSAT VARCHAR(MAX);
ALTER TABLE ut_CFD ADD uf_SelloDigitalSAT VARCHAR(MAX);
ALTER TABLE ut_CFD ADD uf_FolioSAT VARCHAR(50);
ALTER TABLE ut_CFD ADD uf_NoCertificadoSAT VARCHAR(20);
ALTER TABLE ut_CFD ADD uf_FechaHoraCerSAT DATETIME;
ALTER TABLE ut_CFD ADD uf_XMLCFDI VARCHAR(MAX);
ALTER TABLE ut_CFD ADD uf_CBB VARBINARY(MAX);

ALTER TABLE ut_CFDInfo ADD uf_PFX VARCHAR(MAX);

ALTER TABLE BlockDocumentos ADD uf_CFDI_Info INT;


CREATE VIEW qryCFDVentas AS SELECT TOP 100 PERCENT ut_CFD.Sys_PK AS Sys_PK, ut_cfd.uf_IVenta AS IVenta, cDocumentos.Const AS Documento,Venta.Referencia, ut_CFD.uf_FechaHora  AS Fecha, Cliente.Nombre, Cliente.RFC, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto3) AS Total,FoliosDocumentos.Folio,ut_cfdfolio.uf_noAprobacion AS NoAprobacionFolios, ut_cfdbitacora.uf_reportado AS Reportado,(CASE WHEN (Venta.StatusAdministrativo=99) THEN 1 ELSE 0 END) AS Cancelado FROM (((ut_cfd INNER JOIN (((Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) INNER JOIN cDocumentos ON Venta.Documento=cDocumentos.ID) INNER JOIN FoliosDocumentos ON Venta.IFolio=FoliosDocumentos.Sys_PK) ON ut_cfd.uf_IVenta=Venta.Sys_PK) INNER JOIN ut_cfdfolio ON ut_cfd.uf_cfdfolio=ut_cfdfolio.Sys_PK) INNER JOIN ut_cfdbitacora ON ut_cfd.Sys_PK=ut_cfdbitacora.uf_cfd) WHERE ut_CFD.uf_Tipo=2 ORDER BY Venta.Documento,Venta.Referencia,Venta.Fecha;

CREATE VIEW qryCFDIVentas AS SELECT TOP 100 PERCENT ut_CFD.Sys_PK AS Sys_PK, ut_cfd.uf_IVenta AS IVenta, cDocumentos.Const AS Documento,Venta.Referencia,ut_CFD.uf_FechaHora AS Fecha, Cliente.Nombre, Cliente.RFC, (Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto3) AS Total,FoliosDocumentos.Folio,ut_cfd.uf_FolioSAT AS FolioSAT,ut_cfd.uf_NoCertificadoSAT AS NoCertificadoSAT,ut_cfd.uf_FechaHoraCerSAT AS FechaHoraCerSAT, (CASE WHEN (Venta.StatusAdministrativo=99) THEN 1 ELSE 0 END) AS Cancelado, ut_cfd.uf_CanceladoSAT AS CanceladoSAT FROM (ut_cfd INNER JOIN (((Venta INNER JOIN Cliente ON Venta.ICliente=Cliente.Sys_PK) INNER JOIN cDocumentos ON Venta.Documento=cDocumentos.ID) INNER JOIN FoliosDocumentos ON Venta.IFolio=FoliosDocumentos.Sys_PK) ON ut_cfd.uf_IVenta=Venta.Sys_PK) WHERE ut_CFD.uf_Tipo=3 ORDER BY Venta.Documento,Venta.Referencia,Venta.Fecha;

CREATE VIEW qryCFDCxC AS SELECT TOP 100 PERCENT ut_CFD.Sys_PK AS Sys_PK, ut_cfd.uf_IDCXC AS IDCXC, cDocumentos.Const AS Documento,DCXC.Referencia,(ut_CFD.uf_FechaHora) AS Fecha, Cliente.Nombre, Cliente.RFC,(CASE WHEN (DCXC.Haber>0) THEN DCXC.Haber ELSE DCXC.DEBE END) Total, FoliosDocumentos.Folio,ut_cfdfolio.uf_noAprobacion AS NoAprobacionFolios, ut_cfdbitacora.uf_reportado AS Reportado FROM (((ut_cfd INNER JOIN (((DCXC INNER JOIN Cliente ON DCXC.ICliente=Cliente.Sys_PK) INNER JOIN cDocumentos ON DCXC.Documento=cDocumentos.ID) INNER JOIN FoliosDocumentos ON DCXC.IFolio=FoliosDocumentos.Sys_PK) ON ut_cfd.uf_IDCXC=DCXC.Sys_PK) INNER JOIN ut_cfdfolio ON ut_cfd.uf_cfdfolio=ut_cfdfolio.Sys_PK) INNER JOIN ut_cfdbitacora ON ut_cfd.Sys_PK=ut_cfdbitacora.uf_cfd) WHERE ut_CFD.uf_Tipo=2 ORDER BY DCXC.Documento,DCXC.Referencia,DCXC.Fecha;

CREATE VIEW qryCFDICxC AS SELECT TOP 100 PERCENT ut_CFD.Sys_PK AS Sys_PK, ut_cfd.uf_IDCXC AS IDCXC, cDocumentos.Const AS Documento,DCXC.Referencia,(ut_CFD.uf_FechaHora) AS Fecha, Cliente.Nombre, Cliente.RFC,(CASE WHEN (DCXC.Haber>0) THEN DCXC.Haber ELSE DCXC.DEBE END) Total, FoliosDocumentos.Folio,ut_cfd.uf_FolioSAT AS FolioSAT,ut_cfd.uf_NoCertificadoSAT AS NoCertificadoSAT,ut_cfd.uf_FechaHoraCerSAT AS FechaHoraCerSAT,ut_cfd.uf_CanceladoSAT AS CanceladoSAT FROM (ut_cfd INNER JOIN (((DCXC INNER JOIN Cliente ON DCXC.ICliente=Cliente.Sys_PK) INNER JOIN cDocumentos ON DCXC.Documento=cDocumentos.ID) INNER JOIN FoliosDocumentos ON DCXC.IFolio=FoliosDocumentos.Sys_PK) ON ut_cfd.uf_IDCXC=DCXC.Sys_PK) WHERE ut_CFD.uf_Tipo=3 ORDER BY DCXC.Documento,DCXC.Referencia,DCXC.Fecha;

CREATE TABLE ut_FoliosCBB (Sys_PK INT NOT NULL IDENTITY (1,1) CONSTRAINT IDX_ut_FoliosCBB_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_FolioInicial INT NOT NULL , uf_FolioFinal INT NOT NULL , uf_CBB VARBINARY(MAX), uf_BlockDoc INT NOT NULL, uf_NumAprobacion INT NOT NULL, uf_Serie VARCHAR(10),sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

ALTER TABLE ut_FoliosCBB ADD CONSTRAINT uf_BlockDoc_ut_FoliosCBB FOREIGN KEY  (uf_BlockDoc ) REFERENCES BlockDocumentos(Sys_PK);




ALTER TABLE Caja ADD uf_limefectivo Money;
ALTER TABLE Caja ADD uf_lime_vntadic Int;
ALTER TABLE Caja ADD uf_lime_aviso Money;
ALTER TABLE Caja ADD uf_lime_alerta VARCHAR(500);
ALTER TABLE Caja ADD uf_lime_pkprimerventa Int;
ALTER TABLE Caja ADD uf_corte_req Bit;
ALTER TABLE Caja ADD uf_horacorte1 DATETIME;
ALTER TABLE Caja ADD uf_horacorte2 DATETIME;
ALTER TABLE Caja ADD uf_horacorte3 DATETIME;
ALTER TABLE Caja ADD uf_horacorte4 DATETIME;
ALTER TABLE Caja ADD uf_horacorte5 DATETIME;
ALTER TABLE Caja ADD uf_cortereq_vntadic Int;
ALTER TABLE Caja ADD uf_lim_vntliber Int;
ALTER TABLE Almacen ADD uf_movremoto Bit;
ALTER TABLE Venta ADD uf_fechacancelacion DATETIME;
ALTER TABLE Compra ADD uf_fechacancelacion DATETIME;
ALTER TABLE MovCuenta ADD uf_fechacancelacion DATETIME;
ALTER TABLE Proveedor ADD uf_vueltaviajero Int;

CREATE TABLE ut_SysLog (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDXSysLog_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Terminal VARCHAR(50), Usuario Int, Mensaje VARCHAR(1024));

ALTER TABLE TarjetaCredito ADD uf_PorComision Float;
ALTER TABLE DTarjeta ADD uf_PorComision Float;


CREATE VIEW qIngresosOrd AS (SELECT movcaja.sys_pk as pkmov, divisa.Codigo AS Codigo, divisa.Descripcion AS Descripcion, movcaja.Fecha AS Fecha, movcaja.Hora AS Hora, (movcaja.Efectivo+movcaja.Tarjetas+movcaja.Depositos+movcaja.Cheques+movcaja.Vales) AS Ingreso, dcxc.Notas AS Notas, dcxc.Referencia AS Referencia, cliente.Codigo AS CodigoCliente, cliente.Nombre AS Nombre,movcaja.tipocambio as tcambio,'Abono' as Tipo, DCxC.Sys_PK As id,((Year(MovCaja.Fecha)*10000)+(Month(MovCaja.Fecha)*100)+(Day(MovCaja.Fecha))) as NDFecha,year(movcaja.fecha) as ano,month(movcaja.fecha) as mes,day(movcaja.fecha) as dia FROM (((movcaja INNER JOIN divisa ON movcaja.IDivisa = divisa.Sys_PK)  INNER JOIN dcxc ON movcaja.Sys_PK = dcxc.IMovCaja)  INNER JOIN cliente ON dcxc.ICliente = cliente.Sys_PK)  ) UNION ALL (SELECT movcaja.sys_pk as pkmov,  divisa.Codigo AS Codigo, divisa.Descripcion AS Descripcion, movcaja.Fecha AS Fecha, movcaja.Hora AS Hora, (movcaja.Efectivo+movcaja.Tarjetas+movcaja.Depositos+movcaja.Cheques+movcaja.Vales) AS Ingreso, movcaja.Notas AS Notas, movcaja.Referencia AS Referencia, cliente.Codigo AS CodigoCliente, cliente.Nombre AS Nombre, movcaja.tipocambio as tcambio, 'Contado' as Tipo , Venta.Sys_PK as id,((Year(MovCaja.Fecha)*10000)+(Month(MovCaja.Fecha)*100)+(Day(MovCaja.Fecha))) as NDFecha,year(movcaja.fecha) as ano,month(movcaja.fecha) as mes,day(movcaja.fecha) as dia FROM (((movcaja INNER JOIN divisa ON movcaja.IDivisa = divisa.Sys_PK)  INNER JOIN venta ON movcaja.Sys_PK = venta.IMovCaja)  INNER JOIN cliente ON venta.ICliente = cliente.Sys_PK));


ALTER TABLE Producto ADD uf_CodigoParaProveedor1 VARCHAR(50);
ALTER TABLE Producto ADD uf_CodigoParaProveedor2 VARCHAR(50);
ALTER TABLE Producto ADD uf_CodigoParaProveedor3 VARCHAR(50);
alter table docs add urlfile varchar(4096);
alter table docs add storeout tinyint;
ALTER TABLE Compra ADD uf_Importado Bit;
ALTER TABLE Compra ADD uf_IAduana Int;
ALTER TABLE Compra ADD uf_NumDocAduanero VARCHAR(200);
ALTER TABLE Compra ADD uf_FechaDocAduanero DATETIME;

CREATE TABLE ut_Aduana (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDXutAduana_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Codigo VARCHAR(35) NOT NULL UNIQUE, uf_Nombre VARCHAR(500) NOT NULL UNIQUE, uf_Ciudad VARCHAR(100)  , uf_Notas VARCHAR(500));

CREATE TABLE ut_Gasto(Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDXutGasto_PK PRIMARY KEY, Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported BIT , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),Referencia VARCHAR(50) NOT NULL UNIQUE, Fecha DATETIME NOT NULL, Vencimiento DATETIME NOT NULL, Concepto VARCHAR(1500) NOT NULL,IProveedor INT NOT NULL,ICategoria INT NOT NULL,IDivisa INT NOT NULL,TipoCambio Money NOT NULL,IMovCaja INT,IMovChequera INT, Subtotal Money NOT NULL,IVA Money NOT NULL,RetIVA Money NOT NULL, RetISR Money NOT NULL,Total Money NOT NULL,Deducibilidad Int,FormaPago INT NOT NULL,StatusAdministrativo INT NOT NULL, uf_Color INT,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoIProveedor_ProveedorSysPK FOREIGN KEY(IProveedor) REFERENCES Proveedor(Sys_PK);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoICategoria_CategoriaSysPK FOREIGN KEY(ICategoria) REFERENCES Categoria(Sys_PK);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoIDivisa_DivisaSysPK FOREIGN KEY(IDivisa) REFERENCES Divisa(Sys_PK);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoIMovCaja_MovCajaSysPK FOREIGN KEY(IMovCaja) REFERENCES MovCaja(Sys_PK);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoIMovChequera_MovCuentaSysPK FOREIGN KEY(IMovChequera) REFERENCES MovCuenta(Sys_PK);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoFormaPago_cFormasPagoID FOREIGN KEY(FormaPago) REFERENCES cFormasPago(ID);
ALTER TABLE ut_Gasto ADD CONSTRAINT RLUtGastoStAdminist_cStatusAdminstID FOREIGN KEY(StatusAdministrativo) REFERENCES cStatusAdministrativos(ID);
ALTER TABLE DCxP ADD uf_IGasto INT;
ALTER TABLE DCxP ADD CONSTRAINT RLDCxPuf_IGasto_ut_GastoSys_PK FOREIGN KEY (uf_IGasto) REFERENCES ut_Gasto(Sys_PK);
ALTER TABLE MovCuenta ADD uf_IProveedor INT;
ALTER TABLE MovCuenta ADD CONSTRAINT RLDMovCuentaIProvedor_ProveedorSys_PK FOREIGN KEY (uf_IProveedor) REFERENCES Proveedor(Sys_PK);

INSERT INTO cDocumentos(ID,Const) VALUES(7,'cGasto');
INSERT INTO cDocumentos(ID,Const) VALUES(68,'cSPEI');
INSERT INTO cDocumentos(ID,Const) VALUES(69,'cTransferencia_Interbancaria');


CREATE VIEW qryPagos AS SELECT Compra.Referencia AS Documento, Compra.Fecha AS DocFecha, MovCaja.Fecha AS FechaMovimiento, MovCaja.Fecha AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, Abs(MovCaja.Efectivo) AS Importe, MovCaja.Referencia AS Referencia, MovCaja.Notas AS Notas,((YEAR(MovCaja.Fecha)*10000)+(MONTH(MovCaja.Fecha)*100)+DAY(MovCaja.Fecha)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,Compra.Sys_PK AS PKDocumento, Compra.Documento AS DocDocumento,1 AS Entidad, 1 AS Tipo, 0 AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM (((Compra INNER JOIN Proveedor ON Compra.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCaja ON Compra.IMovCaja=MovCaja.Sys_PK) LEFT JOIN Divisa ON MovCaja.IDivisa=Divisa.Sys_PK) WHERE Compra.StatusAdministrativo=3 AND ((Compra.Documento=3 AND Compra.StatusFinanciero=1) OR Compra.Documento=4) AND Compra.FormaPago=1 AND Compra.IMovCaja>0 UNION ALL SELECT Compra.Referencia AS Documento, Compra.Fecha AS DocFecha, MovCuenta.Fecha AS FechaMovimiento, MovCuenta.Aplicacion AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, MovCuenta.Egreso AS Importe, MovCuenta.Referencia AS Referencia, MovCuenta.Notas AS Notas,((YEAR(MovCuenta.Aplicacion)*10000)+(MONTH(MovCuenta.Aplicacion)*100)+DAY(MovCuenta.Aplicacion)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,Compra.Sys_PK AS PKDocumento, Compra.Documento AS DocDocumento,1 AS Entidad, 2 AS Tipo,MovCuenta.Tipo AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM ((((Compra INNER JOIN Proveedor ON Compra.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCuenta ON Compra.IMovChequera=MovCuenta.Sys_PK) LEFT JOIN Chequera ON MovCuenta.ICuenta=Chequera.Sys_PK) LEFT JOIN Divisa ON Chequera.IDivisa=Divisa.Sys_PK) WHERE Compra.StatusAdministrativo=3 AND ((Compra.Documento=3 AND Compra.StatusFinanciero=1) OR Compra.Documento=4) AND Compra.FormaPago=1 AND Compra.IMovChequera>0 UNION ALL SELECT ut_Gasto.Referencia AS Documento, ut_Gasto.Fecha AS DocFecha, MovCaja.Fecha AS FechaMovimiento, MovCaja.Fecha AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, Abs(MovCaja.Efectivo) AS Importe, MovCaja.Referencia AS Referencia, MovCaja.Notas AS Notas,((YEAR(MovCaja.Fecha)*10000)+(MONTH(MovCaja.Fecha)*100)+DAY(MovCaja.Fecha)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,ut_Gasto.Sys_PK AS PKDocumento, 7 AS DocDocumento,2 AS Entidad, 1 AS Tipo,0 AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM (((ut_Gasto INNER JOIN Proveedor ON ut_Gasto.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCaja ON ut_Gasto.IMovCaja=MovCaja.Sys_PK) LEFT JOIN Divisa ON MovCaja.IDivisa=Divisa.Sys_PK) WHERE ut_Gasto.StatusAdministrativo=3 AND ut_Gasto.FormaPago=1 AND ut_Gasto.IMovCaja>0  UNION ALL SELECT ut_Gasto.Referencia AS Documento, ut_Gasto.Fecha AS DocFecha, MovCuenta.Fecha AS FechaMovimiento, MovCuenta.Aplicacion AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, MovCuenta.Egreso AS Importe, MovCuenta.Referencia AS Referencia, MovCuenta.Notas AS Notas,((YEAR(MovCuenta.Aplicacion)*10000)+(MONTH(MovCuenta.Aplicacion)*100)+DAY(MovCuenta.Aplicacion)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,ut_Gasto.Sys_PK AS PKDocumento, 7 AS DocDocumento,2 AS Entidad, 2 AS Tipo,MovCuenta.Tipo AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM ((((ut_Gasto INNER JOIN Proveedor ON ut_Gasto.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCuenta ON ut_Gasto.IMovChequera=MovCuenta.Sys_PK) LEFT JOIN Chequera ON MovCuenta.ICuenta=Chequera.Sys_PK) LEFT JOIN Divisa ON Chequera.IDivisa=Divisa.Sys_PK) WHERE ut_Gasto.StatusAdministrativo=3 AND ut_Gasto.FormaPago=1 AND ut_Gasto.IMovChequera>0 UNION ALL SELECT DCxP.Referencia AS Documento, DCxP.Fecha AS DocFecha, MovCaja.Fecha AS FechaMovimiento, MovCaja.Fecha AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, Abs(MovCaja.Efectivo) AS Importe, MovCaja.Referencia AS Referencia, MovCaja.Notas AS Notas,((YEAR(MovCaja.Fecha)*10000)+(MONTH(MovCaja.Fecha)*100)+DAY(MovCaja.Fecha)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,DCxP.Sys_PK AS PKDocumento, DCxP.Documento AS DocDocumento,3 AS Entidad, 1 AS Tipo, 0 AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM (((DCxP INNER JOIN Proveedor ON DCxP.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCaja ON DCxP.IMovCaja=MovCaja.Sys_PK) LEFT JOIN Divisa ON MovCaja.IDivisa=Divisa.Sys_PK) WHERE DCxP.Documento=19 AND DCxP.IMovCaja>0 UNION ALL SELECT DCxP.Referencia AS Documento, DCxP.Fecha AS DocFecha, MovCuenta.Fecha AS FechaMovimiento, MovCuenta.Aplicacion AS FechaAplicacion,  Proveedor.Nombre AS Proveedor, MovCuenta.Egreso AS Importe, MovCuenta.Referencia AS Referencia, MovCuenta.Notas AS Notas,((YEAR(MovCuenta.Aplicacion)*10000)+(MONTH(MovCuenta.Aplicacion)*100)+DAY(MovCuenta.Aplicacion)) AS NDFechaApl,Proveedor.Sys_PK AS PKProveedor,DCxP.Sys_PK AS PKDocumento, DCxP.Documento AS DocDocumento,3 AS Entidad, 2 AS Tipo,MovCuenta.Tipo AS MovDocumento,Divisa.Codigo AS CodDivisa, Divisa.Descripcion AS DesDivisa FROM ((((DCxP INNER JOIN Proveedor ON DCxP.IProveedor=Proveedor.Sys_PK) LEFT JOIN MovCuenta ON DCxP.IMovChequera=MovCuenta.Sys_PK) LEFT JOIN Chequera ON MovCuenta.ICuenta=Chequera.Sys_PK) LEFT JOIN Divisa ON Chequera.IDivisa=Divisa.Sys_PK) WHERE DCxP.Documento=19 AND DCxP.IMovChequera>0;



create table utx_pdv (cod_prod varchar(50), cod_cc varchar(15), pdv float);

alter table producto add uf_pdv float;
alter table producto add uf_dv_DiasReOrden int;
alter table producto add uf_dv_InventarioSeguridadDias int;

CREATE TABLE RegimenEmisor(Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDXRegimenEmisorSysPK PRIMARY KEY, Regimen VARCHAR(500) NOT NULL UNIQUE, Notas VARCHAR(MAX));

CREATE TABLE ut_DmFacturaResumen(Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDXut_DmFacturaResumenSysPK PRIMARY KEY, Unidad VARCHAR(35) NOT NULL, Descripcion VARCHAR(500) NOT NULL, Cantidad Float NOT NULL, Precio Float NOT NUll, Descuentos Float NOT NULL, Impuestos Float NOT NULL, FKVenta INT NOT NULL);

ALTER TABLE ut_DmFacturaResumen ADD CONSTRAINT RLut_DmFacturaResumen_FKVenta_Venta_Sys_PK FOREIGN KEY(FKVenta) REFERENCES Venta(Sys_PK);

ALTER TABLE Venta ADD uf_dmTipoFormato Int;
ALTER TABLE Venta ADD XMLFormaPago VARCHAR(255);
ALTER TABLE Venta ADD XMLCondicionesPago VARCHAR(255);
ALTER TABLE Venta ADD XMLMetodoPago VARCHAR(255);
ALTER TABLE Venta ADD XMLNumeroCuentaPago VARCHAR(100);
ALTER TABLE DCXC ADD XMLFormaPago VARCHAR(255);
ALTER TABLE DCXC ADD XMLCondicionesPago VARCHAR(255);
ALTER TABLE DCXC ADD XMLMetodoPago VARCHAR(255);
ALTER TABLE DCXC ADD XMLNumeroCuentaPago VARCHAR(100);


ALTER TABLE ut_CFD ADD uf_ackCancelacion_SAT VARCHAR(MAX);


CREATE TABLE ut_DmTransformacion (Sys_PK INT  NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_DmTransformacion_PK PRIMARY KEY, uf_ProdOrigen INT NOT NULL , uf_ProdFinal INT NOT NULL , uf_Factor FLOAT NOT NULL , uf_Margen FLOAT NOT NULL );

ALTER TABLE ut_DmTransformacion ADD CONSTRAINT RLut_DmTransformacionuf_ProdOrigen_ProductoSys_PK FOREIGN KEY (uf_ProdOrigen) REFERENCES Producto(Sys_PK);

ALTER TABLE ut_DmTransformacion ADD CONSTRAINT RLut_DmTransformacionuf_ProdFinal_ProductoSys_PK FOREIGN KEY (uf_ProdFinal) REFERENCES Producto(Sys_PK);

CREATE TABLE ut_bi_perspectiva (Sys_PK INT NOT NULL IDENTITY(1,1)  CONSTRAINT IDX_ut_bi_perspectivaPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Nombre VARCHAR(50) NOT NULL, uf_Entidad VARCHAR(50) NOT NULL , uf_Grupos VARCHAR(MAX) NOT NULL,uf_padre int not null,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_bi_metrica (Sys_PK INT NOT NULL IDENTITY(1,1)  CONSTRAINT IDX_ut_bi_metricaPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Nombre VARCHAR(50) NOT NULL , uf_Descripcion VARCHAR(255) NOT NULL , uf_Titulo VARCHAR(100) NOT NULL , uf_Decimales INT NOT NULL , uf_Formato VARCHAR(50) NOT NULL , uf_Codigo VARCHAR(MAX) NOT NULL, uf_FK_Perspectiva INT NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_bi_indicador (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_indicadorPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Nombre VARCHAR(50) NOT NULL , uf_FK_Perspectiva INT NOT NULL , uf_Tipo INT NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null );

CREATE TABLE ut_bi_tablero (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_tableroPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32),uf_Nombre VarChar(50) NOT NULL,uf_FK_Usuario INT NOT NULL,uf_Color Int,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);

CREATE TABLE ut_bi_barraprog (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_barraprogPK PRIMARY KEY , uf_FK_Indicador INT NOT NULL,uf_FK_Metrica INT NOT NULL  , uf_Dia_Min FLOAT NOT NULL , uf_Dia_Max FLOAT NOT NULL , uf_Dia_Color INT NOT NULL , uf_Dia_ColorDebajo INT NOT NULL , uf_Dia_ColorArriba INT NOT NULL,uf_Semana_Min FLOAT NOT NULL , uf_Semana_Max FLOAT NOT NULL , uf_Semana_Color INT NOT NULL , uf_Semana_ColorDebajo INT NOT NULL , uf_Semana_ColorArriba INT NOT NULL, uf_Mes_Min FLOAT NOT NULL , uf_Mes_Max FLOAT NOT NULL , uf_Mes_Color INT NOT NULL , uf_Mes_ColorDebajo INT NOT NULL , uf_Mes_ColorArriba INT NOT NULL, uf_Ano_Min FLOAT NOT NULL , uf_Ano_Max FLOAT NOT NULL , uf_Ano_Color INT NOT NULL , uf_Ano_ColorDebajo INT NOT NULL , uf_Ano_ColorArriba INT NOT NULL );

CREATE TABLE ut_bi_semaforo (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_semaforoPK PRIMARY KEY , uf_FK_Indicador INT NOT NULL,uf_FK_Metrica INT NOT NULL, uf_invertido Bit NOT NULL  , uf_Dia_Lim1 FLOAT NOT NULL , uf_Dia_Lim2 FLOAT NOT NULL, uf_Semana_Lim1 FLOAT NOT NULL , uf_Semana_Lim2 FLOAT NOT NULL,uf_mes_Lim1 FLOAT NOT NULL,uf_mes_Lim2 FLOAT NOT NULL  , uf_Ano_Lim1 FLOAT NOT NULL , uf_Ano_Lim2 FLOAT NOT NULL);

CREATE TABLE ut_bi_matrizgraf (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_matrizgrafPK PRIMARY KEY ,uf_FK_Indicador INT NOT NULL,uf_FK_M_Metrica1 INT NOT NULL,uf_FK_M_Metrica2 INT NOT NULL,uf_FK_M_Metrica3 INT NOT NULL,uf_FK_M_Metrica4 INT NOT NULL,uf_FK_M_Metrica5 INT NOT NULL,uf_FK_M_Metrica6 INT NOT NULL,uf_FK_M_Metrica7 INT NOT NULL,uf_FK_M_Metrica8 INT NOT NULL,uf_FK_M_Metrica9 INT NOT NULL,uf_FK_M_Metrica10 INT NOT NULL,uf_FK_G_Metrica1 INT NOT NULL,uf_FK_G_Metrica2 INT NOT NULL,uf_FK_G_Metrica3 INT NOT NULL,uf_FK_G_Metrica4 INT NOT NULL,uf_FK_G_Metrica5 INT NOT NULL, uf_G_Titulo VARCHAR(250) NOT NULL, uf_G_Tipo INT NOT NULL);

CREATE TABLE ut_bi_fig (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_figPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), uf_FK_Tablero INT NOT NULL, uf_X INT NOT NULL, uf_Y INT NOT NULL, uf_W INT NOT NULL,uf_tipo INT NOT NULL, uf_H INT NOT NULL, uf_fuente VARCHAR(50) NOT NULL,uf_tamfuente INT NOT NULL, uf_atrib_fuente INT NOT NULL, uf_alin INT NOT NULL, uf_color INT NOT NULL,uf_fondo INT NOT NULL,uf_texto VARCHAR(255) NOT NULL);

CREATE TABLE ut_bi_tabindicador (Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_bi_tabindicadorPK PRIMARY KEY , Sys_TimeStamp DATETIME  NOT NULL , Sys_GUID VARCHAR(32) NOT NULL  UNIQUE , Sys_DTCreated DATETIME , Sys_User VARCHAR(5), Sys_LastUser VARCHAR(5), Sys_Exported Bit , Sys_DTExported DATETIME , Sys_Info VARCHAR(32), uf_FK_Tablero INT NOT NULL,uf_FK_Indicador INT NOT NULL,uf_FK_Entidad INT NOT NULL, uf_X INT NOT NULL, uf_Y INT NOT NULL, uf_W INT NOT NULL, uf_H INT NOT NULL, uf_Periodos INT NOT NULL, uf_pinicial INT NOT NULL, uf_l1 FLOAT NOT NULL,uf_l2 FLOAT NOT NULL,uf_l3 FLOAT NOT NULL,uf_l4 FLOAT NOT NULL,uf_l5 FLOAT NOT NULL,uf_l6 FLOAT NOT NULL,uf_l7 FLOAT NOT NULL,uf_l8 FLOAT NOT NULL,sys_recver int NULL default 0,sys_deleted bit null,sys_lock int null);


create table ut_busqueda(Sys_PK INT NOT NULL IDENTITY(1,1) CONSTRAINT IDX_ut_busquedaPK primary key,Entidad varchar(100) not null UNIQUE, SQLBusqueda VARCHAR(MAX) not null,CampoRetorno varchar(50) not null,CamposOcultos VARCHAR(MAX), SQLDescripcion VARCHAR(MAX));


insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Producto','select Sys_PK,Codigo,Descripcion from Producto where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from producto where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Linea','select Sys_PK,Codigo,Descripcion from Linea where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from Linea where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Marca','select Sys_PK,Codigo,Descripcion from Marca where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from marca where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Almacen','select Sys_PK,Codigo,Descripcion from Almacen where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from Almacen where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Cliente','select Cliente.Sys_PK,Cliente.Codigo,Cliente.Nombre,Cliente.RFC,Domicilio.Colonia,Domicilio.Direccion,Domicilio.CodPos AS CodigoPostal from Cliente left join domicilio on cliente.domicilio1=domicilio.sys_pk where Cliente.codigo like ''%@filter%'' or Cliente.nombre like ''%@filter%'' or Cliente.rfc like ''%@filter%'' order by Cliente.Nombre','Sys_PK','Sys_PK','select codigo,nombre from Cliente where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('TipoCliente','select Sys_PK,Codigo,Descripcion from TipoCliente where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from TipoCliente where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Proveedor','select Proveedor.Sys_PK,Proveedor.Codigo,Proveedor.Nombre,Proveedor.RFC,Domicilio.Colonia,Domicilio.Direccion,Domicilio.CodPos as CodigoPostal from Proveedor left join domicilio on Proveedor.domicilio1=domicilio.sys_pk where Proveedor.codigo like ''%@filter%'' or Proveedor.nombre like ''%@filter%'' or Proveedor.rfc like ''%@filter%'' order by Proveedor.Nombre','Sys_PK','Sys_PK','select codigo,nombre from Proveedor where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('TipoProveedor','select Sys_PK,Codigo,Descripcion from TipoProveedor where codigo like ''%@filter%'' or descripcion like ''%@filter%'' order by Descripcion','Sys_PK','Sys_PK','select codigo,descripcion from TipoProveedor where sys_pk=@filter');

insert into ut_busqueda(Entidad,SQLBusqueda,CampoRetorno,CamposOcultos,SQLDescripcion) values('Agente','select Sys_PK,Codigo,Nombre from Agente where codigo like ''%@filter%'' or nombre like ''%@filter%'' order by nombre','Sys_PK','Sys_PK','select codigo,nombre from Agente where sys_pk=@filter');




CREATE VIEW qryFechaMinventas AS SELECT MIN(v.fecha) as fechaMin, v.icliente as ICliente FROM venta v WHERE ((((v.documento = 3) AND (v.statusFacturacion = 1)) OR ((v.documento = 6) AND (v.StatusFacturacion = 1)) OR (v.documento = 4)) AND (v.StatusAdministrativo = 3) ) GROUP BY v.icliente;



SET IDENTITY_INSERT ut_bi_perspectiva ON;

INSERT INTO ut_bi_perspectiva (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Entidad,uf_Grupos,uf_padre) VALUES  (1,GETDATE(),'FEE5E905E31E47329042857898B8FB4F',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Global','@','*',0);

INSERT INTO ut_bi_perspectiva (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Entidad,uf_Grupos,uf_padre) VALUES  (2,GETDATE(),'C5B6F2BB30624C168D8309ACAC610055',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Ventas','@','*',1);

INSERT INTO ut_bi_perspectiva (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Entidad,uf_Grupos,uf_padre) VALUES  (3,GETDATE(),'0580277B6D264F9390A3639EAA56C300',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Compras','@','*',1);

SET IDENTITY_INSERT ut_bi_perspectiva OFF;


SET IDENTITY_INSERT ut_bi_metrica ON;

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES (1,GETDATE(),'ACFC4A7DA2BE4F039F85001BDF417CAD',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Ventas Brutas','Importe total de ventas antes de impuestos sin incluir ventas canceladas.','Ventas Brutas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT SUM((v.subtotal-v.descuento1-v.descuento2)*v.tipocambio)AS vnsBrutas  FROM venta v WHERE (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha) >= " + inicio + " AND (year(v.fecha )*10000)+(month(v.fecha )*100)+day(v.fecha ) <= " + final + " AND ((v.documento = 3 AND v.statusFacturacion = 1) OR (v.documento = 6 AND v.StatusFacturacion = 1) OR v.documento = 4) AND v.StatusAdministrativo = 3";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES (2,GETDATE(),'4D742B8AED2C47858C32DB001E22E439',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Devoluciones sobre ventas','Importe total de notas de crédito antes de impuestos.','Devoluciones sobre ventas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT SUM( (v.subtotal-v.descuento1-v.descuento2)*v.tipocambio) AS Devoluciones FROM venta v WHERE (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha) >= " + inicio + " AND (year(v.fecha )*10000)+(month(v.fecha )*100)+day(v.fecha ) <= " + final + " AND v.documento = 5";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES (3,GETDATE(),'0368FAFB6C3C4CB78E18D9C3B8958417',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Ventas Netas','Importe total de ventas brutas menos devoluciones sobre ventas.','Ventas Netas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//métrica ventas brutas menos métrica devoluciones sobre ventas'+CHAR(13)+CHAR(10)+'return _ejecutar.obtener_metrica(''ACFC4A7DA2BE4F039F85001BDF417CAD'', ADOCnn, sys_pk, inicio, final) - _ejecutar.obtener_metrica(''4D742B8AED2C47858C32DB001E22E439'', ADOCnn, sys_pk, inicio, final);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (4,GETDATE(),'2F3EE251A5E845AC8BD174E74513179C',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Ventas Facturadas','Importe total de facturas de ventas antes de impuestos.','Ventas Facturadas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT SUM((Venta.Subtotal-Venta.Descuento1-Venta.Descuento2)*venta.tipocambio) AS VentaSubTotal  FROM Venta WHERE Venta.Documento=4 AND Venta.StatusAdministrativo=3 AND (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha) >= " + inicio + " AND (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha ) <= " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (5,GETDATE(),'BE40619A18B8471E8FBB75F7003F1EED',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Costo de ventas','Importe total del costo de ventas correspondientes a las ventas netas.','Costo de ventas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = " SELECT (Sum(qryRepCostoVentas.Costo)) - (Sum(qryRepCostoVentas.CtDev)) as CostoVenta  FROM qryRepCostoVentas WHERE (qryRepCostoVentas.nd_Fecha)>=  " + inicio + " AND (qryRepCostoVentas.nd_Fecha)<=  " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (6,GETDATE(),'76606CA1A59A4AC1857FD3D5EF2FF0DB',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Impuestos trasladados','Importe de impuestos sobre las ventas netas.','Impuestos trasladados',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var impCobrados = "SELECT SUM((v.impuesto1 + v.impuesto2 + v.impuesto3 + v.impuesto4)*v.tipocambio) AS impCobrados  FROM venta v WHERE (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha) >= " + inicio + " AND (year(v.fecha )*10000)+(month(v.fecha )*100)+day(v.fecha ) <= " + final + " AND ((((v.documento = 3) AND (v.statusFacturacion = 1)) OR ((v.documento = 6) AND (v.StatusFacturacion = 1)) OR (v.documento = 4)) AND (v.StatusAdministrativo = 3) )";'+CHAR(13)+CHAR(10)+'var impDevueltos = "SELECT SUM((v.impuesto1 + v.impuesto2 + v.impuesto3 + v.impuesto4)*v.tipocambio) as impuestosDev  FROM venta v WHERE (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha) >= " + inicio + " AND (year(v.fecha )*10000)+(month(v.fecha )*100)+day(v.fecha ) <= " + final + " AND v.documento = 5";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(impCobrados,ADOCnn)-StatsEngine.getScalar(impDevueltos,ADOCnn);',2);
INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (7,GETDATE(),'C54DB48A91AF45EFAEC9EA1979AFBA78',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Nuevos clientes','Clientes que han realizado la primera compra en el rango de fechas.','Nuevos clientes',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT COUNT(icliente) as NuevosCLts FROM qryFechaMinventas fm WHERE (year(fm.fechamin)*10000)+(month(fm.fechamin)*100)+day(fm.fechamin) >= " + inicio + " AND (year(fm.fechamin)*10000)+(month(fm.fechamin)*100)+day(fm.fechamin) <= " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (8,GETDATE(),'A2D2364C40E84F11BB075603EE023403',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Utilidad bruta','Es la diferencia entre las ventas netas y el costo de ventas','Utilidad bruta',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//Métrica ventas netas menos métrica costo ventas'+CHAR(13)+CHAR(10)+'return _ejecutar.obtener_metrica(''0368FAFB6C3C4CB78E18D9C3B8958417'', ADOCnn, sys_pk, inicio, final) - _ejecutar.obtener_metrica(''BE40619A18B8471E8FBB75F7003F1EED'', ADOCnn,sys_pk,inicio,final);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (9,GETDATE(),'999EB0B416BB485A8FA3DDA5392F6818',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones de venta','Es la cantidad total de ventas realizadas en el periodo incluyendo ventas canceladas.','Operaciones de venta',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT COUNT(v.SYS_PK) AS OperVenta FROM venta v WHERE ((((v.documento = 3) AND (v.statusFacturacion = 1)) OR ((v.documento = 6) AND (v.StatusFacturacion = 1)) OR (v.documento = 4)) AND  (v.StatusAdministrativo = 3 OR v.statusadministrativo = 99)) AND (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha) >= " + inicio + " AND (year(v.fecha)*10000)+(month(v.fecha)*100)+day(v.fecha ) <= " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (10,GETDATE(),'8768A82CF7AA431C97DF60AA48AA4C5C',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones de devolución','Es la cantidad de notas de crédito generadas en el periodo.','Operaciones de devolución',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT count(venta.sys_pk) AS OpDevolucion FROM venta WHERE (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha) >= " + inicio + " AND (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha ) <= " + final + " AND venta.documento = 5 ";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (11,GETDATE(),'9B4F61A6F47E464A874E4900008D4200',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones canceladas','Es la cantidad de ventas que se cancelaron en el periodo.','Operaciones canceladas',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT count(venta.sys_pk) AS OpVentas FROM venta WHERE (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha) >= " + inicio + " AND (year(venta.fecha)*10000)+(month(venta.fecha)*100)+day(venta.fecha ) <= " + final + " AND ((((venta.documento = 3) AND (venta.statusFacturacion = 1)) OR ((venta.documento = 6) AND (venta.StatusFacturacion = 1)) OR (venta.documento = 4)) AND (venta.StatusAdministrativo = 99) ) ";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (12,GETDATE(),'9EC2F431B6CD4481AF685FEAC64D7021',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Venta promedio','Es la división de ventas brutas entre operaciones de ventas.','Venta promedio',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//métrica ventas brutas entre métrica operaciones de ventas'+CHAR(13)+CHAR(10)+'var operaciones=_ejecutar.obtener_metrica(''999EB0B416BB485A8FA3DDA5392F6818'', ADOCnn, sys_pk, inicio, final);'+CHAR(13)+CHAR(10)+'if(operaciones>0){'+CHAR(13)+CHAR(10)+'   return _ejecutar.obtener_metrica(''ACFC4A7DA2BE4F039F85001BDF417CAD'', ADOCnn, sys_pk, inicio, final)/ operaciones;'+CHAR(13)+CHAR(10)+'}else{'+CHAR(13)+CHAR(10)+'   return 0;'+CHAR(13)+CHAR(10)+'}',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (13,GETDATE(),'D8D49D9C0BBE4F13A167771C30C4E5D6',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Margen de contribución','Es la representación de utilidades en porcentaje obtenidos de la diferencia de ventas netas y costo de ventas.','Margen de contribución',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//Métrica UtilidadBruta/ Métrica VentasNetas*100'+CHAR(13)+CHAR(10)+'var ventasNetas=_ejecutar.obtener_metrica(''0368FAFB6C3C4CB78E18D9C3B8958417'', ADOCnn, sys_pk, inicio, final);'+CHAR(13)+CHAR(10)+'if(ventasNetas>0)'+CHAR(13)+CHAR(10)+'{'+CHAR(13)+CHAR(10)+'   return  _ejecutar.obtener_metrica(''A2D2364C40E84F11BB075603EE023403'', ADOCnn, sys_pk, inicio, final)/ ventasNetas*100;'+CHAR(13)+CHAR(10)+'}else'+CHAR(13)+CHAR(10)+'{'+CHAR(13)+CHAR(10)+'  return 0;'+CHAR(13)+CHAR(10)+'}'+CHAR(13)+CHAR(10)+'',2);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (14,GETDATE(),'16840A45F3DB410CA8DC76F7CC1CB444',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Compras brutas','Importe total de compras en el periodo.','Compras brutas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT SUM((c.subtotal-c.descuento1-c.descuento2)*c.tipocambio) AS comBrutas  FROM compra c WHERE (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha )*10000)+(month(c.fecha )*100)+day(c.fecha ) <= " + final + " AND ((((c.documento = 3) AND (c.statusFacturacion = 1)) OR (c.documento = 4)) AND (c.StatusAdministrativo = 3) )";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (15,GETDATE(),'91C189BE96AF40D98300C2D0FE68BC79',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Devoluciones sobre compras','Importe total de notas de crédito generadas en el periodo.','Devoluciones sobre compras',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT SUM( (c.subtotal-c.descuento1-c.descuento2)*c.tipocambio) as Devoluciones FROM compra c WHERE (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha)*10000)+(month(c.fecha )*100)+day(c.fecha ) <= " + final + " AND c.documento = 5";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (16,GETDATE(),'5B5136ADB813410B8D1782049DB3E8F1',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Compras netas','Compras brutas menos las devoluciones.','Compras netas',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//métrica compras brutas menos métrica devoluciones'+CHAR(13)+CHAR(10)+'return _ejecutar.obtener_metrica(''16840A45F3DB410CA8DC76F7CC1CB444'', ADOCnn, sys_pk, inicio, final) - _ejecutar.obtener_metrica(''91C189BE96AF40D98300C2D0FE68BC79'', ADOCnn, sys_pk, inicio, final);',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (17,GETDATE(),'7733DD402CCB42D7B9BEF93F3DD1E959',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Costos indirectos','Es la sumatoria de los costos indirectos de las compras netas.','Costos indirectos',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qryBrutas =  "SELECT SUM((c.indirectos)*c.tipocambio )AS costosIndirectos  FROM compra c WHERE ((((c.documento = 3) and (c.StatusFacturacion = 1)) OR (c.documento= 4)) AND (c.StatusAdministrativo = 3)) AND (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) <= " + final;'+CHAR(13)+CHAR(10)+'var qryDevoluciones =  "SELECT SUM((c.indirectos)*c.tipocambio )AS costosIndirectos  FROM compra c WHERE c.documento= 5 AND (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) <= " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qryBrutas, ADOCnn)- StatsEngine.getScalar(qryDevoluciones, ADOCnn);'+CHAR(13)+CHAR(10)+'',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (18,GETDATE(),'9DB2E823847246DC9FE7732B1428009C',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Impuestos acreditables','Importe de impuestos  totales sobre las compras realizadas menos los impuestos por devolución.','Impuestos acreditables',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var impCobrados = "SELECT SUM((c.impuesto1 + c.impuesto2 + c.impuesto3 + c.impuesto4)*c.tipocambio) AS impCobrados  FROM compra c WHERE (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha)*10000)+(month(c.fecha )*100)+day(c.fecha ) <= " + final + " AND ((((c.documento = 3) AND (c.statusFacturacion = 1)) OR (c.documento = 4)) AND (c.StatusAdministrativo = 3) )";'+CHAR(13)+CHAR(10)+'var impDev = "SELECT SUM((c.impuesto1 + c.impuesto2 + c.impuesto3 + c.impuesto4) *c.tipocambio ) AS impuestosDev FROM compra c WHERE (year(c.fecha)*10000)+(month(c.fecha)*100)+day(c.fecha) >= " + inicio + " AND (year(c.fecha )*10000)+(month(c.fecha )*100)+day(c.fecha ) <= " + final + " AND c.documento = 5";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(impCobrados,ADOCnn)-StatsEngine.getScalar(impDev,ADOCnn);'+CHAR(13)+CHAR(10)+'',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (19,GETDATE(),'9566973515AC4814BAC37C62C568CE3C',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones de compra','Es la cantidad de compras realizadas en el periodo incluyendo compras canceladas.','Operaciones de compra',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT COUNT(c.sys_pk) AS OperacionesCompra FROM compra c WHERE ((((c.documento = 3) AND (c.statusFacturacion = 1)) OR (c.documento = 4)) AND (c.StatusAdministrativo = 3 OR c.statusadministrativo = 99)) AND ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))>=  " + inicio + " AND ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))<= " + final;'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);'+CHAR(13)+CHAR(10)+'',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (20,GETDATE(),'76EE5F63465F48278100F33283DEBC5E',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones de devolución','Es la cantidad de notas de crédito generadas en el periodo.','Operaciones de devolución',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = "SELECT COUNT(sys_pk) AS OperacionesDevolucion FROM compra c WHERE ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))>= " + inicio + " AND ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))<= " + final + " AND c.documento = 5";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);'+CHAR(13)+CHAR(10)+'',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (21,GETDATE(),'89AFC36BE3C442A58E0072622264E1EA',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Operaciones canceladas','Es la cantidad de  compras que se cancelaron en el periodo.','Operaciones canceladas',0,'#','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'var qry = " SELECT COUNT(c.sys_pk) AS OperacionesCanceladas FROM compra c WHERE ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))>= " + inicio + " AND ((Year(c.Fecha)*10000)+(Month(c.Fecha)*100)+Day(c.Fecha))<= " + final + " AND ((((c.documento = 3) AND (c.statusFacturacion = 1))  OR (c.documento = 4)) AND (c.StatusAdministrativo = 99) )";'+CHAR(13)+CHAR(10)+'return StatsEngine.getScalar(qry, ADOCnn);'+CHAR(13)+CHAR(10)+'',3);

INSERT INTO ut_bi_metrica (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_Descripcion,uf_Titulo,uf_Decimales,uf_Formato,uf_Codigo,uf_FK_Perspectiva) VALUES  (22,GETDATE(),'8D8C382A20004ABA9D62D701E7FBFD75',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Compra promedio','Es la división de compras brutas entre operaciones de compras.','Compra promedio',2,'#,#.00','//Lenguaje: javascript'+CHAR(13)+CHAR(10)+'//Objetos disponibles: ADOCnn, StatsEngine, _ejecutar y _fecha'+CHAR(13)+CHAR(10)+'//Parámetros: sys_pk, inicio, final  [function_ClaveMetrica(sys_pk,inicio,final){}] '+CHAR(13)+CHAR(10)+'//El valor debe ser devuelto mediante una sentencia return'+CHAR(13)+CHAR(10)+'//Métrica compras brutas/métrica operaciones de compra'+CHAR(13)+CHAR(10)+'var operaciones=_ejecutar.obtener_metrica(''9566973515AC4814BAC37C62C568CE3C'', ADOCnn, sys_pk, inicio, final);'+CHAR(13)+CHAR(10)+'if(operaciones>0){'+CHAR(13)+CHAR(10)+'   return _ejecutar.obtener_metrica(''16840A45F3DB410CA8DC76F7CC1CB444'', ADOCnn, sys_pk, inicio, final)/ operaciones;'+CHAR(13)+CHAR(10)+'}else{'+CHAR(13)+CHAR(10)+'    return 0;'+CHAR(13)+CHAR(10)+'}'+CHAR(13)+CHAR(10)+'',3);

SET IDENTITY_INSERT ut_bi_metrica OFF;


SET IDENTITY_INSERT ut_bi_indicador ON;

INSERT INTO ut_bi_indicador (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_FK_Perspectiva,uf_Tipo) VALUES (1,GETDATE(),'D5E05CBF5214451B90207D51FADC6136',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Ejemplo_Ventas_netas',2,2);

SET IDENTITY_INSERT ut_bi_indicador OFF;


SET IDENTITY_INSERT ut_bi_tablero ON;

INSERT INTO ut_bi_tablero (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_Nombre,uf_FK_Usuario,uf_Color) VALUES  (3,GETDATE(),'3D36959881654F9D948F176E2265CB26',GETDATE(),NULL,NULL,0,GETDATE(),NULL,'Tablero de ejemplo',1,NULL);

SET IDENTITY_INSERT ut_bi_tablero OFF;


SET IDENTITY_INSERT ut_bi_matrizgraf ON;

INSERT INTO ut_bi_matrizgraf (Sys_PK,uf_FK_Indicador,uf_FK_M_Metrica1,uf_FK_M_Metrica2,uf_FK_M_Metrica3,uf_FK_M_Metrica4,uf_FK_M_Metrica5,uf_FK_M_Metrica6,uf_FK_M_Metrica7,uf_FK_M_Metrica8,uf_FK_M_Metrica9,uf_FK_M_Metrica10,uf_FK_G_Metrica1,uf_FK_G_Metrica2,uf_FK_G_Metrica3,uf_FK_G_Metrica4,uf_FK_G_Metrica5,uf_G_Titulo,uf_G_Tipo) VALUES (2,1,3,8,9,0,0,0,0,0,0,0,3,0,0,0,0,'Ventas netas',3);

SET IDENTITY_INSERT ut_bi_matrizgraf OFF;


SET IDENTITY_INSERT ut_bi_tabindicador ON;

INSERT INTO ut_bi_tabindicador (Sys_PK,Sys_TimeStamp,Sys_GUID,Sys_DTCreated,Sys_User,Sys_LastUser,Sys_Exported,Sys_DTExported,Sys_Info,uf_FK_Tablero,uf_FK_Indicador,uf_FK_Entidad,uf_X,uf_Y,uf_W,uf_H,uf_Periodos,uf_pinicial,uf_l1,uf_l2,uf_l3,uf_l4,uf_l5,uf_l6,uf_l7,uf_l8) VALUES  (3,GETDATE(),'50D90DF7A9534037BC48438BF43F383E',GETDATE(),NULL,NULL,0,GETDATE(),NULL,3,1,0,1,1,14400,18360,15,0,0,0,0,0,0,0,0,0);

SET IDENTITY_INSERT ut_bi_tabindicador OFF;





ALTER TABLE DCXC ADD XMLUnidad VARCHAR(35);
ALTER TABLE DCXC ADD XMLPorcentajeIVAVenta Float;


CREATE VIEW qryFacturaParcialidad AS SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad, ISNULL(DCXC.XMLUnidad,'') AS Unidad, DCXC.Notas AS Descripcion, ((DCXC.Debe-DCXC.IntFinancieros)*(Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)/(Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)) AS Impuestos, ((DCXC.Debe-DCXC.IntFinancieros)-((DCXC.Debe-DCXC.IntFinancieros)*(Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)/(Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4))) AS Importe, ISNULL(DCXC.XMLPorcentajeIVAVenta,0) AS TasaImpuestos,(DCXC.Debe-DCXC.IntFinancieros) AS Total FROM (DCXC INNER JOIN Venta ON DCXC.IVenta=Venta.sys_pk) WHERE (DCXC.Documento=18 AND DCXC.IFolio>0 AND DCXC.RelacionadoA>0 AND Venta.Documento=4) UNION ALL SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad,ISNULL(DCXC.XMLUnidad,'') AS Unidad,'Pago de intereses financieros' AS Descripcion, (DCXC.IntFinancieros-(DCXC.IntFinancieros/(1+(DCXC.porImpuestoFin/100)))) AS Impuestos, (DCXC.IntFinancieros-(DCXC.IntFinancieros-(DCXC.IntFinancieros/(1+(DCXC.porImpuestoFin/100))))) AS Importe,DCXC.porImpuestoFin AS TasaImpuestos, DCXC.IntFinancieros AS Total FROM DCXC INNER JOIN Venta ON DCXC.IVenta=Venta.sys_pk WHERE ((DCXC.Documento=18 AND DCXC.IFolio>0 AND DCXC.RelacionadoA>0 AND Venta.Documento=4) AND DCXC.IntFinancieros>0) UNION ALL SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad,ISNULL(DCXC.XMLUnidad,'') AS Unidad,'Pago de intereses moratorios' AS Descripcion, (DCXC.IntMoratorios-(DCXC.IntMoratorios/(1+(DCXC.porImpuestoMor/100)))) AS Impuestos, (DCXC.IntMoratorios-(DCXC.IntMoratorios-(DCXC.IntMoratorios/(1+(DCXC.porImpuestoMor/100))))) AS Importe,DCXC.porImpuestoMor AS TasaImpuestos,DCXC.IntMoratorios AS Total FROM DCXC INNER JOIN Venta ON DCXC.IVenta=Venta.sys_pk WHERE ((DCXC.Documento=18 AND DCXC.IFolio>0 AND DCXC.RelacionadoA>0 AND Venta.Documento=4) AND DCXC.IntMoratorios>0);


CREATE VIEW qryFacturaAnticipo AS SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad, ISNULL(DCXC.XMLUnidad,'') AS Unidad, DCXC.Notas AS Descripcion, ((DCXC.Haber)*(Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)/(Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)) AS Impuestos, ((DCXC.Haber)-((DCXC.Haber)*(Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4)/(Venta.Subtotal-Venta.Descuento1-Venta.Descuento2+Venta.Impuesto1+Venta.Impuesto2+Venta.Impuesto3+Venta.Impuesto4))) AS Importe,ISNULL(DCXC.XMLPorcentajeIVAVenta,0) AS TasaImpuestos, DCXC.Haber AS Total FROM ((((DCXC INNER JOIN (FoliosDocumentos INNER JOIN BlockDocumentos ON FoliosDocumentos.Block=BlockDocumentos.Sys_PK) ON DCXC.IFolio=FoliosDocumentos.Sys_PK) INNER JOIN AplCXC ON DCXC.Sys_PK=AplCXC.FK_DCxC_AplicadoA) INNER JOIN DCXC Fac ON AplCXC.AplicadoA=Fac.Sys_PK) INNER JOIN Venta ON Fac.IVenta=Venta.Sys_PK)  WHERE DCXC.Documento=19 AND DCXC.IFolio>0 AND  BlockDocumentos.Documento=4 AND Fac.Documento=4;



CREATE VIEW qryComprobanteDCXCHaber AS SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad, ISNULL(DCXC.XMLUnidad,'') AS Unidad, DCXC.Notas AS Descripcion, (DCXC.Haber-(DCXC.Haber/(1+(DCXC.porImpuestoCap/100)))) AS Impuestos, (DCXC.Haber/(1+(DCXC.porImpuestoCap/100))) AS Importe, DCXC.porImpuestoCap AS TasaImpuestos, DCXC.Haber AS Total FROM DCXC WHERE Haber>0;

CREATE VIEW qryComprobanteDCXCDebe AS SELECT DCXC.Sys_PK AS PKDCXC,1 AS Cantidad, ISNULL(DCXC.XMLUnidad,'') AS Unidad, DCXC.Notas AS Descripcion, (DCXC.Debe-(DCXC.Debe/(1+(DCXC.porImpuestoCap/100)))) AS Impuestos, (DCXC.Debe/(1+(DCXC.porImpuestoCap/100))) AS Importe, DCXC.porImpuestoCap AS TasaImpuestos, DCXC.Debe AS Total FROM DCXC WHERE Debe>0;


CREATE VIEW qryInfoDocAduanero AS SELECT DISTINCT DCXVenta.RVenta AS RVentaDCardexVenta, DCXcompra.ILote,Compra.Sys_PK AS PKCompra, ut_Aduana.Sys_PK AS PKAduana, Compra.uf_NumDocAduanero AS NumDocAduana, Compra.uf_FechaDocAduanero AS FechaDocAduana, ut_Aduana.uf_Nombre AS Aduana, ut_Aduana.uf_Codigo AS CodAduana, ut_Aduana.uf_Ciudad AS CdAduana, ut_Aduana.uf_Notas AS NotasAduana FROM (DCardex DCXVenta INNER JOIN (DCardex DCXcompra INNER JOIN (Cardex INNER JOIN (Compra INNER JOIN ut_Aduana ON Compra.uf_IAduana=ut_Aduana.Sys_PK) ON Cardex.DocCompra=Compra.Sys_PK) ON DCXcompra.FK_Cardex_Movimientos=Cardex.Sys_PK) ON DCXVenta.ILote=DCXcompra.ILote);



create view qryDatosDetalleFactura as SELECT TOP 100 PERCENT DVenta.IProducto as Prod,DVenta.Sys_PK AS PKDVen, venta.sys_pk AS pkVnt,DVenta.Cantidad AS Cantidad, DVenta.Unidad AS Unidad, DVenta.Precio AS Precio, DVenta.Descuento1,DVenta.Descuento2,(DVenta.Descuento1+DVenta.Descuento2) AS Descuentos, DVenta.Impuesto1,DVenta.Impuesto2,DVenta.Impuesto3,DVenta.Impuesto4, (DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) AS Impuestos, (DVenta.Precio*DVenta.Cantidad) AS Importe, ((DVenta.Precio*DVenta.Cantidad)-DVenta.Descuento1-DVenta.Descuento2+DVenta.Impuesto1+DVenta.Impuesto2+DVenta.Impuesto3+DVenta.Impuesto4) AS Total, DVenta.Factor,DVenta.Notas,DVenta.TipoCambio, Producto.Descripcion AS Prod_Descripcion,Producto.Codigo AS Prod_Codigo, Producto.CodBar1 AS Prod_CodBar1,Producto.CodBar2  AS Prod_CodBar2 ,Producto.CodBar3 AS Prod_CodBar3, Producto.DiasEntrega AS Prod_DiasEntrega,Producto.Notas AS Prod_Notas,Producto.PPuntos AS Prod_PrecioPuntos, Producto.ReqLote AS Prod_ReqLote,Producto.ReqSerie AS Prod_ReqSerie, cClaseProducto.Const AS Prod_Clase, Linea.Codigo AS ProdLinea_Codigo, Linea.Descripcion AS ProdLinea_Descripcion,Linea.Notas AS ProdLinea_Notas, CfgImpuesto.Nombre AS ProdImpuesto_Nombre,CfgImpuesto.I1Venta AS ProdImpuesto_I1Venta, CfgImpuesto.I2Venta AS ProdImpuesto_I2Venta, CfgImpuesto.I3Venta AS ProdImpuesto_I3Venta, CfgImpuesto.I4Venta AS ProdImpuesto_I4Venta, Departamento.Codigo AS ProdDepto_Codigo, Departamento.Descripcion AS ProdDepto_Descripcion, Marca.Codigo AS ProdMarca_Codigo, Marca.Descripcion AS ProdMarca_Descripcion, qryInfoDocAduanero.NumDocAduana,qryInfoDocAduanero.FechaDocAduana,qryInfoDocAduanero.Aduana,venta.uf_dmTipoFormato as TipoFormato FROM (((((((Producto INNER JOIN (DVenta INNER JOIN Venta ON DVenta.FK_Venta_Detalle=Venta.Sys_PK) ON Producto.Sys_PK = DVenta.IProducto) INNER JOIN cClaseProducto ON Producto.IClase=cClaseProducto.ID) INNER JOIN Linea ON Producto.ILinea=Linea.Sys_PK) INNER JOIN CfgImpuesto ON Producto.Impuestos=CfgImpuesto.Sys_PK) left JOIN Departamento ON Producto.IDepartamento=Departamento.Sys_PK) LEFT JOIN Marca ON producto.IMarca=Marca.Sys_PK) LEFT JOIN qryInfoDocAduanero ON DVenta.Sys_PK=qryInfoDocAduanero.RVentaDCardexVenta) WHERE (ISNULL(Venta.uf_dmTipoFormato,0)=0) ORDER BY Venta.Sys_PK,DVenta.Sys_PK;


create view qryDatosResumenFactura as SELECT TOP 100 PERCENT 0 AS Prod, 0 AS PKDVen, FR.fkVenta as pkVnt, FR.cantidad AS Cantidad, FR.unidad AS Unidad, FR.precio AS Precio, FR.descuentos AS Descuento1,0 AS Descuento2,FR.descuentos AS Descuentos, FR.impuestos AS Impuesto1, 0 AS Impuesto2,0 AS Impuesto3,0 AS Impuesto4,FR.impuestos AS Impuestos, (FR.Precio*FR.Cantidad) AS Importe, ((FR.precio*FR.cantidad) - FR.descuentos+FR.impuestos) AS Total, 1 AS Factor,'' AS Notas,Venta.TipoCambio AS TipoCambio, FR.descripcion AS Prod_Descripcion, '' AS Prod_Codigo,'' AS Prod_CodBar1,'' AS Prod_CodBar2,'' AS Prod_CodBar3,0 AS Prod_DiasEntrega,'' AS Prod_Notas,0 AS Prod_PrecioPuntos,0 AS Prod_ReqLote,0 AS Prod_ReqSerie,'cReceta' AS Prod_Clase,'' AS ProdLinea_Codigo,'' AS ProdLinea_Descripcion,'' AS ProdLinea_Notas,'' AS ProdImpuesto_Nombre,'' AS ProdImpuesto_I1Venta,'' AS ProdImpuesto_I2Venta,'' AS ProdImpuesto_I3Venta,'' AS ProdImpuesto_I4Venta,'' AS ProdDepto_Codigo,'' AS ProdDepto_Descripcion,'' AS ProdMarca_Codigo,'' AS ProdMarca_Descripcion,'' AS NumDocAduana,NULL AS FechaDocAduana,'' AS Aduana,Venta.uf_dmTipoFormato as TipoFormato FROM ut_DmFacturaResumen FR INNER JOIN Venta ON Venta.sys_pk = FR.fkVenta WHERE (Venta.uf_dmTipoFormato = 1 OR Venta.uf_dmTipoFormato =2) ORDER BY FR.Sys_PK;



CREATE VIEW qryDatosFacturaDeminus AS SELECT * FROM qryDatosDetalleFactura UNION ALL SELECT * FROM qryDatosResumenFactura;

CREATE VIEW qryComprobanteAtributosAdicionales AS SELECT Venta.Sys_PK AS PKVenta,Venta.XMLFormaPago AS FormaPago,Venta.XMLCondicionesPago AS CondicionesPago,Venta.XMLMetodoPago AS MetodoPago,Venta.XMLNumeroCuentaPago AS NumeroCuentaPago, (CASE WHEN ISNULL(Venta.XMLNumeroCuentaPago,'')='' THEN '' ELSE ('No.CUENTA/TARJETA: '+Venta.XMLNumeroCuentaPago) END) AS SiNumeroCuentaPago FROM Venta;


CREATE VIEW qryComprobanteAtributosAdicionalesCXC AS SELECT DCXC.Sys_PK AS PKDCXC,DCXC.XMLFormaPago AS FormaPago,DCXC.XMLCondicionesPago AS CondicionesPago,DCXC.XMLMetodoPago AS MetodoPago,DCXC.XMLNumeroCuentaPago AS NumeroCuentaPago, (CASE WHEN ISNULL(DCXC.XMLNumeroCuentaPago,'')='' THEN '' ELSE ('No.CUENTA/TARJETA: '+DCXC.XMLNumeroCuentaPago) END) AS SiNumeroCuentaPago FROM DCXC;

ALTER TABLE CConsumo ADD uf_ExpedicionCXC Int;