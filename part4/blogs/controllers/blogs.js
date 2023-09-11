const { Router } = require('express');
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');

const blogsRouter = Router();

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', async (req, res) => {
  const { body, token, user } = req;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken.id || !user) {
    return res.status(401).json({ error: 'token invalid' });
  }
  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' });
  }
  if (!body.likes) body.likes = 0;

  const blog = new Blog({
    ...body,
    likes: parseInt(body.likes, 10),
    user: user.id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const { body: blog } = req;
  await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  const updatedBlog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  res.status(202).json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { token, params } = req;
  const decodedToken = jwt.verify(token, process.env.SECRET);

  let blog = await Blog.findById(params.id).populate('user', { id: 1 });
  blog = blog.toJSON();

  if (decodedToken.id !== blog.user.id) return res.status(401).end();

  await Blog.findByIdAndRemove(params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
