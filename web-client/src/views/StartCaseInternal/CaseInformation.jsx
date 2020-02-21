import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PetitionPaymentForm } from '../CaseDetail/PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCityOptions } from '../TrialCityOptions';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseInformation = connect(
  {
    constants: state.constants,
    form: state.form,
    startCaseInternalHelper: state.startCaseInternalHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  ({
    constants,
    form,
    startCaseInternalHelper,
    updateFormValueSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) => {
    return (
      <div className="blue-container">
        <DateInput
          errorText={validationErrors.receivedAt}
          id="date-received"
          label="Date received"
          names={{
            day: 'dateReceivedDay',
            month: 'dateReceivedMonth',
            year: 'dateReceivedYear',
          }}
          values={{
            day: form.dateReceivedDay,
            month: form.dateReceivedMonth,
            year: form.dateReceivedYear,
          }}
          onBlur={validatePetitionFromPaperSequence}
          onChange={updateFormValueSequence}
        />

        <DateInput
          errorText={validationErrors.mailingDate}
          id="mailing-date"
          label="Mailing Date"
          names={{
            day: 'mailingDateDay',
            month: 'mailingDateMonth',
            year: 'mailingDateYear',
          }}
          optional={true}
          values={{
            day: form.mailingDateDay,
            month: form.mailingDateMonth,
            year: form.mailingDateYear,
          }}
          onBlur={validatePetitionFromPaperSequence}
          onChange={updateFormValueSequence}
        />

        <FormGroup errorText={validationErrors.caseCaption}>
          <label className="usa-label" htmlFor="case-caption">
            Case caption
          </label>
          <textarea
            className="usa-textarea"
            id="case-caption"
            name="caseCaption"
            value={form.caseCaption}
            onBlur={() => {
              validatePetitionFromPaperSequence();
            }}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <p className="margin-top-1">{constants.CASE_CAPTION_POSTFIX}</p>
        </FormGroup>

        <ProcedureType
          legend="Case procedure"
          value={form.procedureType}
          onChange={e => {
            updateFormValueSequence({
              key: 'procedureType',
              value: e.target.value,
            });
            validatePetitionFromPaperSequence();
          }}
        />

        <FormGroup>
          <div className="order-checkbox">
            <input
              checked={form.orderToShowCause || false}
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
        </FormGroup>

        <FormGroup errorText={validationErrors.preferredTrialCity}>
          <label className="usa-label" htmlFor="preferred-trial-city">
            Trial location <span className="usa-hint">(Required with RQT)</span>
          </label>
          <select
            className="usa-select"
            id="preferred-trial-city"
            name="preferredTrialCity"
            value={form.preferredTrialCity}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validatePetitionFromPaperSequence();
            }}
          >
            <option value="">- Select -</option>
            <TrialCityOptions />
          </select>
        </FormGroup>

        <PetitionPaymentForm
          bind="form"
          dateBind="form"
          updateDateSequence={updateFormValueSequence}
          updateSequence={updateFormValueSequence}
          validateSequence={validatePetitionFromPaperSequence}
          validationErrorsBind="validationErrors"
        />

        {startCaseInternalHelper.showOrderForFilingFee && (
          <div className="order-checkbox">
            <input
              checked={form.orderForFilingFee || false}
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
              checked={form.orderForRatification || false}
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
              checked={form.noticeOfAttachments || false}
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
              checked={form.orderForAmendedPetition || false}
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
              checked={form.orderForAmendedPetitionAndFilingFee || false}
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
