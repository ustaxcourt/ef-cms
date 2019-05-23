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
        <h2 className="margin-top-4">
          Add Entry for {form.secondaryDocument.documentType}
        </h2>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.secondaryDocumentFile
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label
              htmlFor="secondary-document"
              id="secondary-document-label"
              className={
                'usa-label ustc-upload with-hint ' +
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
            <span className="usa-hint">
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

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="secondary-additional-info"
              id="secondary-additional-info-label"
            >
              Additional Info 1
            </label>
            <input
              className="usa-input"
              id="secondary-additional-info"
              type="text"
              aria-describedby="secondary-additional-info-label"
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
          <div className="usa-form-group">
            <div className="usa-checkbox">
              <input
                id="secondary-add-to-coversheet"
                className="usa-checkbox__input"
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
              <label
                htmlFor="secondary-add-to-coversheet"
                className="usa-checkbox__label"
              >
                Add to Cover Sheet
              </label>
            </div>
          </div>

          <div className="usa-form-group margin-bottom-0">
            <label
              htmlFor="secondary-additional-info2"
              id="secondary-additional-info2-label"
              className="usa-label"
            >
              Additional Info 2
            </label>
            <input
              className="usa-input"
              id="secondary-additional-info2"
              type="text"
              aria-describedby="secondary-additional-info2-label"
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
