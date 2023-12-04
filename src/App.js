
export default class App {
	/**
	 * Méthode principale. Sera appelée après le chargement de la page.
	 */
	static main() {
		var app = document.getElementById("app");
		localStorage.membre_id = 1;
		if (!localStorage.membre_id) {
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
				}).then(reponse => {
					// Traiter la réponse du serveur
					document.getElementById("backdrop").remove();
					return this.chargerJson("http://localhost:8888/api/membres/nom/" + data.get('nom')).then(membres => {
						const membre = membres.pop();
						// console.log(membre);
						localStorage.membre_id = membre.id;
					});
					// Faire quelque chose avec la réponse reçue du serveur
				});
			});
		}
		this.chargerJson("http://localhost:8888/api/derniers_messages").then(messages => {
			var vieux = document.getElementById("messages");
			var nouveau = this.html_lesMessages(messages);
			vieux.replaceWith(nouveau);
		});
		var nouveau_message = document.forms.nouveau_message;
		nouveau_message.addEventListener("submit", e => {
			e.preventDefault();

			nouveau_message.membre_id.value = localStorage.membre_id;
			// Récupérer les valeurs du formulaire
			const formData = new FormData(nouveau_message);

			// URL du serveur destinataire
			const url = 'http://localhost:8888/api/messages';

			// Options de la requête
			const options = {
				method: 'POST',
				body: formData
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
				this.chargerJson("http://localhost:8888/api/derniers_messages").then(messages => {
					var vieux = document.getElementById("messages");
					var nouveau = this.html_lesMessages(messages);
					vieux.replaceWith(nouveau);
				});
				// Faire quelque chose avec la réponse reçue du serveur
			});
		});
	}
	static html_lesMessages(tMessages) {
		var resultat = document.createElement("div");
		resultat.id = "messages";
		for (let i = 0; i < tMessages.length; i += 1) {
			const objMessage = tMessages[i];
			resultat.appendChild(this.html_unMessage(objMessage));
		}
		return resultat;
	}
	static html_unMessage(objMessage) {
		var resultat = document.createElement("div");
		resultat.classList.add("message");
		if (objMessage.membre_id == localStorage.membre_id) {
			resultat.classList.add("moi");
		}
		var divMembre = resultat.appendChild(document.createElement("div"));
		divMembre.classList.add("membre");
		var img = divMembre.appendChild(document.createElement("img"));
		img.src = `./img/avatars/avatar${objMessage.membre_avatar}_90.webp`;
		img.alt = "Avatar de " + objMessage.membre_nom;
		var pNom = divMembre.appendChild(document.createElement("p"));
		pNom.classList.add("nom");
		pNom.innerHTML = objMessage.membre_nom;
		var pCourriel = divMembre.appendChild(document.createElement("p"));
		pCourriel.classList.add("courriel");
		pCourriel.innerHTML = objMessage.membre_courriel;
		var pDate = divMembre.appendChild(document.createElement("p"));
		pDate.classList.add("date");
		pDate.innerHTML = objMessage.date_ajout;

		var pEmoji = resultat.appendChild(document.createElement("p"));
		pEmoji.classList.add("emoji");
		pEmoji.innerHTML = "😊";
		var pTexte = resultat.appendChild(document.createElement("p"));
		pTexte.classList.add("texte");
		pTexte.innerHTML = objMessage.texte;
		return resultat;
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
		for (let i = 1; i <= 67; i += 1) {
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
