const express = require('express')
const app = express()
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
const cors = require('cors')
const PORT = 2021
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
// parse application/json
app.use(bodyParser.json())
mongoose.connect("mongodb://localhost:27017/user_db", { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("connected to local db");
});
const User = require('./models/User')
app.get('/',(req,res)=>{
    res.json({
        status:200,
        message:'This the local server'
    })
})


app.post('/search', (req, res) => {
    let q = req.body.query;
  let query = {
    "$or": [{"first_name": {"$regex": q, "$options": "i"}}, {"last_name": {"$regex": q, "$options": "i"}}]
  };
  let output = [];

  User.find(query).limit(6).then( usrs => {
      if(usrs && usrs.length && usrs.length > 0) {
          usrs.forEach(user => {
            let obj = {
                id: user.first_name + ' ' + user.last_name,
                label: user.first_name + ' ' + user.last_name
            };
            output.push(obj);
          });
      }
      res.json(output);
  }).catch(err => {
    res.status(404).json(err);
  });
    
  });

app.post('/create',async (req,res)=>{
    const user = new User({
		first_name : req.body.first_name,
		last_name : req.body.last_name,
        email : req.body.email
	})
	await user.save()
	res.send(user)
})



app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})