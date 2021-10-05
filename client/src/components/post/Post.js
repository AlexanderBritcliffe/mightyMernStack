import React, { Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Ghost from '../layout/Ghost';
import PostItem from '../posts/PostItem';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';
import { getPost } from '../../actions/post'

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);

  return loading || post === null ? (
    <Ghost />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
      Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
      {post.comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} postId={post._id} />
      ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}
const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPost })(Post)
