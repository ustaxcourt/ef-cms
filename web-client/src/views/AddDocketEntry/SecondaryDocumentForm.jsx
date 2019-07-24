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
    constants,
    form,
    updateDocketEntryFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
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
              className={
                'usa-label ustc-upload with-hint ' +
                (addDocketEntryHelper.showSecondaryDocumentValid
                  ? 'validated'
                  : '')
              }
              htmlFor="secondary-document"
              id="secondary-document-label"
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
              aria-describedby="secondary-document-label"
              id="secondary-document"
              name="secondaryDocumentFile"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              bind="validationErrors.secondaryDocumentFile"
              className="usa-error-message"
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
              aria-describedby="secondary-additional-info-label"
              autoCapitalize="none"
              className="usa-input"
              id="secondary-additional-info"
              name="secondaryDocument.additionalInfo"
              type="text"
              value={form.secondaryDocument.additionalInfo || ''}
              onBlur={() => {
                validateDocketEntrySequence();
              }}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
          <div className="usa-form-group">
            <div className="usa-checkbox">
              <input
                checked={form.secondaryDocument.addToCoversheet}
                className="usa-checkbox__input"
                id="secondary-add-to-coversheet"
                name="secondaryDocument.addToCoversheet"
                type="checkbox"
                onChange={e => {
                  updateDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateDocketEntrySequence();
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="secondary-add-to-coversheet"
              >
                Add to Cover Sheet
              </label>
            </div>
          </div>

          <div className="usa-form-group margin-bottom-0">
            <label
              className="usa-label"
              htmlFor="secondary-additional-info2"
              id="secondary-additional-info2-label"
            >
              Additional Info 2
            </label>
            <input
              aria-describedby="secondary-additional-info2-label"
              autoCapitalize="none"
              className="usa-input"
              id="secondary-additional-info2"
              name="secondaryDocument.additionalInfo2"
              type="text"
              value={form.secondaryDocument.additionalInfo2 || ''}
              onBlur={() => {
                validateDocketEntrySequence();
              }}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  },
);
