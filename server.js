const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");
// utilities packages
const util = require("util");
// this does callback function and promises
const readFile = util.promisify(fs.readFile);

const app = express();
const PORT = process.env.PORT || 4401;

app.use(express.static("./Develop/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function dbAccessor(){
    const wait = await readFile("Develop/db/db.json", "utf8")
    console.log(wait)
    return JSON.parse(wait);
};

app.get("/notes", function(request, response){
    response.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

app.get("/api/notes", async function(req, res){
    res.json( await dbAccessor());
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.post("/api/notes", async function(req, res){
    let saveThisNote = req.body;
    saveThisNote.id = uniqid();

    let updateThisArr = await dbAccessor();

    updateThisArr.push(saveThisNote);
    updateThisArr = JSON.stringify(updateThisArr);
    fs.writeFile("Develop/db/db.json", updateThisArr, (err) => {if(err) throw err});
    res.json(saveThisNote);
});

app.delete("/api/notes/:id", (req, res) => {
    const deleteNoteWithThisId = req.params.id;
    let postDeleteArr = [];

    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        let dbArr = JSON.parse(data);

        for(let i = 0; i < dbArr.length; i++){
            if(dbArr[i].id !== deleteNoteWithThisId){
                postDeleteArr.push(dbArr[i]);
            };
        };

        postDeleteArr = JSON.stringify(postDeleteArr);

        fs.writeFile("Develop/db/db.json", postDeleteArr, (err) => {
            if(err) throw err
            res.send()
        });
    });

});

app.listen(PORT, function(){
    console.log("App listening on PORT"+ PORT);
});