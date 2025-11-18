import express from 'express'
import dotenv from "dotenv"
import router  from './routers/router.js'

dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api",router)


const port = process.env.PORT


app.listen(port,()=>{
    console.log(`server listening at port no. ${port}`)
})