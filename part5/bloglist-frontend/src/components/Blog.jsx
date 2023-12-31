import { useEffect, useState } from 'react';

const Blog = ({ blog, isCurrentUser, handleDelete, addLike }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    border: '1px solid black',
    margin: '1rem 0',
    padding: '1rem',
  };

  useEffect(() => {
    setLikes(blog.likes);
  }, [blog.likes]);

  const handleLike = () => {
    setLikes((prev) => prev + 1);
    addLike(blog.id, likes + 1);
  }

  return (
    <div style={blogStyle} data-blog>
      <span>{blog.title}</span>
      <span>{blog.author}</span>

      {showDetails && (
        <div data-details>
          <div data-testid='blog-url'>Url: {blog.url}</div>

          <div data-testid='blog-likes'>
            Likes: {likes}

            <button data-testid={`like-button-${blog.id}`} onClick={handleLike}>Like</button>
          </div>

          {blog.user && <div>Created By: {blog.user.name}</div>}

          {isCurrentUser && <button onClick={() => handleDelete(blog)}>Delete</button>}
        </div>
      )}

      <button onClick={() => setShowDetails((prev) => !prev)}>
        {showDetails ? 'Hide details' : 'Show details'}
      </button>
    </div>
  );
};

export default Blog;
