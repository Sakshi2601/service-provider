import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { BsBookmarkStar } from "react-icons/bs";
import './home.css';


function CategoryPage() {

    const navigate = useNavigate()

    const param = useParams()
    console.log(param);

    const [products, setproducts] = useState([]);
    const [cproducts, setcproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [issearch, setissearch] = useState(false);

    // useEffect(() => {
    //     if (!localStorage.getItem('token')) {
    //         navigate('/login')
    //     }
    // }, [])

    useEffect(() => {
        const url ='http://localhost:4000/get-products?catName=' + param.catName;
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }, [param])

    const handlesearch = (value) => {
        setsearch(value);
    }

    const handleClick = () => {

        const url = 'http://localhost:4000/search?search=' + search;
        axios.get(url)
            .then((res) => {
                setcproducts(res.data.products);
                setissearch(true);
            })
            .catch((err) => {
                alert('Server Err.')
            })

        // let filteredProducts = products.filter((item) => {
        //     if (item.pname.toLowerCase().includes(search.toLowerCase()) ||
        //         item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        //         item.category.toLowerCase().includes(search.toLowerCase())) {
        //         return item;
        //     }
        // })
        // setcproducts(filteredProducts)

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

        const url = 'http://localhost:4000/like-product';
        const data = { userId, productId }
        axios.post(url, data)
            .then((res) => {
                if (res.data.message) {
                    alert('Marked.')
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })

    }


    const handleProduct = (id) => {
        navigate('/product/' + id)
    }


    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            {issearch && cproducts &&
                <h5> SEARCH RESULTS
                    <button className="clear-btn" onClick={() => setissearch(false)}> CLEAR </button>
                </h5>}

            {issearch && cproducts && cproducts.length == 0 && <h5> No Results Found </h5>}
            {issearch && <div className="d-flex justify-content-center flex-wrap">
                {cproducts && products.length > 0 &&
                    cproducts.map((item, index) => {

                        return (
                            <div key={item._id} className="card m-3 ">
                                <div onClick={() => handleLike(item._id)} className="icon-con">
                                <BsBookmarkStar className="icons" />
                                </div>
                                <img width="300px" height="200px" src={'http://localhost:4000/' + item.pimage} />

                                <p className="m-2"> {item.pname}  | {item.category} </p>
                                <h3 className="m-2 text-danger"> {item.price} </h3>
                                <p className="m-2 text-success"> {item.servicetype} </p>
                                <p className="m-2 text-success"> {item.pdesc} </p>
                            </div>
                        )

                    })}
            </div>}

            {!issearch && <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => {

                        return (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
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
            </div>}

        </div>
    )
}

export default CategoryPage;