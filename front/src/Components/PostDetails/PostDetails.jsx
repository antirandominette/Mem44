import jquery from 'jquery';
import "./PostDetails.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

import Axios from 'axios';


function PostDetails({ post }) {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);


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
            <>
                <section className="post_details_container">
                    <div className="post_details_content">
                        <h2 className="post_details_title">{ post.title }</h2>
                        <p className="post_details_description">Details : { post.description }</p>
                        <div className="post_details_files_container">
                            {
                                post.files.map((file) => {
                                    return (
                                        <Document loading="Loading File" file={ file } key={ file } >
                                            <Page pageNumber={ 1 } width={ 500 } />
                                        </Document>
                                    )
                                })
                            }
                        </div>

                    </div>

                    <button className="post_details_delete_button" onClick={ deletePost }>Delete</button>
                </section>

                <section className='post_details_comments_container'>
                    <h2>Comments</h2>
                    
                    {
                        post.comments.map((comment) => {
                            return (
                                <div className="post_details_comment" key={ comment._id }>
                                    <h3>{ comment.username }</h3>
                                    <p>{ comment.content }</p>
                                </div>
                            )
                        }
                        )
                    }
                </section>
            </>

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