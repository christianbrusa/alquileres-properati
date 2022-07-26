const cheerio = require("cheerio");
const request = require("request-promise");
let fs = require('fs');
const _ = require("lodash");

let filename = 'alquileres-prueba-1.csv';

async function scrap() {
    console.time();
    for (let i = 1; i < 30; i++) {

        let $ = await request({
            url: `https://www.properati.com.ar/s/capital-federal/departamento/alquiler?page=${i}`,
            method: "GET",
            transform: body => cheerio.load(body)
        });

        $(".Xbqhe > .comlbB").map((index, el) => {
            let titulo = ($(el).find(".gxrAFy > .jGXOiG > a > h2").text());
            let barrio = ($(el).find(".gxrAFy > .jGXOiG > .dxIVBd").text());
            let precio = ($(el).find(".gxrAFy > .jGXOiG > .ePgXRB > .hQvubf").text());
            let expensas = ($(el).find(".gxrAFy > .jGXOiG > .bVeCwP").text());
            let m2 = ($(el).find(".gxrAFy > .jGXOiG > .iktDEj > .kbmWJE > span:nth-child(3)").text());
            let banios = ($(el).find(".gxrAFy > .jGXOiG > .iktDEj > .kbmWJE > span:nth-child(2)").text());
            let ambientes = ($(el).find(".gxrAFy > .jGXOiG > .iktDEj > .kbmWJE > span:first-child").text());
            let inmobiliaria = ($(el).find(".gxrAFy > .jGXOiG > .iktDEj > .yInXk > span:first-child").text());
            let link = ($(el).find(".gxrAFy > a"));

            let obj = {
                direccion: _.deburr(titulo.split("Departamento en alquiler en ")[1]),
                barrio: _.deburr(barrio.split(",")[0]),
                precio: precio.includes("USD") ? "USD" : (precio.split("$")[1]).trim(),
                expensas: expensas !== "" ? (expensas.split("Expensas")[0].split("$")[1]).trim() : "No tiene",
                detalles: {
                    ambientes: ambientes !== "" ? ambientes.split(" ambientes")[0] : "No detalla",
                    m2,
                    banios: banios[0]
                },
                inmobiliaria: _.deburr(inmobiliaria),
                link: "https://www.properati.com.ar" + link.attr('href')
            };

            let precioFormateado = Number(obj.precio).toFixed(3);
            let expensasFormateada = Number(obj.expensas).toFixed(3);

            let limiteAPagar = 70.000;
            let precioTotal = (parseInt(precioFormateado) + parseInt(expensasFormateada)).toFixed(3);

            obj.precio != "USD" && limiteAPagar >= precioTotal &&
            console.log(obj)
            fs.appendFileSync(filename, `${obj.direccion}, ${obj.barrio}, ${obj.precio}, ${obj.expensas}, ${obj.detalles.ambientes}, ${obj.detalles.m2}, ${obj.detalles.banios}, ${obj.inmobiliaria}, ${obj.link},\n`);
        });
    }
    console.timeEnd();

}

scrap();