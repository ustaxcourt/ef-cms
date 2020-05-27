import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PetitionPaymentForm } from '../CaseDetail/PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseInfo = connect(
  {
    baseUrl: state.baseUrl,
    caseDetailEditHelper: state.caseDetailEditHelper,
    constants: state.constants,
    form: state.form,
    token: state.token,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDetailSequence: sequences.validateCaseDetailSequence,
    validationErrors: state.validationErrors,
  },
  function CaseInfo({
    baseUrl,
    caseDetailEditHelper,
    constants,
    form,
    token,
    updateFormValueSequence,
    validateCaseDetailSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container">
        <div className="subsection">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="case-caption">
              Case caption
            </label>
            <textarea
              className="usa-textarea"
              id="case-caption"
              name="caseCaption"
              value={form.caseCaption}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <span className="display-inline-block margin-top-1">
              {constants.CASE_CAPTION_POSTFIX}
            </span>
          </div>
        </div>
        {form.isPaper && (
          <>
            <DateInput
              errorText={validationErrors.receivedAt}
              id="received-at"
              label="Date received"
              names={{
                day: 'receivedAtDay',
                month: 'receivedAtMonth',
                year: 'receivedAtYear',
              }}
              values={{
                day: form.receivedAtDay,
                month: form.receivedAtMonth,
                year: form.receivedAtYear,
              }}
              onBlur={validateCaseDetailSequence}
              onChange={updateFormValueSequence}
            />

            <div className="usa-form-group read-only">
              <div className="label">Mailing date</div>
              <p>{form.mailingDate}</p>
            </div>
          </>
        )}

        <div className="usa-form-group">
          <ProcedureType
            legend="Case procedure"
            value={form.procedureType}
            onChange={e => {
              updateFormValueSequence({
                key: 'procedureType',
                value: e.target.value,
              });
            }}
          />

          <div className="order-checkbox">
            <input
              checked={form.orderToShowCause}
              className="usa-checkbox__input"
              id="order-to-show-cause"
              name="orderToShowCause"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
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
          <label
            className="usa-label margin-bottom-0"
            htmlFor="preferred-trial-city"
          >
            Trial location
          </label>
          <div id="preferred-trial-city">
            {caseDetailEditHelper.showNoTrialLocationSelected && (
              <>
                <p className="margin-top-0">No trial location selected</p>
                <div className="order-checkbox">
                  <input
                    checked={form.orderDesignatingPlaceOfTrial}
                    className="usa-checkbox__input"
                    id="order-designating-place-of-trial"
                    name="orderDesignatingPlaceOfTrial"
                    type="checkbox"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
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
                  href={`${baseUrl}/case-documents/${form.caseId}/${caseDetailEditHelper.requestForPlaceOfTrialDocumentId}/document-download-url?token=${token}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FontAwesomeIcon className="fa-icon-blue" icon="file-pdf" />
                  {caseDetailEditHelper.requestForPlaceOfTrialDocumentTitle}
                </a>
                <div className="order-checkbox">
                  <input
                    checked={form.orderToChangeDesignatedPlaceOfTrial}
                    className="usa-checkbox__input"
                    id="order-to-change-designated-place-of-trial"
                    name="orderToChangeDesignatedPlaceOfTrial"
                    type="checkbox"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label inline-block"
                    htmlFor="order-to-change-designated-place-of-trial"
                  >
                    Order to Change Designated Place of Trial
                  </label>
                </div>
              </>
            )}
            {caseDetailEditHelper.showReadOnlyTrialLocation &&
              `Request for Place of Trial at ${form.preferredTrialCity}`}
          </div>
        </div>

        <PetitionPaymentForm
          bind="form"
          dateBind="form"
          updateDateSequence={updateFormValueSequence}
          updateSequence={updateFormValueSequence}
          validateSequence={validateCaseDetailSequence}
          validationErrorsBind="validationErrors"
        />

        {caseDetailEditHelper.showOrderForFilingFee && (
          <div className="order-checkbox">
            <input
              checked={form.orderForFilingFee}
              className="usa-checkbox__input"
              id="order-for-filing-fee"
              name="orderForFilingFee"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label inline-block"
              htmlFor="order-for-filing-fee"
            >
              Order for Filing Fee
            </label>
          </div>
        )}

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
              checked={form.orderForRatification}
              className="usa-checkbox__input"
              id="order-for-ratification"
              name="orderForRatification"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label inline-block"
              htmlFor="order-for-ratification"
            >
              Order for Ratification of Petition
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={form.noticeOfAttachments}
              className="usa-checkbox__input"
              id="notice-of-attachments"
              name="noticeOfAttachments"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label inline-block"
              htmlFor="notice-of-attachments"
            >
              Notice of Attachments in the Nature of Evidence
            </label>
          </div>
          <div className="usa-form-group" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={form.orderForAmendedPetition}
              className="usa-checkbox__input"
              id="order-for-amended-petition"
              name="orderForAmendedPetition"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label inline-block"
              htmlFor="order-for-amended-petition"
            >
              Order for Amended Petition
            </label>
          </div>
          <div className="usa-form-group margin-bottom-0" role="listitem">
            <input
              aria-describedby="orders-needed"
              checked={form.orderForAmendedPetitionAndFilingFee}
              className="usa-checkbox__input"
              id="order-for-amended-petition-and-filing-fee"
              name="orderForAmendedPetitionAndFilingFee"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
              }}
            />
            <label
              className="usa-checkbox__label inline-block"
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
