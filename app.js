const express = require('express');
const app = express();
const mongoose = require('./database/mogoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');

/*
CORS - Cross Origin Request Security
Backend - http://localhost:3000
Frontend - http://localhost:4200
*/
// 3rd party library, app.use(cors());
// add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});

//Example of middleware (software intermedio)
app.use(express.json());// Or 3rd party bodyParser

// Routes or REST API Endpoints or RESTFul webservices Endpoints
/*
TaskList - Create, Update, ReadTaskListByUId, ReadAllTaskList
Task - Create, Update, ReadTaskByUId, ReadAllTask
*/

// Routes or API endpoints for TaskListmodel
// Get All Task Lists
// http://localhost:3000/tasklist => [ {TaskList}, {TaskList} ]
// https://www.restapitutorial.com/lessons/httpmethods.html

/*app.get('/tasklist', function(req,res){
    TaskList.find({})
        .then(function(lists) {res.send(lists)})
        .catch(function(error){console.log(error)});    
});*/

app.get('/tasklists', (req, res) => {
    TaskList.find({})
        .then((lists) => {
            res.status(200).send(lists);            
        })
        .catch((error)=>{
            console.log(error);
            res.status(500);
        });
});

//Endpoint to get one TaskList by taskId: http://localhost:3000/tasklists/62c365e3de38d1db2a0d32c3
app.get(
    '/tasklists/:tasklistId', (req,res) => {    
        let tasklistId = req.params.tasklistId;
        TaskList.find({ _id: tasklistId })
            .then((taskList)=>{
                res.status(200).send(taskList)
            })
            .catch((error)=>{console.log(error)});
    }
);


// Route or Endpoint for creating a TaskList
app.post('/tasklists', (req, res) => {
    //console.log("Hello i am inside post method");
    console.log(req.body);

    let taskListObj = { 'title': req.body.title};
    TaskList(taskListObj).save()
        .then((taskList)=>{
            res.status(201).send(taskList);
        })
        .catch((error)=>{
            console.log(error);
            res.status(500);
        });

});
//PUT is Full update of object
app.put('/tasklists/:tasklistId', (req,res) =>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, {$set: req.body})
        .then((taskList)=>{
            res.status(200).send(taskList)
        })
        .catch((error)=>{console.log(error)});
});
// Patch is apartial update of one field of an object
app.patch('/tasklists/:tasklistId', (req,res) =>{
    TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, {$set: req.body})
        .then((taskList)=>{
            res.status(200).send(taskList)
        })
        .catch((error)=>{console.log(error)});
});

//Delete a taskList by id
app.delete('/tasklists/:tasklistId', (req,res) =>{
    TaskList.findByIdAndDelete(req.params.tasklistId)
        .then((taskList)=>{
            res.status(201).send(taskList)
        })
        .catch((error)=>{console.log(error)});
});

/* CRUD Operation for Task, 1 task debe pertenecar a 1 tasklist*/
//Get all tasks for 1 TaskList, http://localhost:3000/taskslist/:tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks', (req,res) =>{
    Task.find({_tasklistId: req.params.tasklistId})
        .then((tasks)=>{
            res.status(200).send(tasks)
        })
        .catch((error)=>{console.log(error)});
});

//Create a task inside a particular task List
app.post('/tasklists/:tasklistId/tasks', (req, res) => {
    console.log(req.body);

    let taskObj = { 'title': req.body.title, '_tasklistId': req.params.tasklistId};
    Task(taskObj).save()
        .then((task)=>{
            res.status(201).send(task);
        })
        .catch((error)=>{
            console.log(error);
            res.status(500);
        });

});


// http://localhost:3000/taskslist/:tasklistId
// Get 1 task inside 1 Tasklist
app.get('/tasklists/:tasklistId/tasks/:taskId', (req,res) =>{
    Task.findOne({_tasklistId: req.params.tasklistId, _id: req.params.taskId })
        .then((task)=>{
            res.status(200).send(task)
        })
        .catch((error)=>{console.log(error)});
});

//Update 1 task beloging to 1 TaskList
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req,res) =>{
    Task.findOneAndUpdate({ _tasklistId: req.params.tasklistId, _id: req.params.taskId}, { $set: req.body })
        .then((task)=>{
            res.status(200).send(task)
        })
        .catch((error)=>{console.log(error)});
});

//Delete 1 task beloging to 1 TaskList
app.delete('/tasklists/:tasklistId/tasks/:taskId', (req,res) =>{
    Task.findOneAndDelete({ _tasklistId: req.params.tasklistId, _id: req.params.taskId})
        .then((task)=>{
            res.status(200).send(task)
        })
        .catch((error)=>{console.log(error)});
});

/*app.listen(3000, function(){
    console.log("Server started on port 3000");
});*/

app.listen(3000, () =>{
    console.log("Server started on port 3000");
});