import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ChooseCategoryComponent extends React.Component {
  render() {
    return (
      <div className="blue-container">
        <form
          id="file-a-document"
          aria-labelledby="file-a-document-header"
          role="form"
          noValidate
          onSubmit={e => {
            e.preventDefault();
            this.props.closeDocumentCategoryAccordionSequence();
            this.props.openSelectDocumentTypeModalSequence();
          }}
        >
          <div className="ustc-form-group">
            <label htmlFor="category">Document Category</label>
            <select
              name="category"
              id="document-category"
              aria-label="category"
              onChange={e => {
                this.props.updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {this.props.constants.CATEGORIES.map(category => {
                return (
                  <option key={category} value={category}>
                    {category}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="ustc-form-group">
            <button
              type="submit"
              className="usa-button"
              id="open-choose-document-type-modal"
              onClick={() => {
                this.props.closeDocumentCategoryAccordionSequence();
                this.props.openSelectDocumentTypeModalSequence();
              }}
            >
              Next, Choose Document Type
            </button>
          </div>
        </form>
      </div>
    );
  }
}

ChooseCategoryComponent.propTypes = {
  closeDocumentCategoryAccordionSequence: PropTypes.func,
  constants: PropTypes.object,
  form: PropTypes.object,
  openSelectDocumentTypeModalSequence: PropTypes.func,
  updateFormValueSequence: PropTypes.func,
};

export const ChooseCategory = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    constants: state.constants,
    form: state.form,
    openSelectDocumentTypeModalSequence:
      sequences.openSelectDocumentTypeModalSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ChooseCategoryComponent,
);
