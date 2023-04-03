const { post, user, comment, notification } = require('../../models/index');
const { fileSave } = require('../../services/fileService')
const { getStorage, uploadBytes, ref, getDownloadURL } = require('firebase/storage')
const sharp = require('sharp');

const postController = {

    publish: async (req, res, next) => {
        try {
            const storage = getStorage()
            const content = req.body.content;
            console.log('geldi');
            const photos = req.files?.photos;

            const userId = req.body.userId
            const userDb = await user.findById(userId)
            let downloadURL = ''
            if (photos) {

                const resizedImage = await sharp(photos.data)
                    .resize(800) // Set the maximum width or height to 800 pixels
                    .jpeg({ quality: 80 }) // Convert the image to JPEG format with 80% quality
                    .toBuffer();
                let compressedImage = resizedImage;
                let compressedSize = compressedImage.length;
                while (compressedSize > 1000000) {
                    compressedImage = await sharp(compressedImage)
                        .jpeg({ quality: 70 }) // Reduce the quality by 10%
                        .toBuffer();
                    compressedSize = compressedImage.length;
                }

                const storageRef = ref(storage, photos.name)


                const snapshot = await uploadBytes(storageRef, compressedImage);
                downloadURL = await getDownloadURL(storageRef);

            }
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
                const existingNotification = await notification.findOne({
                    user: postDb.author,
                    userBy: userId,
                    type: 'like',
                    post: postDb._id,
                });

                // if a like notification does not exist, create a new notification object and save it to the database
                const notificationDb = new notification({
                    user: postDb.author,
                    userBy: userId,
                    type: 'like',
                    post: postDb._id,
                    date: new Date(),
                });
                await notificationDb.save();
                // io.emit('newNotification', notification);
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
        //write notification logic in this postComment?

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

            // if a like notification does not exist, create a new notification object and save it to the database
            const notificationDb = new notification({
                user: postDb.author,
                userBy: userId,
                type: 'comment',
                post: postDb._id,
                date: new Date(),
            });
            await notificationDb.save();
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