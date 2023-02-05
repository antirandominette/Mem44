import Header from "../../Components/Header/Header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Forum() {
    const [posts, setPosts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.token) {
            fetch('http://13.37.164.181:4200/api/posts/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + location.state.token
                },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch posts');
                    }
                    return res.json();
                })
                .then(res => setPosts(res))
                .catch(error => console.log(error));
        }
    }, [ location.state ]);

    return (
        <div>
            <Header />
            <h2>Forum</h2>
            { posts.length > 0 ? (
                posts.map(post => (
                    <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                        <p>{post.resume}</p>
                    </div>
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
}

export default Forum;
