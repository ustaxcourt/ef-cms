import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Inclusions } from '../AddDocketEntry/Inclusions';
import { NonstandardForm } from '../FileDocument/NonstandardForm';
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

export const EditDocketEntryMetaFormDocument = connect(
  {
    caseDetail: state.caseDetail,
    editDocketEntryMetaHelper: state.editDocketEntryMetaHelper,
    form: state.form,
    internalTypesHelper: state.internalTypesHelper,
    updateDocketEntryMetaDocumentFormValueSequenceSequence:
      sequences.updateDocketEntryMetaDocumentFormValueSequenceSequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetail,
    editDocketEntryMetaHelper,
    form,
    internalTypesHelper,
    updateDocketEntryMetaDocumentFormValueSequenceSequence,
    validateDocketRecordSequence,
    validationErrors,
  }) => {
    console.log('form', form);
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
                    updateDocketEntryMetaDocumentFormValueSequenceSequence({
                      key: e.target.name,
                      value: e.target.value === 'Lodge',
                    });
                    validateDocketRecordSequence();
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
        <FormGroup errorText={validationErrors.filingDate}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="filing-date-legend">
              Filed Date
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="month, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-month"
                  max="12"
                  maxLength="2"
                  min="1"
                  name="filingDateMonth"
                  type="number"
                  value={form.filingDateMonth || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateDocketEntryMetaDocumentFormValueSequenceSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 2),
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="day, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-day"
                  max="31"
                  maxLength="2"
                  min="1"
                  name="filingDateDay"
                  type="number"
                  value={form.filingDateDay || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateDocketEntryMetaDocumentFormValueSequenceSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 2),
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="year, four digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-year"
                  max="2100"
                  maxLength="4"
                  min="1900"
                  name="filingDateYear"
                  type="number"
                  value={form.filingDateYear || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateDocketEntryMetaDocumentFormValueSequenceSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 4),
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
        </FormGroup>
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
                updateSequence: updateDocketEntryMetaDocumentFormValueSequenceSequence,
                validateSequence: validateDocketRecordSequence,
              });
              return true;
            }}
            onInputChange={(inputText, { action }) => {
              onInputChange({
                action,
                inputText,
                updateSequence: validateDocketRecordSequence,
              });
            }}
          />
        </FormGroup>

        {editDocketEntryMetaHelper.primary.showNonstandardForm && (
          <NonstandardForm
            helper="editDocketEntryMetaHelper"
            level="primary"
            updateSequence="updateDocketEntryMetaDocumentFormValueSequenceSequence"
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
              validateDocketRecordSequence();
            }}
            onChange={e => {
              updateDocketEntryMetaDocumentFormValueSequenceSequence({
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
                updateDocketEntryMetaDocumentFormValueSequenceSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketRecordSequence();
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
              validateDocketRecordSequence();
            }}
            onChange={e => {
              updateDocketEntryMetaDocumentFormValueSequenceSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
        <FormGroup>
          <Inclusions updateSequence="updateDocketEntryMetaDocumentFormValueSequenceSequence" />
        </FormGroup>
        <FormGroup errorText={editDocketEntryMetaHelper.partyValidationError}>
          <fieldset
            className={classNames(
              'usa-fieldset',
              !editDocketEntryMetaHelper.showObjection && 'margin-bottom-0',
            )}
          >
            <legend className="usa-legend">Who is filing this document?</legend>
            <div className="usa-checkbox">
              <input
                checked={form.partyPrimary || false}
                className="usa-checkbox__input"
                id="party-primary"
                name="partyPrimary"
                type="checkbox"
                onChange={e => {
                  updateDocketEntryMetaDocumentFormValueSequenceSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateDocketRecordSequence();
                }}
              />
              <label
                className="usa-checkbox__label inline-block"
                htmlFor="party-primary"
              >
                {caseDetail.contactPrimary.name}
              </label>
            </div>
            {editDocketEntryMetaHelper.showSecondaryParty && (
              <div className="usa-checkbox">
                <input
                  checked={form.partySecondary || false}
                  className="usa-checkbox__input"
                  id="party-secondary"
                  name="partySecondary"
                  type="checkbox"
                  onChange={e => {
                    updateDocketEntryMetaDocumentFormValueSequenceSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateDocketRecordSequence();
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
                checked={form.partyRespondent || false}
                className="usa-checkbox__input"
                id="party-respondent"
                name="partyRespondent"
                type="checkbox"
                onChange={e => {
                  updateDocketEntryMetaDocumentFormValueSequenceSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateDocketRecordSequence();
                }}
              />
              <label
                className="usa-checkbox__label inline-block"
                htmlFor="party-respondent"
              >
                Respondent
              </label>
            </div>
          </fieldset>
        </FormGroup>
        {!editDocketEntryMetaHelper.showObjection && (
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
                      updateDocketEntryMetaDocumentFormValueSequenceSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateDocketRecordSequence();
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
