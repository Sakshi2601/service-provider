import { useEffect, useState } from "react";
import Header from "./Header";
import { Link} from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { BsBookmarkStar } from "react-icons/bs";
import './home.css'

function LikedProducts() {

  const [products, setproducts] = useState([]);
  const [search, setsearch] = useState('');
  const [cproducts, setcproducts] = useState([]);
  // useEffect(() => {
  //     if (!!localStorage.getItem('token')) {
  //       navigate('/login')
  //     }
  // }, [])

  useEffect(() => {
    const url ='http://localhost:4000/liked-products';
    let data = {userId: localStorage.getItem('userId')}
    axios.post(url, data)
        .then((res) => {
            if (res.data.products) {
                setproducts(res.data.products);
            }
        })
        .catch((err) => {
            alert('Server Err.')
        })
}, [])

const handlesearch = (value) => {
  setsearch(value);
}

const handleClick = () => {
  let filteredProducts = products.filter((item) => {
        if (item.pname.toLowerCase().includes(search.toLowerCase()) ||
            item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())) {
            return item;
        }
    })
    setcproducts(filteredProducts)
}

const handleCategory = (value) => {
  let filteredProducts = products.filter((item, index) => {
      if (item.category == value) {
          return item;
      }
  })
  setcproducts(filteredProducts)
}

const handleLike = (productId) => {
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first.')
            return;
        }

        const url = 'http://localhost:4000/like-product';
        const data = { userId, productId }
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Liked.')
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
}

    return (
      <div>
        <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
        <Categories handleCategory={handleCategory} /> 
        <h5>Search Results</h5>

        <div className="d-flex justify-content-center flex-wrap">
          {cproducts && products.length > 0 &&
            cproducts.map((item, index) => {

              return (
                <div key={(item._id)} className="card m-3">
                  <div onClick={() => handleLike(item._id)} className="icon-con">
                                    <BsBookmarkStar className="icons" />
                                </div>
                      <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimage} />
                      <h3 className="m-2 price-text"> Rs. {item.price} /- </h3>
                      <p className="m-2"> {item.pname}  | {item.category} </p>
                      <p className="m-2 text-success"> {item.servicetype} </p>
                      <p className="m-2 text-success"> {item.pdesc} </p>
                    </div>
                        )

                    })}
            </div>

        <h5> All Service Providers</h5>

        <div className="d-flex justify-content-center flex-wrap">
          {products && products.length > 0 &&
            products.map((item, index) => {

              return (
                <div key={(item._id)} className="card m-3">
                  <div onClick={() => handleLike(item._id)} className="icon-con">
                  <BsBookmarkStar className="icons" />
                                </div>
                      <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimage} />
                      <h3 className="m-2 price-text"> Rs. {item.price} /- </h3>
                      <p className="m-2"> {item.pname}  | {item.category} </p>
                      <p className="m-2 text-success"> {item.pdesc} </p>
                    </div>
                        )

                    })}
            </div>
       
      </div>
    );
  }
  
  export default LikedProducts;