const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//API routes
app.get('/api/notes', (req, res) => {
    
    res.json(`${req.method} request received to get notes`)
    
    console.info(`${req.method} request received to get reviews`)
    
    //Read db.json file and return all saved notes as JSON.
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          res.json(parsedNotes);
        }
        return
    })
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});


//Listening to the port
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);