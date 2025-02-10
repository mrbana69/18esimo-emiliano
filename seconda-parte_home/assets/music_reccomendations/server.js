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
