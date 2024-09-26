const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Naming the uploaded file
    }
});

// Initialize upload
const upload = multer({ storage: storage });

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index-update.html');
});

// Handle file upload POST request
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.send('File uploaded successfully.');
    } else {
        res.send('File upload failed.');
    }
});

// Handle audio upload POST request
app.post('/upload-audio', upload.single('audio'), (req, res) => {
    if (req.file) {
        res.send('Audio uploaded successfully.');
    } else {
        res.status(400).send('Audio upload failed.');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
