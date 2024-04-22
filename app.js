const express = require("express")
const articles = require('./routes/articles')
const users = require('./routes/users')
const app = express()
const connectDB = require("./config/connect");
const isLogin = require("./middlewares/isLogin")

require('dotenv').config();


app.use(express.json());
app.use('/api/v1/users/login',isLogin, users)
app.use('/api/v1/users', users),
app.use('/api/v1/articles/create', isLogin, articles)
app.use('/api/v1/articles',  articles);

app.set('view engine', 'ejs')
app.get('/', (req,res)=>{
    res.send('welcome to my blog')
})
//Error handlers
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.json({ error: err.message });
})

const PORT = process.env.PORT ;

const start = async ()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT,
    console.log(`server is running on PORT:${PORT}`))
    console.log("connected sucessfully")
    
  } catch (error) {
    console.log(error)
     process.exit(1)
    
  }
}

start()

