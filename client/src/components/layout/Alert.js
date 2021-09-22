import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//maps through the array of alerts
//whenever you map through an array and output jsx its ba list and you need a unique key
const Alert = ({ alerts }) =>
  alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      { alert.msg }
    </div>
  ));

Alert.propTypes ={
  alerts: PropTypes.array.isRequired
}

//mapStateToPropsis taking the state that we saw in redux tools and sticking it on this component
//state.alert refrence alert in combinereducers
const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
