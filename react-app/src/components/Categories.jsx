import './header.css'
import categories from './CategoriesList';
import { useNavigate } from 'react-router-dom';

function Categories(props) {

    const navigate = useNavigate('')

    return (
        <div className='cat-container'>
            <div>
                <span className='pr-3'>All Categories</span>
                {categories && categories.length > 0 &&
                    categories.map((item, index) => {
                        return (
                            <span onClick={() => navigate('/category/' + item)} key={index} className='category'> {item} </span>
                        )
                    })}
            </div>
        </div>
    )
}


export default Categories;