const app = require("./app")
const mongo = require("./services/mongo")

// CONNECT DATABASE
mongo("flitter")

// LISTEN SERVER
app.listen(3000, () => console.log("flitter listening on port 3000"))
