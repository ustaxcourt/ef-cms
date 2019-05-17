import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const Hint = connect(props => {
  const { children } = props;

  return (
    <div className="alert-gold add-bottom-margin">
      <span className="usa-hint ustc-form-hint-with-svg">
        <FontAwesomeIcon
          icon="arrow-alt-circle-left"
          className="fa-icon-gold"
          size="lg"
        />
        {children}
      </span>
    </div>
  );
});
