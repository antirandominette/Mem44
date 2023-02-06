import jquery from 'jquery';
import "./PostDetails.css";

function PostDetails({ post }) {
    if (!jquery.isEmptyObject(post)) {
        return (
            <section className="post_details_container">
                <div className="post_details_content">
                    <h2 className="post_details_title">{ post.title }</h2>
                    <p className="post_details_description">{ post.description }</p>
                </div>

                <div className="post_details_votes_container">
                    <p>{ post.likes }</p>
                    <p>{ post.dislikes }</p>
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