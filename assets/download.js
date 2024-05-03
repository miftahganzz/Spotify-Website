let downloadClicked = false;

const fetchButton = document.getElementById('fetchButton');
const resultDiv = document.getElementById('result');
const titleP = document.getElementById('title');
const artistP = document.getElementById('artist');
const durationP = document.getElementById('duration');
const image = document.getElementById('image');
const downloadLink = document.getElementById('downloadLink');
const urlInput = document.getElementById('urlInput');
const loadingDiv = document.getElementById('loading');
const alertDiv = document.getElementById('alert');
const previewAudio = document.getElementById('preview');

fetchButton.addEventListener('click', async () => {
  try {
    const url = urlInput.value.trim();
    if (!url) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a Spotify URL!',
      });
    }

    if (downloadClicked) {
      return showAlert('info', 'You have downloaded it');
    }

    loadingDiv.classList.remove('hidden');
    const response = await fetch(`https://itzpire.site/download/aio?url=${url}`);
    const data = await response.json();
    loadingDiv.classList.add('hidden');

    if (data.status === 'success') {
      resultDiv.classList.remove('hidden');
      titleP.textContent = data.data.title;
      artistP.textContent = 'Artist: ' + data.data.artist;
      durationP.textContent = 'Duration: ' + secondsToMinutes(data.data.duration) + ' minutes';
      image.src = data.data.image;
      downloadLink.addEventListener('click', () => {
        if (!downloadClicked) {
          downloadClicked = true;
          showAlert('info', 'Downloading Music');
          downloadLink.href = data.data.download;
          downloadLink.setAttribute('download', data.data.title); // Set filename
        } else {
          showAlert('error', 'You have downloaded it');
          downloadLink.href = 'javascript:void(0)';
        }
      });
      downloadLink.classList.add('bg-green-500', 'hover:bg-green-600', 'text-white', 'py-2', 'px-4', 'rounded');
      downloadLink.removeAttribute('target');

      // Fetch preview audio
      const audioResponse = await fetch(`https://spotifyapi.caliphdev.com/api/download/track?url=${url}`);
      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      previewAudio.src = audioUrl;
      previewAudio.load();
      previewAudio.play();

      showAlert('success', 'Download success!');
    } else {
      console.error('Failed to fetch data:', data);
      showAlert('error', 'Failed to fetch data.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showAlert('error', 'Error fetching data.');
  }
});

function showAlert(icon, text) {
  const alert = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    showClass: {
      popup: 'animate__animated animate__fadeInRight'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutRight'
    }
  });

  alert.fire({
    icon: icon,
    text: text
  });
}

function secondsToMinutes(duration) {
  const durationInSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(durationInSeconds / 60);
  const remainingSeconds = durationInSeconds % 60;
  const formattedMinutes = minutes.toString();
  const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}