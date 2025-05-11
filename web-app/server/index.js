const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./models');
const userRouter = require('./routes/userRouter');
const audioBookRouter = require('./routes/audioBookRouter');
const reviewRouter = require('./routes/reviewRouter');
const initialiseBooks = require('./initialiseBooks.js');
const initialiseReviews = require('./initializeReviews.js');
const initializeSocket = require('./socket.js');
const downloadRouter = require('./routes/downloadRouter.js')

const app = express();
const server = http.createServer(app);

const port = 8080;

// db.connectToMongo();
// initialiseBooks();

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/audiobook', audioBookRouter);
app.use('/reviews', reviewRouter);
app.use('/download',downloadRouter);

app.get('/', (req, res) => {
  res.send('Hello from our server!');
});

initializeSocket(server)

db.sequelize
  .sync()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
