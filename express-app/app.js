const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();


mongoose.connect('mongodb+srv://bestpira:zRNr2DR0eKJ0ezii@cluster0-cetjn.mongodb.net/test?retryWrites=true&w=majority')
.then(()=>{
    console.log('Successfully Connected to Mongodb Atlas !');
}).catch((error)=>{
    console.log('Opps! Unable to connect to mongoDB Atlas');
    console.error(error);
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//Adding a recipe
app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
        title : req.body.title,
        ingredients : req.body.ingredients,
        instructions : req.body.instructions,
        difficulty : req.body.difficulty,
        time : req.body.time,
        userId : req.body.userId,
    });
    recipe.save().then(
        ()=>{
        res.status(201).json({
            Message: 'Recipe Saved Successfully!'
        })
    }).catch(
        (error)=>{
        res.status(400).json({
            error: error
        })
    })
});

// Fetching a recipe
app.get('/api/recipes/:id', (req, res, next)=>{
    Recipe.findOne({
        _id:req.params.id
    }).then(
        (thing)=>{
            res.status(200).json(thing)

    }).catch((error)=>{
        res.status(404).json({
            error: error
        });
    });
});
//Updating a recipe
app.put('/api/recipes/:id', (req, res, next)=>{
    const recipe = new Recipe({
        _id : req.params.id,
        title : req.body.title,
        ingredients : req.body.ingredients,
        instructions : req.body.instructions,
        difficulty : req.body.difficulty,
        time : req.body.time,
        userId : req.body.userId,
    });

    Recipe.updateOne({_id : req.params.id}, recipe).then(
        ()=>{
            res.status(200).json({
                Message: 'Recipe Updated Successfully!'
            })
    }).catch(
        (error)=>{
        res.status(400).json({
            error:error
        });
    })
})

//Deleting the Recipe
app.delete('/api/recipes/:id', (req, res, next)=>{
    Recipe.deleteOne({_id:req.params.id}).then(
        ()=>{
            res.status(200).json({
                Message : 'You have successfully Deleted the Recipe'
            });
    }).catch(
        (error)=>{
            res.status(400).json({
                error : error
            });
    });

});
//fetching all recipes
app.use('/api/recipes',(req, res, next)=>{
    Recipe.find().then(
        (recipes)=>{
        res.status(200).json(recipes);
        }
    ).catch(
        (error)=>{
        res.status(400).json({
            error:error
            }
        )
    })
})


module.exports = app;