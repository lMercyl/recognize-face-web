// Загрузка моделей Face-api.js
async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    console.log("Модели загружены");
}

// Настройка видео
async function startVideo() {
    const video = document.getElementById('videoInput');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
    } catch (err) {
        console.error("Ошибка доступа к камере", err);
    }
}

// Распознавание лиц
async function detectFaces() {
    const video = document.getElementById('videoInput');
    const canvas = document.getElementById('overlay');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const detections = await faceapi.detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

    context.clearRect(0, 0, canvas.width, canvas.height);

    if (detections.length > 0) {
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceLandmarks(canvas, detections);
    }

    requestAnimationFrame(detectFaces);
}

// Основная функция
document.addEventListener('DOMContentLoaded', async () => {
    await loadModels(); // Загружаем модели Face-api.js
    await startVideo(); // Включаем видеопоток
    detectFaces(); // Запускаем распознавание
});
