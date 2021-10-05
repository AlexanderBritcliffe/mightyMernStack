import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

//payloads come from action file do bnot forget!!
//line 30 return current state plus payload which is new posts
export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !==payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post => post._id === payload.id ? { ...post, likes: payload.likes } : post),
        loading: false
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {
          ...state.post,
          comments: state.post.comments.filter(comment => comment._id !== payload),
        },
        loading: false
      }
    default:
      return state;
  }
}

//line 70 we want to bring in all comments except the one with that id since it was just deleted from server we want to delete it from state and ui
//update likes...map through posts for each post check to see if its the correct
//one and matches the payload id if it does return new state with all stuff in
//that post...we just want to manipulate the likes to the likes that are returned

//we only want to update the likes piece otherwise return the post (...post)

//...post is says return indicidual post
//line 31 payload goes first so it is on top for UI purposes
