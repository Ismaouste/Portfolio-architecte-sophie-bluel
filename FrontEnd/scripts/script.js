// on page load (in the browser), load works from the backend
window.addEventListener("load", () => {
  loadWorks();
  const btnAll = document.querySelector(".btn-all");
  const btnObjets = document.querySelector(".btn-objets");
  const btnApps = document.querySelector(".btn-apps");
  const btnHotel = document.querySelector(".btn-hotel");
  btnAll.addEventListener("click", function () {
    loadWorks();
  });

  btnObjets.addEventListener("click", function () {
    loadWorks(1);
  });

  btnApps.addEventListener("click", function () {
    loadWorks(2);
  });

  btnHotel.addEventListener("click", function () {
    loadWorks(3);
  });
  const btnAddproject = document.querySelector(".btn-addproject");
  const modalAddproject = document.querySelector("#modal");

  if (localStorage.token != null) {
    const login = document.querySelector(".login");
    login.style.display = "none";
    const logout = document.querySelector(".logout");
    logout.style.display = "block";
    btnAddproject.style.display = "block";
  }

  logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  btnAddproject.addEventListener("click", function (event) {
    event.preventDefault();
    modalAddproject.style.display = "block";
    return false;
  });

});

function loadWorks(categoryId) {
  try {
    //fetch works from the backend
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // and display them in the DOM
        const gallery = document.querySelector(".gallery");
        // check if data.categoryId === categoryId (if categoryId is defined)
        // if yes, display the work
        // if no, display all works
        gallery.innerHTML = "";

        data = data.filter((work) => {
          if (categoryId) {
            return work.categoryId === categoryId;
          } else {
            return true;
          }
        });

        data.forEach((work) => {
          // add figure element inside div.gallery
          const figure = document.createElement("figure");
          figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
          gallery.appendChild(figure);
        });
      });
  } catch {
    console.log("error");
  }

}

// 