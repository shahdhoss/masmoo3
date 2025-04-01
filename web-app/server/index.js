const express = require('express')
const app = express()
const cors = require('cors')
const port = 8080

app.use(cors())


app.get('/', (req, res) => {
      res.send('Hello from our server!')
})

app.listen(8080, () => {
      console.log(`Server is running on http://localhost:${port}`)
})



