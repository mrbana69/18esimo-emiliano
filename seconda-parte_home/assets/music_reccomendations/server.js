require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configurazione nodemailer per raccomandazioni musicali
app.post('/submit-recommendation', (req, res) => {
    const { songTitle, artistName, songUrl } = req.body;

    console.log('Ricevuta raccomandazione:', { songTitle, artistName, songUrl });

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
            console.error('Errore nell\'invio dell\'email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email inviata:', info.response);
        res.status(200).json({ message: 'Recommendation submitted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
