import CommentModel from '../models/Comment.js';
//import lodash from 'lodash';

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user').exec();

    //const sortPostByCreate = lodash.orderBy(comments, ['createdAt'], ['desc']);

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить комментарии',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};
