import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nbs from 'nodemailer-express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config(); 

const sendEmail = (email, subject, civility, lastname, text, link, contactToken, campaignToken) => {
    // create settings
    const transporter = nodemailer.createTransport(
        {
            secureConnection: false,
            host: process.env.SMTP,
            port: process.env.PORT_SMTP,
            tls: {
                ciphers: 'SSLv3'
            },
            auth: {
                user: process.env.ADDRESS_EMAIL,
                pass: process.env.PASS_EMAIL
            }
        }
    );

    // settings for handlebars
    transporter.use('compile', nbs(
        {
            viewEngine: {
                extName: '.html',
                partialsDir: './app/views/',
                defaultLayout: false
            },
            viewPath: './app/views/',
            extName: '.handlebars'
        }
    ))

    // Email option
    const options = {
        from: process.ADDRESS_EMAIL,
        to: `${email}`,
        template: 'email',
        subject: `${subject}`,
        context: {
            contactToken: `${contactToken}`,
            campaignToken: `${campaignToken}`,
            subject: `${subject}`,
            civility: `${civility}`,
            lastname: `${lastname}`,
            text: `${text}`,
            link: `${link}`,
            pixelImage: `${process.env.URL_SERVER}:${process.env.PORT}/api/tracker/${contactToken}/${campaignToken}/cid:pixel`,
            image: `cid:image`,
            logoFacebook: `cid:picto_linkedn_W`,
            logoTwitter: `cid:picto_facebook_W`,
            logoLinkedn: `cid:picto_twitter_W`,
            namebusiness: `O'clock`,
            address: `10 rue de Penthievre`,
            zip: `75008`,
            city: `Paris`,
            unsubscribeText: `Pour vous désinscrire, `,
            unsubscribeTextLink: `cliquez ici`,
        },
        attachments: [
            {
                filename: 'pixel.png',
                path: __dirname + '/images/pixel.png',
                cid: 'pixel'
            },
            {
                filename: `${process.env.IMG_NAME}`,
                path: __dirname + `${process.env.IMG_PATH}`,
                cid: 'image'
            },
            {
                filename: 'picto_linkedn_W.png',
                path: __dirname + '/images/picto_linkedn_W.png',
                cid: 'picto_linkedn_W'
            },
            {
                filename: 'picto_facebook_W.png',
                path: __dirname + '/images/picto_facebook_W.png',
                cid: 'picto_facebook_W'
            },
            {
                filename: 'picto_twitter_W.png',
                path: __dirname + '/images/picto_twitter_W.png',
                cid: 'picto_twitter_W'
            }
        ]
    };

    // envoi email
    transporter.sendMail(options, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${email} - ${subject}`);
        }
    });
}
export default sendEmail;