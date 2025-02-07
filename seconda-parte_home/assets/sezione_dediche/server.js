const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

app.post('/send-dedica', (req, res) => {
    const { dedica } = req.body;

    client.messages.create({
        body: dedica,
        from: 'whatsapp:+14155238886', // Twilio sandbox number
        to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}` // Admin's WhatsApp number
    })
    .then(message => {
        console.log('Messaggio inviato:', message.sid);
        res.status(200).json({ success: true });
    })
    .catch(error => {
        console.error('Errore nell\'invio del messaggio:', error);
        res.status(500).json({ success: false });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
