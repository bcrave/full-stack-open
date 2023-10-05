import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests';

const AnecdoteForm = ({ notificationDispatch }) => {
  const queryClient = useQueryClient();

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))

      notificationDispatch({
        type: 'ANECDOTE_ADDED',
        payload: `New anecdote '${newAnecdote.content}' successfully added!`,
      })

      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE_NOTIFICATION'
        })
      }, 5000)
    },
    onError: () => {
      notificationDispatch({
        type: 'ERROR',
        message: 'Anecdote must have length of 5 or more'
      })

      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE_NOTIFICATION'
        })
      })
    }
  });

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    if (content.length < 5) {
      notificationDispatch({
        type: 'ERROR',
        payload: 'Anecdote must have length of 5 or more'
      })

      setTimeout(() => {
        notificationDispatch({
          type: 'REMOVE_NOTIFICATION'
        })
      }, 5000)
    } else {
      newAnecdoteMutation.mutate({ content, votes: 0 })
    }
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
