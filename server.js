import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const host = 'localhost';
const port = 3000;

const app = express();

// Otetaan käyttöön EJS-moottori
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));


app.use('/tyylit', express.static('includes/styles'));
app.use('/images', express.static('includes/images'));


// Staattiset tiedostot
app.use('/styles', express.static('includes/styles'));

// POST:n body:n lukeminen lomakedatalla
app.use(express.urlencoded({ extended: true }));


// TODO tähän tulevat polut



app.get('/palaute', (req, res) => {
    res.render('palaute');
})

app.post('/palaute', (req, res) => {
    const nimi = req.body.nimi;
    const email = req.body.email;
    const palaute = req.body.palaute;
    
    // Luetaan nykyinen data.json
    const dataPolku = path.join(__dirname, 'templates', 'data.json');
    const data = JSON.parse(fs.readFileSync(dataPolku, 'utf8'));
    
    // Lisätään uusi palaute
    data.palautteet.push({
        nimi: nimi,
        email: email,
        palaute: palaute,
    });
    
    // Tallennetaan päivitetty data
    fs.writeFileSync(dataPolku, JSON.stringify(data, null, 2));
    
    res.send(`Kiitos palautteestasi, ${nimi}! Otamme sinuun tarvittaessa yhteyttä sähköpostitse osoitteeseen ${email}.`);
});

app.listen(port, host, () => console.log( `${host}:${port} kuuntelee...`));