const recordButton = document.getElementById('recordButton');
const stopButton = document.getElementById('stopButton');
const recordingStatus = document.getElementById('recordingStatus');
const playbackSection = document.getElementById('playbackSection');
const audioPlayer = document.getElementById('audioPlayer');
const audioSource = document.getElementById('audioSource');
const audioGif = document.getElementById('audioGif');

let mediaRecorder;
let audioChunks = [];

// Start Recording
recordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    recordingStatus.textContent = "Recording...";
    recordButton.disabled = true;
    stopButton.disabled = false;
    stopButton.classList.remove('disabled');

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
});

// Stop Recording and Playback
stopButton.addEventListener('click', () => {
    mediaRecorder.stop();
    recordingStatus.textContent = "Stopped recording.";
    recordButton.disabled = false;
    stopButton.disabled = true;
    stopButton.classList.add('disabled');

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioSource.src = audioUrl;
        playbackSection.style.display = "block";
        audioPlayer.load();
        audioChunks = [];
    };
});

// Play/Pause Animation
audioPlayer.addEventListener('play', () => {
    audioGif.classList.remove('paused');
});

audioPlayer.addEventListener('pause', () => {
    audioGif.classList.add('paused');
});