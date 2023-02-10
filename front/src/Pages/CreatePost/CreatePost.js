import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import './CreatePost.css';

function CreatePost() {
    const [result, setResult] = useState();
    const [postDescriptionLength, setPostDescriptionLength] = useState();
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const resume = document.getElementById('resume').value;
        const duration = document.getElementById('duration').value;
        const userId = sessionStorage.getItem('userId');

        const data = {
            post: {
                title,
                description,
                resume,
                duration,
                userId,
            }
        }

        fetch('http://13.37.164.181:4200/api/posts/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            body: JSON.stringify(data),
        })
        .then(res => res.json())
        .then(res => {
            setResult(res);
            console.log(res)
            navigate(`/forum/post/${ res.postId }`);
        })
        .catch(err => console.log(err))
    }

    function handleChange(e) {
        const postDescription = e.target.value;
        setPostDescriptionLength(postDescription.length);
    }

    return (
        <div className="create-post">
            <Header />
            <h1>Create Post</h1>
            <form className='create-post-form' onSubmit={ handleSubmit }>
                <input id="title" type="text" name="title" placeholder="Title" />
                <textarea id="description" type="text" name="description" placeholder="Description" onChange={ handleChange } maxLength={ 5000 } />
                {
                    postDescriptionLength > 0 && <p>{ postDescriptionLength } / 5000</p>
                }
                <input id="resume" type="text" name="resume" placeholder="Resume" />
                <input id="duration" type="number" name="duration" placeholder="duration in weeks" />
                
                <button type="submit">Create Post</button>
            </form>

            { 
                result && <>
                    <h1>{ result.message }</h1>
                    <h2>{ result.title }</h2>
                    <h2>{ result.description }</h2>
                    <h2>{ result.resume }</h2>
                    <h2>{ result.userId }</h2>
                    <img src={ result.image } alt="post" />
                </>
            }
        </div>
    );
}

export default CreatePost;