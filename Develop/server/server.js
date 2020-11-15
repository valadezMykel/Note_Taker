const express = require("express");
const path = require("path");
const fs = require("fs");
const { request } = require("http");
const { json } = require("express");

const app = express();
const PORT = 4400;

app.use(express.static("./Develop/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// function dbAccessor(){
//     let tt;
//     fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
//         if(err) throw err;
//         console.log("in")
//         tt = JSON.parse(data);
//     }).then((tt)=>{
        
//         return tt;
//     });
// };

app.get("/notes", function(request, response){
    response.sendFile(path.join(__dirname, "../public/notes.html"));
});


app.get("/api/notes", function(req, res){
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        if(err) throw err;
        res.json(JSON.parse(data));
    });
    // res.json(dbAccessor());
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/api/notes", function(req, res){
    // takes db, parses, then pushes new object, then puts it back into db
    let saveThisNote = req.body;
    let updateThisArr;

    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        if(err) throw err;
        updateThisArr = JSON.parse(data);
        updateThisArr.push(saveThisNote);
        updateThisArr = JSON.stringify(updateThisArr);
        fs.writeFile("Develop/db/db.json", updateThisArr, (err) => {if(err) throw err});
        
    });
    res.json(saveThisNote);
});

app.delete("/api/notes/:id", function(req, res){

});

app.listen(PORT, function(){
    console.log("App listening on PORT"+ PORT);
});