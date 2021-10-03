/** 
 * 1. Usar el paquete nodemailer para el envío de correos electrónicos.
 */
const nodemailer = require('nodemailer')

const http = require('http')
const fs = require('fs')
const url = require('url')
const axios = require("axios");


/** 
2. Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta
función debe retornar una promesa.
 */
async function enviar(to, subject, text) {
    console.log("inicio de envio de correo");
    let tecto = await consulta();
    console.log(tecto);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodemailerclase2021@gmail.com',
            pass: 'pelado2021',
        },
    })
    // Paso 3
    let mailOptions = {
        from: 'nodemailerclase2021@gmail.com',
        to,
        subject,
        text: text + tecto,
    }
    // Paso 4
    transporter.sendMail(mailOptions, (err, data) => {
        // Paso 5
        if (err) console.log(err)
        if (data) console.log(data)
        console.log(mailOptions);

    })

}


http
    .createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('index.html', 'utf8', (err, data) => {
            res.end(data);
        })

        console.log(req.url.startsWith('/mailing.js'))
        let { correos, asunto, contenido } = url.parse(req.url, true).query
        if (req.url.startsWith('/mailing.js')) {

            console.log("entramos en mailing.js");
            enviar(correos, asunto, contenido);

        }



    })
    .listen(5500, () => console.log('Servidor encendido'))







/**
3. Realizar una petición a la api de mindicador.cl y preparar un template que incluya los
valores del dólar, euro, uf y utm. Este template debe ser concatenado al mensaje
descrito por el usuario en el formulario HTML.
*/

function consulta() {
    axios
        .get("https://mindicador.cl/api")
        .then((datos) => {
            const indicadores = datos.data;

            let template =
                `
El valor del Dolar el dia de hoy es: ${indicadores.dolar.valor} <br>
El valor del euro el dia de hoy es: ${indicadores.euro.valor} <br>
El valor del uf el dia de hoy es: ${indicadores.uf.valor} <br>
El valor del utm el dia de hoy es: ${indicadores.utm.valor} <br>
`;
      //      console.log(template);
            return template;
        })
        .catch((e) => {
            console.log(e.message);
        });
}



/**
4. Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.
*/

/**
5. Cada correo debe ser almacenado como un archivo con un nombre identificador
único en una carpeta “correos”. Usar el paquete UUID para esto.
 */