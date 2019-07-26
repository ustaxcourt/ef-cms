import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

export const DocumentSelect = ({ options, title }) => {
  return (
    <div className="grid-container padding-x-0 margin-bottom-1">
      <div className="document-select-header semi-bold grid-col-12">
        {title}
      </div>
      {options.map(({ name, value }) => (
        <div className="document-select-option grid-row" key={value}>
          <div className="grid-col-10 padding-left-2 padding-top-2">
            {name} <span className="usa-hint">(optional)</span>
          </div>
          <div className="grid-col-2 padding-top-2">
            <button
              aria-controls={`add ${name} file`}
              className="usa-button usa-button--unstyled text-no-underline"
              type="button"
              onClick={() => {}}
            >
              <span>
                <FontAwesomeIcon icon="plus-circle" size="sm" /> Add
              </span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

DocumentSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  title: PropTypes.string.isRequired,
};
