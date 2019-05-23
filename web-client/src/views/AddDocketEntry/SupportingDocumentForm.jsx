import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Inclusions } from './Inclusions';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SupportingDocumentSelect } from './SupportingDocumentSelect';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SupportingDocumentForm = connect(
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
        <h1>Add Supporting Document</h1>
        <div className="blue-container docket-entry-form">
          <div
            className={`usa-form-group ${
              validationErrors.primaryDocumentFile ? 'usa-input-error' : ''
            }`}
          >
            <label
              htmlFor="primary-document"
              id="primary-document-label"
              className={
                'usa-label ustc-upload ' +
                (addDocketEntryHelper.showPrimaryDocumentValid
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
              id="supporting-document"
              name="primaryDocumentFile"
              aria-describedby="supporting-document-label"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.primaryDocumentFile"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.documentType ? 'usa-input-error' : ''
            }`}
          >
            <label
              htmlFor="event-code"
              id="event-code-label"
              className="usa-label"
            >
              Document Type
            </label>
            <select
              className="usa-select"
              name="eventCode"
              id="event-code"
              aria-describedby="event-code-label"
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateDocketEntrySequence();
              }}
              value={form.eventCode || ''}
            >
              <option value="">- Select -</option>
              {addDocketEntryHelper.supportingDocumentTypeList.map(entry => {
                return (
                  <option key={entry.eventCode} value={entry.eventCode}>
                    {entry.documentTypeDisplay}
                  </option>
                );
              })}
            </select>
            <Text
              className="usa-input-error-message"
              bind="validationErrors.documentType"
            />
          </div>

          {addDocketEntryHelper.showSupportingDocumentFreeText && (
            <div
              className={`usa-form-group ${
                validationErrors.freeText ? 'usa-input-error' : ''
              }`}
            >
              <label
                htmlFor="free-text"
                id="free-text-label"
                className="usa-label"
              >
                Supporting Document Signed By
              </label>
              <input
                className="usa-input"
                id="free-text"
                type="text"
                aria-describedby="free-text-label"
                name="freeText"
                autoCapitalize="none"
                value={form.freeText || ''}
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
              <Text
                className="usa-input-error-message"
                bind="validationErrors.freeText"
              />
            </div>
          )}
          {addDocketEntryHelper.showSupportingDocumentSelect && (
            <SupportingDocumentSelect />
          )}
          <div className="usa-form-group">
            <label
              htmlFor="additional-info"
              id="additional-info-label"
              className="usa-label"
            >
              Additional Info 1
            </label>
            <input
              className="usa-input"
              id="additional-info"
              type="text"
              aria-describedby="additional-info-label"
              name="additionalInfo"
              autoCapitalize="none"
              value={form.additionalInfo || ''}
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
                id="add-to-coversheet"
                className="usa-checkbox__input"
                type="checkbox"
                name="addToCoversheet"
                checked={form.addToCoversheet}
                onChange={e => {
                  updateDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateDocketEntrySequence();
                }}
              />
              <label
                htmlFor="add-to-coversheet"
                className="usa-checkbox__label"
              >
                Add to Cover Sheet
              </label>
            </div>
          </div>

          <div className="usa-form-group">
            <label
              htmlFor="additional-info2"
              id="additional-info-label2"
              className="usa-label"
            >
              Additional Info 2
            </label>
            <input
              className="usa-input"
              id="additional-info2"
              type="text"
              aria-describedby="additional-info2-label2"
              name="additionalInfo2"
              autoCapitalize="none"
              value={form.additionalInfo2 || ''}
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

          {addDocketEntryHelper.showSupportingInclusions && <Inclusions />}
        </div>
      </React.Fragment>
    );
  },
);
