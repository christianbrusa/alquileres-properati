const cheerio = require("cheerio");
const request = require("request-promise");

async function scrap() {

    for (let i = 1; i < 5; i++) {

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

            let obj = {
                direccion: titulo.split("Departamento en alquiler en ")[1],
                barrio,
                precio,
                expensas: expensas !== "" ? expensas : "No tiene",
                detalles: {
                    ambientes: ambientes !== "" ? ambientes.split(" ambientes")[0] : "No detalla",
                    m2,
                    banios: banios[0]
                },
                inmobiliaria
            };
            console.log(obj);
        });
    }

}

scrap();