var express = require('express');


var app = express(); 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());


//Endpoint qui affiche "Hello"
app.get("/", function(req, res) {
  res.send("Hello")
})


//Endpoint qui rend le paramètre donné en json
app.get('/test/*', function(req, res) {
  let parametre_donné = req.params[0];
  res.json({parametre_donné});
});


//Le compteur que l'on va incrémenter
let compteur=0

//Endpoint qui rend le compteur sous format json
app.get('/cpt/query', function(req, res) {
  res.json({compteur});
})



//Endoint qui incrémente le compteur, si il y a un parametre v dans la requete on incremente de v sinon de 1.
//On retourne {"code":0} si tout va bien et {"code":1} si le parametre v n'est pas un nombre
app.get('/cpt/inc', function(req, res) {
  let v = req.query.v;
  if(v){
    if(isNaN(v)){
      res.json({code:1});
    }else{
      compteur+=parseInt(v);
      res.json({code:0});
    }
  }else{
    compteur++;
    res.json({code:0});
  }
})



var allMsgs = [
  { "message": "Comment allez-vous aujourd'hui les amis?", "pseudo": "Pierre", "date": new Date() },
  { "message": "Moi vraiment excellent", "pseudo": "Paul", "date": new Date() },
  { "message": "Pareil que Paul", "pseudo": "Jacques", "date": new Date() },
  { "message": "Pareil que Jacques", "pseudo": "Etienne", "date": new Date() },
  { "message": "Pareil qu'Etienne", "pseudo": "Eudes", "date": new Date() },
  { "message": "Pareil qu'Eudes", "pseudo": "Béranger", "date": new Date() }
];







//Endpoint pour obtenir le nombre de messages
app.get('/msg/nber', function(req, res) {
  res.json({ count: allMsgs.length });
});

//Endpoint pour obtenir un message par id dans la liste de messages
app.get('/msg/get/:id', function(req, res) {
  let index = parseInt(req.params.id);
  if (!Number.isInteger(index) || index < 0 || index >= allMsgs.length) {
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, msg: allMsgs[index] });
  }
});

//Endpoint pour obtenir la liste des messages
app.get('/msg/getAll', function(req, res) {
  res.json({ messages: allMsgs });
});



//Endpoint pour ajouter un message à la liste de messages
//Attention je l'ai mis en post pour pouvoir envoyer des données (non seulement le message mais aussi le pseudo)
app.post("/msg/post", function(req, res) {
  const { message, pseudo } = req.body;  

  if (message && pseudo) {
      const newMessage = {
          message: message,
          pseudo: pseudo,
          date: new Date()
      };
      allMsgs.push(newMessage);
      res.json({ code: 0, msg: "Message ajouté avec succès" });
  } else {
      res.json({ code: -1, msg: "Données manquantes" });
  }
});


//Endpoint pour supprimer un message à la liste de messages avec son id dans la liste
app.get('/msg/del/:id', function(req, res) {
  let index = parseInt(req.params.id);
  if (!Number.isInteger(index) || index < 0 || index >= allMsgs.length) {
    res.json({ code: 0 });
  } else {
    allMsgs.splice(index, 1);
    res.json({ code: 1 });
  }
});


app.listen(8080); 
console.log("App listening on port 8080...");