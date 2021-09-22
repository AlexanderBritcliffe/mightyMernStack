import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';


export const setAlert = (msg, alertType) => dispatch => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id}
  });

  setTimeout(() => dispatch ({ type: REMOVE_ALERT, payload: id }), 5000);
};

//we call this action from a component SET_ALERT in reducer will be dispatched and the state will be passed into the component
