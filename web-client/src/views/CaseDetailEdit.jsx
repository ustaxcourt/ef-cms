import { connect } from '@cerebral/react';
import { state, sequences } from 'cerebral';
import React from 'react';
import UpdateCaseCancelModalDialog from './UpdateCaseCancelModalDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default connect(
  {
    appendNewYearAmountSequence: sequences.appendNewYearAmountSequence,
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    caseDetail: state.caseDetail,
    caseDetailErrors: state.caseDetailErrors,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    removeYearAmountSequence: sequences.removeYearAmountSequence,
    showModal: state.showModal,
    submitting: state.submitting,
    submitCaseDetailEditSaveSequence:
      sequences.submitCaseDetailEditSaveSequence,
    unsetFormSaveSuccessSequence: sequences.unsetFormSaveSuccessSequence,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function PetitionEdit({
    appendNewYearAmountSequence,
    autoSaveCaseSequence,
    caseDetail,
    caseDetailErrors,
    form,
    formattedCaseDetail,
    removeYearAmountSequence,
    showModal,
    submitting,
    submitCaseDetailEditSaveSequence,
    unsetFormSaveSuccessSequence,
    updateCaseValueSequence,
    updateFormValueSequence,
  }) {
    return (
      <form
        id="case-edit-form"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          submitCaseDetailEditSaveSequence();
        }}
        role="form"
        onFocus={() => {
          unsetFormSaveSuccessSequence();
        }}
      >
        {showModal === 'UpdateCaseCancelModalDialog' && (
          <UpdateCaseCancelModalDialog />
        )}
        <div className="blue-container">
          <h3>IRS Notice(s)</h3>
          <span className="label">Type of Notice</span>
          <p>{caseDetail.caseType}</p>

          <div
            className={caseDetailErrors.irsNoticeDate ? 'usa-input-error' : ''}
          >
            <fieldset>
              <legend id="date-of-notice-legend">Date of Notice</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor="date-of-notice-month" aria-hidden="true">
                    MM
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input-error' : '')
                    }
                    id="date-of-notice-month"
                    max="12"
                    min="1"
                    name="irsMonth"
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
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="date-of-notice-day" aria-hidden="true">
                    DD
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input-error' : '')
                    }
                    id="date-of-notice-day"
                    max="31"
                    min="1"
                    name="irsDay"
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
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="date-of-notice-year" aria-hidden="true">
                    YYYY
                  </label>
                  <input
                    aria-describedby="date-of-notice-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.irsNoticeDate ? 'usa-input-error' : '')
                    }
                    id="date-of-notice-year"
                    max="2100"
                    min="1900"
                    name="irsYear"
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
              <div className="usa-input-error-message beneath" role="alert">
                {caseDetailErrors.irsNoticeDate}
              </div>
            )}
          </div>
          {formattedCaseDetail.yearAmountsFormatted.map((yearAmount, idx) => (
            <div
              key={idx}
              className={yearAmount.showError ? ' usa-input-error' : ''}
            >
              <div className="inline-input-year">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  type="number"
                  name="year"
                  aria-label="IRS Notice Year"
                  value={yearAmount.year || ''}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.year`,
                      value: e.target.value,
                    });
                  }}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                />
              </div>
              <div className="inline-input-amount">
                <label htmlFor="amount">Amount</label>
                <span aria-hidden="true" role="presentation">
                  $
                </span>
                <input
                  aria-label="IRS Notice Amount in whole dollars"
                  id="amount"
                  name="amount"
                  type="text"
                  value={Number(yearAmount.amount || 0).toLocaleString('en-US')}
                  onChange={e => {
                    updateCaseValueSequence({
                      key: `yearAmounts.${idx}.amount`,
                      value: e.target.value.replace(/\D/g, ''),
                    });
                  }}
                  onBlur={() => {
                    autoSaveCaseSequence();
                  }}
                />
                <span aria-hidden="true" role="presentation">
                  .00
                </span>
                {idx !== 0 && (
                  <button
                    className="link"
                    type="button"
                    aria-controls="removeYearAmount"
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
                <div className="usa-input-error-message beneath">
                  {yearAmount.errorMessage}
                </div>
              )}
            </div>
          ))}
          <button
            className="link"
            type="button"
            aria-controls="addAnotherYearAmount"
            disabled={!formattedCaseDetail.canAddYearAmount}
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
        </div>
        <div className="blue-container">
          <h3>Case Information</h3>
          <span className="label">Case Procedure</span>
          <p>{caseDetail.procedureType} Tax Case</p>
          <span className="label">Trial Location</span>
          <p>{caseDetail.preferredTrialCity}</p>
          <div className={caseDetailErrors.payGovDate ? 'usa-input-error' : ''}>
            <fieldset>
              <legend id="fee-payment-date-legend">Fee Payment Date</legend>
              <div className="usa-date-of-birth">
                <div className="usa-form-group usa-form-group-month">
                  <label htmlFor="fee-payment-date-month" aria-hidden="true">
                    MM
                  </label>
                  <input
                    aria-describedby="fee-payment-date-legend"
                    aria-label="month, two digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                    }
                    id="fee-payment-date-month"
                    max="12"
                    min="1"
                    name="payGovMonth"
                    type="number"
                    value={form.payGovMonth || ''}
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
                <div className="usa-form-group usa-form-group-day">
                  <label htmlFor="fee-payment-date-day" aria-hidden="true">
                    DD
                  </label>
                  <input
                    aria-describedby="fee-payment-date-legend"
                    aria-label="day, two digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                    }
                    id="fee-payment-date-day"
                    max="31"
                    min="1"
                    name="payGovDay"
                    type="number"
                    value={form.payGovDay || ''}
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
                <div className="usa-form-group usa-form-group-year">
                  <label htmlFor="fee-payment-date-year" aria-hidden="true">
                    YYYY
                  </label>
                  <input
                    aria-describedby="fee-payment-date-legend"
                    aria-label="year, four digits"
                    className={
                      'usa-input-inline' +
                      (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                    }
                    id="fee-payment-date-year"
                    max="2100"
                    min="1900"
                    name="payGovYear"
                    type="number"
                    value={form.payGovYear || ''}
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
              {caseDetailErrors.payGovDate && (
                <div className="usa-input-error-message beneath" role="alert">
                  {caseDetailErrors.payGovDate}
                </div>
              )}
            </fieldset>
          </div>

          <div className="usa-form-group">
            <label htmlFor="fee-payment-id">Fee Payment ID</label>
            <input
              id="fee-payment-id"
              name="payGovId"
              type="number"
              value={caseDetail.payGovId || ''}
              onBlur={() => {
                autoSaveCaseSequence();
              }}
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <button
          aria-disabled={submitting ? 'true' : 'false'}
          className={
            submitting ? 'usa-button-active' : 'usa-button usa-button-secondary'
          }
          disabled={submitting}
          type="submit"
        >
          {submitting && <div className="spinner" />}
          Save
        </button>
        {form.showSaveSuccess && (
          <span className="mini-success">
            <FontAwesomeIcon icon="check-circle" size="sm" />
            Your changes have been saved.
          </span>
        )}
      </form>
    );
  },
);
