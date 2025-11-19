import express from 'express'
const app = express()

import user from './user.js'
import category from "./category.js"
import product from "./product.js"

app.use("/user",user)
app.use("/category",category)
app.use("/product",product)

export default app