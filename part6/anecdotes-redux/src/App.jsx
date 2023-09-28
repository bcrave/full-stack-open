import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import AnecdoteForm from './components/AnecdoteForm'
import Anecdotes from './components/Anecdotes'
import Filter from './components/Filter';
import Notification from './components/Notification';

import { initializeAnecdotes } from './reducers/anecdoteReducer'


const App = () => {
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  const { display: displayNotification } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  return (
    <div>
      {displayNotification &&
        <Notification />
      }
      <Filter dispatch={dispatch} />
      <Anecdotes dispatch={dispatch} />
      <AnecdoteForm dispatch={dispatch} />
    </div>
  )
}
export default App;
