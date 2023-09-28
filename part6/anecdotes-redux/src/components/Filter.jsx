import { stringFilter } from '../reducers/filterReducer';

export default function Filter({ dispatch }) {
  const handleChange = (e) => {
    dispatch(stringFilter(e.target.value))
  };

  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      Filter <input onChange={handleChange} />
    </div>
  );
}
