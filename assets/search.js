let downloadClicked = false;

const fetchButton = document.getElementById('fetchButton');
const playlistDiv = document.getElementById('playlist');
const urlInput = document.getElementById('urlInput');
const loadingDiv = document.getElementById('loading');
const alertDiv = document.getElementById('alert');

fetchButton.addEventListener('click', async () => {
  try {
    const url = urlInput.value.trim();
    if (!url) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter the Spotify music title!',
      });
    }

    loadingDiv.classList.remove('hidden');
    const response = await fetch(url.startsWith('https') ? `https://itzpire.site/download/aio?url=${url}` : `https://spotifyapi.caliphdev.com/api/search/tracks?q=${url}`);
    const data = await response.json();
    loadingDiv.classList.add('hidden');

    if (data.length > 0) {
      displayPlaylist(data);
    } else {
      showAlert('error', 'No results found.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showAlert('error', 'Error fetching data.');
  }
});

function displayPlaylist(tracks) {
  playlistDiv.innerHTML = tracks.map(track => `
      <div class="flex items-center py-2 border-b border-gray-700">
        <img src="${track.thumbnail}" alt="${track.title}" class="w-12 h-12 rounded-md mr-4">
        <div>
          <p class="font-semibold">${track.title}</p>
          <p class="text-sm">${track.artist}</p>
        </div>
        <button class="ml-auto bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg" onclick="showTrackDetail('${track.title}', '${track.artist}', '${track.duration}', '${track.thumbnail}', '${track.url}')">
          Detail
        </button>
      </div>
    `).join('');
  playlistDiv.classList.remove('hidden');
}

function showTrackDetail(title, artist, duration, thumbnail, url) {
  Swal.fire({
    title: title,
    html: `
      <img src="${thumbnail}" alt="${title}" class="mb-4">
      <p class="font-semibold">Artist:</p>
      <p>${artist}</p>
      <p class="font-semibold">Duration:</p>
      <p>${duration}</p>
    `,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Download',
    cancelButtonText: 'Close'
  }).then((result) => {
    if (result.isConfirmed) {
      downloadTrack(url, title);
    }
  });
}

async function downloadTrack(url, title) {
  try {

    loadingDiv.classList.remove('hidden');
    const response = await fetch(`https://itzpire.site/download/aio?url=${url}`);
    const data = await response.json();
    loadingDiv.classList.add('hidden');

    if (data.status === 'success') {
      showAlert('success', 'Download success!');
      downloadClicked = true;
      const downloadLink = document.createElement('a');
      downloadLink.href = data.data.download;
      downloadLink.setAttribute('download', title);
      downloadLink.click();
    } else {
      showAlert('error', 'Failed to download track.');
    }
  } catch (error) {
    console.error('Error downloading track:', error);
    showAlert('error', 'Error downloading track.');
  }
}

function showAlert(icon, text) {
  Swal.fire({
    icon: icon,
    text: text,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    toast: true,
    showClass: {
      popup: 'animate__animated animate__fadeInRight'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutRight'
    }
  });
}

function secondsToMinutes(duration) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}