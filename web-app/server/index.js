const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')
const userRouter = require('./routes/userRouter')
const port = 8080

app.use(cors({origin:"http://localhost:3000"}))
app.use(express.json())

app.use('/user', userRouter)

app.get('/',(req, res) => {
      res.send('Hello from our server!')
})

db.sequelize.sync().then(() => {
      app.listen(8080, () => {
            console.log(`Server is running on http://localhost:${port}`)
      })
}).catch((error) => {
      console.error('Unable to connect to the database:', error)
})



