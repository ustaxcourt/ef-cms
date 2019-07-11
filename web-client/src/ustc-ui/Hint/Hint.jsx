import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const Hint = connect(props => {
  const { children } = props;

  return (
    <div className="alert-gold add-bottom-margin">
      <span className="usa-hint ustc-form-hint-with-svg">
        <FontAwesomeIcon
          className="fa-icon-gold"
          icon="arrow-alt-circle-left"
          size="lg"
        />
        {children}
      </span>
    </div>
  );
});
