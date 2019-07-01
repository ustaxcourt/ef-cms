import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseTypeSelect } from '../StartCase/CaseTypeSelect';

export const IRSNotice = connect(
  {
    appendNewYearAmountSequence: sequences.appendNewYearAmountSequence,
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    caseTypes: state.caseTypes,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    removeYearAmountSequence: sequences.removeYearAmountSequence,
    setIrsNoticeFalseSequence: sequences.setIrsNoticeFalseSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    appendNewYearAmountSequence,
    autoSaveCaseSequence,
    caseDetail,
    caseDetailErrors,
    caseTypes,
    form,
    formattedCaseDetail,
    removeYearAmountSequence,
    setIrsNoticeFalseSequence,
    updateCaseValueSequence,
    updateFormValueSequence,
  }) => {
    const renderIrsNoticeRadios = () => {
      return (
        <fieldset className="usa-fieldset" id="irs-verified-notice-radios">
          <legend htmlFor="irs-verified-notice-radios">
            Notice Attached to Petition?
          </legend>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={caseDetail.hasVerifiedIrsNotice === true}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-yes"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="Yes"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: true,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="hasVerifiedIrsNotice-yes"
              id="has-irs-verified-notice-yes"
            >
              Yes
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              checked={caseDetail.hasVerifiedIrsNotice === false}
              className="usa-radio__input"
              id="hasVerifiedIrsNotice-no"
              name="hasVerifiedIrsNotice"
              type="radio"
              value="No"
              onChange={() => {
                setIrsNoticeFalseSequence();
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="hasVerifiedIrsNotice-no"
              id="has-irs-verified-notice-no"
            >
              No
            </label>
          </div>
        </fieldset>
      );
    };

    const renderIrsNoticeDate = () => {
      return (
        <div
          className={
            'usa-form-group ' +
            (caseDetailErrors.irsNoticeDate ? 'usa-form-group--error' : '')
          }
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="date-of-notice-legend">
              Date of Notice
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="month, two digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                  }
                  id="date-of-notice-month"
                  max="12"
                  min="1"
                  name="irsMonth"
                  placeholder="MM"
                  type="number"
                  value={form.irsMonth || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="day, two digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                  }
                  id="date-of-notice-day"
                  max="31"
                  min="1"
                  name="irsDay"
                  placeholder="DD"
                  type="number"
                  value={form.irsDay || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="date-of-notice-legend"
                  aria-label="year, four digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (caseDetailErrors.irsNoticeDate ? 'usa-input--error' : '')
                  }
                  id="date-of-notice-year"
                  max="2100"
                  min="1900"
                  name="irsYear"
                  placeholder="YYYY"
                  type="number"
                  value={form.irsYear || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
          {caseDetailErrors.irsNoticeDate && (
            <div className="usa-error-message" role="alert">
              {caseDetailErrors.irsNoticeDate}
            </div>
          )}
        </div>
      );
    };

    const renderYearAmounts = () => {
      return (
        <React.Fragment>
          {formattedCaseDetail.yearAmountsFormatted.map((yearAmount, idx) => (
            <div
              className={yearAmount.showError ? ' usa-input-error' : ''}
              key={idx}
            >
              <div className="inline-input-year">
                <label className="usa-label" htmlFor="year">
                  Year
                </label>
                <input
                  aria-label="IRS Notice Year"
                  className="usa-input"
                  id="year"
                  name="year"
                  type="number"
                  value={yearAmount.year || ''}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.year`,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="inline-input-amount">
                <label className="usa-label" htmlFor="amount">
                  Amount
                </label>
                <span aria-hidden="true" role="presentation">
                  $
                </span>
                <input
                  aria-label="IRS Notice Amount in whole dollars"
                  className="usa-input"
                  id="amount"
                  name="amount"
                  type="text"
                  value={Number(yearAmount.amount || 0).toLocaleString('en-US')}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.amount`,
                      value: e.target.value.replace(/\D/g, ''),
                    });
                  }}
                />
                <span aria-hidden="true" role="presentation">
                  .00
                </span>
                {idx !== 0 && (
                  <button
                    aria-controls="removeYearAmount"
                    className="usa-button usa-button--unstyled"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      removeYearAmountSequence({
                        index: idx,
                      });
                    }}
                  >
                    <span>
                      <FontAwesomeIcon icon="times-circle" size="sm" />
                      Remove
                    </span>
                  </button>
                )}
              </div>
              {yearAmount.showError && (
                <div className="usa-error-message">
                  {yearAmount.errorMessage}
                </div>
              )}
            </div>
          ))}
          <button
            aria-controls="addAnotherYearAmount"
            className="usa-button usa-button--unstyled"
            disabled={!formattedCaseDetail.canAddYearAmount}
            type="button"
            onClick={e => {
              e.preventDefault();
              appendNewYearAmountSequence();
            }}
          >
            <span>
              <FontAwesomeIcon icon="plus-circle" size="sm" />
              Add Another
            </span>
          </button>
        </React.Fragment>
      );
    };

    return (
      <div className="blue-container">
        {renderIrsNoticeRadios()}

        <CaseTypeSelect
          allowDefaultOption={true}
          caseTypes={caseTypes}
          legend="Type of Case"
          validation="autoSaveCaseSequence"
          value={caseDetail.caseType}
          onChange="updateCaseValueSequence"
        />

        {formattedCaseDetail.shouldShowIrsNoticeDate && renderIrsNoticeDate()}
        {formattedCaseDetail.shouldShowYearAmounts && (
          <React.Fragment>
            <hr />
            {renderYearAmounts()}
          </React.Fragment>
        )}
      </div>
    );
  },
);
