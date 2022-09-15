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
    
    // res.json(`${req.method} request received to get notes`)
    
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

// Post 
app.post('/api/notes', (req, res) => {
    const {note, title, id} = req.body;
    
    //If all the required propeties are present
    if (note && title && id) {
        //Variable for the object we will save
        const newNote = {
            note,
            title,
            note_id: uuid(),
        };

        // Obtain exsiting notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                //Convert string into JSON object
              const parsedNotes = JSON.parse(data);

              //Add a new note
              parsedNotes.push(newNote);
             
              //Write updated notes back to the file
              fs.writeFile (
                './db/db.json',
                JSON.stringify(parsedNotes, null, 3),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        :console.info('Successfully update notes')
              );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in saving note')
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});


//Listening to the port
app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);