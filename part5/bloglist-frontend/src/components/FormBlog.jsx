import { useState } from 'react';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    width: '100%',
  },
};

export default function FormBlog({ createBlog }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleNewBlog = async (e) => {
    e.preventDefault();
    createBlog({ title, author, url });
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
            data-testid='titleInput'
          />
        </label>
        <label>
          author:{' '}
          <input
            type='text'
            onChange={({ target }) => setAuthor(target.value)}
            value={author}
            data-testid='authorInput'
          />
        </label>
        <label>
          url:{' '}
          <input
            type='text'
            onChange={({ target }) => setUrl(target.value)}
            value={url}
            data-testid='urlInput'
          />
        </label>

        <input type='submit' style={styles.submit} data-testid='blogFormSubmit' />
      </form>
    </div>
  );
}
