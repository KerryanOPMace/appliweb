
// Plein de stratégies existent pour implémenter la factorielle. J'ai choisi une méthode récursive plutôt efficace mais on pourrait aussi mémoisé
// en utilisant un tableau qui stocke les resultats de 1 à n (ce serait la meilleure option)
function fact(n){
    if (n<=1){
        return 1;
    }
    return n*fact(n-1);
}



console.log(fact(18))


console.log("blah blah blah")

function applique(f, tab){
    return tab.map((x)=>f(x)); // On parcourt le tableau en appliquant la fonction f a chaque élement
}


//Ici j'applique applique à la fonction fact et au tableau [1,2,3,4,5,6] ce qui applique la factorielle a tous les élements du tableau
console.log(applique(fact,[1,2,3,4,5,6]))


// Ici on applique la fonction définie par :
// f(n)=n+1
// a tout le tableau [1,2,3,4,5,6] ce qui doit retourner [2,3,4,5,6,7]
console.log(applique(function(n) { return (n+1); } , [1,2,3,4,5,6]));






// Tableau initial des messages
let msgs = [];

// Fonction pour mettre à jour la liste des messages dans l'interface
function update(nouveauxMessages) {
    const liste_de_messages = document.querySelector("#messageList");
    liste_de_messages.innerHTML = '';  

    nouveauxMessages.forEach(message => {
        const li = document.createElement('li');
        li.classList.add('message');
        li.textContent = `${message.pseudo} a écrit à ${new Date(message.date).toLocaleString()}: ${message.message}`;
        liste_de_messages.appendChild(li);
    });
}

// Fonction d'ajout d'un message via l'API
function ajoutMessage() {
    const message = document.querySelector("textarea").value.trim();  
    const pseudo = document.querySelector('#pseudo').value.trim(); 

    if (message && pseudo) {
        fetch(`http://localhost:8080/msg/post`, {
            method: 'POST',  //C'est parceque j'ai choisi de mettre l'endpoint en post
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                message: message,
                pseudo: pseudo
            })  
        })
        .then(response => response.json()) 
        .then(data => {
            
            // msgs.push({
            //     "message": message,
            //     "pseudo": pseudo,
            //     "date": new Date()
            // });
            document.querySelector("textarea").value = '';
            document.querySelector('#pseudo').value = '';

            // update(msgs); //Si on veut mettre à jour la liste des messages après chaque ajout
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi du message:", error);
        });
    } else {
        alert("Veuillez remplir tous les champs !");
    }
}



function miseAJour() {
    fetch('http://localhost:8080/msg/getAll')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            msgs = []; 
            data.messages.forEach(message => {
                msgs.push({
                    "message": message.message,
                    "pseudo": message.pseudo,
                    "date": new Date(message.date)
                });
            });
            update(msgs);  
        })
        .catch(error => {
            console.error("Erreur lors de la mise à jour des messages:", error);
        });
}


function changerStyle() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}

// Attacher les écouteurs d'événements pour les boutons
document.querySelector('#envoyerButton').addEventListener('click', ajoutMessage);
document.querySelector('#miseAJourButton').addEventListener('click', miseAJour);
document.querySelector('#changerStyleButton').addEventListener('click', changerStyle);

// Charger les messages au démarrage
miseAJour();
