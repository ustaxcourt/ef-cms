import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addDocketEntryHelper,
    form,
    updateFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h2>Add Entry for [Secondary Document]</h2>
        <div className="blue-container">
          <div
            className={`ustc-form-group ${
              validationErrors.secondaryDocumentFile ? 'usa-input-error' : ''
            }`}
          >
            <label
              htmlFor="secondary-document"
              id="secondary-document-label"
              className={
                'ustc-upload ' +
                (addDocketEntryHelper.showSecondaryDocumentValid
                  ? 'validated'
                  : '')
              }
            >
              Add Document{' '}
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <StateDrivenFileInput
              id="secondary-document"
              name="secondaryDocumentFile"
              aria-describedby="secondary-document-label"
              updateFormValueSequence="updateFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.secondaryDocumentFile"
            />
          </div>

          <div className="ustc-form-group">
            <label htmlFor="additional-info" id="additional-info-label">
              Additional Info 1
            </label>
            <input
              id="additional-info"
              type="text"
              aria-describedby="additional-info-label"
              name="additionalInfo"
              autoCapitalize="none"
              value={form.additionalInfo || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateDocketEntrySequence();
              }}
            />
          </div>
          <div className="ustc-form-group add-to-coversheet-checkbox">
            <input
              id="add-to-coversheet"
              type="checkbox"
              name="addToCoversheet"
              checked={form.addToCoversheet}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label htmlFor="add-to-coversheet">Add to Cover Sheet</label>
          </div>

          <div className="ustc-form-group">
            <label htmlFor="additional-info2" id="additional-info-label">
              Additional Info 2
            </label>
            <input
              id="additional-info2"
              type="text"
              aria-describedby="additional-info2-label"
              name="additionalInfo2"
              autoCapitalize="none"
              value={form.additionalInfo2 || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateDocketEntrySequence();
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  },
);
