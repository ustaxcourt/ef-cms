import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const PrimaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    caseDetail: state.caseDetail,
    form: state.form,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addDocketEntryHelper,
    caseDetail,
    form,
    updateDocketEntryFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h2>Add Docket Entry</h2>
        <div className="blue-container docket-entry-form">
          <div
            className={`ustc-form-group ${
              validationErrors.primaryDocumentFile ? 'usa-input-error' : ''
            }`}
          >
            <label
              htmlFor="primary-document"
              id="primary-document-label"
              className={
                'ustc-upload ' +
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
              id="primary-document"
              name="primaryDocumentFile"
              aria-describedby="primary-document-label"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.primaryDocumentFile"
            />
          </div>

          <div
            className={`ustc-form-group ${
              validationErrors.lodged ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend>Filing Status</legend>
              <ul className="usa-unstyled-list">
                {['File', 'Lodge'].map(option => (
                  <li key={option}>
                    <input
                      id={`filing-status-${option}`}
                      type="radio"
                      name="lodged"
                      value={option}
                      checked={form.lodged === (option === 'Lodge')}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value === 'Lodge',
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor={`filing-status-${option}`}>{option}</label>
                  </li>
                ))}
              </ul>
            </fieldset>
            <Text
              className="usa-input-error-message"
              bind="validationErrors.lodged"
            />
          </div>

          <div
            className={`ustc-form-group ${
              validationErrors.dateReceived ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="date-received">
              <legend id="date-received-legend">Date Received</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <input
                    className="usa-input-inline"
                    id="date-received-month"
                    aria-label="month, two digits"
                    aria-describedby="date-received-legend"
                    name="dateReceivedMonth"
                    value={form.dateReceivedMonth || ''}
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
                    id="date-received-day"
                    name="dateReceivedDay"
                    value={form.dateReceivedDay || ''}
                    aria-label="day, two digits"
                    aria-describedby="date-received-legend"
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
                    id="date-received-year"
                    aria-label="year, four digits"
                    aria-describedby="date-received-legend"
                    name="dateReceivedYear"
                    value={form.dateReceivedYear || ''}
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
            <Text
              className="usa-input-error-message"
              bind="validationErrors.dateReceived"
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
            <Select
              className="select-react-element"
              options={addDocketEntryHelper.internalDocumentTypes}
              name="documentType"
              id="document-type"
              isClearable={true}
              aria-describedby="document-type-label"
              placeholder="- Select -"
              onChange={(inputValue, { action, name }) => {
                switch (action) {
                  case 'select-option':
                    updateDocketEntryFormValueSequence({
                      key: name,
                      value: inputValue.label,
                    });
                    updateDocketEntryFormValueSequence({
                      key: 'documentTitle',
                      value: inputValue.label,
                    });
                    validateDocketEntrySequence();
                    break;
                }
                return true;
              }}
            />
            <Text
              className="usa-input-error-message"
              bind="validationErrors.documentType"
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

          <div
            className={`ustc-form-group ${
              addDocketEntryHelper.partyValidationError ? 'usa-input-error' : ''
            }`}
          >
            <fieldset className="usa-fieldset-inputs usa-sans">
              <legend>Who Is Filing This Document?</legend>
              <ul className="ustc-vertical-option-list">
                <li>
                  <input
                    id="party-primary"
                    type="checkbox"
                    name="partyPrimary"
                    checked={form.partyPrimary || false}
                    onChange={e => {
                      updateDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateDocketEntrySequence();
                    }}
                  />
                  <label htmlFor="party-primary">
                    {caseDetail.contactPrimary.name}
                  </label>
                </li>
                {addDocketEntryHelper.showSecondaryParty && (
                  <li>
                    <input
                      id="party-secondary"
                      type="checkbox"
                      name="partySecondary"
                      checked={form.partySecondary || false}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor="party-secondary">
                      {caseDetail.contactSecondary.name}
                    </label>
                  </li>
                )}
                {addDocketEntryHelper.showRespondentParty && (
                  <li>
                    <input
                      id="party-respondent"
                      type="checkbox"
                      name="partyRespondent"
                      checked={form.partyRespondent || false}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label htmlFor="party-respondent">Respondent</label>
                  </li>
                )}
              </ul>
              <Text
                className="usa-input-error-message"
                bind="addDocketEntryHelper.partyValidationError"
              />
            </fieldset>
          </div>
          {addDocketEntryHelper.showObjection && (
            <div
              className={`ustc-form-group ${
                validationErrors.objections ? 'usa-input-error' : ''
              }`}
            >
              <fieldset className="usa-fieldset-inputs usa-sans">
                <legend id="objections-legend">
                  Are There Any Objections to This Document?
                </legend>
                <ul className="usa-unstyled-list">
                  {['Yes', 'No', 'Unknown'].map(option => (
                    <li key={option}>
                      <input
                        id={`objections-${option}`}
                        type="radio"
                        aria-describedby="objections-legend"
                        name="objections"
                        value={option}
                        checked={form.objections === option}
                        onChange={e => {
                          updateDocketEntryFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateDocketEntrySequence();
                        }}
                      />
                      <label htmlFor={`objections-${option}`}>{option}</label>
                    </li>
                  ))}
                </ul>
              </fieldset>
              <Text
                className="usa-input-error-message"
                bind="validationErrors.objections"
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  },
);
