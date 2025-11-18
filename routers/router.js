import express from 'express'
const app = express()

import user from './user.js'

app.use("/user",user)

export default app