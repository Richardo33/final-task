import express from "express";
import { projects } from "./src/assets/js/projects.js";
import multer from "multer";
import { Pool } from 'pg'
import path from "path";


const db = new Pool({
    user: 'postgres',
    password: 'Development1',
    host: 'localhost',
    port: 5432,
    database: 'my_portfolio',
    max: 20,
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/assets/uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage });

db.connect()
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"));
app.use(express.static('src/assets'));

app.get("/", home)

app.get("/add_project", (req, res) => {
    res.render("add_project");
});

app.post("/add_project", upload.single('imageProject'), handleAdd);

async function home(req, res) {
    try {
        const result = await db.query(`SELECT * FROM projects ORDER BY id DESC`);

        const projects = result.rows.map((project) => ({
            ...project,
            tech: project.tech || [],
            isGithubPrivate: project.is_github_private === true,
            githubUrl: project.github_url,
            demoUrl: project.demo_url
        }));
        // console.log(projects)

        res.render("home", { projects });
    } catch (error) {
        console.error("Gagal mengambil data project:", error.message);
        res.status(500).send("Internal Server Error");
    }
}


async function handleAdd(req, res) {
    try {
        const { title, description, githubUrl, demoUrl, tech, isGithubPrivate } = req.body;
        const imageName = req.file.filename;

        const techList = tech.split(",").map((t) => t.trim());

        await db.query(
            `INSERT INTO projects (title, description, image_data, github_url, demo_url, tech, is_github_private)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, description, imageName, githubUrl, demoUrl, techList, isGithubPrivate ? true : false]
        );

        res.redirect('/add_project?success=true');
        ;
    } catch (error) {
        console.error("Gagal simpan project:", error.message);
        res.status(500).send("Server error");
    }
}



app.listen(port, () => {
    console.log(`Server on http://localhost:${port}`);
});