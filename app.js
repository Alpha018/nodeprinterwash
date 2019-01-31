/**
 * Created by Tomás on 26-01-2019.
 */
'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const printer = require("node-thermal-printer");

const app = express();

app.use(cors());

printer.init({
    type: printer.printerTypes.EPSON,
    interface: '/dev/usb/lp0',
    characterSet: 'SLOVENIA',
    removeSpecialCharacters: true,
    replaceSpecialCharacters: true,
    extraSpecialCharacters: {'@': 40}
});

printer.isPrinterConnected(function (isConnected) {
    if (isConnected) {
        printer.alignCenter();
        printer.printImage(`${__dirname}/assets/logo.png`, function (done) {
            printer.bold(true);
            printer.alignCenter();
            printer.println('LAVANDERÍA');
            printer.println('THE WASH HOUSE');
            printer.println('ROSA MARÍA HERRERA CAAMAÑO');
            printer.println('Vicuña Maquena 2885 - Calama');
            printer.println('F: 84120496 - 552340966');
            printer.println('lavanderiamathewashhouse@gmail.com');

            printer.drawLine();
            printer.alignRight();
            printer.println('N ORDEN DE TRABAJO');
            printer.bold(false);
            printer.println('9999');
            printer.println(' ');


            printer.alignCenter();
            printer.leftRight('Fecha Recepción', '13/04/1995');
            printer.leftRight('Fecha Entrega', '13/04/1995');
            printer.println(' ');


            printer.alignLeft();
            printer.bold(true);
            printer.println('NOMBRE EMPRESA');
            printer.bold(false);
            printer.println('SODIRED');
            printer.bold(true);
            printer.println(' ');
            printer.println('DIRECCIÓN');
            printer.bold(false);
            printer.println('MI CASA, 4703, ANTOFAGASTA'.toUpperCase());


            printer.println(' ');
            printer.leftRight('DESPACHO DOMICILIO', 'SI');
            printer.drawLine();
            printer.tableCustom([
                {text: "CANT", align: "LEFT", width: 0.3, bold: true},
                {text: "PRENDA", align: "CENTER", width: 0.3, bold: true},
                {text: "VALOR", align: "RIGHT", width: 0.3, bold: true}
            ]);

            const table = [
                {text: "10", align: "LEFT", width: 0.3},
                {text: "PRENDA1", align: "CENTER", width: 0.3},
                {text: "1000", align: "RIGHT", width: 0.3},
            ];
            printer.tableCustom(table);

            const table2 = [
                {text: "20", align: "LEFT", width: 0.3},
                {text: "PRENDA2", align: "CENTER", width: 0.3},
                {text: "3000", align: "RIGHT", width: 0.3},
            ];
            printer.tableCustom(table2);

            printer.tableCustom([
                {text: 'TOTAL', align: "CENTER", width: 0.3, bold: true},
                {text: '4000', align: "RIGHT", width: 0.3}
            ]);

            printer.drawLine();
            printer.alignLeft();
            printer.bold(true);
            printer.print('NOTA: ');
            printer.bold(false);
            printer.println('Después de 30 días no se responde por trabajos no retirados\n');


            printer.alignCenter();
            printer.bold(true);
            printer.println('Sistema Control y Gestión de Lavandería');
            printer.println('Sodired E.I.R.L - www.sodired.cl');
            printer.println('56963424158 - contacto@sodired.cl');
            printer.cut();
            printer.execute(function (err) {
                if (err) {
                    console.log('print error: ' + err);
                } else {
                    console.log('print DONE!!');
                }
            })
        });

    } else {
        console.log('no conectado');
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Allow', 'GET, POST, OPTION, PUT, DELETE');

    next();
});

//middleware bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/print', (req, res) => {
    const params = req.body;

    printer.isPrinterConnected(function (isConnected) {
        if (!isConnected) {
            res.status(500).send({
                desc: 'Error con la impresora'
            });
            return;
        }
        printer.printImage('./assets/logo.png', function (done) {
            printer.bold(true);
            printer.alignCenter();
            printer.print(`
            LAVANDERÍA\n
            "THE WASH HOUSE"\n
            ROSA MARÍA HERRERA CAAMAÑO\n
            Vicuña Maquena 2885 - Calama\n
            F: 84120496 - 552340966\n
            lavanderiamathewashhouse@gmail.com\n
            `);


            printer.alignRight();
            printer.println(`N° ORDEN DE TRABAJO`);
            printer.bold(false);
            printer.println(params.orden);


            printer.alignCenter();
            printer.leftRight('Fecha Recepción', params.fechaRecepcion);
            printer.leftRight('Fecha Entrega', params.fechaEntrega);


            printer.alignLeft();
            printer.bold(true);
            printer.println('NOMBRE EMPRESA');
            printer.bold(false);
            printer.println(params.empresa.nombre.toUpperCase());
            printer.bold(true);
            printer.println('DIRECCIÓN');
            printer.bold(false);
            printer.println(params.empresa.direccion.toUpperCase());

            printer.alignCenter();
            let text = 'NO';
            if (params.delivery) {
                text = 'SI'
            } else {
                text = 'NO'
            }
            printer.leftRight('¿DESPACHO DOMICILIO?', text);
            printer.tableCustom([
                {text: "CANT", align: "LEFT", width: 0.5, bold: true},
                {text: "PRENDA", align: "CENTER", width: 0.5, bold: true},
                {text: "VALOR", align: "RIGHT", width: 0.5, bold: true}
            ]);
            for (let i = 0; i < params.prendas.length; i++) {
                printer.tableCustom([
                    {text: params.prendas[i].cant, align: "LEFT", width: 0.5},
                    {text: params.prendas[i].prenda, align: "CENTER", width: 0.5},
                    {text: params.prendas[i].valor, align: "RIGHT", width: 0.5}
                ]);
            }
            printer.tableCustom([
                {text: 'TOTAL', align: "CENTER", width: 0.5},
                {text: params.total, align: "RIGHT", width: 0.5}
            ]);


            printer.alignLeft();
            printer.bold(true);
            printer.print('NOTA: ');
            printer.bold(false);
            printer.println('Después de 30 días no se responde por trabajos no retirados');


            printer.alignCenter();
            printer.bold(true);
            printer.println('Sistema Control y Gestión de Lavandería');
            printer.println('Sodired E.I.R.L - www.sodired.cl');
            printer.println('56963424158 - contacto@sodired.cl');
            printer.cut();

            printer.execute(function (err) {
                if (err) {
                    console.log('print error: ' + err);
                    res.status(500).send({
                        desc: 'Printer Error',
                        err: err.message
                    })
                } else {
                    console.log('print DONE!!');
                    res.status(200).send({
                        desc: 'Printer done!'
                    })
                }
            })

        });
    })
});

//rutas body-parser
module.exports = app;
