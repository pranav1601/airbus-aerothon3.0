// GET: http://34.229.15.195:8080/bugs
fetch("http://34.229.15.195:8080/bugs", { method: "GET" })
    .then((a) => a.json())
    .then((a) => console.log(a));

// POST: http://34.229.15.195:8080/bugs
const jsonRequest = {
    subject: "ui-bug",
    description: "ui can be improved",
    email: "ola@xyz.com",
    url: "https://www.airbus.com/",
};
let result = await fetch("http://34.229.15.195:8080/bugs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonRequest),
});
result = await result.json();

// GET: http://34.229.15.195:8080/notification
fetch("http://34.229.15.195:8080/notification", { method: "GET" })
    .then((a) => a.json())
    .then((a) => console.log(a));

// POST: http://34.229.15.195:8080/notification
const jsonRequest = { message: "hello world!!!" };
fetch("http://localhost:8080/notification", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(jsonRequest),
})
    .then((a) => a.json())
    .then(console.log(a));
