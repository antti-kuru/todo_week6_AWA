import express, {Express, Router} from "express"
import morgan from "morgan"
import router from "./src/index"
import path from "path"
import mongoose, {Connection} from "mongoose"
import {User, IUser, ITodo} from "./src/models/User"







const app: Express = express()
const port = 3000


const mongoDB: string = "mongodb://127.0.0.1:27017/testdb"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection


db.on("error", console.error.bind(console, "Error connecting MongoDB"))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan("dev"))

app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)




app.listen(port, () => {
    console.log(`server running on port ${port}`)

})