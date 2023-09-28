import { useSelector } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer";

export default function Anecdotes({ dispatch }) {
  const { anecdotes, filter } = useSelector((state) => state);

  const handleClick = (anecdote) => {
    dispatch(vote(anecdote));
    dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => {
        if (anecdote.content.toLowerCase().includes(filter.toLowerCase())) {
          return <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleClick(anecdote)}>vote</button>
            </div>
          </div>
        }
      }
      )}
    </div >
  )
}
