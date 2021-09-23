import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ghost from '../layout/Ghost'
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading }
 }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return loading && profile === null ? <Ghost /> : <Fragment>
    <h1 className="large text-primary">Dashboard</h1>
    <p className="lead">
      <i className="fas fa-user"></i> Welcome { user && user.name}
    </p>
    {profile !== null ? (
       <Fragment>has</Fragment>
     ) : (
       <Fragment>
        <p>You have not yet set up a profile, please add some info.</p>
        <Link to='/create-profile' className="btn btn-primary my-1">
          Create Profile
        </Link>
       </Fragment>
     )}
  </Fragment>
};
//if user exists show user name line 19
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
