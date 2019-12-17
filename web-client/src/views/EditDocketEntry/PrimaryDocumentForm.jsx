import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Inclusions } from '../AddDocketEntry/Inclusions';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { SecondaryDocumentForm } from '../AddDocketEntry/SecondaryDocumentForm';
import { connect } from '@cerebral/react';
import {
  docketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { limitLength } from '../../ustc-ui/utils/limitLength';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

export const PrimaryDocumentForm = connect(
  {
    addDocketEntryHelper: state.addDocketEntryHelper,
    caseDetail: state.caseDetail,
    form: state.form,
    internalTypesHelper: state.internalTypesHelper,
    saveIntermediateDocketEntrySequence:
      sequences.saveIntermediateDocketEntrySequence,
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
    saveIntermediateDocketEntrySequence,
    updateDocketEntryFormValueSequence,
    updateScreenMetadataSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="blue-container docket-entry-form">
          <FormGroup errorText={validationErrors.lodged}>
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Filing status</legend>
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
                      saveIntermediateDocketEntrySequence();
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
          </FormGroup>

          {addDocketEntryHelper.showDateReceivedEdit && (
            <FormGroup errorText={validationErrors.dateReceived}>
              <fieldset className="usa-fieldset date-received">
                <legend id="usa-legend date-received-legend">
                  Date received
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
                        saveIntermediateDocketEntrySequence();
                      }}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 2),
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
                      maxLength="2"
                      min="1"
                      name="dateReceivedDay"
                      placeholder="DD"
                      type="number"
                      value={form.dateReceivedDay || ''}
                      onBlur={() => {
                        saveIntermediateDocketEntrySequence();
                      }}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 2),
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
                      maxLength="4"
                      min="1900"
                      name="dateReceivedYear"
                      placeholder="YYYY"
                      type="number"
                      value={form.dateReceivedYear || ''}
                      onBlur={() => {
                        saveIntermediateDocketEntrySequence();
                      }}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 4),
                        });
                      }}
                    />
                  </div>
                </div>
              </fieldset>
            </FormGroup>
          )}

          <FormGroup errorText={validationErrors.eventCode}>
            <label
              className="usa-label"
              htmlFor="react-select-2-input"
              id="document-type-label"
            >
              Document type
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
              value={reactSelectValue({
                documentTypes:
                  internalTypesHelper.internalDocumentTypesForSelectSorted,
                selectedEventCode: form.eventCode,
              })}
              onChange={(inputValue, { action, name }) => {
                docketEntryOnChange({
                  action,
                  inputValue,
                  name,
                  updateSequence: updateDocketEntryFormValueSequence,
                  validateSequence: saveIntermediateDocketEntrySequence,
                });
                return true;
              }}
              onInputChange={(inputText, { action }) => {
                onInputChange({
                  action,
                  inputText,
                  updateSequence: updateScreenMetadataSequence,
                });
              }}
            />
          </FormGroup>

          {addDocketEntryHelper.primary.showSecondaryDocumentForm && (
            <FormGroup
              errorText={
                !form.secondaryDocument && validationErrors.secondaryDocument
              }
            >
              <label
                className="usa-label"
                htmlFor="react-select-3-input"
                id="secondary-document-type-label"
              >
                Which Document Is This Motion for Leave For?
                <span className="usa-hint">
                  You can upload the associated document by creating a new
                  docket entry for it.
                </span>
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
                value={reactSelectValue({
                  documentTypes:
                    internalTypesHelper.internalDocumentTypesForSelectSorted,
                  selectedEventCode:
                    form.secondaryDocument && form.secondaryDocument.eventCode,
                })}
                onChange={(inputValue, { action, name }) => {
                  docketEntryOnChange({
                    action,
                    inputValue,
                    name,
                    updateSequence: updateDocketEntryFormValueSequence,
                    validateSequence: validateDocketEntrySequence,
                  });
                  saveIntermediateDocketEntrySequence();
                  return true;
                }}
                onInputChange={(inputText, { action }) => {
                  onInputChange({
                    action,
                    inputText,
                    updateSequence: updateScreenMetadataSequence,
                  });
                }}
              />
            </FormGroup>
          )}

          {addDocketEntryHelper.primary.showNonstandardForm && (
            <NonstandardForm
              helper="addDocketEntryHelper"
              level="primary"
              updateSequence="updateDocketEntryFormValueSequence"
              validateSequence="saveIntermediateDocketEntrySequence"
              validationErrors="validationErrors"
            />
          )}

          {form.secondaryDocument && <SecondaryDocumentForm />}

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="additional-info"
              id="additional-info-label"
            >
              Additional info 1 <span className="usa-hint">(optional)</span>
            </label>
            <textarea
              aria-describedby="additional-info-label"
              autoCapitalize="none"
              className="usa-textarea height-8"
              id="additional-info"
              name="additionalInfo"
              type="text"
              value={form.additionalInfo || ''}
              onBlur={() => {
                saveIntermediateDocketEntrySequence();
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
                  saveIntermediateDocketEntrySequence();
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

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="additional-info2"
              id="additional-info2-label"
            >
              Additional info 2 <span className="usa-hint">(optional)</span>
            </label>
            <textarea
              aria-describedby="additional-info2-label"
              autoCapitalize="none"
              className="usa-textarea height-8"
              id="additional-info2"
              name="additionalInfo2"
              type="text"
              value={form.additionalInfo2 || ''}
              onBlur={() => {
                saveIntermediateDocketEntrySequence();
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

          <FormGroup errorText={addDocketEntryHelper.partyValidationError}>
            <fieldset
              className={classNames(
                'usa-fieldset',
                !addDocketEntryHelper.showObjection && 'margin-bottom-0',
              )}
            >
              <legend className="usa-legend">
                Who is filing this document?
              </legend>
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
                    saveIntermediateDocketEntrySequence();
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
                      saveIntermediateDocketEntrySequence();
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
                    saveIntermediateDocketEntrySequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="party-respondent"
                >
                  Respondent
                </label>
              </div>
            </fieldset>
          </FormGroup>
          {addDocketEntryHelper.showObjection && (
            <FormGroup errorText={validationErrors.objections}>
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="objections-legend">
                  Are there any objections to this document?
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
                        saveIntermediateDocketEntrySequence();
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
            </FormGroup>
          )}
          {addDocketEntryHelper.showTrackOption && (
            <>
              <hr />
              <div className="usa-form-group">
                <fieldset className="usa-fieldset">
                  <legend className="usa-legend">Track document?</legend>
                  <div className="usa-checkbox">
                    <input
                      checked={form.pending || false}
                      className="usa-checkbox__input"
                      id="pending"
                      name="pending"
                      type="checkbox"
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.checked,
                        });
                        saveIntermediateDocketEntrySequence();
                      }}
                    />
                    <label className="usa-checkbox__label" htmlFor="pending">
                      Add to pending report
                    </label>
                  </div>
                </fieldset>
              </div>
            </>
          )}
        </div>
      </>
    );
  },
);
