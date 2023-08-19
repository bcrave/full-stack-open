const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'HTML is Easy',
    author: 'Brendon Crave',
    url: 'https://google.com/',
    likes: 13,
  },
  {
    title: 'Coding is Fun',
    author: 'Brendon Crave',
    url: 'https://github.com/',
    likes: 12,
  },
];

const initialUsers = [
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  },
  {
    username: 'bcrave',
    name: 'Brendon Crave',
    password: 'sekret',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({}).populate('user', { id: 1 });
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  initialUsers,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
