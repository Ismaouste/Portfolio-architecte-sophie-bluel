// Constante sélection des éléments form avec l'id form
const formUser = document.querySelector("#form");
// Constante de la div avec la class error
const errorUser = document.querySelector(".error");

// Ajout evenement sur le bouton submit
formUser.addEventListener("submit", async (event) => {
  // Méthode qui permet d'empecher l'action par défaut du navigateur
  event.preventDefault();

  // Constante email et password , .value renvoie la valeur en chaine de caractères
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  //
  console.log(email);
  console.log(password);
  //
  // Requêtes HTTP POST à l'API
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      // Envoie des données au serveur avec la method POST
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Données convertie en format JSON
      body: JSON.stringify({ email, password }),
    });

    // Si la réponse n'est pas valide , erreur dans la console
    if (!response.ok) {
      throw new Error("Identifiants invalides");
    }
    // Stockage du token
    const data = await response.json();
    localStorage.setItem("token", data.token);
    // Redirection a adminindex.html
    window.location.href = "adminindex.html";
  } catch (error) {
    console.error(error);
    // Change le style de errorUser (passe de display hidden a flex)
    errorUser.style.display = "flex";

    // Si le message contient
    if (error.message.includes("Failed to fetch")) {
      // Serveur indisponible
      errorUser.textContent = "Serveur indisponible";
    } else {
      // affichage du message d'erreur d'origine
      errorUser.textContent = error.message;
    }
  }
});
