const Client = require("pg").Client;
const express = require("express");

const app = express();
app.use(express.json());

let allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
};
app.use(allowCrossDomain);

const client = new Client({
    user: "postgres",
    password: "airbus",
    host: "localhost",
    port: 5432,
    database: "airbus_aerothon",
});

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

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

app.get("/bugs", async (req, res) => {
    const rows = await getBugs();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
});

app.post("/bugs", async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await createBugs(reqJson);
        result.success = true;
    } catch (err) {
        result.success = false;
        console.error(`err in /bugs: ${err}`);
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
    }
});

async function getBugs() {
    try {
        const results = await client.query("SELECT * FROM bugs");
        return results.rows;
    } catch (e) {
        console.error(`err in getBugs: ${e}`);
        return [];
    }
}

async function getBugsByEmail(email) {
    try {
        const results = await client.query(
            "SELECT * FROM bugs WHERE email = $1",
            [email]
        );
        return results.rows;
    } catch (e) {
        console.error(`err in getBugsByEmail: ${e}`);
        return [];
    }
}

async function createBugs(bug) {
    try {
        bug = JSON.stringify(bug);
        console.log(`bug: ${bug}`);
        bug = JSON.parse(bug);
        await client.query(
            "CREATE TABLE IF NOT EXISTS bugs (id SERIAL PRIMARY KEY, subject VARCHAR(256) NOT NULL, description TEXT, email VARCHAR(100) NOT NULL, url VARCHAR(256), row_created_ TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), row_updated_ TIMESTAMP WITH TIME ZONE)"
        );
        await client.query("BEGIN");
        await client.query(
            "INSERT INTO bugs VALUES (DEFAULT, $1, $2, $3, $4)",
            [bug.subject, bug.description, bug.email, bug.url]
        );
        await client.query("COMMIT");
        return true;
    } catch (e) {
        await client.query("ROLLBACK");
        console.error(`err in createBugs: ${e}`);
        return false;
    }
}

app.get("/notification", async (req, res) => {
    const rows = await getNotification();
    res.setHeader("content-type", "application/json");
    res.send(JSON.stringify(rows));
});

app.post("/notification", async (req, res) => {
    let result = {};
    try {
        const reqJson = req.body;
        await createNotification(reqJson);
        result.success = true;
    } catch (err) {
        result.success = false;
        console.error(`err in /notification: ${err}`);
    } finally {
        res.setHeader("content-type", "application/json");
        res.send(JSON.stringify(result));
    }
});

async function getNotification() {
    try {
        const results = await client.query(
            "SELECT * FROM notification ORDER BY row_created_ DESC"
        );
        return results.rows;
    } catch (e) {
        console.error(`err in getNotification: ${e}`);
        return [];
    }
}

async function createNotification(msg) {
    try {
        msg = JSON.stringify(msg);
        console.log(`msg: ${msg}`);
        msg = JSON.parse(msg);
        await client.query(
            "CREATE TABLE IF NOT EXISTS notification (id SERIAL PRIMARY KEY, message TEXT NOT NULL, row_created_ TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), row_updated_ TIMESTAMP WITH TIME ZONE)"
        );
        await client.query("BEGIN");
        await client.query("INSERT INTO notification VALUES (DEFAULT, $1)", [
            msg.message,
        ]);
        await client.query("COMMIT");
        return true;
    } catch (e) {
        await client.query("ROLLBACK");
        console.error(`err in createNotification: ${e}`);
        return false;
    }
}
