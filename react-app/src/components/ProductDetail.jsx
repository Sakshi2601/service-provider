import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import './home.css'

function ProductDetail() {

    const [product, setproduct] = useState()
    const [user, setuser] = useState()
    console.log(user, "userrrrr")
    const p = useParams()

    useEffect(() => {
        const url = 'http://localhost:4000/getProduct/' + p.productId;
        axios.get(url)
            .then((res) => {
                if (res.data.product) {
                    setproduct(res.data.product)
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }, [])


    const handleContact = (addedBy) => {
        console.log('id', addedBy)
        const url = 'http://localhost:4000/get-user/' + addedBy;
        axios.get(url)
            .then((res) => {
                if (res.data.user) {
                    setuser(res.data.user)
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }

    return (<>
        <Header />
        <div >
            {product && <div className="card mx-auto mb-3" style={{width: 1000}}>
                <div width="600px" height="600px" >
                    <img src={'http://localhost:4000/' + product.pimage} alt="" className="card-img-top" />
                    {product.pimage2 && <img src={'http://localhost:4000/' + product.pimage2} alt="" className="card-img-top"/>}
                </div>
                    
                    <div className="card-body text-center">
                    <h3 className="card text-white bg-dark"> Service Provider Details:</h3>
                        <h5 className="card-title">{product.pname}</h5>
                    <h5 className="m-2 card-text"> Rs. {product.price} /- </h5>
                    <p className="m-2"> {product.category} </p>
                    <p className="m-2 text-success card-text"> {product.servicetype} </p>
                    <p className="m-2 text-success card-text"> {product.pdesc} </p>
                    {product.addedBy &&
                        <button className="btn btn-primary" onClick={() => handleContact(product.addedBy)}>
                            SHOW CONTACT DETAILS
                        </button>}
                    </div>
                    <div className="card-footer text-muted text-center">
                    {user && user.username && <h6>{user.username}</h6>}
                    {user && user.mobile && <h6>{user.mobile}</h6>}
                    {user && user.email && <h6>{user.email}</h6>}
                    </div>
            </div>}
        </div>
    </>

    )
}

export default ProductDetail;


// 6:22 stopped......