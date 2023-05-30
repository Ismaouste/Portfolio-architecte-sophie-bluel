// on page load (in the browser), load works from the backend
window.addEventListener("load", () => {
  loadWorks();
  if (localStorage.token != null) {
    loadEditWorks();
  }

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
  const btnAddproject = document.querySelector("#btn-addproject");
  const modalAddproject = document.querySelector("#modal");
  const modalAddproject1 = document.querySelector(".modal-content-1");
  const modalAddproject2 = document.querySelector(".modal-content-2");

  if (localStorage.token != null) {
    const login = document.querySelector(".login");
    login.style.display = "none";
    const logout = document.querySelector(".logout");
    logout.style.display = "block";
    btnAddproject.style.display = "block";
  }
  const logout = document.querySelector(".logout");

  logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  btnAddproject.addEventListener("click", function (event) {
    event.preventDefault();
    modalAddproject.style.display = "block";
    modalAddproject1.style.display = "block";
    return false;
  });
  showModal = () => {
    modalAddproject.style.display = "block";
  };
  //when user pick an image to upload in the form#post-portfolio on input#image, display the image in the img#preview and display:none on label#image-label and p.upload-conditions

  const imageInput = document.getElementById("image");
  const imageLabel = document.getElementById("image-label");
  const uploadConditions = document.querySelector(".upload-conditions");
  const uploadLogo = document.querySelector(".fa-image");
  const preview = document.getElementById("preview");

  imageInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      preview.src = reader.result;
      imageLabel.style.display = "none";
      uploadConditions.style.display = "none";
      uploadLogo.style.display = "none";
    };
  });
});

function hideBody(event) {
  const modalAddproject = document.querySelector("#modal");
  const modalBg = document.querySelector(".modal-bg");
  var body = document.querySelector("body");

  modalAddproject.classList.toggle("modal-active");
  modalAddproject1.style.display = "none";
  modalAddproject2.style.display = "none";
  modalAddproject.style.display = "none";
  modalBg.classList.toggle("modal-bg-active");
  body.classList.toggle("lightbox-on");
}
function logout(event) {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "index.html";
}
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

function loadEditWorks() {
  try {
    //fetch works from the backend
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // and display them in the DOM
        const gallery = document.querySelector(".gallery-edit");
        gallery.innerHTML = "";
        data.forEach((work) => {
          // add figure element inside div.gallery
          const figure = document.createElement("figure");
          figure.innerHTML = `
            <div class="delete"><i onclick="deleteWork(${work.id})" class="fa-solid fa-trash-can" style="color: #ffffff;"></i></div>
            <img class="gallery-edit-thumbnail"
            onclick src="${work.imageUrl}" alt="${work.title}">
            <figcaption>éditer</figcaption>
        `;
          gallery.appendChild(figure);
        });
      });
  } catch {
    console.log("error");
  }
}

function deleteWork(workId) {
  try {
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })

        loadEditWorks();
        loadWorks();

  } catch {
    console.log("error");
  }
}

const modalAddproject1 = document.querySelector(".modal-content-1");
const modalAddproject2 = document.querySelector(".modal-content-2");

function modal2() {
  modalAddproject1.style.display = "none";
  modalAddproject2.style.display = "block";
}

//add event listener on form enctype submit #form-modal to add a new work
const formModal = document.getElementById("post-portfolio");
const formButton = document.getElementById("form-modal");

console.log(formModal);
formModal.addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(formModal);
  const token = localStorage.token;
  // validate the form
  if (formData.get("title") === "") {
    alert("Please enter a title");
    return;
  }

  if (formData.get("image") === "") {
    alert("Please upload an image");
    return;
  }

  //send the data to the backend
  console.log(formData.get("image"));
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //reload the works
      loadWorks();
      loadEditWorks();
      //hide the modal
      hideBody();
      formModal.reset();
    });
});


const closeBtn = document.querySelector(".close-btn");
closeBtn.addEventListener("click", function () {
  modalAddproject1.style.display = "none";
  modalAddproject2.style.display = "none";
  hideBody();
}
);

const previousBtn = document.querySelector(".previous-btn");
previousBtn.addEventListener("click", function () {
  modalAddproject1.style.display = "block";
  modalAddproject2.style.display = "none";
});