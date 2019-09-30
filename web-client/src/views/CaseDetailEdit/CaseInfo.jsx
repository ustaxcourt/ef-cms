import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProcedureType } from '../StartCase/ProcedureType';
import { connect } from '@cerebral/react';
import { limitLength } from '../../ustc-ui/utils/limitLength';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseInfo = connect(
  {
    autoSaveCaseSequence: sequences.autoSaveCaseSequence,
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseDetailEditHelper: state.caseDetailEditHelper,
    caseDetailErrors: state.caseDetailErrors,
    form: state.form,
    token: state.token,
    updateCaseValueSequence: sequences.updateCaseValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    autoSaveCaseSequence,
    baseUrl,
    caseDetail,
    caseDetailEditHelper,
    caseDetailErrors,
    form,
    token,
    updateCaseValueSequence,
    updateFormValueSequence,
  }) => {
    return (
      <div className="blue-container">
        {caseDetail.isPaper && (
          <React.Fragment>
            <div
              className={`usa-form-group ${
                caseDetailErrors.receivedAt ? 'usa-form-group--error' : ''
              }`}
            >
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="received-at-legend">
                  Date received
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="received-at-month"
                    >
                      MM
                    </label>
                    <input
                      aria-describedby="received-at-legend"
                      aria-label="month, two digits"
                      className={
                        'usa-input usa-input--inline' +
                        (caseDetailErrors.receivedAt ? 'usa-error' : '')
                      }
                      id="received-at-month"
                      max="12"
                      maxLength="2"
                      min="1"
                      name="receivedAtMonth"
                      type="number"
                      value={form.receivedAtMonth || ''}
                      onBlur={() => {
                        autoSaveCaseSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 2),
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="received-at-day"
                    >
                      DD
                    </label>
                    <input
                      aria-describedby="received-at-legend"
                      aria-label="day, two digits"
                      className={
                        'usa-input usa-input--inline' +
                        (caseDetailErrors.receivedAt ? 'usa-error' : '')
                      }
                      id="received-at-day"
                      max="31"
                      maxLength="2"
                      min="1"
                      name="receivedAtDay"
                      type="number"
                      value={form.receivedAtDay || ''}
                      onBlur={() => {
                        autoSaveCaseSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 2),
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year margin-bottom-0">
                    <label
                      aria-hidden="true"
                      className="usa-label"
                      htmlFor="received-at-year"
                    >
                      YYYY
                    </label>
                    <input
                      aria-describedby="received-at-legend"
                      aria-label="year, four digits"
                      className={
                        'usa-input usa-input--inline' +
                        (caseDetailErrors.receivedAt ? 'usa-error' : '')
                      }
                      id="received-at-year"
                      max="2100"
                      maxLength="4"
                      min="1900"
                      name="receivedAtYear"
                      type="number"
                      value={form.receivedAtYear || ''}
                      onBlur={() => {
                        autoSaveCaseSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: limitLength(e.target.value, 4),
                        });
                      }}
                    />
                  </div>
                </div>
                {caseDetailErrors.receivedAt && (
                  <div className="usa-error-message" role="alert">
                    {caseDetailErrors.receivedAt}
                  </div>
                )}
              </fieldset>
            </div>
          </React.Fragment>
        )}

        <div className="usa-form-group">
          <ProcedureType
            legend="Case procedure"
            value={caseDetail.procedureType}
            onChange={e => {
              updateCaseValueSequence({
                key: 'procedureType',
                value: e.target.value,
              });
              autoSaveCaseSequence();
            }}
          />

          <div className="order-checkbox">
            <input
              checked={caseDetail.orderToShowCause}
              className="usa-checkbox__input"
              id="order-to-show-cause"
              name="orderToShowCause"
              type="checkbox"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="order-to-show-cause"
            >
              Order to Show Cause
            </label>
          </div>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="preferred-trial-city">
            Trial Location
          </label>
          <div id="preferred-trial-city">
            {caseDetailEditHelper.showNoTrialLocationSelected && (
              <>
                <p>No trial location selected</p>
                <div className="order-checkbox">
                  <input
                    checked={caseDetail.orderDesignatingPlaceOfTrial}
                    className="usa-checkbox__input"
                    id="order-designating-place-of-trial"
                    name="orderDesignatingPlaceOfTrial"
                    type="checkbox"
                    onChange={e => {
                      updateCaseValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      autoSaveCaseSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="order-designating-place-of-trial"
                  >
                    Order Designating Place of Trial
                  </label>
                </div>
              </>
            )}
            {caseDetailEditHelper.showRQTDocumentLink && (
              <>
                <a
                  aria-label="View PDF: Ownership Disclosure Statement"
                  href={`${baseUrl}/documents/${caseDetailEditHelper.requestForPlaceOfTrialDocumentId}/document-download-url?token=${token}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FontAwesomeIcon className="fa-icon-blue" icon="file-pdf" />
                  {caseDetailEditHelper.requestForPlaceOfTrialDocumentTitle}
                </a>
                <div className="order-checkbox">
                  <input
                    checked={caseDetail.orderToChangePlaceOfTrial}
                    className="usa-checkbox__input"
                    id="order-to-change-place-of-trial"
                    name="orderToChangePlaceOfTrial"
                    type="checkbox"
                    onChange={e => {
                      updateCaseValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      autoSaveCaseSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="order-to-change-place-of-trial"
                  >
                    Order to Change Designated Place of Trial
                  </label>
                </div>
              </>
            )}
            {caseDetailEditHelper.showReadOnlyTrialLocation &&
              `Request for Place of Trial at ${caseDetail.preferredTrialCity}`}
          </div>
        </div>

        <div
          className={`usa-form-group margin-bottom-0 ${
            caseDetailErrors.payGovDate ? 'usa-form-group--error' : ''
          }`}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="fee-payment-date-legend">
              Fee Payment Date <span className="usa-hint">(optional)</span>
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month">
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="month, two digits"
                  className={
                    'usa-input usa-input--inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-month"
                  max="12"
                  min="1"
                  name="payGovMonth"
                  placeholder="MM"
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
              <div className="usa-form-group usa-form-group--day">
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="day, two digits"
                  className={
                    'usa-input usa-input--inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-day"
                  max="31"
                  min="1"
                  name="payGovDay"
                  placeholder="DD"
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
              <div className="usa-form-group usa-form-group--year">
                <input
                  aria-describedby="fee-payment-date-legend"
                  aria-label="year, four digits"
                  className={
                    'usa-input usa-input--inline' +
                    (caseDetailErrors.payGovDate ? 'usa-input-error' : '')
                  }
                  id="fee-payment-date-year"
                  max="2100"
                  min="1900"
                  name="payGovYear"
                  placeholder="YYYY"
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
              <div className="usa-error-message" role="alert">
                {caseDetailErrors.payGovDate}
              </div>
            )}
          </fieldset>
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="fee-payment-id">
            Fee Payment ID <span className="usa-hint">(optional)</span>
          </label>
          <input
            className="usa-input"
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

        <div className="order-checkbox">
          <input
            checked={caseDetail.orderForFilingFee}
            className="usa-checkbox__input"
            id="order-for-filing-fee"
            name="orderForFilingFee"
            type="checkbox"
            onChange={e => {
              updateCaseValueSequence({
                key: e.target.name,
                value: e.target.checked,
              });
              autoSaveCaseSequence();
            }}
          />
          <label className="usa-checkbox__label" htmlFor="order-for-filing-fee">
            Order for Filing Fee
          </label>
        </div>

        <h3 id="orders-needed">
          Orders Needed <span className="usa-hint">(optional)</span>
        </h3>
        <div
          aria-labelledby="orders-needed"
          className="orders-needed"
          role="list"
        >
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={caseDetail.orderForRatification}
              className="usa-checkbox__input"
              id="order-for-ratification"
              name="orderForRatification"
              type="checkbox"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="order-for-ratification"
            >
              Order for Ratification of Petition
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={caseDetail.noticeOfAttachments}
              className="usa-checkbox__input"
              id="notice-of-attachments"
              name="noticeOfAttachments"
              type="checkbox"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="notice-of-attachments"
            >
              Notice of Attachments in the Nature of Evidence
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={caseDetail.orderForAmendedPetition}
              className="usa-checkbox__input"
              id="order-for-amended-petition"
              name="orderForAmendedPetition"
              type="checkbox"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="order-for-amended-petition"
            >
              Order for Amended Petition
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={caseDetail.orderForAmendedPetitionAndFilingFee}
              className="usa-checkbox__input"
              id="order-for-amended-petition-and-filing-fee"
              name="orderForAmendedPetitionAndFilingFee"
              type="checkbox"
              onChange={e => {
                updateCaseValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                autoSaveCaseSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="order-for-amended-petition-and-filing-fee"
            >
              Order for Amended Petition and Filing Fee
            </label>
          </div>
        </div>
      </div>
    );
  },
);
