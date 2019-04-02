import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class ChooseDocumentTypeComponent extends React.Component {
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
              value={this.props.form.category}
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
          {this.props.form.category && (
            <>
              <div className="ustc-form-group only-large-screens">
                <label htmlFor="document-type">Document Type</label>
                <select
                  id="document-type"
                  name="documentType"
                  className="documentType"
                  onChange={e => {
                    this.props.updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                  value={this.props.form.documentType}
                >
                  <option value="">- Select -</option>
                  {(
                    this.props.constants.CATEGORY_MAP[
                      this.props.form.category
                    ] || []
                  ).map(documentType => (
                    <option
                      key={documentType.documentTitle}
                      value={documentType.documentTitle}
                    >
                      {documentType.documentTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ustc-form-group only-small-screens">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Document Type</legend>
                  <ul className="ustc-vertical-option-list ustc-hide-radio-buttons documentType">
                    {(
                      this.props.constants.CATEGORY_MAP[
                        this.props.form.category
                      ] || []
                    ).map((documentType, index) => (
                      <li
                        key={documentType.documentTitle}
                        value={documentType.documentTitle}
                      >
                        <input
                          id={`documentType-${index}`}
                          type="radio"
                          name="documentType"
                          value={documentType.documentTitle}
                          onClick={e => {
                            this.props.updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                            this.props.selectDocumentSequence();
                          }}
                        />
                        <label htmlFor={`documentType-${index}`}>
                          {documentType.documentTitle}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>
            </>
          )}
          <div className="ustc-form-group only-large-screens">
            <button
              type="submit"
              className="usa-button"
              id="select-document"
              onClick={() => {
                this.props.selectDocumentSequence();
              }}
            >
              Select
            </button>
          </div>
        </form>
      </div>
    );
  }
}

ChooseDocumentTypeComponent.propTypes = {
  closeDocumentCategoryAccordionSequence: PropTypes.func,
  constants: PropTypes.object,
  form: PropTypes.object,
  selectDocumentSequence: PropTypes.func,
  updateFormValueSequence: PropTypes.func,
};

export const ChooseDocumentType = connect(
  {
    closeDocumentCategoryAccordionSequence:
      sequences.closeDocumentCategoryAccordionSequence,
    constants: state.constants,
    form: state.form,
    selectDocumentSequence: sequences.selectDocumentSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ChooseDocumentTypeComponent,
);
