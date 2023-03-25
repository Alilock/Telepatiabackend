const { post, user, comment } = require('../../models/index');
const { fileSave } = require('../../services/fileService')
const { getStorage, uploadBytes, ref, getDownloadURL } = require('firebase/storage')

const postController = {

    publish: async (req, res, next) => {
        const storage = getStorage()
        console.log('sa');
        try {
            const content = req.body.content;
            const photos = req.files.photos;
            const userId = req.body.userId
            const userDb = await user.findById(userId)
            let images = []
            const storageRef = ref(storage, photos.name)
            const snapshot = await uploadBytes(storageRef, photos.data);
            const downloadURL = await getDownloadURL(storageRef);

            const newpost = new post({
                author: userId,
                content: content,
                photos: downloadURL,
            })
            await newpost.save();
            await userDb.posts.push(newpost)
            await userDb.save()
            const returnpost = await newpost.populate('author')
            res.json({
                data: returnpost,
                statusCode: 201
            })
        } catch (error) {
            next(error);
        }
    },
    getAll: async (req, res, next) => {
        try {
            const posts = await post.find().populate('author').sort({ createdAt: -1 });;
            res.json({
                data: posts,
                statusCode: 200
            });
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const postId = req.query.postId
            const postDb = await post.findById(postId)
                .populate('author')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        model: 'User'
                    }
                });
            res.json(postDb)

        } catch (error) {
            next(error)
        }

    },
    getAllByUser: async (req, res, next) => {
        try {
            const { userId } = req.query;
            const query = userId ? { author: userId } : {};
            const posts = await post.find(query).populate('author').sort({ createdAt: -1 });

            res.json(posts);
        } catch (error) {
            next(error);
        }
    },
    likePost: async (req, res, next) => {
        try {

            const { postId, userId } = req.body;
            const postDb = await post.findById(postId);

            // check if the user has already liked the post
            const isLiked = postDb.likes.some((like) => like.equals(userId));

            if (isLiked) {
                // if user already liked the post, unlike the post
                postDb.likes = postDb.likes.filter((like) => !like.equals(userId));
            } else {
                // if user has not liked the post, like the post
                postDb.likes.push(userId);
            }

            // save the updated post
            const updatedPost = await postDb.save();

            res.json({
                data: updatedPost,
                statusCode: 200,
            });
        } catch (error) {
            next(error);
        }
    },
    postComment: async (req, res, next) => {
        try {
            const { postId, userId, content } = req.body;
            const userDb = await user.findById(userId)
            const postDb = await post.findById(postId).populate('author')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'author',
                        model: 'User'
                    }
                });;
            const newComment = new comment({
                author: userDb,
                post: postId,
                content: content
            })
            await newComment.save()
            await postDb.comments.push(newComment);
            await postDb.save()
            res.json(postDb)
        } catch (error) {
            next(error);
        }
    },

}

module.exports = postController; 