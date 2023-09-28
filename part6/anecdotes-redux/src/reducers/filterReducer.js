import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    stringFilter(state = "", action) {
      if (action.payload === undefined) return state;
      return action.payload;
    },
  },
});

export const { stringFilter } = filterSlice.actions;
export default filterSlice.reducer;
