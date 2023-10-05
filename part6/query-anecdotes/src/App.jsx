import { useReducer } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { getAnecdotes, updateAnecdote } from './requests'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ANECDOTE_ADDED':
      return action.payload;

    case 'ANECDOTE_VOTED':
      return action.payload;

    case 'ERROR':
      return action.payload;

    case 'REMOVE_NOTIFICATION':
      return null;

    default:
      return state
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, false);

  const queryClient = useQueryClient();

  const updateAnecdoteMutation = useMutation(updateAnecdote, {
    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries('anecdotes')

      notificationDispatch({
        type: 'ANECDOTE_VOTED',
        payload: `Vote added for anecdote '${updatedAnecdote.content}'!`,
      })

      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE_NOTIFICATION'
        })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery(
    {
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      refetchOnWindowFocus: false,
      retry: false
    }
  )

  const anecdotes = result.data;


  if (result.isLoading) {
    return <div>loading data...</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification notification={notification} />
      <AnecdoteForm notificationDispatch={notificationDispatch} />

      {anecdotes.map((anecdote) =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
