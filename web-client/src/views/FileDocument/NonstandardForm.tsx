import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@web-client/presenter/shared.cerebral';
import { get } from 'lodash';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const NonstandardForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    caseDetail: state.caseDetail,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    getOrdinalValuesForUploadIteration:
      state.getOrdinalValuesForUploadIteration,
    helper: state[props.helper],
    level: props.level,
    namespace: props.namespace,
    trialCitiesHelper: state.trialCitiesHelper,
    updateSequence: sequences[props.updateSequence],
    validateSequence: sequences[props.validateSequence],
    validationErrors: state[props.validationErrors],
  },
  function NonstandardForm({
    caseDetail,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    getOrdinalValuesForUploadIteration,
    helper,
    level,
    namespace,
    updateSequence,
    validateSequence,
    validationErrors,
  }) {
    useEffect(() => {
      const input = window.document.getElementById('other-iteration');
      if (input) {
        input.addEventListener('keydown', keydownTriggered, false);
      }
    });

    const keydownTriggered = e => {
      if (e.keyCode === 110 || e.keyCode === 190) {
        e.preventDefault();
      }
    };

    namespace = namespace ? `${namespace}.` : '';
    return (
      <div className="nonstandard-form">
        {helper[level].showTextInput && (
          <FormGroup errorText={validationErrors?.freeText}>
            <label className="usa-label" htmlFor={`${namespace}free-text`}>
              {helper[level].textInputLabel}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id={`${namespace}free-text`}
              name={`${namespace}freeText`}
              type="text"
              value={get(form, `${namespace}freeText`, '')}
              onBlur={() => {
                validateSequence();
              }}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}
        {helper[level].showTextInput2 && (
          <FormGroup errorText={validationErrors?.freeText2}>
            <label className="usa-label" htmlFor={`${namespace}free-text2`}>
              {helper[level].textInputLabel2}
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              id={`${namespace}free-text2`}
              name={`${namespace}freeText2`}
              type="text"
              value={get(form, `${namespace}freeText2`, '')}
              onBlur={() => {
                validateSequence();
              }}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}
        {helper[level].previousDocumentSelectLabel && (
          <FormGroup errorText={validationErrors?.previousDocument}>
            <label
              className="usa-label"
              htmlFor={`${namespace}previous-document`}
            >
              {helper[level].previousDocumentSelectLabel}
            </label>
            <select
              aria-label="previousDocument"
              className={classNames(
                'usa-select',
                validationErrors?.previousDocument && 'usa-select--error',
              )}
              id={`${namespace}previous-document`}
              name={`${namespace}previousDocument`}
              value={get(
                form,
                `${namespace}previousDocument.docketEntryId`,
                '',
              )}
              onChange={e => {
                updateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence();
              }}
            >
              <option value="">- Select -</option>
              {helper[level].previouslyFiledDocuments.map(previousDocument => {
                return (
                  <option
                    key={previousDocument.docketEntryId}
                    value={previousDocument.docketEntryId}
                  >
                    {previousDocument.documentTitle ||
                      previousDocument.documentType}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        )}
        {helper[level].showDateFields && (
          <DateSelector
            defaultValue={form[`${namespace}serviceDate`]}
            errorText={validationErrors?.serviceDate}
            id="date-of-service"
            label="Service date"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key: `${namespace}serviceDate`,
                toFormat: DATE_FORMATS.ISO,
                value: e.target.value,
              });
              updateSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateSequence();
            }}
          />
        )}
        {helper[level].showTrialLocationSelect && (
          <FormGroup errorText={validationErrors?.trialLocation}>
            <TrialCity
              label={helper[level].textInputLabel}
              procedureType={caseDetail.procedureType}
              showDefaultOption={true}
              showRegularTrialCitiesHint={false}
              showSmallTrialCitiesHint={false}
              value={get(form, `${namespace}trialLocation`, '')}
              onChange={e => {
                updateSequence({
                  key: `${namespace}trialLocation`,
                  value: e.target.value,
                });
                validateSequence();
              }}
            />
          </FormGroup>
        )}
        {helper[level].ordinalField && (
          <>
            <NonMobile>
              <FormGroup className="grid-row grid-gap">
                <FormGroup
                  className="grid-col-6 margin-bottom-0"
                  errorText={validationErrors?.ordinalValue}
                >
                  <label
                    className="usa-label"
                    htmlFor={`${namespace}ordinal-field-select`}
                  >
                    {helper[level].ordinalField}
                  </label>
                  <select
                    className="usa-select"
                    id={`${namespace}ordinal-field-select`}
                    name={`${namespace}ordinalValue`}
                    value={get(form, `${namespace}ordinalValue`)}
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateSequence();
                    }}
                  >
                    <option value="">- Select -</option>
                    {getOrdinalValuesForUploadIteration.map(ordinalValue => (
                      <option key={ordinalValue} value={ordinalValue}>
                        {ordinalValue}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                {get(form, `${namespace}ordinalValue`) === 'Other' && (
                  <FormGroup
                    className="grid-col-6"
                    errorText={validationErrors?.otherIteration}
                  >
                    <label
                      className="usa-label"
                      htmlFor={`${namespace}other-iteration`}
                    >
                      Iteration
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input margin-0"
                      id={`${namespace}other-iteration`}
                      name={`${namespace}otherIteration`}
                      placeholder="Number"
                      type="number"
                      value={get(form, `${namespace}otherIteration`) || ''}
                      onBlur={() => validateSequence()}
                      onChange={e => {
                        updateSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateSequence();
                      }}
                    />
                  </FormGroup>
                )}
              </FormGroup>
            </NonMobile>
            <Mobile>
              <FormGroup>
                <FormGroup
                  className="margin-bottom-0"
                  errorText={validationErrors?.ordinalValue}
                >
                  <label
                    className="usa-label"
                    htmlFor={`${namespace}ordinal-field-select`}
                  >
                    {helper[level].ordinalField}
                  </label>
                  <select
                    className="usa-select"
                    id={`${namespace}ordinal-field-select`}
                    name={`${namespace}ordinalValue`}
                    value={get(form, `${namespace}ordinalValue`)}
                    onChange={e => {
                      updateSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateSequence();
                    }}
                  >
                    <option value="">- Select -</option>
                    {getOrdinalValuesForUploadIteration.map(ordinalValue => (
                      <option key={ordinalValue} value={ordinalValue}>
                        {ordinalValue}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                {get(form, `${namespace}ordinalValue`) === 'Other' && (
                  <FormGroup
                    errorText={validationErrors?.otherIteration}
                    id="other-iteration-field"
                  >
                    <label
                      className="usa-label"
                      htmlFor={`${namespace}other-iteration`}
                    >
                      Iteration
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input margin-0"
                      id={`${namespace}other-iteration`}
                      name={`${namespace}otherIteration`}
                      placeholder="Number"
                      type="number"
                      value={get(form, `${namespace}otherIteration`) || ''}
                      onBlur={() => validateSequence()}
                      onChange={e => {
                        updateSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateSequence();
                      }}
                    />
                  </FormGroup>
                )}
              </FormGroup>
            </Mobile>
          </>
        )}
      </div>
    );
  },
);

NonstandardForm.displayName = 'NonstandardForm';
