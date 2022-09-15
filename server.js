const express = require('express');
const path = require('path');
const fs = require('fs');

//From the helpers folder this is to create unique Ids.
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

//Middleware for parsing application/jso and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//Get request for notes
// Read the db.json file and return all saved not as JSON
app.get('/api/notes', (req, res) => {
      
    //Read db.json file and return all saved notes as JSON. Return the contents of 'db.json' as a string in the variable "data".
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
          let parsedNotes = JSON.parse(data);
          res.json(parsedNotes);
        }
        return
    })
});

// Post request 
// Get a new note to save on the request body.
// Add note to the db.json file and return new note.
app.post('/api/notes', (req, res) => {

    let getNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    
        //Variable for the object that will be saved in the request body
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uuid(),
        };
        console.log(newNote);

              //Add a new note 
              getNotes.push(newNote);
             
              //Write updated notes back to the file
              fs.writeFileSync (
                './db/db.json',
                JSON.stringify(getNotes, null, 4));
                res.json(getNotes);
     
});

// Get a query parameter containg the id of a note to delete.
// Read all notes from the db.json file.
// Remove the note with the given id property.
// Rewrite the notes to the db.json
app.delete('/api/notes/:id', (req, res) => {

    console.info(`${req.method} request received to delete a note`);
    
    let getNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    let noteId = req.params.id;
   
    let noteIndex = getNotes.findIndex((note) => note.noteId === noteId);
   
    let deletedNote = getNotes.splice(noteIndex, 1);

    res.send(deletedNote);

    fs.writeFileSync (
        './db/db.json',
        JSON.stringify(getNotes, null, 4));
        res.json(getNotes);   
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


//Listening to the port
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);