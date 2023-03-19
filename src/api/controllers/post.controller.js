const { post } = require('../../models/index');
const { fileSave } = require('../../services/fileService')
const postController = {

    publish: (req, res, next) => {
        try {
            const content = req.body.content;
            const photos = req.files;
            const userId = req.body.userId
            let images = []
            console.log(photos);
            if (photos) {
                images = fileSave(photos.photos)
            }
            const newpost = new post({
                author: userId,
                content: content,
                photos: images,
            })
            newpost.save();
            res.json({
                data: newpost,
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
        console.log('sa');
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