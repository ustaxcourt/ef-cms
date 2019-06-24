import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Inclusions } from './Inclusions';
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
              aria-describedby="primary-document-label"
              id="primary-document"
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
              validationErrors.lodged ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Filing Status</legend>
              {['File', 'Lodge'].map(option => (
                <div className="usa-radio usa-radio__inline" key={option}>
                  <input
                    checked={form.lodged === (option === 'Lodge')}
                    className="usa-radio__input"
                    id={`filing-status-${option}`}
                    name="lodged"
                    type="radio"
                    value={option}
                    onChange={e => {
                      updateDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.value === 'Lodge',
                      });
                      validateDocketEntrySequence();
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`filing-status-${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </fieldset>
            <Text
              bind="validationErrors.lodged"
              className="usa-error-message"
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
                    aria-describedby="date-received-legend"
                    aria-label="month, two digits"
                    className="usa-input usa-input--inline"
                    id="date-received-month"
                    max="12"
                    min="1"
                    name="dateReceivedMonth"
                    placeholder="MM"
                    type="number"
                    value={form.dateReceivedMonth || ''}
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
                <div className="usa-form-group usa-form-group--day">
                  <input
                    aria-describedby="date-received-legend"
                    aria-label="day, two digits"
                    className="usa-input usa-input--inline"
                    id="date-received-day"
                    max="31"
                    min="1"
                    name="dateReceivedDay"
                    placeholder="DD"
                    type="number"
                    value={form.dateReceivedDay || ''}
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
                <div className="usa-form-group usa-form-group--year">
                  <input
                    aria-describedby="date-received-legend"
                    aria-label="year, four digits"
                    className="usa-input usa-input--inline"
                    id="date-received-year"
                    max="2100"
                    min="1900"
                    name="dateReceivedYear"
                    placeholder="YYYY"
                    type="number"
                    value={form.dateReceivedYear || ''}
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
            </fieldset>
            <Text
              bind="validationErrors.dateReceived"
              className="usa-error-message"
            />
          </div>

          <div
            className={`usa-form-group ${
              validationErrors.eventCode ? 'usa-form-group--error' : ''
            }`}
          >
            <label
              className="usa-label"
              htmlFor="react-select-2-input"
              id="document-type-label"
            >
              Document Type
            </label>
            <Select
              aria-describedby="document-type-label"
              className="select-react-element"
              classNamePrefix="select-react-element"
              id="document-type"
              isClearable={true}
              name="eventCode"
              options={internalTypesHelper.internalDocumentTypesForSelectSorted}
              placeholder="- Select -"
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
              onInputChange={(inputText, { action }) => {
                if (action == 'input-change') {
                  updateScreenMetadataSequence({
                    key: 'searchText',
                    value: inputText,
                  });
                }
              }}
            />
            <Text
              bind="validationErrors.eventCode"
              className="usa-error-message"
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
                className="usa-label"
                htmlFor="react-select-3-input"
                id="secondary-document-type-label"
              >
                Which Document Is This Motion for Leave For?
              </label>
              <Select
                aria-describedby="secondary-document-type-label"
                className="select-react-element"
                classNamePrefix="select-react-element"
                id="secondary-document-type"
                isClearable={true}
                name="secondaryDocument.eventCode"
                options={
                  internalTypesHelper.internalDocumentTypesForSelectSorted
                }
                placeholder="- Select -"
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
                onInputChange={(inputText, { action }) => {
                  if (action == 'input-change') {
                    updateScreenMetadataSequence({
                      key: 'searchText',
                      value: inputText,
                    });
                  }
                }}
              />
              {!form.secondaryDocument && (
                <Text
                  bind="validationErrors.secondaryDocument"
                  className="usa-error-message"
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
              className="usa-label"
              htmlFor="additional-info"
              id="additional-info-label"
            >
              Additional Info 1
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
                checked={form.addToCoversheet || false}
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
                Add to Cover Sheet
              </label>
            </div>
          </div>

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="additional-info2"
              id="additional-info2-label"
            >
              Additional Info 2
            </label>
            <input
              aria-describedby="additional-info2-label"
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

          <Inclusions />

          <div
            className={`usa-form-group ${
              addDocketEntryHelper.partyValidationError
                ? 'usa-form-group--error'
                : ''
            } ${!addDocketEntryHelper.showObjection ? 'margin-bottom-0' : ''}`}
          >
            <fieldset
              className={`usa-fieldset ${
                !addDocketEntryHelper.showObjection ? 'margin-bottom-0' : ''
              }`}
            >
              <legend className="usa-legend">
                Who Is Filing This Document?
              </legend>
              {addDocketEntryHelper.showPractitionerParty &&
                addDocketEntryHelper.practitionerNames.map(
                  (practitionerName, idx) => {
                    return (
                      <div className="usa-checkbox" key={idx}>
                        <input
                          checked={
                            (form.practitioner[idx] &&
                              form.practitioner[idx].partyPractitioner) ||
                            false
                          }
                          className="usa-checkbox__input"
                          id={`party-practitioner-${idx}`}
                          name={`practitioner.${idx}`}
                          type="checkbox"
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
                          className="usa-checkbox__label"
                          htmlFor={`party-practitioner-${idx}`}
                        >
                          Counsel {practitionerName}
                        </label>
                      </div>
                    );
                  },
                )}
              <div className="usa-checkbox">
                <input
                  checked={form.partyPrimary || false}
                  className="usa-checkbox__input"
                  id="party-primary"
                  name="partyPrimary"
                  type="checkbox"
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketEntrySequence();
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="party-primary">
                  {caseDetail.contactPrimary.name}
                </label>
              </div>
              {addDocketEntryHelper.showSecondaryParty && (
                <div className="usa-checkbox">
                  <input
                    checked={form.partySecondary || false}
                    className="usa-checkbox__input"
                    id="party-secondary"
                    name="partySecondary"
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
                    htmlFor="party-secondary"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
              {addDocketEntryHelper.showRespondentParty && (
                <div className="usa-checkbox">
                  <input
                    checked={form.partyRespondent || false}
                    className="usa-checkbox__input"
                    id="party-respondent"
                    name="partyRespondent"
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
                    htmlFor="party-respondent"
                  >
                    Respondent
                  </label>
                </div>
              )}
              <Text
                bind="addDocketEntryHelper.partyValidationError"
                className="usa-error-message"
              />
            </fieldset>
          </div>
          {addDocketEntryHelper.showObjection && (
            <div
              className={`usa-form-group margin-bottom-0 ${
                validationErrors.objections ? 'usa-form-group--error' : ''
              }`}
            >
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="objections-legend">
                  Are There Any Objections to This Document?
                </legend>
                {['Yes', 'No', 'Unknown'].map(option => (
                  <div className="usa-radio" key={option}>
                    <input
                      aria-describedby="objections-legend"
                      checked={form.objections === option}
                      className="usa-radio__input"
                      id={`objections-${option}`}
                      name="objections"
                      type="radio"
                      value={option}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateDocketEntrySequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`objections-${option}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
              <Text
                bind="validationErrors.objections"
                className="usa-error-message"
              />
            </div>
          )}
        </div>

        {form.secondaryDocument && <SecondaryDocumentForm />}
      </React.Fragment>
    );
  },
);
