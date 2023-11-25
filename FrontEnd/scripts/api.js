let works = [];
let categories = [];

function loadCategories() {
  try {
    if (categories.length > 0) {
      displayCategories();
    } else {
      fetch("http://localhost:5678/api/categories")
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          categories = data;
          displayCategories();
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }
  } catch (error) {
    console.log("error loading categories:", error);
  }
}

function loadWorks(categoryId) {
  try {
    if (works.length > 0) {
      displayWorks(categoryId);
      loadEditWorks();
    } else {
      fetch("http://localhost:5678/api/works")
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          if (response.status === 200) {
            return response.json();
          }
        })
        .then((data) => {
          works = data;
          displayWorks(categoryId);
          loadEditWorks();
        })
        .catch((error) => {
          console.error('Error fetching works:', error);
        });
    }
  } catch (error) {
    console.log("error:", error);
  }
}

function displayWorks(categoryId) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;
    figure.setAttribute("data-id", work.id);
    figure.setAttribute("category-id", work.categoryId);

    if (categoryId && work.categoryId !== categoryId) {
      figure.style.display = "none";
    }

    gallery.appendChild(figure);
  });
}

function displayCategories() {
  const filterButtons = document.querySelector(".filter");
  categories.unshift({ id: 0, name: "Tous" });
  const categoriesList = document.querySelector("#category");

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.addEventListener("click", function () {
      loadWorks(category.id);
    });

    btn.classList.add("filter-btn");
    btn.classList.add(`btn-${category.name.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').toLowerCase()}`);
    btn.innerText = category.name;
    btn.setAttribute("data-id", category.id);
    filterButtons.appendChild(btn);

    if (category.id > 0) {
      const option = document.createElement("option");
      option.value = category.id;
      option.innerText = category.name;
      categoriesList.appendChild(option);
    }
  });
}

function loadEditWorks() {
  const gallery = document.querySelector(".gallery-edit");
  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.classList.add("gallery-element-edit");
    figure.innerHTML = `
      <div class="delete"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i></div>
      <img class="gallery-edit-thumbnail" src="${work.imageUrl}" alt="${work.title}">
      <figcaption>éditer</figcaption>
    `;
    gallery.appendChild(figure);

    const deleteBtn = figure.querySelector(".delete");
    deleteBtn.addEventListener("click", function () {
      deleteWork(work.id);
    });
  });
}

function deleteWork(workId) {
  try {
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          const index = works.findIndex((work) => work.id === workId);
          if (index > -1) {
            works.splice(index, 1);
            loadEditWorks();
            loadWorks();
          }
        } else {
          alert("Une erreur est survenue");
        }
      });
  } catch (error) {
    console.log("error", error);
  }
}

function postWork(event) {
  event.preventDefault();
  const formModal = event.currentTarget;
  const formData = new FormData(formModal);

  if (formData.get("title") === "" || formData.get("image") === "") {
    alert("Merci de renseigner un titre et de télécharger une image");
    return;
  }

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error("Post request failed with status: " + response.status);
      }
    })
    .then((data) => {
      loadWorks();
      loadEditWorks();
      formModal.reset();
    })
    .catch((error) => {
      console.error("Post work request failed:", error);
    });
}

loadWorks();
loadCategories();
