import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    constants: state.constants,
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
    constants,
  }) => {
    return (
      <React.Fragment>
        <h2>Add Entry for {form.secondaryDocument.documentType}</h2>
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
                'ustc-upload with-hint' +
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
            <span className="usa-form-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <StateDrivenFileInput
              id="secondary-document"
              name="secondaryDocumentFile"
              aria-describedby="secondary-document-label"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.secondaryDocumentFile"
            />
          </div>

          {addDocketEntryHelper.secondary.showNonstandardForm && (
            <NonstandardForm
              helper="addDocketEntryHelper"
              level="secondary"
              namespace="secondaryDocument"
              updateSequence="updateDocketEntryFormValueSequence"
              validateSequence="validateDocketEntrySequence"
              validationErrors="validationErrors.secondaryDocument"
            />
          )}

          <div className="ustc-form-group">
            <label htmlFor="additional-info" id="additional-info-label">
              Additional Info 1
            </label>
            <input
              id="additional-info"
              type="text"
              aria-describedby="additional-info-label"
              name="secondaryDocument.additionalInfo"
              autoCapitalize="none"
              value={form.secondaryDocument.additionalInfo || ''}
              onChange={e => {
                updateDocketEntryFormValueSequence({
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
              name="secondaryDocument.addToCoversheet"
              checked={form.secondaryDocument.addToCoversheet}
              onChange={e => {
                updateDocketEntryFormValueSequence({
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
              name="secondaryDocument.additionalInfo2"
              autoCapitalize="none"
              value={form.secondaryDocument.additionalInfo2 || ''}
              onChange={e => {
                updateDocketEntryFormValueSequence({
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
