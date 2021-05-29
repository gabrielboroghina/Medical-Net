const nodemailer = require('nodemailer');

class Mailer {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendMail(to, subject, body) {
        console.log("Sending mail to", to, subject);

        this.transporter.sendMail({
            from: 'monitor@medicalnet.com',
            to: to,
            subject: subject,
            text: body,
            html: body
        }).then(info => {
            console.log({info});
        }).catch(console.error);
    }
}

module.exports = {Mailer};
