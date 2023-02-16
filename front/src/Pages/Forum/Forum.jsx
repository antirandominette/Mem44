import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Header from "../../Components/Header/Header"; 


import "./Forum.css";


function Forum() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);

    /* Getting the user token, user id and user is connected from local storage. */
    const userToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userIsConnected = localStorage.getItem('isConnected');


    useEffect(() => {
        if (!userIsConnected || !userToken) {
            navigate('/login');
        }
        if (userIsConnected && userToken) {
            fetchPosts();
        }
        // eslint-disable-next-line
    }, []);

    function fetchPosts() { // Fetch all posts
        fetch('http://13.37.164.181:4200/api/posts/', {
                credentials: 'same-origin',
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
                        localStorage.setItem('isConnected', true);
                        return res.json();
                    }
                })
                .then(res => setPosts(res))
                .catch(error => console.log(error));
    }

    function handleCreatePost() { // Redirect to create post page
        navigate('/forum/create-post');
    }

    function postVote(postId, vote) { // Vote for a post
        const data = { vote: vote};

        fetch(`http://13.37.164.181:4200/api/posts/${ postId }/like`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + userToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(() => fetchPosts())
        .catch(error => console.log(error));
    }
    
    function handleUpvote(postId) { // Handle upvote
        const singlePost = posts.find(post => post._id === postId);
        const upvoteArrow = document.querySelector('.upvote');

        switch (true) {
            case !singlePost.usersUpvoted.includes(userId) && !singlePost.usersDownvoted.includes(userId):
                postVote(postId, 1);
                upvoteArrow.classList.remove('upvote');
                upvoteArrow.classList.add('upvoted');
                break;
            case singlePost.usersUpvoted.includes(userId) && !singlePost.usersDownvoted.includes(userId):
                postVote(postId, 0);
                break;
            default:
                postVote(postId, 0);
                break;
        }
    }

    function handleDownvote(postId) { // Handle downvote
        const singlePost = posts.find(post => post._id === postId);

        switch (true) {
            case !singlePost.usersDownvoted.includes(userId) && !singlePost.usersUpvoted.includes(userId):
                postVote(postId, -1);
                break;
            case singlePost.usersDownvoted.includes(userId) && !singlePost.usersUpvoted.includes(userId):
                postVote(postId, 0);
                break;
            default:
                postVote(postId, 0);
                break;
        }
    }

    return (
        <section className="forum_section_container">
            <Header />
            <h2 className="forum_section_title">Campaigns</h2>
            {
                    posts.length > 0 ? (
                        posts.sort((a, b) => (a.upvotes - a.downvotes) < (b.upvotes - b.downvotes) ? 1 : -1).map(
                            post => (
                                <div key={post._id} className="forum_posts_container">
                                    <div className="forum_post_container">
                                        <NavLink  className="forum_post_content" to={ `/forum/post/${post._id}` }>
                                            <div className="flexRow">
                                                <h2 className="forum_post_title">{ post.title }</h2>
                                                <p className="forum_post_duration">Campaign { post.duration } weeks</p>
                                            </div>

                                            <p className="forum_post_resume">{ post.resume }</p>
                                        </NavLink>
                                    </div>

                                    <div className="forum_post_votes_container">
                                            <svg onClick={ () => handleUpvote(post._id) } className="vote_arrow upvote" fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"/></svg>
                                            {
                                                <p className="forum_post_votes">{ post.upvotes - post.downvotes }</p>
                                            }
                                            <svg onClick={ () => handleDownvote(post._id) } className="vote_arrow downvote" fill="#000000" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z"/></svg>
                                    </div>
                                </div>
                            )
                        )
                ) : (
                    <p>No posts available</p>
                )
            }
            <button className="forum_section_create_post_button" onClick={ handleCreatePost }>Create a post</button>
        </section>
    );
}

export default Forum;
