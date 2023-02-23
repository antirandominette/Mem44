import jquery from 'jquery';
import "./PostDetails.css";
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

function PostDetails({ post }) {
    const navigate = useNavigate();

    function deletePost() {
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        Axios.delete(`http:////13.37.164.181:4200/api/posts/${ post._id }`)
            .then(response => {
                console.log(response);
                navigate('/forum');
            })
            .catch(error => {
                console.log(error);
            });
    }

    if (!jquery.isEmptyObject(post)) {
        return (
            <section className="post_details_container">
                <div className="post_details_content">
                    <h2 className="post_details_title">{ post.title }</h2>
                    <p className="post_details_description">Details : { post.description }</p>
                    <img className="post_details_image" src={ post.imagesIntels } alt="post_image" />
                </div>
                {/* delete button */}
                <button className="post_details_delete_button" onClick={ deletePost }>Delete</button>
            </section>
        )
    }
    else {
        return (
            <section className="post_details_container">
                <div className="post_details_content">
                    <h2 className="post_details_title">Loading...</h2>
                </div>
            </section>
        )
    }
}

export default PostDetails;