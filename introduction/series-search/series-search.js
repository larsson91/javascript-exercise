
const searchInput = document.querySelector('input');
const list = document.querySelector('ul');

searchInput.addEventListener('input', event => {
  const name = event;

  const shows = fetchShow(name);

  list.innerHTML = shows.reduce((html, show) => html + showHTMLListItem(show.name), '');
});











// Helper functions, no need to touch :)

function showHTMLListItem(showName) {
  return `<li>Name: ${showName}</li>`;
}

async function fetchShow(name) {
  const response = await fetch(`http://api.tvmaze.com/search/shows?q=${decodeURI(name)}`);
  const shows = await response.json();
  return shows.map(show => ({
    name: show.show.name,
    image: show.show.image ? show.show.image.medium : ''
  }));
}

function fetchShowObservable(name) {
  return Rx.Observable.defer(() => fetchShow(name));
}
