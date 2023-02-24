import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header/Header';
import './CreatePost.css';
import Axios from 'axios';

function CreatePost() {
    const [postDescriptionLength, setPostDescriptionLength] = useState();
    const [postResumeLength, setPostResumeLength] = useState();
    const [selectedFile, setSelectedFile] = useState([]);
    const [requestResult, setRequestResult] = useState(false);
    const [previewFile, setPreviewFile] = useState([]);
    const previewFiles = [];
    const selectedFiles = [];

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const resume = document.getElementById('resume').value;
        const duration = document.getElementById('duration').value;

        const data = new FormData();
        data.append('title', title);
        data.append('description', description);
        data.append('resume', resume);
        data.append('duration', duration);

        if (selectedFile.length !== 0) {
            for (const single_file of selectedFile) {
                data.append('files', single_file)
            }
        }
        
        Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

        Axios.post('http://13.37.164.181:4200/api/posts/', data)
            .then(res => { 
                console.log(res);
                navigate(`/forum/post/${ res.data.postId }`);
            })
            .catch(err => {
                console.log(err.response);
                setRequestResult(err.response.data.alreadyExists);
            })
    }

    function handleDescChange(e) {
        const postDescription = e.target.value;
        setPostDescriptionLength(postDescription.length);
    }

    function handleResumeChange(e) {
        const postResume = e.target.value;
        setPostResumeLength(postResume.length);
    }

    function handleFileChange(e) {
        const files = e.target.files;

        for (const file of files) {
            const preview = {
                preview: URL.createObjectURL(file)
            }

            previewFiles.push(preview);
            // console.log(previewFiles);
        }

        for (const file of files) {
            selectedFiles.push(file);
            // console.log(selectedFiles);
        }

        setPreviewFile(previewFiles);
        setSelectedFile(files);
    }

    return (
        <div className="create-post">
            <Header />
            <h1>Create Post</h1>
            <form className='create-post-form' onSubmit={ handleSubmit }>
                <input id="title" type="text" name="title" placeholder="Title" />
                <textarea id="description" type="text" name="description" placeholder="Description" onChange={ handleDescChange } maxLength={ 5000 } />
                {
                    postDescriptionLength > 0 && <p>{ postDescriptionLength } / 5000</p>
                }
                <input id="resume" type="text" name="resume" placeholder="Resume" onChange={ handleResumeChange } maxLength={ 450 } />
                {
                    postResumeLength > 0 && <p>{ postResumeLength } / 450</p>
                }
                <input id="duration" type="number" name="duration" placeholder="duration in weeks" />

                <input type="file" name="file" onChange={ handleFileChange } multiple />

                {
                    previewFile.map((file, index) => {
                        return (
                            <div key={ index }>
                                <img src={ file.preview } alt="preview" />
                            </div>
                        )
                    })
                }

                <button className='createPostBtn' type="submit">Create Post</button>

                {
                    requestResult && <p className="error-message">Post already exists</p>
                }
            </form>
        </div>
    );
}

export default CreatePost;