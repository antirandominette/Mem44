import React, { useState } from 'react';

function CreatePost() {
    const [result, setResult] = useState();

    function handleSubmit(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const resume = document.getElementById('resume').value;
        const image = document.getElementById('image').value;
        const userId = "ergq"

        const data = {
            post: {
                title,
                description,
                resume,
                image,
                userId
            }
        }

        fetch('http://13.37.164.181:4200/api/posts/',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => setResult(res))
        .catch(err => console.log(err))
    }

    return (
        <div className="create-post">
            <h1>Create Post</h1>
            <form onSubmit={ handleSubmit }>
                <input id="title" type="text" name="title" placeholder="Title" />
                <input id="description" type="text" name="description" placeholder="Description" />
                <input id="resume" type="text" name="resume" placeholder="Resume" />
                <input id="image" type="file" name="image" />
                <button type="submit">Create Post</button>
            </form>

            { 
                result && <>
                    <h1>{ result.message }</h1>
                </>
            }
        </div>
    );
}

export default CreatePost;