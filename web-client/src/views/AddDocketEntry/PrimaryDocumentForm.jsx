import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
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
    internalTypesHelper: state.internalTypesHelper,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addDocketEntryHelper,
    caseDetail,
    form,
    internalTypesHelper,
    updateDocketEntryFormValueSequence,
    updateScreenMetadataSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <React.Fragment>
        <h1>Add Docket Entry</h1>
        <div className="blue-container docket-entry-form">
          <div
            className={`usa-form-group ${
              validationErrors.primaryDocumentFile
                ? 'usa-form-group--error'
                : ''
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
              id="primary-document"
              name="primaryDocumentFile"
              aria-describedby="primary-document-label"
              updateFormValueSequence="updateDocketEntryFormValueSequence"
              validationSequence="validateDocketEntrySequence"
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.primaryDocumentFile"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.lodged ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Filing Status</legend>
              {['File', 'Lodge'].map(option => (
                <div className="usa-radio usa-radio__inline" key={option}>
                  <input
                    id={`filing-status-${option}`}
                    type="radio"
                    name="lodged"
                    value={option}
                    className="usa-radio__input"
                    checked={form.lodged === (option === 'Lodge')}
                    onChange={e => {
                      updateDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.value === 'Lodge',
                      });
                      validateDocketEntrySequence();
                    }}
                  />
                  <label
                    htmlFor={`filing-status-${option}`}
                    className="usa-radio__label"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </fieldset>
            <Text
              className="usa-error-message"
              bind="validationErrors.lodged"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.dateReceived ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset date-received">
              <legend id="usa-legend date-received-legend">
                Date Received
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month">
                  <input
                    className="usa-input usa-input--inline"
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
                <div className="usa-form-group usa-form-group--day">
                  <input
                    className="usa-input usa-input--inline"
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
                <div className="usa-form-group usa-form-group--year">
                  <input
                    className="usa-input usa-input--inline"
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
              className="usa-error-message"
              bind="validationErrors.dateReceived"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.eventCode ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              htmlFor="react-select-2-input"
              id="document-type-label"
              className="usa-label"
            >
              Document Type
            </label>
            <Select
              className="select-react-element"
              classNamePrefix="select-react-element"
              options={internalTypesHelper.internalDocumentTypesForSelectSorted}
              name="eventCode"
              id="document-type"
              isClearable={true}
              aria-describedby="document-type-label"
              placeholder="- Select -"
              onInputChange={(inputText, { action }) => {
                if (action == 'input-change') {
                  updateScreenMetadataSequence({
                    key: 'searchText',
                    value: inputText,
                  });
                }
              }}
              onChange={(inputValue, { action, name }) => {
                switch (action) {
                  case 'select-option':
                    updateDocketEntryFormValueSequence({
                      key: name,
                      value: inputValue.value,
                    });
                    validateDocketEntrySequence();
                    break;
                  case 'clear':
                    updateDocketEntryFormValueSequence({
                      key: name,
                      value: '',
                    });
                    validateDocketEntrySequence();
                    break;
                }
                return true;
              }}
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.eventCode"
            />
          </div>

          {addDocketEntryHelper.primary.showSecondaryDocumentForm && (
            <div
              className={`usa-form-group ${
                validationErrors.secondaryDocument && !form.secondaryDocument
                  ? 'usa-form-group--error'
                  : ''
              }`}
            >
              <label
                htmlFor="react-select-3-input"
                id="secondary-document-type-label"
                className="usa-label"
              >
                Which Document Is This Motion for Leave For?
              </label>
              <Select
                className="select-react-element"
                classNamePrefix="select-react-element"
                options={
                  internalTypesHelper.internalDocumentTypesForSelectSorted
                }
                name="secondaryDocument.eventCode"
                id="secondary-document-type"
                isClearable={true}
                aria-describedby="secondary-document-type-label"
                placeholder="- Select -"
                onInputChange={(inputText, { action }) => {
                  if (action == 'input-change') {
                    updateScreenMetadataSequence({
                      key: 'searchText',
                      value: inputText,
                    });
                  }
                }}
                onChange={(inputValue, { action, name }) => {
                  switch (action) {
                    case 'select-option':
                      updateDocketEntryFormValueSequence({
                        key: name,
                        value: inputValue.value,
                      });
                      validateDocketEntrySequence();
                      break;
                    case 'clear':
                      updateDocketEntryFormValueSequence({
                        key: name,
                        value: '',
                      });
                      validateDocketEntrySequence();
                      break;
                  }
                  return true;
                }}
              />
              {!form.secondaryDocument && (
                <Text
                  className="usa-error-message"
                  bind="validationErrors.secondaryDocument"
                />
              )}
            </div>
          )}

          {addDocketEntryHelper.primary.showNonstandardForm && (
            <NonstandardForm
              helper="addDocketEntryHelper"
              level="primary"
              updateSequence="updateDocketEntryFormValueSequence"
              validateSequence="validateDocketEntrySequence"
              validationErrors="validationErrors"
            />
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
              id="additional-info"
              type="text"
              aria-describedby="additional-info-label"
              name="additionalInfo"
              autoCapitalize="none"
              className="usa-input"
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
          <div className="usa-form-group usa-checkbox add-to-coversheet-checkbox">
            <input
              id="add-to-coversheet"
              type="checkbox"
              name="addToCoversheet"
              className="usa-checkbox__input"
              checked={form.addToCoversheet || false}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label htmlFor="add-to-coversheet" className="usa-checkbox__label">
              Add to Cover Sheet
            </label>
          </div>

          <div className="usa-form-group">
            <label
              htmlFor="additional-info2"
              id="additional-info2-label"
              className="usa-label"
            >
              Additional Info 2
            </label>
            <input
              id="additional-info2"
              type="text"
              aria-describedby="additional-info2-label"
              name="additionalInfo2"
              autoCapitalize="none"
              className="usa-input"
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

          <div className="usa-form-group">
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Inclusions</legend>
              <div className="usa-checkbox">
                <input
                  id="exhibits"
                  type="checkbox"
                  name="exhibits"
                  className="usa-checkbox__input"
                  checked={form.exhibits || false}
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketEntrySequence();
                  }}
                />
                <label htmlFor="exhibits" className="usa-checkbox__label">
                  Exhibit(s)
                </label>
              </div>
              <div className="usa-checkbox">
                <input
                  id="attachments"
                  type="checkbox"
                  name="attachments"
                  className="usa-checkbox__input"
                  checked={form.attachments || false}
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketEntrySequence();
                  }}
                />
                <label htmlFor="attachments" className="usa-checkbox__label">
                  Attachment(s)
                </label>
              </div>
              <div className="usa-checkbox">
                <input
                  id="certificate-of-service"
                  type="checkbox"
                  name="certificateOfService"
                  className="usa-checkbox__input"
                  checked={form.certificateOfService || false}
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketEntrySequence();
                  }}
                />
                <label
                  htmlFor="certificate-of-service"
                  className="usa-checkbox__label"
                >
                  Certificate of Service
                </label>
                {form.certificateOfService && (
                  <fieldset
                    className={`margin-bottom-0 usa-fieldset service-date
                        ${
                          validationErrors.certificateOfServiceDate
                            ? 'usa-form-group--error'
                            : ''
                        }`}
                  >
                    <legend
                      id="service-date-legend"
                      className="usa-legend usa-sr-only"
                    >
                      Certificate of Service
                    </legend>
                    <div className="usa-memorable-date margin-top-2">
                      <div className="usa-form-group usa-form-group--month">
                        <input
                          className="usa-input usa-input--inline"
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
                      <div className="usa-form-group usa-form-group--day">
                        <input
                          className="usa-input usa-input--inline"
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
                      <div className="usa-form-group usa-form-group--year">
                        <input
                          className="usa-input usa-input--inline"
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
                    <Text
                      className="usa-error-message"
                      bind="validationErrors.certificateOfServiceDate"
                    />
                  </fieldset>
                )}
              </div>
            </fieldset>
          </div>

          <div
            className={`usa-form-group ${
              addDocketEntryHelper.partyValidationError
                ? 'usa-form-group--error'
                : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">
                Who Is Filing This Document?
              </legend>
              {addDocketEntryHelper.showPractitionerParty &&
                addDocketEntryHelper.practitionerNames.map(
                  (practitionerName, idx) => {
                    return (
                      <div className="usa-checkbox" key={idx}>
                        <input
                          id={`party-practitioner-${idx}`}
                          type="checkbox"
                          name={`practitioner.${idx}`}
                          className="usa-checkbox__input"
                          checked={
                            (form.practitioner[idx] &&
                              form.practitioner[idx].partyPractitioner) ||
                            false
                          }
                          onChange={e => {
                            updateDocketEntryFormValueSequence({
                              key: e.target.name,
                              value: {
                                name: practitionerName,
                                partyPractitioner: e.target.checked,
                              },
                            });
                            validateDocketEntrySequence();
                          }}
                        />
                        <label
                          htmlFor={`party-practitioner-${idx}`}
                          className="usa-checkbox__label"
                        >
                          Counsel {practitionerName}
                        </label>
                      </div>
                    );
                  },
                )}
              <div className="usa-checkbox">
                <input
                  id="party-primary"
                  type="checkbox"
                  name="partyPrimary"
                  className="usa-checkbox__input"
                  checked={form.partyPrimary || false}
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketEntrySequence();
                  }}
                />
                <label htmlFor="party-primary" className="usa-checkbox__label">
                  {caseDetail.contactPrimary.name}
                </label>
              </div>
              {addDocketEntryHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-secondary"
                    type="checkbox"
                    name="partySecondary"
                    className="usa-checkbox__input"
                    checked={form.partySecondary || false}
                    onChange={e => {
                      updateDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateDocketEntrySequence();
                    }}
                  />
                  <label
                    htmlFor="party-secondary"
                    className="usa-checkbox__label"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
              {addDocketEntryHelper.showRespondentParty && (
                <div className="usa-checkbox">
                  <input
                    id="party-respondent"
                    type="checkbox"
                    name="partyRespondent"
                    className="usa-checkbox__input"
                    checked={form.partyRespondent || false}
                    onChange={e => {
                      updateDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateDocketEntrySequence();
                    }}
                  />
                  <label
                    htmlFor="party-respondent"
                    className="usa-checkbox__label"
                  >
                    Respondent
                  </label>
                </div>
              )}
              <Text
                className="usa-error-message"
                bind="addDocketEntryHelper.partyValidationError"
              />
            </fieldset>
          </div>
          {addDocketEntryHelper.showObjection && (
            <div
              className={`usa-form-group ${
                validationErrors.objections ? 'usa-form-group--error' : ''
              }`}
            >
              <fieldset className="usa-fieldset">
                <legend id="objections-legend" className="usa-legend">
                  Are There Any Objections to This Document?
                </legend>
                {['Yes', 'No', 'Unknown'].map(option => (
                  <div className="usa-radio" key={option}>
                    <input
                      id={`objections-${option}`}
                      type="radio"
                      aria-describedby="objections-legend"
                      name="objections"
                      className="usa-radio__input"
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
                    <label
                      htmlFor={`objections-${option}`}
                      className="usa-radio__label"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
              <Text
                className="usa-error-message"
                bind="validationErrors.objections"
              />
            </div>
          )}
        </div>

        {form.secondaryDocument && <SecondaryDocumentForm />}
      </React.Fragment>
    );
  },
);
