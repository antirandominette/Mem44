import Header from "../../Components/Header/Header"; 
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Forum.css";


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

    function handleCreatePost() {
        navigate('/forum/create-post');
    }

    return (
        <section className="forum_section_container">
            <Header />
            <h2 className="forum_section_title">Forum</h2>
            <button className="forum_section_create_post_button" onClick={ handleCreatePost }>Create a post</button>
            {
                    posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="forum_post_container">
                            <NavLink  className="forum_post_content" to={ `/forum/post/${post._id}` }>
                                <div className="flexRow">
                                    <h2 className="forum_post_title">{post.title}</h2>
                                    <p className="forum_post_duration">Campaign {post.duration} weeks</p>
                                </div>

                                <p className="forum_post_resume">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae repellendus voluptatem deleniti ipsam, sunt consequuntur amet quo officiis maiores enim, maxime delectus! Quisquam tempore quae nulla dolorum aut. Repellat ut quisquam placeat voluptatum dolorum. Nisi repellat voluptatibus vero dignissimos hic.</p>
                            </NavLink>

                            <div className="forum_post_votes_container">
                                <p>{ post.likes }</p>
                                <p>{ post.dislikes }</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No posts available</p>
                )
            }
        </section>
    );
}

export default Forum;
