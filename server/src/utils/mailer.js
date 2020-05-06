const {google} = require('googleapis');
const path = require('path');
const https = require('https');
const fs = require('fs');
const qs = require('querystring');


const scopes = [
    'https://mail.google.com/',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.compose',
    'https://www.googleapis.com/auth/gmail.send',
];

class Mailer {
    constructor() {
        const keyPath = path.join(__dirname, '../../oauth2.keys.json');
        if (fs.existsSync(keyPath)) {
            const keyFile = require(keyPath);
            this.keys = keyFile.installed || keyFile.web;
        }

        this.oAuth2Client = new google.auth.OAuth2(
            this.keys.client_id,
            this.keys.client_secret,
        );

        this.tokens = null;
    }

    async getAuthToken() {
        if (!this.tokens) { // TODO check expiration
            const options = {
                'method': 'POST',
                'hostname': 'oauth2.googleapis.com',
                'path': '/token',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                'maxRedirects': 20
            };

            const postData = qs.stringify({
                client_id: this.keys.client_id,
                client_secret: this.keys.client_secret,
                grant_type: 'refresh_token',
                refresh_token: process.env.GMAIL_REFRESH_TOKEN
            });

            this.tokens = await new Promise((resolve, reject) => {
                const req = https.request(options, function (res) {
                    const chunks = [];

                    res.on("data", chunk => chunks.push(chunk));

                    res.on("end", function (chunk) {
                        const data = Buffer.concat(chunks).toString();
                        resolve(JSON.parse(data));
                    });

                    res.on("error", error => console.error(error));
                });

                req.write(postData);
                req.end();
            });
        }
        return this.tokens;
    }

    async init() {
        // get authToken
        this.oAuth2Client.credentials = await this.getAuthToken();

        this.gmail = google.gmail({
            version: 'v1',
            auth: this.oAuth2Client,
        });
    }

    async sendMail(to, subject, body) {
        // You can use UTF-8 encoding for the subject using the method below.
        // You can also just use a plain string if you don't need anything fancy.
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            'From: Medical.Net <md.medical.net@gmail.com>',
            `To: <${to}>`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${utf8Subject}`,
            '',
            body,
        ];
        const message = messageParts.join('\n');

        // The body needs to be base64url encoded.
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const res = await this.gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        return res.data;
    }
}

module.exports = {Mailer};
