var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var Sequelize = require("sequelize");

var sequelize = new Sequelize('pharmacy', 'adelinavidroiu', '', {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306
});

var Druggist = sequelize.define('druggists', {
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    forename: {
        type: Sequelize.STRING,
        field: 'forename'
    },
    phone: {
        type: Sequelize.STRING,
        field: 'phone'
    },
    email: {
        type: Sequelize.STRING,
        field: 'email'
    }
}, {
    freezeTableName: false,
    timestamps: false
});


var app = express();
app.use(bodyParser.json());
app.use(cors());

var nodeadmin = require('nodeadmin');
app.use(nodeadmin(app));

var data = [{
    id: 1
}, {
    id: 2
}, {
    id: 3
}];


//create new resource 
app.post('/druggists', function(request, response) {
    Druggist.create(request.body).then(function(druggist) {
            Druggist.findById(druggist.id).then(function(druggist){
            response.status(201).send(druggist);
            });
    });
});

//read all
app.get('/druggists', function(request, response) {
     Druggist.findAll().then(function(druggists){
    response.status(200).send(druggists);
});
});

//read one 
app.get('/druggists/:id', function(request, response) {
    Druggist.findById(request.params.id).then(function(druggist){
    if(druggist){
      response.status(200).send(druggist);
    }
    else
    {
       response.status(404).send();
    }
  });

});

//update one 
app.put('/druggists/:id', function(request, response) {
    Druggist
  .findById(request.params.id)
  .then(function(druggist){
    if(druggist){
      druggist
      .updateAttributes(request.body)
      .then(function(){
        response.status(200).send('updated');
      })
      .catch(function(error){
        console.warn(error);
        response.status(500).send('server error');
      });
    }
    else
   {
    response.status(201).send(request.body);
   }
});
});

//delete one by id
app.delete('/druggists/:id', function(req, res) {
    Druggist
  .findById(req.params.id)
  .then(function(druggist){
    if(druggist){
      druggist
      .destroy()
      .then(function(){
        res.status(204).send();
      })
      .catch(function(error){
        console.warn(error);
        res.status(500).send('server error');
      });
    }
    else{
    res.status(404).send();
    }
  });
});

app.use('/admin',express.static('admin'));

app.listen(process.env.PORT);