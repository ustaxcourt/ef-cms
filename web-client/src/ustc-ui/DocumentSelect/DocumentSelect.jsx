import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

export const DocumentSelect = connect(
  {
    documentSelectedForScan: state.documentSelectedForScan,
    selectDocument: sequences.selectDocumentForScanSequence,
  },
  ({ documentSelectedForScan, options, selectDocument }) => {
    return (
      <div className="grid-container padding-x-0 margin-bottom-1">
        {options.map(({ name, required, value }) => (
          <div
            className={`${
              documentSelectedForScan === value
                ? 'document-select-header'
                : 'document-select-option'
            } grid-row`}
            key={value}
          >
            <div
              className={`
              grid-col-10 padding-left-2 
              padding-top-2 ${required && 'padding-bottom-2'}
              `}
            >
              <span>{name} </span>
              {!required && <span className="usa-hint">(optional)</span>}
            </div>
            {documentSelectedForScan !== value && (
              <div className="grid-col-2 padding-top-2">
                <button
                  aria-controls={`add ${name} file`}
                  className="usa-button usa-button--unstyled text-no-underline"
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    selectDocument({ documentType: value });
                  }}
                >
                  <span>
                    <FontAwesomeIcon icon="plus-circle" size="sm" /> Add
                  </span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  },
);

DocumentSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      value: PropTypes.string.isRequired,
    }),
  ),
  title: PropTypes.string.isRequired,
};
