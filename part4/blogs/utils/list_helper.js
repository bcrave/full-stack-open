const _ = require('lodash');

const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0);

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const mostLikes = Math.max(...likes);
  const blogWithMostLikes = blogs.filter((blog) => blog.likes === mostLikes)[0];

  return {
    title: blogWithMostLikes.title,
    author: blogWithMostLikes.author,
    likes: blogWithMostLikes.likes,
  };
};

const groupBlogsByAuthor = (blogs) => _.groupBy(blogs, (blog) => blog.author);

const getAuthorWithMostBlogs = (blogs) => {
  const groupedBlogs = groupBlogsByAuthor(blogs);
  let mostBlogs = -Infinity;
  let authorWithMostBlogs = {};

  Object.keys(groupedBlogs).forEach((author) => {
    const authorBlogs = groupedBlogs[author];
    if (authorBlogs.length > mostBlogs) {
      mostBlogs = authorBlogs.length;
      authorWithMostBlogs = { author, blogs: mostBlogs };
    }
  });

  return authorWithMostBlogs;
};

const getAuthorWithMostLikes = (blogs) => {
  const groupedBlogs = groupBlogsByAuthor(blogs);
  let mostLikes = -Infinity;
  let authorWithMostLikes = {};

  Object.keys(groupedBlogs).forEach((author) => {
    const listOfLikes = groupedBlogs[author].map((blog) => blog.likes);

    const totalAuthorLikes = listOfLikes.reduce((a, b) => a + b);
    if (totalAuthorLikes > mostLikes) {
      mostLikes = totalAuthorLikes;
      authorWithMostLikes = { author, likes: mostLikes };
    }
  });

  return authorWithMostLikes;
};

module.exports = {
  totalLikes,
  favoriteBlog,
  getAuthorWithMostBlogs,
  getAuthorWithMostLikes,
};
