const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rhp8f.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(process.env.DB_PASS);
const app = express()

app.use(bodyParser.json());
app.use(cors());




const port = 5500

app.get('/', (req, res)=>{
    res.send('Hello from db its working fine')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection error', err);
  const fruitsCollection = client.db("freshFruits").collection("fruits");
  const ordersCollection = client.db("freshFruits").collection("orders");

  console.log('Database connected successfully');

  app.get('/products', (req, res)=>{
    fruitsCollection.find()
    .toArray((err, documents)=>{
        res.send(documents);
    })
  })

    app.post('/addProduct', (req, res)=>{
        const newFruits = req.body;
        fruitsCollection.insertOne(newFruits)
        .then(result =>{
            res.send(result.insertedCount > 0)
            res.redirect('/');
        })
    })


    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>{
        
            console.log(result);
            
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/products/:id',(req, res)=>{
        fruitsCollection.find({_id: ObjectId(req.params.id)})
          .toArray((err, document)=>{
              res.send(document[0]);
          })
      })


      app.get('/orders',(req, res)=>{
        ordersCollection.find()
          .toArray((err, document)=>{
              res.send(document);
              console.log(document);
          })
      })

      app.get('/orders/:id',(req, res)=>{
        ordersCollection.find({_id: ObjectId(req.params.id)})
          .toArray((err, document)=>{
              res.send(document[0]);
          })
      })

      app.delete('/delete/:id',(req, res)=>{
        fruitsCollection.deleteOne({_id: ObjectId (req.params.id)})
        .then((result)=>{
            res.send(result.deletedCount > 0);
        })
    })

   
  
});

app.listen(process.env.PORT || port);