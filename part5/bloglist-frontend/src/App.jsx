import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import FormLogin from './components/FormLogin';
import FormBlog from './components/FormBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';

const styles = {
  flexCol: {
    display: 'flex',
    flexDirection: 'column',
    width: '15%',
  },
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const blogFormRef = useRef();

  const getBlogs = async () => {
    const blogs = await blogService.getAll();
    setBlogs(blogs.sort((a, b) => a.likes - b.likes));
  };

  useEffect(() => {
    getBlogs();

    return () => getBlogs;
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem('blogAppUser');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const createBlog = async (newBlog) => {
    try {
      const savedBlog = await blogService.create(newBlog);

      const blogs = await blogService.getAll();
      setBlogs(blogs);

      setNotification({
        type: 'success',
        message: `A new blog '${savedBlog.title}' by ${savedBlog.author} added`,
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);

      blogFormRef.current.toggleVisibility();

    } catch (exception) {
      setNotification({ type: 'error', message: 'Could not add blog' });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      console.error(exception);
    }
  };

  const addLike = async (id, likes) => {
    const blog = blogs.find((blog) => blog.id === id);

    const updatedBlog = {
      user: blog.user?.id,
      likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);

    setBlogs((blog) => blog.id !== id ? blog : returnedBlog);
  }

  const handleDelete = async (blog) => {
    const confirmation = window.confirm(
      `Delete blog: ${blog.title} by ${blog.author}?`
    );

    if (confirmation) {
      await blogService.remove(blog.id);

      setBlogs(blogs.filter((b) => b.id !== blog.id));
    } else {
      return;
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('blogAppUser');
    window.location.reload(false);
  };


  if (user !== null) {
    return (
      <div className='note'>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
          />
        )}

        <h2>Blogs</h2>

        <div style={styles.flexCol}>
          <button onClick={handleLogout}>Log out</button>

          <p>Logged in as {user.username}</p>

          <Togglable buttonLabel='New Blog' ref={blogFormRef}>
            <FormBlog
              createBlog={createBlog}
            />
          </Togglable>
        </div>

        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            isCurrentUser={user.username === blog.user?.username}
            addLike={addLike}
            setBlogs={setBlogs}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <h1>Blogs app</h1>

      <h2>Log into application</h2>

      <Togglable buttonLabel='Login'>
        <FormLogin setUser={setUser} setNotification={setNotification} />
      </Togglable>

      <p>Bloglist app, Department of Computer Science, University of Helsinki 2023</p>
    </div>
  );
};

export default App;
