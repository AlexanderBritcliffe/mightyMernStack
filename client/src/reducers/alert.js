import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); //goes through all alerts and returns all of them except one that matches payload
    default:
      return state;
  }
}
