const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

app.post('/submit-recommendation', (req, res) => {
    const { songTitle, artistName, songUrl } = req.body;

    // Configura il trasportatore di nodemailer con le credenziali di Brevo
    const transporter = nodemailer.createTransport({
        service: 'SendinBlue', // Brevo è precedentemente conosciuto come SendinBlue
        auth: {
            user: 'your-brevo-email@example.com',
            pass: 'your-brevo-api-key'
        }
    });

    const mailOptions = {
        from: 'your-brevo-email@example.com',
        to: 'your-email@example.com',
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