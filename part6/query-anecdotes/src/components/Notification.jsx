const style = {
  border: 'solid',
  padding: 10,
  borderWidth: 1,
  marginBottom: 5
}

const Notification = ({ notification }) => {

  if (notification) {
    return (
      <div style={style}>
        {notification}
      </div>
    )
  }

  return null
}

export default Notification
