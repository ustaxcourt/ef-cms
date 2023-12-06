import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const NonstandardDateInput = ({
  addCourtIssuedDocketEntryNonstandardHelper,
  DATE_FORMATS,
  form,
  formatAndUpdateDateFromDatePickerSequence,
  updateCourtIssuedDocketEntryTitleSequence,
  validateCourtIssuedDocketEntrySequence,
  validationErrors,
}) => (
  <DateSelector
    defaultValue={form.date}
    errorText={validationErrors.date}
    id="date"
    label={addCourtIssuedDocketEntryNonstandardHelper.dateLabel}
    onChange={e => {
      formatAndUpdateDateFromDatePickerSequence({
        key: 'date',
        toFormat: DATE_FORMATS.ISO,
        value: e.target.value,
      });
      updateCourtIssuedDocketEntryTitleSequence();
      validateCourtIssuedDocketEntrySequence();
    }}
  />
);

export const CourtIssuedNonstandardForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    addCourtIssuedDocketEntryNonstandardHelper:
      state.addCourtIssuedDocketEntryNonstandardHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    judgeUsers: state.judges,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    updateCourtIssuedDocketEntryTitleSequence:
      sequences.updateCourtIssuedDocketEntryTitleSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function CourtIssuedNonstandardForm({
    addCourtIssuedDocketEntryNonstandardHelper,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    judgeUsers,
    updateCourtIssuedDocketEntryFormValueSequence,
    updateCourtIssuedDocketEntryTitleSequence,
    validateCourtIssuedDocketEntrySequence,
    validationErrors,
  }) {
    return (
      <>
        {addCourtIssuedDocketEntryNonstandardHelper.showDateFirst && (
          <NonstandardDateInput
            DATE_FORMATS={DATE_FORMATS}
            addCourtIssuedDocketEntryNonstandardHelper={
              addCourtIssuedDocketEntryNonstandardHelper
            }
            form={form}
            formatAndUpdateDateFromDatePickerSequence={
              formatAndUpdateDateFromDatePickerSequence
            }
            updateCourtIssuedDocketEntryTitleSequence={
              updateCourtIssuedDocketEntryTitleSequence
            }
            validateCourtIssuedDocketEntrySequence={
              validateCourtIssuedDocketEntrySequence
            }
            validationErrors={validationErrors}
          />
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showJudge && (
          <FormGroup errorText={validationErrors.judge}>
            <label className="usa-label" htmlFor="judge" id="judge-label">
              Judge’s name
            </label>
            <select
              className="usa-select"
              data-testid="judge-select"
              id="judge"
              name="judge"
              value={form.judge || ''}
              onChange={e => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCourtIssuedDocketEntrySequence();
              }}
            >
              <option value="">- Select -</option>
              {judgeUsers.map(judgeUser => (
                <option key={judgeUser.userId} value={judgeUser.name}>
                  {judgeUser.name}
                </option>
              ))}
            </select>
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showTrialLocation && (
          <FormGroup errorText={validationErrors.trialLocation}>
            <label
              className="usa-label"
              htmlFor="trial-location"
              id="trial-location-label"
            >
              Trial location
            </label>
            <select
              className="usa-select"
              id="trial-location"
              name="trialLocation"
              value={form.trialLocation || ''}
              onChange={e => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCourtIssuedDocketEntrySequence();
              }}
            >
              <option value="">- Select -</option>
              <TrialCityOptions procedureType="AllPlusStandalone" />
            </select>
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showFreeText && (
          <FormGroup errorText={validationErrors.freeText}>
            <label
              className="usa-label"
              htmlFor="free-text"
              id="free-text-label"
            >
              {addCourtIssuedDocketEntryNonstandardHelper.freeTextLabel}
            </label>

            <input
              aria-describedby="free-text-label"
              className="usa-input usa-input--inline"
              id="free-text"
              name="freeText"
              value={form.freeText || ''}
              onBlur={() => validateCourtIssuedDocketEntrySequence()}
              onChange={e => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showOptionalFreeText && (
          <FormGroup errorText={validationErrors.freeText}>
            <label
              className="usa-label"
              htmlFor="free-text"
              id="free-text-label"
            >
              {addCourtIssuedDocketEntryNonstandardHelper.freeTextLabel}{' '}
              <span className="usa-hint">(optional)</span>
            </label>

            <textarea
              aria-describedby="free-text-label"
              className="usa-textarea height-8"
              id="free-text"
              name="freeText"
              value={form.freeText || ''}
              onBlur={() => validateCourtIssuedDocketEntrySequence()}
              onChange={e => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showDocketNumbers && (
          <FormGroup errorText={validationErrors.docketNumbers}>
            <label
              className="usa-label"
              htmlFor="docket-numbers"
              id="docket-numbers-label"
            >
              Docket number(s)
            </label>

            <input
              aria-describedby="docket-numbers-label"
              className="usa-input usa-input--inline"
              id="docket-numbers"
              name="docketNumbers"
              value={form.docketNumbers || ''}
              onBlur={() => validateCourtIssuedDocketEntrySequence()}
              onChange={e => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showDateLast && (
          <NonstandardDateInput
            DATE_FORMATS={DATE_FORMATS}
            addCourtIssuedDocketEntryNonstandardHelper={
              addCourtIssuedDocketEntryNonstandardHelper
            }
            form={form}
            formatAndUpdateDateFromDatePickerSequence={
              formatAndUpdateDateFromDatePickerSequence
            }
            updateCourtIssuedDocketEntryTitleSequence={
              updateCourtIssuedDocketEntryTitleSequence
            }
            validateCourtIssuedDocketEntrySequence={
              validateCourtIssuedDocketEntrySequence
            }
            validationErrors={validationErrors}
          />
        )}
      </>
    );
  },
);

CourtIssuedNonstandardForm.displayName = 'CourtIssuedNonstandardForm';
