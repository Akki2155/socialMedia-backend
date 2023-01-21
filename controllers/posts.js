import express from 'express';
import mongoose from "mongoose";
import PostMessage from "../models/posts.js"

const router=express.Router();

export const getAllPost= async (req, res)=> {
    const {page}=req.query;

    try{
        const LIMIT=6;
        const startIndex= (Number(page) - 1)*LIMIT; //get the starting index of every page
        const total=await PostMessage.countDocuments({});

        const posts= await PostMessage.find().sort({ id: -1}).limit(LIMIT).skip(startIndex);
        res.status(200).json({data:posts, currentPage: Number(page), numOfPages:Math.ceil(total/LIMIT)})
    }catch(err){
        res.status(404).json({message: err.message});
    }
}

export const fetchPost = async(req,res) =>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send("No Post Available with Given Id1");
       }
    try {
        
        const post=await PostMessage.findById(id);
        if(!post){
            return res.status(404).json({message:"Post Not Found !!"})
        }
       
        return res.status(200).json(post)

    } catch (error) {
        console.log(error.message)
    }


}

export const getPostsBySearch = async(req,res) => {
    
    const  {searchQuery, tags}= req.query;
 
    try {
         const title= new RegExp(searchQuery, 'i');
       
         const posts=await PostMessage.find({ $or: [{title},{tags : { $in : tags.split(',') }}] });
         res.json({ data: posts })


    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) =>{
    const post =req.body;
    const newPost = new PostMessage({...post , creator: req.userId});
    
   try{
       await newPost.save();
       res.status(201).json(newPost);
   } catch(err){
       res.status(409).json({message: err.message});
   }
}

export const updatePost= async(req,res)=>{
   const { id: _id }= req.params;

   const post= req.body;
  
   if(!mongoose.Types.ObjectId.isValid(_id)){
    return res.status(404).send("No Post Available with Given Id");
   }
   let data=await PostMessage.findById(_id);
   const updatedPost= await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new:true} );
   res.status(200).json(updatedPost);
}

export const deletePost = async(req, res)=>{

    const {id : _id}= req.params;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("No Post Available with Given Id");
       }

     await PostMessage.findByIdAndRemove(_id);
     res.send("Post Deleted Successfully");  

}

export const likePost =  async(req, res) =>{
    const {id}=req.params;
    if(!req.userId){
        return res.json({message:"Unauthenticated !!" });
    }

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send("No Post Available with Given Id");
    }

    const post= await PostMessage.findById(id);

    const index=  post.likes.findIndex((id) => id=== String(req.userId));      // check if the id already present in like_id array 
    
    if(index===-1){
        //like the post
        post.likes.push(req.userId);

    }else{
        //dislike the post 
        post.likes=post.likes.filter((id) => id !== String(req.userId));

    }

    const updatedPost= await PostMessage.findByIdAndUpdate(id, post,{new: true});
    res.status(200).json(updatedPost);
}


export const commentPost= async(req,res)=>{
   const {id}=req.params;
   const {comment} = req.body;

   const post=await PostMessage.findById(id);
   post.comments.push(comment);

   const updatedPost=await PostMessage.findByIdAndUpdate(id, post, {new:true});

   res.json(updatedPost);

}


export default router;