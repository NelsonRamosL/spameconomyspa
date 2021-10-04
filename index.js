/** 
 * 1. Usar el paquete nodemailer para el envío de correos electrónicos.
 */
const nodemailer = require('nodemailer')

const http = require('http')
const fs = require('fs')
const url = require('url')
const axios = require("axios");
const { v4: uuidv4 } = require('uuid')

/** 
2. Crear una función que reciba la lista de correos, asunto y contenido a enviar. Esta
función debe retornar una promesa.
 */
async function enviar(to, subject, textt) {
    console.log("inicio de envio de correo");
  
    let template = await consulta(); // trae el template

    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nodemailerclase2021@gmail.com',
            pass: 'pelado2021',
        },
    })
 
    let mailOptions = {
        from: 'nodemailerclase2021@gmail.com',
        to,
        subject,
        text: `${textt} ${template}`
    }
 
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) console.log(err)
        if (data) {


/**
5. Cada correo debe ser almacenado como un archivo con un nombre identificador
único en una carpeta “correos”. Usar el paquete UUID para esto.
*/
            let id =uuidv4().slice(0,6);
           
            let datosGuardar = {
                id,
                ...mailOptions
            }
            fs.writeFileSync(`./correos/${id}.json`, JSON.stringify(datosGuardar));

            console.log(datosGuardar);
          
        }

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

async function consulta() {
const {data} = await axios.get("https://mindicador.cl/api")

   let template =`

Hola Los indicadores economicos de hoy son los siguientes 

El valor del Dolar el dia de hoy es: ${data.dolar.valor} 
El valor del euro el dia de hoy es: ${data.euro.valor}
El valor del uf el dia de hoy es: ${data.uf.valor}
El valor del utm el dia de hoy es: ${data.utm.valor} 
`;

return template;


        }



/**
4. Enviar un mensaje de éxito o error por cada intento de envío de correos electrónicos.
*/

