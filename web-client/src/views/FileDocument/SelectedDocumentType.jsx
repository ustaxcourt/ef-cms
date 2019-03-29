import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SelectedDocumentTypeComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="blue-container" role="alert" aria-live="polite">
          <div className="ustc-form-group">
            <div>
              <label htmlFor="category" className="inline-block mr-1">
                Selected Document Type
              </label>
              <button
                className="link"
                id="edit-selected-document-type"
                onClick={() => {
                  this.props.closeDocumentCategoryAccordionSequence();
                  this.props.openSelectDocumentTypeModalSequence();
                }}
              >
                <FontAwesomeIcon icon="edit" size="sm" />
                Edit
              </button>
            </div>
            <div>
              <p>{this.props.form.documentType}</p>
            </div>
          </div>
        </div>

        <div className="ustc-form-group">
          <button type="button" className="usa-button" onClick={() => {}}>
            Continue
          </button>
        </div>
      </React.Fragment>
    );
  }
}

SelectedDocumentTypeComponent.propTypes = {
  closeDocumentCategoryAccordionSequence: PropTypes.func,
  form: PropTypes.object,
  openSelectDocumentTypeModalSequence: PropTypes.func,
};

export const SelectedDocumentType = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    form: state.form,
    openSelectDocumentTypeModalSequence:
      sequences.openSelectDocumentTypeModalSequence,
  },
  SelectedDocumentTypeComponent,
);
