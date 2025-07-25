<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xs="http://www.w3.org/2001/XMLSchema"
    exclude-result-prefixes="xs" version="2.0">
    <xsl:template match="/">
        <fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format">
            <fo:layout-master-set>
                <fo:simple-page-master master-name="simple" page-height="21cm" page-width="29.7cm"
                    margin-top="0.5cm" margin-bottom="1cm" margin-left="0.5cm"
                    margin-right="0.5cm">
                    <fo:region-body margin-top="2.5cm" margin-bottom="1cm"/>
                    <fo:region-before extent="1.5cm"/>
                    <fo:region-after extent="0.5cm"/>
                </fo:simple-page-master>
            </fo:layout-master-set>

            <fo:page-sequence master-reference="simple" font-size="7pt">
                <fo:static-content flow-name="xsl-region-before">

                    <fo:table>
                        <fo:table-column column-width="10cm"/>
                        <fo:table-column column-width="10cm"/>

                        <fo:table-body>
                            <fo:table-row>
                                <fo:table-cell number-columns-spanned="2" font-size="12pt"
                                    text-align="center">
                                    <fo:block>
                                        <xsl:value-of select="Reporte/Cabecera/Datos/Nombre"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                            <fo:table-row>
                                <fo:table-cell number-columns-spanned="2" font-size="11pt"
                                    text-align="center">
                                    <fo:block>
                                        <xsl:value-of select="Reporte/Cabecera/Datos/RFC"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                            <fo:table-row>
                                <fo:table-cell number-columns-spanned="2" font-size="11pt"
                                    text-align="center">
                                    <fo:block>
                                        <xsl:value-of select="Reporte/Cabecera/Datos/Direccion"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                            <fo:table-row>
                                <fo:table-cell font-size="10pt">
                                    <fo:block> Fecha de generación de reporte: <xsl:value-of
                                            select="Reporte/Cabecera/Datos/FechaActual"/>
                                    </fo:block>
                                </fo:table-cell>
                                <fo:table-cell font-size="10pt">
                                    <fo:block> Hora de generación de reporte: <xsl:value-of
                                            select="Reporte/Cabecera/Datos/HoraActual"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                            <fo:table-row>
                                <fo:table-cell font-size="10pt">
                                    <fo:block> Usuario: <xsl:value-of
                                            select="Reporte/Cabecera/Datos/Usuario"/>
                                    </fo:block>
                                </fo:table-cell>
                                <fo:table-cell font-size="10pt">
                                    <fo:block> Fecha seleccionada: <xsl:value-of
                                            select="Reporte/Cabecera/Datos/FechaSel"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>
                            <fo:table-row>


                                <fo:table-cell font-size="10pt">
                                    <fo:block> Turno: <xsl:value-of
                                            select="Reporte/Cabecera/Datos/Turno"/>
                                    </fo:block>
                                </fo:table-cell>
                            </fo:table-row>

                        </fo:table-body>
                    </fo:table>

                </fo:static-content>
                <fo:static-content flow-name="xsl-region-after">
                    <fo:block>
                        <fo:page-number/> / <fo:page-number-citation ref-id="UltimaPagina"/>
                    </fo:block>
                </fo:static-content>
                <fo:flow flow-name="xsl-region-body">
                    <xsl:apply-templates/>
                </fo:flow>
            </fo:page-sequence>
        </fo:root>
    </xsl:template>

    <xsl:decimal-format name="pesos" decimal-separator="." grouping-separator=","/>

    <xsl:template match="Reporte">
        
        <fo:block width="29.7cm" height="1cm" background-color="#000" color="white" font-weight="bold" font-size="10pt" border="0.01cm black solid" margin-top="0.2cm" text-align="center">Reporte de sesiones de venta por turno</fo:block>


        <fo:table border-collapse="separate" border-width="5mm" padding-top="0.5cm"
            padding-bottom="0.5cm">
            <fo:table-column column-width="3cm" border="solid" border-color="black"
                border-width="1mm"/>
            <fo:table-column column-width="7cm"/>
            <fo:table-column column-width="2cm"/>
            <fo:table-column column-width="2cm"/>
            <fo:table-column column-width="2cm"/>
            <fo:table-column column-width="2.5cm"/>
            <fo:table-column column-width="2.5cm"/>
            <fo:table-column column-width="2.5cm"/>
            <fo:table-column column-width="2.5cm"/>
            <fo:table-column column-width="2.5cm"/>
            <fo:table-header>
                <fo:table-row>
                    <fo:table-cell>
                        <fo:block> </fo:block>
                    </fo:table-cell>
                    <fo:table-cell>
                        <fo:block> </fo:block>
                    </fo:table-cell>
                    <fo:table-cell text-align="center" number-columns-spanned="4" border="solid"
                        border-color="black" border-width="0.1mm">
                        <fo:block font-size="8pt" font-weight="bold">Tipo de venta</fo:block>
                    </fo:table-cell>
                </fo:table-row>
                <fo:table-row>
                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block> Punto de venta </fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block> Cajero </fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Venta propia</fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Estacionamiento</fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Tiempo aire</fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Tarjetas telefónicas</fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Total de venta</fo:block>
                    </fo:table-cell>

                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Efectivo entregado</fo:block>
                    </fo:table-cell>
                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Sobrante</fo:block>
                    </fo:table-cell>
                    <fo:table-cell border="solid" border-color="black" border-width="0.1mm">
                        <fo:block>Faltante</fo:block>
                    </fo:table-cell>
                </fo:table-row>
            </fo:table-header>
            <fo:table-body>

                <!--  ITERAR PUNTOS DE VENTA -->
                <xsl:for-each select="PuntoVenta">
                    <fo:table-row>
                        <fo:table-cell>
                            <fo:block>
                                <xsl:value-of select="puntovta"/>
                            </fo:block>
                        </fo:table-cell>
                    </fo:table-row>
                    <!-- ITERAR CAJEROS DEL PUNTO DE VENTA -->
                    <xsl:for-each select="Cajero">
                        <fo:table-row>
                            <fo:table-cell >
                                <fo:block/>
                            </fo:table-cell>

                            <fo:table-cell>
                                <fo:block>
                                    <!--<xsl:value-of select="NombreCajero"/> [<xsl:value-of select="HoraApertura"/>] [<xsl:value-of select="HoraCierre"/>] Corte: <xsl:value-of select="Corte"/>-->
                                    <xsl:value-of select="cajero"/> Corte: <xsl:value-of
                                        select="corte"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(VentaPropia), '###,##0.00' )" />
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(Estacionamiento), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(TA), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(Recargas), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(TotalVenta), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>
                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(EfectivoX), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(Sobrante), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                            <fo:table-cell text-align="right">
                                <fo:block>
                                    $ <xsl:value-of select="format-number(number(Faltante), '###,##0.00' )"/>
                                </fo:block>
                            </fo:table-cell>

                        </fo:table-row>
                    </xsl:for-each>
                    <!-- FIN ITERAR CAJEROS DEL PUNTO DE VENTA -->
                    <fo:table-row>
                        <fo:table-cell text-align="right">
                            <fo:block font-weight="bold">Totales</fo:block>
                        </fo:table-cell>

                        <fo:table-cell text-align="right">
                            <fo:block><xsl:value-of select="SSesiones"></xsl:value-of></fo:block>
                        </fo:table-cell>

                        <fo:table-cell text-align="right">
                            <fo:block font-weight="bold">
                                $ <xsl:value-of select="format-number(number(SVentaPropia), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell text-align="right">
                            <fo:block font-weight="bold">
                                $ <xsl:value-of select="format-number(number(SEstacionamiento), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell text-align="right">
                            <fo:block font-weight="bold">
                                $ <xsl:value-of select="format-number(number(STA), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell text-align="right">
                            <fo:block font-weight="bold">
                                $ <xsl:value-of select="format-number(number(SRecargas), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell font-weight="bold" text-align="right">
                            <fo:block>
                                $ <xsl:value-of select="format-number(number(STotalVenta), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell font-weight="bold" text-align="right">
                            <fo:block>
                                $ <xsl:value-of select="format-number(number(SEfectivoX), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell font-weight="bold" text-align="right">
                            <fo:block>
                              $ <xsl:value-of select="format-number(number(SSobrante), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                        <fo:table-cell font-weight="bold" text-align="right">
                            <fo:block>
                                $ <xsl:value-of select="format-number(number(SFaltante), '###,##0.00' )"/>
                            </fo:block>
                        </fo:table-cell>

                    </fo:table-row>
                </xsl:for-each>
                <!-- FIN ITERAR PUNTOS DE VENTA -->
                <fo:table-row>
                    <fo:table-cell>
                        <fo:block>
                            <fo:leader/>
                        </fo:block>
                    </fo:table-cell>
                </fo:table-row>

                <fo:table-row>
                    <fo:table-cell font-weight="bold">
                        <fo:block>Gran total</fo:block>
                    </fo:table-cell>

                    <fo:table-cell>
                        <fo:block/>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                          $ <xsl:value-of select="format-number(number(SumVentaPropia), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                           $ <xsl:value-of select="format-number(number(SumEstacionamiento), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                          $ <xsl:value-of select="format-number(number(SumTA), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                            $ <xsl:value-of select="format-number(number(SumRecargas), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                           $ <xsl:value-of select="format-number(number(SumTotalVenta), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                            $ <xsl:value-of select="format-number(number(SumEfectivoX), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                            $  <xsl:value-of select="format-number(number(SumSobrante), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>

                    <fo:table-cell font-weight="bold" text-align="right">
                        <fo:block>
                            $  <xsl:value-of select="format-number(number(SumFaltante), '###,##0.00' )"/>
                        </fo:block>
                    </fo:table-cell>
                </fo:table-row>
            </fo:table-body>
        </fo:table>
        <fo:block id="UltimaPagina"> </fo:block>
    </xsl:template>
</xsl:stylesheet>
