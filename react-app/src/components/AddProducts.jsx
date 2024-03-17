import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";

function AddProduct() {

    const [pname, setpname] = useState('');
    const [uname, setuname] = useState('');
    const [pdesc, setpdesc] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [servicetype, setservicetype] = useState('');
    const [pimage, setpimage] = useState('');

  const navigate = useNavigate()

 useEffect(() => {
      if (!localStorage.getItem('token')) {
        navigate('/login')
      }
  }, [])

  const handleApi = () => {

    navigator.geolocation.getCurrentPosition((position) => {

        const formData = new FormData();
            formData.append('plat', position.coords.latitude)
            formData.append('plong', position.coords.longitude)
            formData.append('pname', pname)
            formData.append('uname', uname)
            formData.append('pdesc', pdesc)
            formData.append('price', price)
            formData.append('category', category)
            formData.append('servicetype', servicetype)
            formData.append('pimage', pimage)
            formData.append('userId', localStorage.getItem('userId'))

    const url = 'http://localhost:4000/add-product';
            axios.post(url, formData)
                .then((res) => {
                    console.log(res)
                    if (res.data.message) {
                        alert(res.data.message); 
                        navigate('/')
                    }
                })
                .catch((err) => {
                    alert('server err')
                })
            })
  }

    return (
      <div className="App">
        <Header />
        <div className="p-3">
                <h2> ADD PROFILE DETAILS : </h2>

                <label>Service/Company Name </label>
                <input className="form-control" type="text" value={pname}
                    onChange={(e) => { setpname(e.target.value) }} />
                <label>Service Provider Name </label>
                <input className="form-control" type="text" value={uname}
                    onChange={(e) => { setuname(e.target.value) }} />
                <label> Service Description (Services, speciality, skills)</label>
                <input className="form-control" type="text" value={pdesc}
                    onChange={(e) => { setpdesc(e.target.value) }} />
                <label> Service charge per visit</label>
                <input className="form-control" type="text" value={price}
                    onChange={(e) => { setprice(e.target.value) }} />
                <label> Service Category </label>
                <select className="form-control" value={category}
                    onChange={(e) => { setcategory(e.target.value) }}>
                    <option> Mechanic </option>
                    <option> Plumber </option>
                    <option> Artist </option>
                    <option> Electrician </option>
                    <option> Home Cleaner </option>
                    <option> Landscaper </option>
                    <option> Pest Controller </option>
                    <option> Parlour </option>
                    <option> Carpenter </option>
                    <option> Photograper </option>
                    <option> Tailor </option>
                    <option> Other... </option>
                    {
                        categories && categories.length > 0 &&
                        categories.map((item, index) => {
                            return (
                                <option key={'option' + index}> {item} </option>
                            )
                        })
                    }
                </select>
                <label>Service Type (Full/Part time) </label>
                <input className="form-control" type="text" value={servicetype}
                    onChange={(e) => { setservicetype(e.target.value) }} />
                <label> Upload your Image </label>
                <input className="form-control" type="file" onChange={(e) => {
                        setpimage(e.target.files[0])
                    }} />

                <button onClick={handleApi} className="btn btn-primary mt-3"> SUBMIT </button>
            </div>
      </div>
    );
  }
  
  export default AddProduct;