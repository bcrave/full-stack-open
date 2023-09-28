import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    content: "render here notification...",
    display: false,
  },
  reducers: {
    setNotificationContent(state, action) {
      if (action.payload === undefined) return state.content;
      state.content = action.payload;
    },
    toggleNotificationDisplay(state, action) {
      state.display = action.payload;
    },
  },
});

export const { setNotificationContent, toggleNotificationDisplay } =
  notificationSlice.actions;

export const setNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(setNotificationContent(content));
    dispatch(toggleNotificationDisplay(true));

    setTimeout(() => {
      dispatch(toggleNotificationDisplay(false));
    }, timeout * 1000);
  };
};

export default notificationSlice.reducer;
