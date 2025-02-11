import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import feedback from './feedback_mock.json' with {type:'json'}
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

app.use(express.json());


// POST:n body:n lukeminen lomakedatalla
app.use(express.urlencoded({ extended: true }));

//apufunktio
const newId=()=>{
    let max=0;

    for(let palaute of feedback){
        if (palaute.id>max)
            max =palaute.id;
    }

    return max +1;


}

// TODO tähän tulevat polut
// REST-palvelimen polut
app.get('/palaute/', (req, res) => {
    res.json(feedback);
});
app.get('/palaute/:id', (req, res) => {
    const haettu= req.params.id;
    const tulos = feedback.filter((palaute) => palaute.id === haettu);
    res.json(tulos);
});


app.post('/palaute/uusi', (req, res) => {
    // Lisää uuden palautteen. Palaute pyynnön body:ssä
    const nimi=req.body.name;
    const email=req.body.email;
    const palaute=req.body.feedback;
    console.log(req.body)
    if(!nimi ||!email||!palaute){
        res.status(400);
        res.send('virhe osa tiedostoista puuttuu');
    }
    
    const uusi={
        id:newId(),
        name: nimi,
        email: email,
        feedback: palaute,
    }

    feedback.push(uusi);

    res.status(200).json(uusi);

});
app.put('/palaute/:id', (req, res) => {
    // Muokkaa tietyn palautteen sisältöä. (Miksi tällainen on?)
});
app.delete('/palaute/:id', (req, res) => {
    // Poistaa tietyn palautteen. (Miksi tällainen on?)
});

app.post('/palautelomake', (req, res) => {
    res.render('palaute');
})

app.post('/palautelomake', (req, res) => {
    res.render('palaute');
})



app.listen(port, host, () => console.log( `${host}:${port} kuuntelee...`));