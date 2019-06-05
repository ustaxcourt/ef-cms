import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { get } from 'lodash';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SupportingDocumentSelect = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    form: state.form,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addDocketEntryHelper,
    form,
    updateDocketEntryFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <div
          className={`usa-form-group ${
            validationErrors && validationErrors.previousDocument
              ? 'usa-form-group--error'
              : ''
          }`}
        >
          <label htmlFor={'previous-document'} className="usa-label">
            Which Document is This Supporting?
          </label>
          <select
            className="usa-select"
            name="previousDocument"
            id="previous-document"
            value={get(form, 'previousDocument', '')}
            aria-label="previousDocument"
            onChange={e => {
              updateDocketEntryFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketEntrySequence();
            }}
          >
            <option value="">- Select -</option>
            {addDocketEntryHelper.previouslyFiledWizardDocuments.map(
              (documentTitle, idx) => {
                return (
                  <option key={idx} value={documentTitle}>
                    {documentTitle}
                  </option>
                );
              },
            )}
          </select>
          <Text
            className="usa-error-message"
            bind="validationErrors.previousDocument"
          />
        </div>
      </React.Fragment>
    );
  },
);
