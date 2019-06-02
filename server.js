const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/fetch_user_info',(req,res) => {
    fs.readFile(`info/${req.query.id}.json`,'utf-8',(err,data) => {
        res.json(data);
    });
});

app.get('/get_event_data',(req,res) => {
    fs.readdir(`event_db/${req.query.id}`,(err,files) => {
        if (err) throw err;

        let promises = [];

        for (file of files){
            promises.push(fetch_event_data(req.query.id,file))
        }

        Promise.all(promises)
        .then((events) => {
            res.json(events);
        })
        .catch((err) => {
            res.send(null);
        })
    });
});

app.listen(3000,() => {
    console.log('Server Started');
});

function fetch_event_data(iduser,eventfile){
    return new Promise ((resolve,reject) => {
        fs.readFile(`event_db/${iduser}/${eventfile}`,'utf-8',(err,data) => {
            if (err) reject(null);
            resolve(data);
        });
    });
}
