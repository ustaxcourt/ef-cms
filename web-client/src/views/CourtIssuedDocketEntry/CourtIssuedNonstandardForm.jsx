import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const NonstandardDateInput = ({
  addCourtIssuedDocketEntryNonstandardHelper,
  form,
  updateCourtIssuedDocketEntryFormValueSequence,
  validateCourtIssuedDocketEntrySequence,
  validationErrors,
}) => (
  <DateInput
    errorText={validationErrors.date}
    id="date"
    label={addCourtIssuedDocketEntryNonstandardHelper.dateLabel}
    values={form}
    onBlur={validateCourtIssuedDocketEntrySequence}
    onChange={updateCourtIssuedDocketEntryFormValueSequence}
  />
);

export const CourtIssuedNonstandardForm = connect(
  {
    addCourtIssuedDocketEntryNonstandardHelper:
      state.addCourtIssuedDocketEntryNonstandardHelper,
    form: state.form,
    judgeUsers: state.judges,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function CourtIssuedNonstandardForm({
    addCourtIssuedDocketEntryNonstandardHelper,
    form,
    judgeUsers,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validationErrors,
  }) {
    return (
      <>
        {addCourtIssuedDocketEntryNonstandardHelper.showDateFirst && (
          <NonstandardDateInput
            addCourtIssuedDocketEntryNonstandardHelper={
              addCourtIssuedDocketEntryNonstandardHelper
            }
            form={form}
            updateCourtIssuedDocketEntryFormValueSequence={
              updateCourtIssuedDocketEntryFormValueSequence
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
              <TrialCityOptions procedureType="All" />
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
            addCourtIssuedDocketEntryNonstandardHelper={
              addCourtIssuedDocketEntryNonstandardHelper
            }
            form={form}
            updateCourtIssuedDocketEntryFormValueSequence={
              updateCourtIssuedDocketEntryFormValueSequence
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
