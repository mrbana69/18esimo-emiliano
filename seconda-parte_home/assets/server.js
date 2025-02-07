const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const app = express();
app.use(bodyParser.json());

const pusher = new Pusher({
    appId: '1938373',
    key: 'e242d122715c9ce4d6a3',
    secret: '5538f846e5a04f621e87',
    cluster: 'eu',
    useTLS: true
});

app.post('/messages', (req, res) => {
    const { message } = req.body;
    pusher.trigger('chat', 'message', {
        username: 'User', // Puoi sostituire con il nome utente reale
        message: message
    });
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
