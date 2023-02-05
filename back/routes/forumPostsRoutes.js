const express = require('express');
const router = express.Router();
const forumPostCtrl = require('../controllers/forumPostController');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer_config');

router.post('/',  auth, multer, forumPostCtrl.createPost);
router.get('/', auth, forumPostCtrl.getAllPosts);
router.get('/:id', auth, forumPostCtrl.getOnePost);
router.put('/:id', auth, multer, forumPostCtrl.modifyPost);
router.delete('/:id', auth, forumPostCtrl.deletePost);
router.post('/:id/like', auth, forumPostCtrl.likePost);

module.exports = router;