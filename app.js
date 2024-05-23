const express = require("express");
const articles = require('./routes/articles');
const users = require('./routes/users');
const app = express();
const connectDB = require("./config/connect");
const isLogin = require("./middlewares/isLogin");
const logger = require('./logger/index');
const morgan = require('morgan');
const redisClient = require('./cache/redis');
const rateLimit = require("express-rate-limit");
const articleValidationMiddleware = require('./validator/article.validator')

require('dotenv').config();

const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, //  30 seconds
  max: 4, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  store: undefined, // Add a store option if you want to use Redis or other stores
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

redisClient.connect();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/users/login', isLogin, users);
app.use('/api/v1/users', users);
app.use('/api/v1/articles/create', articleValidationMiddleware, articles);
app.use('/api/v1/articles', articles);

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res.send('welcome to my blog');
  logger.info('Info logged')
});

// Error handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`server is running on PORT:${PORT}`);
      console.log("connected successfully");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
