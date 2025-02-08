const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-entry', (req, res) => {
    const entry = req.body;
    const filePath = path.join(__dirname, 'entries.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Errore nella lettura del file:', err);
            return res.status(500).json({ success: false });
        }

        let entries = [];
        if (data) {
            entries = JSON.parse(data);
        }

        entries.push(entry);

        fs.writeFile(filePath, JSON.stringify(entries, null, 2), (err) => {
            if (err) {
                console.error('Errore nella scrittura del file:', err);
                return res.status(500).json({ success: false });
            }

            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});
