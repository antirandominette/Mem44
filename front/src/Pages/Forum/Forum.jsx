import Header from "../../Components/Header/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Forum() {
    const navigate = useNavigate();
    const userToken = sessionStorage.getItem('token');
    const userIsConnected = sessionStorage.getItem('isConnected');
    const [posts, setPosts] = useState([]);

    /* A hook that is called when the component is mounted. Fetches all Posts in database */
    useEffect(() => {
        if (!userIsConnected || !userToken) {
            navigate('/login');
        }
        if (userIsConnected && userToken) {
            fetch('http://13.37.164.181:4200/api/posts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + userToken
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    else {
                        sessionStorage.setItem('isConnected', true);
                        return res.json();
                    }
                })
                .then(res => setPosts(res))
                .catch(error => console.log(error));
        }
        // eslint-disable-next-line
    }, []);

    return (
        <div>
            <Header />
            <h2>Forum</h2>
            {
                    posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id}>
                            <h2>{post.title}</h2>
                            <p>{post.description}</p>
                            <p>{post.resume}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )
            }
        </div>
    );
}

export default Forum;
