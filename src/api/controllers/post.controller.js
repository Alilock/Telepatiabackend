const { post } = require('../../models/index');

const postController = {
    getAll: async (req, res, next) => {
        const page = req.query?.page || 0
        const limit = req.query?.limit || 2
        const skip = page * limit;
        const posts = await post.find().sort({ createdDate: 1 }).skip(skip).limit(limit).where({ isDeleted: false });
        res.json({
            data: posts,
            statusCode: 200
        })
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const postDb = await post.findById(id).where({
                isDeleted: false
            }).populate("project");
            if (!postDb) throw new Error("post not found");
            res.json({
                data: postDb,
                statusCode: 200
            })
        } catch (error) {
            next(error);
        }
    },
    create: (req, res, next) => {
        try {
            const content = req.body.content;

            const newpost = new post({
                content: content,
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
    delete: () => {

    },
    update: () => {

    }
}

module.exports = postController;