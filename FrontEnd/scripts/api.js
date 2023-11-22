

let works = []; 
let categories = [];


function loadCategories() {
    try {
      if (categories.length > 0) {
        displayCategories();
      } else {
        // Fetch categories from the backend
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
      } else {
        // Fetch works from the backend
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
    // Display works in the DOM based on the provided category ID
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
  
      // Check if categoryId is specified and hide figures of other categories
      if (categoryId && work.categoryId !== categoryId) {
        figure.style.display = "none";
      }
  
      gallery.appendChild(figure);
    });
  }
  function displayCategories() {
    const filterButtons = document.querySelector(".filter");
    filterButtons.innerHTML = '<a class="filter-btn btn-all">Tous</a>';
    const categoriesList = document.querySelector("#category");
    categories.forEach((category) => {
      //Create filter buttons
      const btn = document.createElement("a");
      btn.classList.add("filter-btn");
      btn.classList.add(`btn-${category.name.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').toLowerCase()}`);
      btn.innerText = category.name;
      btn.setAttribute("data-id", category.id);
      filterButtons.appendChild(btn);
      // Create list of categories for Post Work form
      const option = document.createElement("option");
      option.value = category.id;
      option.innerText = category.name;
      categoriesList.appendChild(option);
    });
  }

  

  function loadEditWorks() {
    const gallery = document.querySelector(".gallery-edit");
    gallery.innerHTML = "";
    // console.log(works);
    if (works.length)
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
          // Find the index of the work to remove from the works array
          const index = works.findIndex(work => work.id === workId);
          if (index > -1) {
            // Remove the work from the works array
            works.splice(index, 1);
            loadEditWorks();
            loadWorks();
          }
        } else {
          alert("Une erreur est survenue");
          // console.log(response.status);
          return false;
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

    const token = localStorage.token;
    // validate the form
    if (formData.get("title") === "") {
      alert("Merci de renseigner un titre");
      return;
    }
    if (formData.get("image") === "") {
      alert("Merci de télécharger une image");
      return;
    }
    if (formData.get("title") && formData.get("image") === "") {
      alert("Merci de renseigner un titre et de télécharger une image");
      return;
    }
    //send the data to the backend
    // console.log(formData.get("image"));
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
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
      // hideBody();
      formModal.reset();
    })

  }


loadWorks();
loadCategories();