require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configurazione Brevo per dediche
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/send-dedica', (req, res) => {
    const { dedica } = req.body;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'Nuova canzone consigliata';
    sendSmtpEmail.htmlContent = `<html><body><p>${dedica}</p></body></html>`;
    sendSmtpEmail.sender = { name: 'Nuova Canzone', email: process.env.SENDER_EMAIL };
    sendSmtpEmail.to = [{ email: process.env.ADMIN_EMAIL }];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(data => {
        console.log('Email inviata:', data);
        res.status(200).json({ success: true });
    }).catch(error => {
        console.error('Errore nell\'invio dell\'email:', error);
        res.status(500).json({ success: false });
    });
});

// Configurazione nodemailer per raccomandazioni musicali
app.post('/submit-recommendation', (req, res) => {
    const { songTitle, artistName, songUrl } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'SendinBlue', // Brevo è precedentemente conosciuto come SendinBlue
        auth: {
            user: process.env.BREVO_EMAIL,
            pass: process.env.BREVO_API_KEY
        }
    });

    const mailOptions = {
        from: process.env.BREVO_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Song Recommendation',
        text: `Song Title: ${songTitle}\nArtist Name: ${artistName}\nSong URL: ${songUrl}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Recommendation submitted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
