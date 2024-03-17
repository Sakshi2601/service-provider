const express = require('express')
const cors = require('cors')
const path = require('path');
var jwt = require('jsonwebtoken');
const app = express()

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

const Users = mongoose.model('Users', { 
  username: String, 
  mobile: String,
  email: String,
  password: String, 
  likedProducts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

let schema = new mongoose.Schema({
  pname: String, 
  uname: String, 
  pdesc: String, 
  price: String, 
  category: String, 
  servicetype: String,
  pimage: String,
  addedBy: mongoose.Schema.Types.ObjectId,
  pLoc: {
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
    },
    coordinates: {
        type: [Number]
    }
}
})

schema.index({ pLoc: '2dsphere' });

const Products = mongoose.model('Products', schema)

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/like-product', (req, res) => {
  let productId = req.body.productId;
    let userId = req.body.userId;

    console.log(req.body);

    Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
        .then(() => {
            res.send({ message: 'liked success.' })
        })
        .catch(() => {
            res.send({ message: 'server err' })
        })
})

app.post('/add-product', upload.single('pimage'), (req, res)=>{
  console.log(req.body);
  console.log(req.file.path);

  const plat = req.body.plat;
  const plong = req.body.plong;
  const pname = req.body.pname;
  const uname = req.body.uname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const category = req.body.category;
  const servicetype = req.body.servicetype;
  const pimage = req.file.path;
  const addedBy = req.body.userId;
  const product = new Products({ pname, uname, pdesc, price, category, servicetype, pimage, addedBy, pLoc: {
    type: 'Point', coordinates: [plat, plong]
  }
})
  product.save().then(() => {
    res.send({ message: 'saved success'})
  })
  .catch(() => {
    res.send({ message: 'server error'})
  })
})

app.get('/get-products', (req, res) => {

  const catName = req.query.catName;
  let _f = {}
  if (catName) {
    _f = { category: catName }
}

  Products.find(_f)
  .then((result) => {
    console.log(result, "user")
    res.send({message:"success", products: result})
  })
  .catch((err) => {
    res.send({message: "server err"})
  })
})

app.get('/getProduct/:pId', (req, res) => {
  console.log(req.params);

  Products.findOne({ _id: req.params.pId })
      .then((result) => {
          res.send({ message: 'success', product: result })
      })
      .catch((err) => {
          res.send({ message: 'server err' })
      })

})

app.get('/search', (req, res) => {

  console.log(req.query)

    let latitude = req.query.loc.split(',')[0]
    let longitude = req.query.loc.split(',')[1]

  let search = req.query.search;
    Products.find({
        $or: [
            { pname: { $regex: search } },
            { pdesc: { $regex: search } },
            { price: { $regex: search } },
            { category: { $regex: search } },
        ],
        pLoc: {
          $near: {
              $geometry: {
                  type: 'Point',
                  coordinates: [parseFloat(latitude), parseFloat(longitude)]
              },
              $maxDistance: 500 * 1000,
          }

      }
      })
  .then((results) => {
    res.send({ message: 'success', products: results })
})
.catch((err) => {
    res.send({ message: 'server err' })
})
})

app.post('/liked-products', (req, res) => {

  Users.findOne({ _id: req.body.userId }).populate('likedProducts')
      .then((result) => {
          res.send({ message: 'success', products: result.likedProducts })
      })
      .catch((err) => {
          res.send({ message: 'server err' })
      })

})

app.post('/signup', (req,res)=>{
    console.log(req.body);
    const username = req.body.username;
    const mobile = req.body.mobile;
    const email = req.body.email;
    const password = req.body.password;
    const user = new Users({ username: username,email, mobile, password: password });
    user.save().then(() => {
      res.send({ message: 'saved success'})
    })
    .catch(() => {
      res.send({ message: 'server error'})
    })
})

app.get('/get-user/:uId', (req, res) => {
  const _userId = req.params.uId;
    Users.findOne({ _id: _userId })
        .then((result) => {
            res.send({
                message: 'success.', user: {
                    email: result.email,
                    mobile: result.mobile,
                    username: result.username
                }
            })
        })
        .catch(() => {
            res.send({ message: 'server err' })
        })
})

app.post('/login', (req,res)=>{
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  // const user = new Users({ username: username, password: password });
  Users.findOne({ username: username})
  .then((result) => {
    console.log(result, "user data")
    if(!result) {
      res.send({message: "User not found"})
    }else {
      if(result.password == password){
        const token = jwt.sign({
          data: result
        }, 'MYKEY', {expiresIn: '1h'});
        res.send({ message: 'find success', token: token, userId: result._id})
      }
      if(result.password != password){
        res.send({ message: 'password wrong'})
      }
    
    }
  })
  .catch(() => {
    res.send({ message: 'find error'})
  })
})



app.listen(4000)