window.addEventListener("load", () => {
  loadWorks();


  const btnAll = document.querySelector(".btn-all");
  const btnObjets = document.querySelector(".btn-items");
  const btnApps = document.querySelector(".btn-flats");
  const btnHotel = document.querySelector(".btn-hotels");
  const adminBar = document.querySelector(".admin-bar");
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
  const btnAddintro = document.querySelector("#btn-addintro");
  const modalAddproject = document.querySelector("#modal");
  const modalAddproject1 = document.querySelector(".modal-content-1");
  const modalAddproject2 = document.querySelector(".modal-content-2");
  const logout = document.querySelector(".logout");
  const filterButtons = document.querySelector(".filter");

  if (localStorage.token != null) {
    const login = document.querySelector(".login");
    login.style.display = "none";
    adminBar.style.display = "flex";
    logout.style.display = "block";
    btnAddproject.style.display = "block";
    btnAddintro.style.display = "block";
    filterButtons.style.display = "none";
  }

  logout.addEventListener("click", logoutPortfolio);

  function logoutPortfolio(event) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }

  btnAddproject.addEventListener("click", function (event) {
    event.preventDefault();
    modalAddproject.style.display = "block";
    modalAddproject1.style.display = "block";
    modalAddproject1.classList.add("modal-active");
  });


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

  function hideBody(event) {
    const modalAddproject = document.querySelector("#modal");
    var body = document.querySelector("body");
    modalAddproject.classList.toggle("modal-active");
    modalAddproject1.style.display = "none";
    modalAddproject2.style.display = "none";
    modalAddproject.style.display = "none";
    modalBg.classList.toggle("modal-bg-active");
    modalAddproject2.classList.remove("modal-active");
    body.classList.toggle("lightbox-on");
  }

  function modal2() {
    modalAddproject1.style.display = "none";
    modalAddproject1.classList.remove("modal-active");
    modalAddproject2.style.display = "block";
  }

  //add event listener on form enctype submit #form-modal to add a new work
  const formModal = document.getElementById("post-portfolio");
  const formButton = document.getElementById("form-modal");
  const actionButton = document.querySelector(".action-button");
  actionButton.addEventListener("click", modal2);

  formModal.addEventListener("submit", postWork);

  const closeBtn = document.querySelector(".close-btn");
  closeBtn.addEventListener("click", function () {
    modalAddproject1.style.display = "none";
    modalAddproject2.style.display = "none";
    hideBody();
  });

  const previousBtn = document.querySelector(".previous-btn");
  previousBtn.addEventListener("click", function () {
    modalAddproject1.style.display = "block";
    modalAddproject2.classList.remove("modal-active");
    modalAddproject2.style.display = "none";
  });

  const modalBg = document.querySelector(".modal-bg");
  modalBg.addEventListener("click", hideBody);
  btnAddproject.addEventListener("click", hideBody);
});
