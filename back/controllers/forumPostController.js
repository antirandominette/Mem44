const Post = require('../models/forumPostModel');
const fs = require('fs');

exports.createPost = (req, res) => {
    console.log(req.body.post);
    const postObject = req.body.post;

    delete postObject._id;

    const post = new Post({
        ...postObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    post.save()
        .then(() => res.status(201).json({ message: 'Post created successfully !' }))
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
    const like = req.body.like;
    const userId = req.auth.userId;
    const postId = req.params.id;

    function addLike() {
        Post.updateOne({ _id: postId }, { $inc: { likes: 1 }, $push: { usersLiked: userId } })
            .then(() => res.status(200).json({ message: 'Post liked successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post like failed !' }));
    }

    function removeLike() {
        Post.updateOne({ _id: postId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
            .then(() => res.status(200).json({ message: 'Post unliked successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post unlike failed !' }));
    }

    function addDislike() {
        Post.updateOne({ _id: postId }, { $inc: { dislikes: 1 }, $push: { usersDisliked: userId } })
            .then(() => res.status(200).json({ message: 'Post disliked successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post dislike failed !' }));
    }

    function removeDislike() {
        Post.updateOne({ _id: postId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
            .then(() => res.status(200).json({ message: 'Post undisliked successfully !' }))
            .catch(error => res.status(400).json({ message: 'Post undislike failed !' }));
    }

    switch (like) {
        case 1:
            Post.findOne({ _id: postId })
                .then(post => {(
                    userId === req.auth.userId && !post.usersLiked.includes(userId) && !post.usersDisliked.includes(userId)) ? addLike() : res.status(401).json({ message: 'Unauthorized request !' })})
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        case -1:
            Post.findOne({ _id: postId })
                .then(post => {(userId === req.auth.userId && !post.usersLiked.includes(userId) && !post.usersDisliked.includes(userId)) ? addDislike() : res.status(401).json({ message: 'Unauthorized request !' })})
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        case 0:
            Post.findOne({ _id: postId })
                .then(post => {
                    switch(true) {
                        case (userId === req.auth.userId && post.usersLiked.includes(userId) && !post.usersDisliked.includes(userId)):
                            removeLike();
                            break;
                        case (userId === req.auth.userId && !post.usersLiked.includes(userId) && post.usersDisliked.includes(userId)):
                            removeDislike();
                            break;
                        default:
                            res.status(401).json({ message: 'Unauthorized request !' });
                    }
                })
                .catch(error => res.status(404).json({ message: 'Post not found !' }));

            break;
        default:
            res.status(400).json({ message: 'Invalid request !' });
    }
};
