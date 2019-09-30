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
              validationErrors.primaryDocumentFile
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <label
              className={
                'usa-label ustc-upload ' +
                (addDocketEntryHelper.showPrimaryDocumentValid
                  ? 'validated'
                  : '')
              }
              htmlFor="primary-document"
              id="primary-document-label"
            >
              Add Document{' '}
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>
            </label>
            <StateDrivenFileInput
              aria-describedby="supporting-document-label"
              id="supporting-document"
              name="primaryDocumentFile"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              bind="validationErrors.primaryDocumentFile"
              className="usa-error-message"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.documentType ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              className="usa-label"
              htmlFor="event-code"
              id="event-code-label"
            >
              Document type
            </label>
            <select
              aria-describedby="event-code-label"
              className="usa-select"
              id="event-code"
              name="eventCode"
              value={form.eventCode || ''}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateDocketEntrySequence();
              }}
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
              bind="validationErrors.documentType"
              className="usa-error-message"
            />
          </div>

          {addDocketEntryHelper.showSupportingDocumentFreeText && (
            <div
              className={`usa-form-group ${
                validationErrors.freeText ? 'usa-form-group--error' : ''
              }`}
            >
              <label
                className="usa-label"
                htmlFor="free-text"
                id="free-text-label"
              >
                Supporting Document Signed By
              </label>
              <input
                aria-describedby="free-text-label"
                autoCapitalize="none"
                className="usa-input"
                id="free-text"
                name="freeText"
                type="text"
                value={form.freeText || ''}
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
              <Text
                bind="validationErrors.freeText"
                className="usa-error-message"
              />
            </div>
          )}
          {addDocketEntryHelper.showSupportingDocumentSelect && (
            <SupportingDocumentSelect />
          )}
          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="additional-info"
              id="additional-info-label"
            >
              Additional info 1 <span className="usa-hint">(optional)</span>
            </label>
            <input
              aria-describedby="additional-info-label"
              autoCapitalize="none"
              className="usa-input"
              id="additional-info"
              name="additionalInfo"
              type="text"
              value={form.additionalInfo || ''}
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
                checked={form.addToCoversheet}
                className="usa-checkbox__input"
                id="add-to-coversheet"
                name="addToCoversheet"
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
                htmlFor="add-to-coversheet"
              >
                Add to cover sheet
              </label>
            </div>
          </div>

          <div
            className={`usa-form-group ${
              !addDocketEntryHelper.showSupportingInclusions
                ? 'margin-bottom-0'
                : ''
            }`}
          >
            <label
              className="usa-label"
              htmlFor="additional-info2"
              id="additional-info-label2"
            >
              Additional info 2 <span className="usa-hint">(optional)</span>
            </label>
            <input
              aria-describedby="additional-info2-label2"
              autoCapitalize="none"
              className="usa-input"
              id="additional-info2"
              name="additionalInfo2"
              type="text"
              value={form.additionalInfo2 || ''}
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

          {addDocketEntryHelper.showSupportingInclusions && (
            <Inclusions marginClass="margin-bottom-0" />
          )}
        </div>
      </React.Fragment>
    );
  },
);
