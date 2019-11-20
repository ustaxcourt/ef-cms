import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CourtIssuedNonstandardForm = connect(
  {
    addCourtIssuedDocketEntryNonstandardHelper:
      state.addCourtIssuedDocketEntryNonstandardHelper,
    form: state.form,
    judgeUsers: state.judgeUsers,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addCourtIssuedDocketEntryNonstandardHelper,
    form,
    judgeUsers,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <>
        {addCourtIssuedDocketEntryNonstandardHelper.showDate && (
          <FormGroup errorText={validationErrors.date}>
            <fieldset className="usa-fieldset margin-bottom-0 margin-top-2">
              <legend className="usa-legend" id="date-legend">
                Date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month margin-bottom-0">
                  <input
                    aria-describedby="date-legend"
                    aria-label="month, two digits"
                    className="usa-input usa-input-inline"
                    id="date-month"
                    max="12"
                    min="1"
                    name="month"
                    placeholder="MM"
                    type="number"
                    value={form.month || ''}
                    onBlur={() => validateCourtIssuedDocketEntrySequence()}
                    onChange={e => {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day margin-bottom-0">
                  <input
                    aria-describedby="date-legend"
                    aria-label="day, two digits"
                    className="usa-input usa-input-inline"
                    id="date-day"
                    max="31"
                    min="1"
                    name="day"
                    placeholder="DD"
                    type="number"
                    value={form.day || ''}
                    onBlur={() => validateCourtIssuedDocketEntrySequence()}
                    onChange={e => {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year margin-bottom-0">
                  <input
                    aria-describedby="date-legend"
                    aria-label="year, four digits"
                    className="usa-input usa-input-inline"
                    id="date-year"
                    max="2100"
                    min="1900"
                    name="year"
                    placeholder="YYYY"
                    type="number"
                    value={form.year || ''}
                    onBlur={() => validateCourtIssuedDocketEntrySequence()}
                    onChange={e => {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
          </FormGroup>
        )}

        {addCourtIssuedDocketEntryNonstandardHelper.showJudge && (
          <FormGroup errorText={validationErrors.judge}>
            <label className="usa-label" htmlFor="judge" id="judge-label">
              Judge’s Name
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

        {addCourtIssuedDocketEntryNonstandardHelper.showFreeText && (
          <FormGroup errorText={validationErrors.freeText}>
            <label
              className="usa-label"
              htmlFor="free-text"
              id="free-text-label"
            >
              What is this order for?
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

        {addCourtIssuedDocketEntryNonstandardHelper.showDocketNumbers && (
          <FormGroup errorText={validationErrors.docketNumbers}>
            <label
              className="usa-label"
              htmlFor="docket-numbers"
              id="docket-numbers-label"
            >
              Docket Number(s)
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
      </>
    );
  },
);
