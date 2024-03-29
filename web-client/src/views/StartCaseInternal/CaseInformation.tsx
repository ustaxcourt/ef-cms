import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PetitionPaymentForm } from '../CaseDetail/PetitionPaymentForm';
import { ProcedureType } from '../StartCase/ProcedureType';
import { TrialCity } from '../StartCase/TrialCity';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseInformation = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    clearPreferredTrialCitySequence: sequences.clearPreferredTrialCitySequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    startCaseInternalHelper: state.startCaseInternalHelper,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateOrderForDesignatingPlaceOfTrialSequence:
      sequences.updateOrderForDesignatingPlaceOfTrialSequence,
    updatePetitionPaymentFormValueSequence:
      sequences.updatePetitionPaymentFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  function CaseInformation({
    clearPreferredTrialCitySequence,
    constants,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    startCaseInternalHelper,
    updateFormValueSequence,
    updateOrderForDesignatingPlaceOfTrialSequence,
    updatePetitionPaymentFormValueSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container">
        <DateSelector
          defaultValue={form.receivedAt}
          errorText={validationErrors.receivedAt}
          id="date-received"
          label="Date received"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'receivedAt',
              toFormat: DATE_FORMATS.ISO,
              value: e.target.value,
            });
            validatePetitionFromPaperSequence();
          }}
        />
        <FormGroup errorText={validationErrors.mailingDate}>
          <label className="usa-label" htmlFor="mailing-date">
            Mailing date
          </label>
          <input
            className="usa-input usa-input-inline"
            id="mailing-date"
            maxLength="25"
            name="mailingDate"
            value={form.mailingDate || ''}
            onBlur={() => validatePetitionFromPaperSequence()}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </FormGroup>
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
          <span className="display-inline-block margin-top-1">
            {constants.CASE_CAPTION_POSTFIX}
          </span>
        </FormGroup>
        <ProcedureType
          legend="Case procedure"
          value={form.procedureType}
          onChange={e => {
            updateFormValueSequence({
              key: 'procedureType',
              value: e.target.value,
            });
            clearPreferredTrialCitySequence();
            validatePetitionFromPaperSequence();
          }}
        />
        <FormGroup>
          <div className="order-checkbox">
            <input
              checked={form.orderToShowCause || false}
              className="usa-checkbox__input"
              data-testid="order-to-show-cause-checkbox"
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
              data-testid="order-to-show-cause-label"
              htmlFor="order-to-show-cause"
            >
              Order to Show Cause
            </label>
          </div>
        </FormGroup>
        <TrialCity
          label="Trial location"
          procedureType={form.procedureType}
          showDefaultOption={true}
          showHint={false}
          showRegularTrialCitiesHint={false}
          showSmallTrialCitiesHint={false}
          value={form.preferredTrialCity}
          onChange={e => {
            updateOrderForDesignatingPlaceOfTrialSequence({
              key: e.target.name,
              value: e.target.value || null,
            });
            validatePetitionFromPaperSequence();
          }}
        />
        <FormGroup errorText={validationErrors['object.missing']}>
          <div className="order-checkbox">
            <input
              checked={form.orderDesignatingPlaceOfTrial || false}
              className="usa-checkbox__input"
              data-testid="order-for-requested-trial-location-checkbox"
              id="order-for-requested-trial-location"
              name="orderDesignatingPlaceOfTrial"
              type="checkbox"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validatePetitionFromPaperSequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              data-testid="order-for-requested-trial-location-label"
              htmlFor="order-for-requested-trial-location"
            >
              Order Designating Place of Trial
            </label>
          </div>
        </FormGroup>
        <PetitionPaymentForm
          bind="form"
          updateSequence={updatePetitionPaymentFormValueSequence}
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
              className="usa-checkbox__label"
              data-testid="order-for-filing-fee"
              htmlFor="order-for-filing-fee"
            >
              Order for Filing Fee
            </label>
          </div>
        )}
        <h3 id="orders-needed">
          Orders/Notices Needed <span className="usa-hint">(optional)</span>
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
              data-testid="order-for-ratification-checkbox"
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
              className="usa-checkbox__label"
              data-testid="order-for-ratification-label"
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
              data-testid="notice-of-attachments-checkbox"
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
              className="usa-checkbox__label"
              data-testid="notice-of-attachments-label"
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
              data-testid="order-for-amended-petition-checkbox"
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
              className="usa-checkbox__label"
              data-testid="order-for-amended-petition-label"
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
              data-testid="order-for-amended-petition-and-filing-fee-checkbox"
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
              className="usa-checkbox__label"
              data-testid="order-for-amended-petition-and-filing-fee-label"
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

CaseInformation.displayName = 'CaseInformation';
