const express = require("express");
const path = require("path");
const fs = require("fs")

const app = express();
const PORT = 4400;

app.use(express.static("Develop/public"));

app.get("/notes", function(request, response){
    response.sendFile(path.join(__dirname, "../public/notes.html"));
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/api/notes", function(req, res){
    console.log("is working")
    res.send(fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        if(err) throw err;
        console.log(data);
        return JSON.stringify(data);
    }));
});

app.post("/api/notes", function(req, res){

    res.send(req.body);
});

app.delete("/api/notes/:id", function(req, res){

});

app.listen(PORT, function(){
    console.log("App listening on PORT"+ PORT);
});