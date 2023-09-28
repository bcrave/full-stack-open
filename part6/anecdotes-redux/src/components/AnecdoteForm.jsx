import { createAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = ({ dispatch }) => {
  const addAnecdote = async (e) => {
    e.preventDefault();

    const content = e.target.anecdote.value;
    e.target.anecdote.value = '';

    dispatch(createAnecdote(content));
    dispatch(setNotification(`Added '${content}'`, 5));
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
