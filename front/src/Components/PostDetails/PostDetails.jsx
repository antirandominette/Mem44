import jquery from 'jquery';
import "./PostDetails.css";

function PostDetails({ post }) {
    if (!jquery.isEmptyObject(post)) {
        return (
            <section className="post_details_container">
                <div className="post_details_content">
                    <h2 className="post_details_title">{ post.title }</h2>
                    <p className="post_details_description">Details : { post.description }</p>
                    <img className="post_details_image" src={ post.imagesIntels } alt="post_image" />
                </div>
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