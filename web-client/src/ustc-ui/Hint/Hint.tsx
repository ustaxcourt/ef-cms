import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';
import classNames from 'classnames';

export const Hint = connect(function Hint(props) {
  const { children, className, exclamation, fullWidth, wider } = props;

  return (
    <div
      className={classNames(
        'alert-info add-bottom-margin',
        fullWidth && 'full-width',
        wider && 'wider',
        className,
      )}
    >
      <span className="usa-hint ustc-form-hint-with-svg">
        {!exclamation && (
          <FontAwesomeIcon
            className="fa-icon-blue-vivid"
            icon="info-circle"
            size="lg"
          />
        )}
        {children}
      </span>
    </div>
  );
});

Hint.displayName = 'Hint';
