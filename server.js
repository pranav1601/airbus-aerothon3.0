const Client = require("pg").Client;
const express = require("express");

const app = express();
app.use(express.json());

const client = new Client({
    user: "postgres",
    password: "airbus",
    host: "localhost",
    port: 5432,
    database: "airbus_aerothon",
});

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

// fetch("http://localhost:8080/bugs", {
//     method: "GET",
// })
//     .then((a) => a.json())
//     .then(console.log(a));
app.get("/bugs", async (req, res) => {
    const rows = await getBugs();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
});

// fetch("http://localhost:8080/bugs", {
//     method: "POST",
//     headers: { "content-type": "application/json" },
//     body: JSON.stringify({ bug: { email: "abc@xyz.com" } }),
// })
//     .then((a) => a.json())
//     .then(console.log(a));
app.post("/bugs", async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await createBugs(reqJson);
        result.success = true;
    } catch (err) {
        result.success = false;
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
    }
});

app.listen(8080, () => console.log("Web server is listening... on port 8080"));

start();

async function start() {
    await connect();
}

async function connect() {
    try {
        await client.connect();
    } catch (e) {
        console.error(`Failed to connect ${e}`);
    }
}

async function getBugs() {
    try {
        const results = await client.query(
            "SELECT * FROM bug_reports WHERE subject = $1",
            ["navbar is wrong"]
        );
        return results.rows;
    } catch (e) {
        console.error(`err in getBugs: ${e}`);
        return [];
    }
}

async function createBugs(bug) {
    try {
        bug = JSON.stringify(bug);
        console.log(`bug: ${bug}`);
        bug = JSON.parse(bug);
        // console.log(`bug: ${bug}`);
        await client.query(
            "CREATE TABLE IF NOT EXISTS bug_reports (id SERIAL PRIMARY KEY, subject VARCHAR(256) NOT NULL, description TEXT, email VARCHAR(100) NOT NULL, row_created_ TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), row_updated_ TIMESTAMP WITH TIME ZONE)"
        );
        await client.query("BEGIN");
        await client.query(
            "INSERT INTO bug_reports VALUES (DEFAULT, $1, $2, $3)",
            [
                // "navbar is wrong",
                // "location of navbar should be to left",
                // "abc@xyz.com",
                bug.subject,
                bug.description,
                bug.email,
            ]
        );
        await client.query("COMMIT");
        return true;
    } catch (e) {
        await client.query("ROLLBACK");
        console.error(`err in createBugs: ${e}`);
        return false;
    }
}
