// on page load (in the browser), load works from the backend
window.addEventListener('load', () => {
    loadWorks();
});

function loadWorks() {
//fetch works from the backend
  fetch('http://localhost:5678/api/works')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // and display them in the DOM
      const gallery = document.querySelector('.gallery');

      data.forEach((work) => {
        // add figure element inside div.gallery
        const figure = document.createElement('figure');
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
      });
    });
}

