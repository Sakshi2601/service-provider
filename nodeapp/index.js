const express = require('express')
const cors = require('cors')
const path = require('path');

const app = express()

const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

const bodyParser = require('body-parser')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://root:root@cluster0.tkosugq.mongodb.net/?tls=true');


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/like-product', userController.likeProducts)

app.post('/add-product', upload.single('pimage'), productController.addProduct)

app.get('/get-products', productController.getProduct)

app.get('/getProduct/:pId', productController.getProductById)

app.get('/search', productController.search)

app.post('/liked-products', userController.likedProducts)

app.post('/signup', userController.signup)

app.get('/get-user/:uId', userController.getUserById)

app.post('/login', userController.login)

app.listen(4000)