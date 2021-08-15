import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FilingPartiesForm } from '../FilingPartiesForm';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Inclusions } from './Inclusions';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { SecondaryDocumentForm } from './SecondaryDocumentForm';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@cerebral/react';
import {
  docketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrimaryDocumentForm = connect(
  {
    OBJECTIONS_OPTIONS: state.constants.OBJECTIONS_OPTIONS,
    addDocketEntryHelper: state.addDocketEntryHelper,
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
    form,
    internalTypesHelper,
    OBJECTIONS_OPTIONS,
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
          </FormGroup>
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
            onBlur={validateDocketEntrySequence}
            onChange={updateDocketEntryFormValueSequence}
          />
          <FormGroup errorText={validationErrors.mailingDate}>
            <label className="usa-label" htmlFor="mailing-date">
              Mailing date <span className="usa-hint">(optional)</span>
            </label>
            <input
              className="usa-input usa-input-inline"
              id="mailing-date"
              maxLength="25"
              name="mailingDate"
              value={form.mailingDate || ''}
              onBlur={() => validateDocketEntrySequence()}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          <FormGroup errorText={validationErrors.eventCode}>
            <label
              className="usa-label"
              htmlFor="react-select-2-input"
              id="document-type-label"
            >
              Document type
            </label>

            <span className="usa-hint">
              Enter your document name to see available document types,
              <br />
              or use the dropdown to select your document type.
            </span>

            <SelectSearch
              aria-label="document-type-label"
              id="document-type"
              name="eventCode"
              options={internalTypesHelper.internalDocumentTypesForSelectSorted}
              value={reactSelectValue({
                documentTypes:
                  internalTypesHelper.internalDocumentTypesForSelectSorted,
                selectedEventCode: form.eventCode,
              })}
              onChange={(inputValue, { action, name: inputName }) => {
                docketEntryOnChange({
                  action,
                  inputName,
                  inputValue,
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
                validationErrors.secondaryDocument && !form.secondaryDocument
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
              <SelectSearch
                aria-label="secondary-document-type-label"
                id="secondary-document-type"
                isClearable={true}
                name="secondaryDocument.eventCode"
                options={
                  internalTypesHelper.internalDocumentTypesForSelectSorted
                }
                value={reactSelectValue({
                  documentTypes:
                    internalTypesHelper.internalDocumentTypesForSelectSorted,
                  selectedEventCode:
                    form.secondaryDocument && form.secondaryDocument.eventCode,
                })}
                onChange={(inputValue, { action, name: inputName }) => {
                  docketEntryOnChange({
                    action,
                    inputName,
                    inputValue,
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
          <FormGroup errorText={validationErrors.additionalInfo}>
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
                validateDocketEntrySequence();
              }}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
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
                Add to cover sheet
              </label>
            </div>
          </div>
          <FormGroup errorText={validationErrors.additionalInfo2}>
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
                validateDocketEntrySequence();
              }}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
          <Inclusions updateSequence="updateDocketEntryFormValueSequence" />
          <FilingPartiesForm
            updateSequence={updateDocketEntryFormValueSequence}
            validateSequence={validateDocketEntrySequence}
          />
          {addDocketEntryHelper.showObjection && (
            <FormGroup errorText={validationErrors.objections}>
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="objections-legend">
                  Are there any objections to the granting of this document?
                </legend>
                {OBJECTIONS_OPTIONS.map(option => (
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
                        validateDocketEntrySequence();
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
