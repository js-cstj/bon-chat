
export default class App {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		var app = document.getElementById("app");
		// this.chargerJson("fichier.json").then(donnees => {
		// });
		if (false) {
			document.body.appendChild(this.html_form_login());
			var form_login = document.forms.login;
			form_login.addEventListener("submit", e => {
				e.preventDefault();
				var data = new FormData(form_login);
				// URL du serveur destinataire
				const url = 'http://localhost:8888/api/membres';

				// Options de la requête
				const options = {
					method: 'POST',
					body: data
				};

				// Envoi de la requête
				fetch(url, options).then(response => {
					if (!response.ok) {
						throw new Error('Erreur lors de la requête ' + response.status);
					}
					return response.json(); // Ou response.text() selon le type de données attendu
				}).then(data => {
					// Traiter la réponse du serveur
					console.log('Réponse du serveur:', data);
					// Faire quelque chose avec la réponse reçue du serveur
				}).catch(error => {
					// Attraper les erreurs de la requête
					console.error('Erreur:', error);
				});
			});
		}
	}
	static html_form_login() {
		var resultat = document.createElement("div");
		resultat.id = "backdrop";
		var form = resultat.appendChild(document.createElement("form"));
		form.action = "";
		form.id = form.name = "login";
		var h1 = form.appendChild(document.createElement("h1"));
		h1.innerHTML = "Inscrivez-vous";
		var div, label, input;
		// NOM
		div = form.appendChild(document.createElement("div"));
		label = div.appendChild(document.createElement("label"));
		label.setAttribute("for", "nom");
		label.innerHTML = "Nom";
		input = div.appendChild(document.createElement("input"));
		input.type = "text";
		input.id = input.name = "nom";
		input.required = true;
		input.value = "Jo Binne";
		// COURRIEL		
		div = form.appendChild(document.createElement("div"));
		label = div.appendChild(document.createElement("label"));
		label.setAttribute("for", "courriel");
		label.innerHTML = "Courriel";
		input = div.appendChild(document.createElement("input"));
		input.type = "email";
		input.id = input.name = "courriel";
		input.required = true;
		input.value = "jo.binne@example.com";
		// AVATAR
		div = form.appendChild(document.createElement("div"));
		label = div.appendChild(document.createElement("label"));
		label.setAttribute("for", "avatar");
		label.innerHTML = "Avatar";
		var fieldset = div.appendChild(document.createElement("fieldset"));
		for (let i = 1; i <= 65; i += 1) {
			input = fieldset.appendChild(document.createElement("input"));
			input.type = "radio";
			input.id = "avatar" + i;
			input.name = "avatar";
			input.value = i;
			if (i === 1) {
				input.checked = true;
			}
			label = fieldset.appendChild(document.createElement("label"));
			label.setAttribute("for", "avatar" + i);
			let img = label.appendChild(document.createElement("img"));
			img.src = `./img/avatars/avatar${i}_90.webp`;
			img.alt = "Avatar " + i;
		}
		div = form.appendChild(document.createElement("div"));
		var button = div.appendChild(document.createElement("button"));
		button.innerHTML = "Entrer";
		return resultat;
	}
	/**
	 * Charge un fichier JSON.
	 * @param {string} url URL du fichier JSON ou de l'API
	 * @returns {Promise} Promise résolue avec le JSON
	 */
	static chargerJson(url) {
		return new Promise(function (resolve) {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url);
			xhr.responseType = "json";
			xhr.addEventListener("load", e => {
				resolve(xhr.response);
			});
			xhr.send();
		});
	}
}
