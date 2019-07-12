import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const SupportingDocumentForm = connect(
  {},
  () => {
    return (
      <React.Fragment>
        <button className="usa-button usa-button--outline margin-top-205">
          <FontAwesomeIcon
            className="margin-right-05"
            icon="plus-circle"
            size="1x"
          />
          Add Supporting Document
        </button>
      </React.Fragment>
    );
  },
);
