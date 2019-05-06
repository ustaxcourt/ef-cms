import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <h2>Add Supporting Document</h2>
        <div className="blue-container docket-entry-form">
          <div
            className={`ustc-form-group ${
              validationErrors.supportingDocumentFile ? 'usa-input-error' : ''
            }`}
          >
            <label
              htmlFor="supporting-document"
              id="supporting-document-label"
              className={
                'ustc-upload ' +
                (addDocketEntryHelper.showSupportingDocumentValid
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
              id="primary-document"
              name="primaryDocumentFile"
              aria-describedby="primary-document-label"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.supportingDocumentFile"
            />
          </div>

          <div
            className={`ustc-form-group ${
              validationErrors.documentType ? 'usa-input-error' : ''
            }`}
          >
            <label htmlFor="document-type" id="document-type-label">
              Document Type
            </label>
            <select
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

          <SupportingDocumentSelect />

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

          {addDocketEntryHelper.showSupportingInclusions && (
            <div className="ustc-form-group">
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend>Inclusions</legend>
                <ul className="ustc-vertical-option-list">
                  <li>
                    <input
                      id="exhibits"
                      type="checkbox"
                      name="exhibits"
                      checked={form.exhibits || false}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor="exhibits">Exhibit(s)</label>
                  </li>
                  <li>
                    <input
                      id="attachments"
                      type="checkbox"
                      name="attachments"
                      checked={form.attachments || false}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor="attachments">Attachment(s)</label>
                  </li>
                  <li>
                    <input
                      id="certificate-of-service"
                      type="checkbox"
                      name="certificateOfService"
                      checked={form.certificateOfService || false}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor="certificate-of-service">
                      Certificate of Service
                    </label>
                    {form.certificateOfService && (
                      <fieldset className="service-date">
                        <div className="usa-date-of-birth">
                          <div className="usa-form-group usa-form-group-month">
                            <input
                              className="usa-input-inline"
                              id="service-date-month"
                              aria-label="month, two digits"
                              aria-describedby="service-date-legend"
                              name="certificateOfServiceMonth"
                              value={form.certificateOfServiceMonth || ''}
                              type="number"
                              min="1"
                              max="12"
                              placeholder="MM"
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
                          <div className="usa-form-group usa-form-group-day">
                            <input
                              className="usa-input-inline"
                              id="service-date-day"
                              name="certificateOfServiceDay"
                              value={form.certificateOfServiceDay || ''}
                              aria-label="day, two digits"
                              aria-describedby="service-date-legend"
                              type="number"
                              min="1"
                              max="31"
                              placeholder="DD"
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
                          <div className="usa-form-group usa-form-group-year">
                            <input
                              className="usa-input-inline"
                              id="service-date-year"
                              aria-label="year, four digits"
                              aria-describedby="service-date-legend"
                              name="certificateOfServiceYear"
                              value={form.certificateOfServiceYear || ''}
                              type="number"
                              min="1900"
                              max="2100"
                              placeholder="YYYY"
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
                      </fieldset>
                    )}
                  </li>
                </ul>
              </fieldset>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
