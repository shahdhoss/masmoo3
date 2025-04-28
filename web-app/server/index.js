const express = require('express')
const app = express()
const cors = require('cors')
const db = require('./models')
const userRouter = require('./routes/userRouter')
const audioBookRouter = require('./routes/audioBookRouter')
const port = 8080
const initialiseBooks = require('./initialiseBooks.js')
const reviewRouter = require('./routes/reviewRouter');
const initialiseReviews = require("./initializeReviews.js")


// db.connectToMongo();

initialiseBooks(); // you can comment after initialising

app.use(cors())
app.use(express.json())

app.use('/user', userRouter)
app.use('/audiobook',audioBookRouter)
app.use('/reviews', reviewRouter);
app.get('/',(req, res) => {
      res.send('Hello from our server!')
})

db.sequelize.sync().then(() => {
      app.listen(8080, () => {
            console.log(`Server is running on ${port}`)
      })
}).catch((error) => {
      console.error('Unable to connect to the database:', error)
})



