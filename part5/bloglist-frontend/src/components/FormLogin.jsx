import { useState } from 'react';
import { login } from '../services/auth';
import PropTypes from 'prop-types';

import blogService from '../services/blogs';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    width: '15%',
  },
};

export default function FormLogin({ setUser, setNotification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await login({ username, password });
      console.log(user);

      window.localStorage.setItem('blogAppUser', JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');

      setNotification({ type: 'success', message: 'Welcome!' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (exception) {
      setNotification({ type: 'error', message: 'Wrong credentials' });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  return (
    <div>
      <form style={styles.form} onSubmit={handleLogin}>
        <label>
          username:{' '}
          <input
            id='login-username'
            type='text'
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          password:{' '}
          <input
            id='login-password'
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <input type='submit' value='Log in' style={styles.submit} id='login-button' />
      </form>
    </div>
  );
}

FormLogin.propTypes = {
  setUser: PropTypes.func.isRequired,
  setNotification: PropTypes.func.isRequired,
};
