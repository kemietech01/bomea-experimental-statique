function appelApi(url) {
    return fetch(url).then(res => res.json());
}

function recupinfos() {

    // e.preventDefault();

    // var formulaire = document.getElementById('formulaire-contact');
    // var inputs = document.querySelectorAll('#formulairecontact input[required]');


    var nom = document.getElementById('nom').value;
    var phone = document.getElementById('phone').value;
    var email = document.getElementById('email').value;
    var objet = document.getElementById('objet').value;
    var message = document.getElementById('message').value;
	var newsletterBox = document.getElementById('newsletterBox').value;
	var privacyBox = document.getElementById('privacyBox');
 console.log("privacyBox", privacyBox.checked);
    if (nom == "" || phone == "" || email == "" || objet == "" || message == "" || !privacyBox.checked) {
        var mess = document.getElementById("messageretour");

        mess.style.backgroundColor = "orange";
        mess.innerHTML = "Veuillez s'il vous plaît remplir tous les champs requis";
        console.log("Erreur : tous les champs ne sont pas remplis");
	
    } else {
        var lat;
        var long;
        var urlLocalisation;
        var addr;

        var etatDemande = appelApi('https://api.ipdata.co?api-key=79d09a0d85de38c3046635ae78e745afd01e5b51716645f6fc90f6ee')
            .then(data => {
                lat = data.latitude;
                long = data.longitude;
                return "ok";
            })
            .then(donnees => {
                if (lat && long) {
                    urlLocalisation = 'https://api.geoapify.com/v1/geocode/reverse?lat=' + lat + '&lon=' + long + '&apiKey=ceb2215885f14749a4fac3a60889c41e';
                    return urlLocalisation;
                }
            })
            .then(adresseApelLoca => {
                if (adresseApelLoca) {
                    var ad = appelApi(adresseApelLoca)
                        .then(result => { 
                            var adr = result.features[0].properties.formatted;
                            return adr; 
                        })
                        .then(ad => {
                            if (ad) {
                                addr = ad;
                            } else {
                                addr = 'aucune adresse détectée';
                            }
                        return addr;
                        });
                    return ad;
                }
            })
            .then(adresseComplete => {
                var retourEnvoi = appelApi('https://bomea-studio.com/wp-json/formulaires/contact/envoyer?nom=' + nom + '&phone=' + phone + '&email=' + email + '&objet=' + objet + '&message=' + message + '&adressephysique=' + adresseComplete);
                return retourEnvoi;
            })
            .then(valeurRetour => {
                var succesDemande = (valeurRetour.insertion_liste_emailing);
                var val;
                if (succesDemande.length > 0) {
                    val = true;
                } else {
                    val = false;
                }
                console.log(val);
                return val;
            })
            .then(valRetour => {
                messageConfirmation(valRetour);
            });
        }
    }

function messageConfirmation(valeur) {
    var message = document.getElementById("messageretour");

    var contenuMessage;
    
    if (valeur) {
        contenuMessage = "Votre demande a bien été prise en compte. Nous vous recontactons au plus vite.";
        message.style.backgroundColor = "green";
    } else {
        contenuMessage = "Une erreur s'est produite pendant l'envoi de votre demande. Veuillez s'il vous plaît nous contacter via l'adresse e-mail mentionnée plus bas.";
        message.style.backgroundColor = "red";
    }
    
    message.innerHTML = contenuMessage;
}

function autretest() {
    console.log("un 'autre test' depuis le fichier gestion-formulaire.js");
}