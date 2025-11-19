import express from 'express'
const app = express()

import user from './user.js'
import category from "./category.js"

app.use("/user",user)
app.use("/category",category)

export default app