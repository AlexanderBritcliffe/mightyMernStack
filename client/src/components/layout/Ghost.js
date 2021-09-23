import React, { Fragment } from 'react';
import ghost from './ghost.gif';

export default () => (
  <Fragment>
    <img
      src={ghost}
      style={{width: '200px', margin: 'auto', display: 'block'}}
      alt='Loading...'
      />
  </Fragment>
);
