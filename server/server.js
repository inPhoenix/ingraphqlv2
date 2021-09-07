const { ApolloServer, gql } = require("apollo-server-express")
const bodyParser = require("body-parser")
const cors = require("cors")
const express = require("express")
const expressJwt = require("express-jwt")
const jwt = require("jsonwebtoken")
const db = require("./db")
const fs = require("fs")

const port = 9000
const jwtSecret = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64")

const app = express()
app.use(
  cors(),
  bodyParser.json(),
  expressJwt({
    secret: jwtSecret,
    credentialsRequired: false,
  })
)

const typeDefs = gql(
  fs.readFileSync("./graphql/schema.graphql", { encoding: "utf8" })
)
const resolvers = require("./graphql/resolvers")
const apolloServer = new ApolloServer({ typeDefs, resolvers })

apolloServer.applyMiddleware({ app, path: "/graphql" }) // MiddleWare to integrate with express

app.post("/login", (req, res) => {
  const { email, password } = req.body
  const user = db.users.list().find((user) => user.email === email)
  if (!(user && user.password === password)) {
    res.sendStatus(401)
    return
  }
  const token = jwt.sign({ sub: user.id }, jwtSecret)
  res.send({ token })
})

app.listen(port, () => console.info(`Server started on port ${port}`))
