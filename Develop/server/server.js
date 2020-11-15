const express = require("express");
const path = require("path");
const fs = require("fs");
const uniqid = require("uniqid");

const app = express();
const PORT = process.env.PORT || 4400;

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

// function getId(){
//     id.increment();
//     let assignId = id.count;
//     return assignId;
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
    let saveThisNote = req.body;
    saveThisNote.id = uniqid();
    console.log(saveThisNote.id)
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

app.delete("/api/notes/:id", (req, res) => {
    // console.log(req.params.id);
    const deleteNoteWithThisId = req.params.id;
    console.log(deleteNoteWithThisId);
    let postDeleteArr = [];
    fs.readFile("Develop/db/db.json", "utf8", (err, data) => {
        let dbArr = JSON.parse(data);
        console.log(dbArr);

        for(let i = 0; i < dbArr.length; i++){
            if(dbArr[i].id !== deleteNoteWithThisId){
                console.log("this should appear twice")
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