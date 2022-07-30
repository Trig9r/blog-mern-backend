import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { UserController, PostController, CommentController } from './controllers/index.js';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentValidation,
} from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok!'))
  .catch((err) => console.log('DB error!', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  '/comments',
  checkAuth,
  commentValidation,
  handleValidationErrors,
  CommentController.create,
);
app.get('/comments', CommentController.getAll);

app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getAllPopulate);
app.get('/tags', PostController.getLastTags);

app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK!');
});
