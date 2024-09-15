import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FilingPartiesForm } from '../FilingPartiesForm';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Inclusions } from '../PaperFiling/Inclusions';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { SecondaryDocumentForm } from '../PaperFiling/SecondaryDocumentForm';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  docketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMetaFormDocument = connect(
  {
    constants: state.constants,
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    internalTypesHelper: state.internalTypesHelper,
    updateDocketEntryMetaDocumentFormValueSequence:
      sequences.updateDocketEntryMetaDocumentFormValueSequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormDocument({
    constants,
    editDocketEntryMetaHelper,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    internalTypesHelper,
    updateDocketEntryMetaDocumentFormValueSequence,
    validateDocumentSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors.lodged}>
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Filing status</legend>
            {['Filed', 'Lodge'].map(option => (
              <div className="usa-radio usa-radio__inline" key={option}>
                <input
                  checked={form.lodged === (option === 'Lodge')}
                  className="usa-radio__input"
                  id={`filing-status-${option}`}
                  name="lodged"
                  type="radio"
                  value={option}
                  onChange={e => {
                    updateDocketEntryMetaDocumentFormValueSequence({
                      key: e.target.name,
                      value: e.target.value === 'Lodge',
                    });
                    validateDocumentSequence();
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
        <DateSelector
          defaultValue={form.filingDate}
          errorText={validationErrors.filingDate}
          id="filing-date"
          label="Filed date"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'filingDate',
              toFormat: constants.DATE_FORMATS.ISO,
              value: e.target.value,
            });
            validateDocumentSequence();
          }}
        />
        <FormGroup errorText={validationErrors.eventCode}>
          <label
            className="usa-label"
            htmlFor="react-select-2-input"
            id="document-type-label"
          >
            Document type
          </label>

          <SelectSearch
            aria-describedby="document-type-label"
            id="document-type"
            name="eventCode"
            options={internalTypesHelper.internalDocumentTypesForSelectSorted}
            value={reactSelectValue({
              documentTypes:
                internalTypesHelper.internalDocumentTypesForSelectWithLegacySorted,
              selectedEventCode: form.eventCode,
            })}
            onChange={(inputValue, { action, name: inputName }) => {
              docketEntryOnChange({
                action,
                inputName,
                inputValue,
                updateSequence: updateDocketEntryMetaDocumentFormValueSequence,
                validateSequence: validateDocumentSequence,
              });
              return true;
            }}
            onInputChange={(inputText, { action }) => {
              onInputChange({
                action,
                inputText,
                updateSequence: validateDocumentSequence,
              });
            }}
          />
        </FormGroup>
        {editDocketEntryMetaHelper.primary.showSecondaryDocumentForm && (
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
                You can upload the associated document by creating a new docket
                entry for it.
              </span>
            </label>
            <SelectSearch
              aria-label="secondary-document-type-label"
              id="secondary-document-type"
              isClearable={true}
              name="secondaryDocument.eventCode"
              options={internalTypesHelper.internalDocumentTypesForSelectSorted}
              value={reactSelectValue({
                documentTypes:
                  internalTypesHelper.internalDocumentTypesForSelectWithLegacySorted,
                selectedEventCode:
                  form.secondaryDocument && form.secondaryDocument.eventCode,
              })}
              onChange={(inputValue, { action, name: inputName }) => {
                docketEntryOnChange({
                  action,
                  inputName,
                  inputValue,
                  updateSequence:
                    updateDocketEntryMetaDocumentFormValueSequence,
                  validateSequence: validateDocumentSequence,
                });
                return true;
              }}
              onInputChange={(inputText, { action }) => {
                onInputChange({
                  action,
                  inputText,
                  updateSequence:
                    updateDocketEntryMetaDocumentFormValueSequence,
                });
              }}
            />
          </FormGroup>
        )}
        {editDocketEntryMetaHelper.primary.showNonstandardForm && (
          <NonstandardForm
            helper="editDocketEntryMetaHelper"
            level="primary"
            updateSequence="updateDocketEntryMetaDocumentFormValueSequence"
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
            value={form.additionalInfo || ''}
            onBlur={() => {
              validateDocumentSequence();
            }}
            onChange={e => {
              updateDocketEntryMetaDocumentFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup>
          <div className="usa-checkbox">
            <input
              checked={form.addToCoversheet || false}
              className="usa-checkbox__input"
              id="add-to-coversheet"
              name="addToCoversheet"
              type="checkbox"
              onChange={e => {
                updateDocketEntryMetaDocumentFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocumentSequence();
              }}
            />
            <label className="usa-checkbox__label" htmlFor="add-to-coversheet">
              Add to cover sheet
            </label>
          </div>
        </FormGroup>
        <FormGroup>
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
            value={form.additionalInfo2 || ''}
            onBlur={() => {
              validateDocumentSequence();
            }}
            onChange={e => {
              updateDocketEntryMetaDocumentFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup>
          <Inclusions updateSequence="updateDocketEntryMetaDocumentFormValueSequence" />
        </FormGroup>
        <FilingPartiesForm
          updateSequence={updateDocketEntryMetaDocumentFormValueSequence}
          validateSequence={validateDocumentSequence}
        />
        {editDocketEntryMetaHelper.showObjection && (
          <FormGroup errorText={validationErrors.objections}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="objections-legend">
                Are there any objections to the granting of this document?
              </legend>
              {constants.OBJECTIONS_OPTIONS.map(option => (
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
                      updateDocketEntryMetaDocumentFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateDocumentSequence();
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
                  updateDocketEntryMetaDocumentFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label className="usa-checkbox__label" htmlFor="pending">
                Add to pending report
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    );
  },
);

EditDocketEntryMetaFormDocument.displayName = 'EditDocketEntryMetaFormDocument';
