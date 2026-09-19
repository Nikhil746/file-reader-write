const express = require("express")
const path = require("path")
const fs = require("fs")

const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", (req, res) => {
    fs.readdir(`./files`, (err, files) => {
        res.render("index", { files: files })
    })
    // res.send("the server is started")
})

app.post("/create", (req, res) => {
    console.log('req: ', req);
    fs.writeFile(`./files/${req.body.title.split(' ').join('-')}.txt`, req.body.content, (err) => {
        if (err) {
            console.log("Something went wrong", err.message)
        } else {
            res.redirect("/")
        }
    })
})

app.post("/edit", (req, res) => {
    fs.rename(`./files/${req.body.oldFileName}`, `./files/${req.body.newFileName}`, (err) => {
        if (err) {
            console.log("Something went wrong", err.message)
        } else {
            res.redirect("/")
        }
    })
})

app.get("/files/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, file) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        res.render("show", { fileName: req.params.filename, content: file })
        console.log('File contents:', file);
        // res.redirect("/")
    })
})

app.get("/edit/:filename", (req, res) => {
    res.render("edit", { fileName: req.params.filename })
    // res.redirect("/")
})

app.listen(3000)
