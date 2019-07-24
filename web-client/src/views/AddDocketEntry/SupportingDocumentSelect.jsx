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
          <label className="usa-label" htmlFor={'previous-document'}>
            Which Document is This Supporting?
          </label>
          <select
            aria-label="previousDocument"
            className="usa-select"
            id="previous-document"
            name="previousDocument"
            value={get(form, 'previousDocument', '')}
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
            bind="validationErrors.previousDocument"
            className="usa-error-message"
          />
        </div>
      </React.Fragment>
    );
  },
);
