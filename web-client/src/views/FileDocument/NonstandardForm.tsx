import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { get } from 'lodash';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const NonstandardForm = connect(
  {
    caseDetail: state.caseDetail,
    form: state.form,
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
    form,
    getOrdinalValuesForUploadIteration,
    helper,
    level,
    namespace,
    updateSequence,
    validateSequence,
    validationErrors,
  }) {
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
          <DateInput
            errorText={validationErrors?.serviceDate}
            id="date-of-service"
            label="Service date"
            names={{
              day: `${namespace}serviceDateDay`,
              month: `${namespace}serviceDateMonth`,
              year: `${namespace}serviceDateYear`,
            }}
            values={{
              day: get(form, `${namespace}serviceDateDay`, ''),
              month: get(form, `${namespace}serviceDateMonth`, ''),
              year: get(form, `${namespace}serviceDateYear`, ''),
            }}
            onBlur={validateSequence}
            onChange={updateSequence}
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
          <FormGroup errorText={validationErrors?.ordinalValue}>
            <label
              className="usa-label"
              htmlFor={`${namespace}ordinal-field-select`}
            >
              {helper[level].ordinalField}
            </label>
            <select
              className="usa-select"
              id={`${namespace}ordinal-field-select`}
              name="ordinalValue"
              value={form.ordinalValue}
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
            {form.ordinalValue === 'Other' && (
              <FormGroup errorText={validationErrors.otherIteration}>
                <label className="usa-label" htmlFor="other-iteration">
                  Iteration
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="other-iteration"
                  name="otherIteration"
                  placeholder="Number"
                  type="number"
                  value={form.otherIteration || ''}
                  onBlur={() => validateSequence()}
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateSequence(); // use joi to determine max of 9999?
                  }}
                />
              </FormGroup>
            )}
          </FormGroup>
        )}
      </div>
    );
  },
);

NonstandardForm.displayName = 'NonstandardForm';
