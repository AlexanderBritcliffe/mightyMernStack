import React, { Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ghost from '../layout/Ghost';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/post'

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost]);
  
  return loading || post === null ? (
    <Ghost />
  ) : (
    <Fragment>
      <PostItem post={post} showActions={false} />
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
