<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
    xmlns="urn:schemas-microsoft-com:office:spreadsheet" exclude-result-prefixes="xs" version="2.0">
    <xsl:template match="/">
        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
            xmlns:html="http://www.w3.org/TR/REC-html40">
            <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
                <Author>Induxsoft Fábrica de Software</Author>
                <Created/>
                <Company>Induxsoft Fábrica de Software</Company>
                <Version>1.0</Version>
            </DocumentProperties>
            <xsl:apply-templates/>
        </Workbook>
    </xsl:template>

    <xsl:template match="Reporte">
        <Styles>
            <Style ss:ID="Header" ss:Name="Header">
                <Alignment ss:Horizontal="Center"/>
                <Font ss:Bold="1"/>
                <Borders>
                    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
                    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
                    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
                    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
                </Borders>
            </Style>
            <Style ss:ID="Moneda">
                <NumberFormat ss:Format="&quot;$&quot;#,##0.00"/>
            </Style>
            <Style ss:ID="Total" ss:Name="Total">
                <Font ss:Bold="1"/>
            </Style>
            <Style ss:ID="HeaderText">
                <Alignment ss:Horizontal="Center"/>
                <Font ss:Bold="1"/>
            </Style>
            <Style ss:ID="ReportTitle">
                <Alignment ss:Horizontal="Center"/>
                <Font ss:Bold="1" ss:Color="#FFFFFF"/>
                <Interior ss:Color="#000000" ss:Pattern="Solid"/> 
            </Style>
        </Styles>
        <Worksheet ss:Name="Reporte">
  
            <Table>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="200"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="100"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="100"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                <Column ss:AutoFitWidth="1" ss:Width="80"/>
                
                <!-- CABECERA -->
                <Row>
                    <Cell ss:StyleID="HeaderText" ss:MergeAcross="9">
                        <Data ss:Type="String">
                            <xsl:value-of select="Cabecera/Datos/Nombre"/>
                        </Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell ss:StyleID="HeaderText" ss:MergeAcross="9">
                        <Data ss:Type="String">
                            <xsl:value-of select="Cabecera/Datos/RFC"/>
                        </Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell ss:StyleID="HeaderText" ss:MergeAcross="9">
                        <Data ss:Type="String">
                            <xsl:value-of select="Cabecera/Datos/Direccion"/>
                        </Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell ss:MergeAcross="9" ss:StyleID="ReportTitle" >
                        <Data ss:Type="String">Reporte de sesiones de venta por turno</Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell >
                        <Data ss:Type="String">Fecha de generación de reporte</Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String"><xsl:value-of select="Cabecera/Datos/FechaActual"></xsl:value-of></Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String">Hora de generación de reporte</Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String"><xsl:value-of select="Cabecera/Datos/HoraActual"></xsl:value-of></Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell >
                        <Data ss:Type="String">Usuario</Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String"><xsl:value-of select="Cabecera/Datos/Usuario"></xsl:value-of></Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String">Fecha seleccionada</Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String"><xsl:value-of select="Cabecera/Datos/FechaSel"></xsl:value-of></Data>
                    </Cell>
                    <Cell>
                        <Data ss:Type="String">Turno</Data>
                    </Cell>
                    <Cell><Data ss:Type="String"><xsl:value-of select="Cabecera/Datos/Turno"></xsl:value-of></Data></Cell>
                </Row>
                <!-- FIN CABECERA -->
                <Row>
                    <Cell/>
                    <Cell/>
                    <Cell ss:StyleID="Header" ss:MergeAcross="3">
                        <Data ss:Type="String">Tipo de venta</Data>
                    </Cell>
                </Row>
                <Row>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Punto de venta</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Cajero</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Propia</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Estacionamiento</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Tiempo aire</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Tarjetas teléfonicas</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Total de venta</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Efectivo entregado</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Sobrante</Data>
                    </Cell>
                    <Cell ss:StyleID="Header">
                        <Data ss:Type="String">Faltante</Data>
                    </Cell>
                </Row>
                <xsl:for-each select="PuntoVenta">
                    <Row>
                        <Cell>
                            <Data ss:Type="String">
                                <xsl:value-of select="puntovta"/>
                            </Data>
                        </Cell>
                    </Row>
                    <xsl:for-each select="Cajero">
                        <Row>
                            <Cell/>
                            <Cell>
                                <!--<Data ss:Type="String"><xsl:value-of select="NombreCajero"/> [<xsl:value-of select="HoraApertura"/>] [<xsl:value-of select="HoraCierre"/>] Corte: <xsl:value-of select="Corte"/></Data>-->
                                <Data ss:Type="String">
                                    <xsl:value-of select="cajero"/> Corte: <xsl:value-of
                                        select="corte"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="VentaPropia"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="Estacionamiento"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="TA"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="Recargas"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="TotalVenta"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="EfectivoX"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="Sobrante"/>
                                </Data>
                            </Cell>

                            <Cell ss:StyleID="Moneda">
                                <Data ss:Type="Number">
                                    <xsl:value-of select="Faltante"/>
                                </Data>
                            </Cell>
                        </Row>
                    </xsl:for-each>

                    <Row>
                        <Cell ss:StyleID="Total">
                            <Data ss:Type="String">Totales</Data>
                        </Cell>

                        <Cell>
                            <Data ss:Type="Number"><xsl:value-of select="SSesiones"></xsl:value-of></Data>
                            </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SVentaPropia"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SEstacionamiento"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="STA"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SRecargas"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="STotalVenta"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SEfectivoX"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SSobrante"/>
                            </Data>
                        </Cell>

                        <Cell ss:StyleID="Moneda">
                            <Data ss:Type="Number">
                                <xsl:value-of select="SFaltante"/>
                            </Data>
                        </Cell>
                    </Row>
                    <Row/>
                </xsl:for-each>
                <Row>
                    <Cell/>
                </Row>
                <Row>
                    <Cell ss:StyleID="Total">
                        <Data ss:Type="String">Gran total</Data>
                    </Cell>

                    <Cell/>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumVentaPropia"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumEstacionamiento"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumTA"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumRecargas"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumTotalVenta"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumEfectivoX"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumSobrante"/>
                        </Data>
                    </Cell>

                    <Cell ss:StyleID="Moneda">
                        <Data ss:Type="Number">
                            <xsl:value-of select="SumFaltante"/>
                        </Data>
                    </Cell>

                </Row>
            </Table>
        </Worksheet>
    </xsl:template>
</xsl:stylesheet>
