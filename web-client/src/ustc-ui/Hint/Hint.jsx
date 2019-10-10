import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const Hint = connect(props => {
  const { children, exclamation, fullWidth, wider } = props;

  return (
    <div
      className={`alert-gold add-bottom-margin ${
        fullWidth ? 'full-width' : ''
      } ${wider ? 'wider' : ''}`}
    >
      <span className="usa-hint ustc-form-hint-with-svg">
        {!exclamation && (
          <FontAwesomeIcon className="fa-icon-gold" icon="flag" size="lg" />
        )}
        {exclamation && (
          <FontAwesomeIcon
            className="fa-icon-gold"
            icon={['fas', 'exclamation-circle']}
            size="lg"
          />
        )}
        {children}
      </span>
    </div>
  );
});
