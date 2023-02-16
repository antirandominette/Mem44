const Post = require('../models/forumPostModel');
const fs = require('fs');

exports.createPost = (req, res) => {
    console.log(req.body.post);
    const postObject = req.body.post;

    delete postObject._id;

    const post = new Post({
        ...postObject,
        userId: req.auth.userId,
        // imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    console.log(post);

    post.save()
        .then(() => res.status(201).json({ message: 'Post created successfully !', postId: post._id }))
        .catch(error => res.status(400).json({ message: 'Post creation failed !' }));
};

exports.modifyPost = (req, res) => {
    const postObject = req.file ? { ...JSON.parse(req.body.post), imageUrl: `${ req.protocol }://${ req.get('host') }/images/${ req.file.filename }` } : { ...req.body };

    delete postObject.userId;

    function updateWithoutImage() {
        Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Post updated successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post update failed !' }));
    }

    function updateWithImage(oldImageUrl) {
        fs.unlink(`images/${ oldImageUrl }`, () => {
            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post updated successfully !' }))
                .catch(error => res.status(400).json({ message: 'Post update failed !' }));
        });

        Post.finOne({ _id: req.params.id })
            .then(post => {
                const oldImageUrl = post.imageUrl.split('/images/')[1];

                switch(true) {
                    case post.userId === req.auth.userId && !req.file:
                        updateWithoutImage();
                        break;
                    case post.userId === req.auth.userId && req.file && oldImageUrl !== req.file.filename:
                        updateWithImage(oldImageUrl);
                        break;
                    default:
                        res.status(401).json({ message: 'Unauthorized request !' });
                        break;
                }
            })
            .catch(error => res.status(404).json({ message: 'Post not found !' }));
    }
};

exports.getAllPosts = (req, res) => {
    Post.find()
        .then(posts => res.status(200).json(posts))
        .catch(error => res.status(400).json({ message: 'Posts not found !' }));
};

exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => res.status(404).json({ message: 'Post not found !' }));
};

exports.deletePost = (req, res) => {
    function deletePost(post) {
        const filename = post.imageUrl.split('/images/')[1];

        fs.unlink(`images/${ filename }`, () => {
            Post.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post deleted successfully !' }))
                .catch(error => res.status(400).json({ message: 'Post deletion failed !' }));
        });
    }

    Post.findOne({ _id: req.params.id })
        .then(post => { post.userId != req.auth.userId ? res.status(401).json({ message: 'Unauthorized request !' }) : deletePost(post) })
        .catch(error => res.status(404).json({ message: 'Post not found !' }));
};

exports.likePost = (req, res) => {
    const vote = req.body.vote;
    const userId = req.auth.userId;
    const postId = req.params.id;

    console.table({ vote, userId, postId });

    function addLike() {
        Post.updateOne({ _id: postId }, { $inc: { upvotes: 1 }, $push: { usersUpvoted: userId } })
            .then(() => res.status(200).json({ message: 'Post upvoted successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post vote failed !' }));
    }

    function removeLike() {
        Post.updateOne({ _id: postId }, { $inc: { upvotes: -1 }, $pull: { usersUpvoted: userId } })
            .then(() => res.status(200).json({ message: 'Removed upvote successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post unlike failed !' }));
    }

    function addDislike() {
        Post.updateOne({ _id: postId }, { $inc: { downvotes: 1 }, $push: { usersDownvoted: userId } })
            .then(() => res.status(200).json({ message: 'Post downvoted successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post dislike failed !' }));
    }

    function removeDislike() {
        Post.updateOne({ _id: postId }, { $inc: { downvotes: -1 }, $pull: { usersDownvoted: userId } })
            .then(() => res.status(200).json({ message: 'Removed downvote successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post undislike failed !' }));
    }

    switch (vote) {
        case 1:
            Post.findOne({ _id: postId })
                .then(post => {(
                    userId === req.auth.userId && !post.usersUpvoted.includes(userId) && !post.usersDownvoted.includes(userId)) ? addLike() : res.status(401).json({ message: 'Unable to remove the upvote !' })})
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        case -1:
            Post.findOne({ _id: postId })
                .then(post => {(userId === req.auth.userId && !post.usersUpvoted.includes(userId) && !post.usersDownvoted.includes(userId)) ? addDislike() : res.status(401).json({ message: 'Unable to remove the downvote !' })})
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        case 0:
            Post.findOne({ _id: postId })
                .then(post => {
                    switch(true) {
                        case (userId === req.auth.userId && post.usersUpvoted.includes(userId) && !post.usersDownvoted.includes(userId)):
                            removeLike();
                            break;
                        case (userId === req.auth.userId && !post.usersUpvoted.includes(userId) && post.usersDownvoted.includes(userId)):
                            removeDislike();
                            break;
                        default:
                            res.status(401).json({ message: 'Unable to remove the vote !' });
                    }
                })
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        default:
            res.status(400).json({ message: 'Invalid request !' });
    }
};
