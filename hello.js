const express = require('express');
const multer = require('multer');
const path = require('path');

const fs = require('fs');
const { exec } = require('child_process');


const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, "TEST" + path.extname(file.originalname)); // Naming the uploaded file
    }
});


// Function to execute the Python script
function executePythonScript(audioPath, textPath, callback) {
    const scriptPath = '/Users/naveenkumar/Documents/test/script.py'; // Replace with the actual path to your Python script

    // Execute the Python script and pass the file paths as arguments
    exec(`python3 ${scriptPath} ${audioPath} ${textPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${stderr}`);
            return callback(error);
        }
        console.log(`Python script output: ${stdout}`);
        callback(null); // No error
    });
}






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


app.post('/upload-audio', upload.single('audio'), (req, res) => {
    const userMessage = req.body.message; // Get the user message

    const textFilePath = path.join(__dirname, 'uploads', `Message.txt`);
    fs.writeFile(textFilePath, userMessage, (err) => {
        if (err) {
            console.error('Error saving message:', err);
            return res.status(500).send('Error saving message');
        }

       
        const audioFilePath = "/Users/naveenkumar/Documents/Node js/Hello World/uploads/TEST.wav";
        executePythonScript(audioFilePath, textFilePath, (error) => {
            if (error) {
                console.error('Error executing Python script:', error);
                return res.status(500).send('Error executing Python script');
            }

            return res.send('Audio and message uploaded successfully, and Python script executed.');
        });
    });


    // if (req.file) {
    //     res.send('Audio uploaded successfully Message : ' + message);
    // } else {
    //     res.status(400).send('Audio upload failed.');
    // }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
