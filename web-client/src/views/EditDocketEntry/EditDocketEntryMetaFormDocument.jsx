import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FilingPartiesForm } from '../FilingPartiesForm';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Inclusions } from '../AddDocketEntry/Inclusions';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@cerebral/react';
import {
  docketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaFormDocument = connect(
  {
    OBJECTIONS_OPTIONS: state.constants.OBJECTIONS_OPTIONS,
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    form: state.form,
    internalTypesHelper: state.internalTypesHelper,
    updateDocketEntryMetaDocumentFormValueSequence:
      sequences.updateDocketEntryMetaDocumentFormValueSequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormDocument({
    editDocketEntryMetaHelper,
    form,
    internalTypesHelper,
    OBJECTIONS_OPTIONS,
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
        <DateInput
          errorText={validationErrors.filingDate}
          id="filing-date"
          label="Filed date"
          names={{
            day: 'filingDateDay',
            month: 'filingDateMonth',
            year: 'filingDateYear',
          }}
          values={{
            day: form.filingDateDay,
            month: form.filingDateMonth,
            year: form.filingDateYear,
          }}
          onBlur={validateDocumentSequence}
          onChange={updateDocketEntryMetaDocumentFormValueSequence}
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
                internalTypesHelper.internalDocumentTypesForSelectSorted,
              selectedEventCode: form.eventCode,
            })}
            onChange={(inputValue, { action, name }) => {
              docketEntryOnChange({
                action,
                inputValue,
                name,
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

        {editDocketEntryMetaHelper.primary.showNonstandardForm && (
          <NonstandardForm
            helper="editDocketEntryMetaHelper"
            level="primary"
            updateSequence="updateDocketEntryMetaDocumentFormValueSequence"
            validateSequence="validateDocketEntrySequence"
            validationErrors="validationErrors"
          />
        )}

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
            <label
              className="usa-checkbox__label inline-block"
              htmlFor="add-to-coversheet"
            >
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
            type="text"
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
      </div>
    );
  },
);
