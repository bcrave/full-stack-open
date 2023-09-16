import { useState } from 'react';
import blogService from '../services/blogs';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    width: '100%',
  },
};

export default function FormBlog({ setBlogs, setNotification, blogFormRef }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleNewBlog = async (e) => {
    e.preventDefault();

    try {
      const savedBlog = await blogService.create({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');

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

  return (
    <div>
      <form style={styles.form} onSubmit={handleNewBlog}>
        <label>
          title:{' '}
          <input
            type='text'
            onChange={({ target }) => setTitle(target.value)}
            value={title}
          />
        </label>
        <label>
          author:{' '}
          <input
            type='text'
            onChange={({ target }) => setAuthor(target.value)}
            value={author}
          />
        </label>
        <label>
          url:{' '}
          <input
            type='text'
            onChange={({ target }) => setUrl(target.value)}
            value={url}
          />
        </label>

        <input type='submit' style={styles.submit} />
      </form>
    </div>
  );
}
