import express from "express";
import { getAllPost, fetchPost, createPost, updatePost, deletePost, likePost , getPostsBySearch, commentPost} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router= express.Router();

router.get('/', getAllPost);
router.get('/:id', fetchPost);
router.get('/posts/search', getPostsBySearch);
router.post('/',auth,  createPost);
router.patch('/:id',auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth,  likePost);
router.post('/:id/commentPost', auth,  commentPost);


export default router;