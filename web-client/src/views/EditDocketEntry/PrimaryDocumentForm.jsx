import { DateInput } from '../../ustc-ui/DateInput/DateInput';
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
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function PrimaryDocumentForm({
    addDocketEntryHelper,
    caseDetail,
    form,
    internalTypesHelper,
    updateDocketEntryFormValueSequence,
    updateScreenMetadataSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) {
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
            <DateInput
              errorText={validationErrors.dateReceived}
              id="date-received"
              label="Date received"
              names={{
                day: 'dateReceivedDay',
                month: 'dateReceivedMonth',
                year: 'dateReceivedYear',
              }}
              values={{
                day: form.dateReceivedDay,
                month: form.dateReceivedMonth,
                year: form.dateReceivedYear,
              }}
              onChange={updateDocketEntryFormValueSequence}
            />
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
                  validateSequence: validateDocketEntrySequence,
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
              validateSequence="validateDocketEntrySequence"
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
                }}
              />
              <label
                className="usa-checkbox__label inline-block"
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
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <Inclusions updateSequence="updateDocketEntryFormValueSequence" />

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
                  }}
                />
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="party-primary"
                >
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
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
                    htmlFor="party-secondary"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
              <div className="usa-checkbox">
                <input
                  checked={form.partyIrsPractitioner || false}
                  className="usa-checkbox__input"
                  id="party-irs-practitioner"
                  name="partyIrsPractitioner"
                  type="checkbox"
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="party-irs-practitioner"
                >
                  Respondent
                </label>
              </div>
              <div className="usa-checkbox">
                <input
                  checked={form.hasOtherFilingParty || false}
                  className="usa-checkbox__input"
                  id="has-other-filing-party"
                  name="hasOtherFilingParty"
                  type="checkbox"
                  onChange={e => {
                    updateDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label inline-block"
                  htmlFor="has-other-filing-party"
                >
                  Other
                </label>
              </div>
              {form.hasOtherFilingParty && (
                <FormGroup errorText={validationErrors.otherFilingParty}>
                  <div>
                    <label
                      className="usa-label"
                      htmlFor="other-filing-party"
                      id="other-filing-party"
                    >
                      Other filing party name
                    </label>
                    <input
                      aria-describedby="other-filing-party-label"
                      className="usa-input"
                      id="other-filing-party"
                      name="otherFilingParty"
                      type="text"
                      value={form.otherFilingParty || ''}
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </FormGroup>
              )}
            </fieldset>
          </FormGroup>
          {addDocketEntryHelper.showObjection && (
            <FormGroup errorText={validationErrors.objections}>
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="objections-legend">
                  Are there any objections to the granting of this document?
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
                      }}
                    />
                    <label
                      className="usa-checkbox__label inline-block"
                      htmlFor="pending"
                    >
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
