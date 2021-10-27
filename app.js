const express = require("express")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")

const app = express()

const port = 3000|| process.env.PORT;

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

// DB Confuguration
const url = "mongodb://localhost:27017/tee-api"
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(url, options)

// Schema
const factSchema ={
    category: String, 
    content: String,
    author: String
}
// Model
const Fact = mongoose.model("Fact", factSchema);

// Using the onchain route method
app.get('/', (req, res)=>{
    res.render("index")
})
app.route('/facts')
// get all the articles
.get(function(req, res){
    Fact.find(function(err, foundFacts){
        if(!err){
            res.send(foundFacts)
        }else{
            res.send(err)
        }
    })
})

.post(function(req, res){
    const newFact = new Fact({
        category: req.body.category,
        content: req.body.content,
        author: req.body.author
    })

    newFact.save(function(err){
        if(!err){
            res.send("Thanks for adding a new fact 😉")
        }else{
            res.send(err)
        }
    })
});

app.route('/facts/:category')
.get(function(req,res){
        Fact.findOne({category: req.params.category}, function(err, foundCategory){
            if(foundCategory){
                res.send(foundCategory)
            }else{
                res.send("No Category was found")
            }
        })  
})
// Port
app.listen(port, ()=>{
    console.log("Server has successfully started")
})