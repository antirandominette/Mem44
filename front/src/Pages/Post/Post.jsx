import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import PostDetails from '../../Components/PostDetails/PostDetails';
import { useState, useEffect } from 'react';
import './Post.css';

function Post() {
    const userToken = localStorage.getItem('token');
    const userIsConnected = localStorage.getItem('isConnected');
    const [postDetails, setPostDetails] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userIsConnected || !userToken) {
            navigate('/login');
        }
        if (userIsConnected && userToken) {
            fetch(`http://13.37.164.181:4200/api/posts/${ id }`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + userToken
                },
            })
                .then(res => res.json())
                .then(res => setPostDetails(res))
                .catch(error => console.log(error));

        }
        // eslint-disable-next-line
    }, []);
    
    return (
        <section className="post_section_container">
            <Header />
            <PostDetails post={ postDetails } />
        </section>
    );
}

export default Post;