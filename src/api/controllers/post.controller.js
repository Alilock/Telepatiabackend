const { post, user } = require('../../models/index');
const { fileSave } = require('../../services/fileService')
const postController = {

    publish: async (req, res, next) => {
        try {
            const content = req.body.content;
            const photos = req.files;
            const userId = req.body.userId
            let images = []
            if (photos) {
                images = fileSave(photos.photos)
            }

            const newpost = new post({
                author: userId,
                content: content,
                photos: images,
            })
            await newpost.save();
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
            const posts = await post.find();
            res.json({
                data: posts,
                statusCode: 200
            });
        } catch (error) {
            next(error);
        }
    },
    getAllByUser: async (req, res, next) => {
        try {
            const { userId } = req.query;
            const query = userId ? { author: userId } : {};
            const posts = await post.find(query).populate('author');
            res.json(posts);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = postController; 