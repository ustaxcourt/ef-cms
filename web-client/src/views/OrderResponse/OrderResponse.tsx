import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '../../ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';

export const OrderResponse = connect(
  {
    motionOrderResponseFormHelper: state.motionOrderResponseFormHelper,
    motionOrderResponsePdfPreviewSequence:
      sequences.motionOrderResponsePdfPreviewSequence,
    clearDueDateSequence: sequences.clearDueDateSequence,
    clearMotionOrderResponseFormSequence:
      sequences.clearMotionOrderResponseFormSequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateBackSequence: sequences.navigateBackSequence,
    pdfForSigning: state.pdfForSigning,
    pdfObj: state.pdfForSigning.pdfjsObj,
    pdfSignerHelper: state.pdfSignerHelper,
    setPDFStampDataSequence: sequences.setPDFStampDataSequence,
    submitMotionOrderResponseSequence:
      sequences.submitMotionOrderResponseSequence,
    submitStampMotionSequence: sequences.submitStampMotionSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateMotionOrderResponseSequence:
      sequences.validateMotionOrderResponseSequence,
    validationErrors: state.validationErrors,
  },
  function OrderResponse({
    clearMotionOrderResponseFormSequence,
    motionOrderResponseFormHelper,
    motionOrderResponsePdfPreviewSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    formattedCaseDetail,
    navigateBackSequence,
    submitMotionOrderResponseSequence,
    updateFormValueSequence,
    validationErrors,
    validateMotionOrderResponseSequence,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Order Response to Motion
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="border border-base-lighter">
                <label
                  className="grid-header grid-row padding-left-205"
                  htmlFor="motion-order-response-form"
                >
                  Order Response
                </label>
                <div className="motion-order-response-form">
                  {formattedCaseDetail.isLeadCase && (
                    <div>
                      <FormGroup
                        className="order-response-form-group"
                        errorText={validationErrors.issueOrderFor}
                      >
                        <label
                          className="usa-label"
                          htmlFor="motion-order-lead-case"
                        >
                          This is the lead case in a consolidated group. Issue
                          this order in:
                        </label>
                        <div className="grid-row grid-gap">
                          <div className="usa-radio">
                            <input
                              aria-label="all cases in this group"
                              checked={
                                form.issueOrderFor ===
                                  constants.MOTION_ORDER_RESPONSE_OPTIONS
                                    .issueOrderOptions.ALL_CASES || false
                              }
                              className="usa-radio__input"
                              id="motion-order-lead-case-radio-all"
                              name="issueOrderFor"
                              type="radio"
                              value={
                                constants.MOTION_ORDER_RESPONSE_OPTIONS
                                  .issueOrderOptions.ALL_CASES
                              }
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                                validateMotionOrderResponseSequence();
                              }}
                            />
                            <label
                              className="usa-radio__label"
                              htmlFor={'motion-order-lead-case-radio-all'}
                            >
                              {
                                constants.MOTION_ORDER_RESPONSE_OPTIONS
                                  .issueOrderOptions.ALL_CASES
                              }
                            </label>
                          </div>
                          <div className="usa-radio">
                            <input
                              aria-label="Just this case"
                              checked={
                                form.issueOrderFor ===
                                  constants.MOTION_ORDER_RESPONSE_OPTIONS
                                    .issueOrderOptions.THIS_CASE_ONLY || false
                              }
                              className="usa-radio__input"
                              id="motion-order-lead-case-radio-just-this"
                              name="issueOrderFor"
                              type="radio"
                              value={
                                constants.MOTION_ORDER_RESPONSE_OPTIONS
                                  .issueOrderOptions.THIS_CASE_ONLY
                              }
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                                validateMotionOrderResponseSequence();
                              }}
                            />
                            <label
                              className="usa-radio__label"
                              htmlFor={'motion-order-lead-case-radio-just-this'}
                            >
                              {
                                constants.MOTION_ORDER_RESPONSE_OPTIONS
                                  .issueOrderOptions.THIS_CASE_ONLY
                              }
                            </label>
                          </div>
                        </div>
                      </FormGroup>
                      <hr className="border-top-2px border-base-lighter" />
                    </div>
                  )}
                  <FormGroup
                    className="order-response-form-group"
                    errorText={validationErrors.responseDate}
                  >
                    <DateSelector
                      defaultValue={form.responseDate}
                      pristine={!form.responseDate}
                      formGroupClassNames="display-inline-block order-response-date-selector"
                      id="response-date-input-orderResponseResponseDate"
                      data-testid="response-date-input-orderResponseResponseDate"
                      label="Response Date"
                      hintText="(Required)"
                      minDate={motionOrderResponseFormHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'responseDate',
                          toFormat: constants.DATE_FORMATS.YYYYMMDD,
                          value: e.target.value,
                        });
                        validateMotionOrderResponseSequence();
                      }}
                    />
                  </FormGroup>
                  <hr className="border-top-2px border-base-lighter" />
                  <FormGroup className="order-response-form-group">
                    <label htmlFor="motion-order-reply">
                      Order Reply <span className="usa-hint">(Optional)</span>:
                    </label>
                    <div className="usa-checkbox">
                      <input
                        aria-label="order reply"
                        checked={form.motionOrderResponse || false}
                        className="usa-checkbox__input"
                        data-testid="motion-order-reply"
                        id="motion-order-reply"
                        name="motionOrderResponse"
                        type="checkbox"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: !form.motionOrderResponse,
                          });
                          if (form.motionOrderResponse === false) {
                            updateFormValueSequence({
                              key: 'dueDate',
                              value: '',
                            });
                          }
                          validateMotionOrderResponseSequence();
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="motion-order-reply"
                      >
                        Order Reply
                      </label>
                    </div>
                  </FormGroup>
                  <FormGroup
                    className="order-response-form-group"
                    errorText={validationErrors.dueDate}
                  >
                    <DateSelector
                      defaultValue={form.dueDate}
                      disabled={!form.motionOrderResponse}
                      formGroupClassNames="display-inline-block order-response-date-selector"
                      id="due-date-input-motionOrderResponseDueDate"
                      data-testid="due-date-input-motionOrderResponseDueDate"
                      minDate={form.responseDate}
                      hintText={
                        form.motionOrderResponse
                          ? 'Due date (Required):'
                          : 'Due date:'
                      }
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'dueDate',
                          toFormat: constants.DATE_FORMATS.YYYYMMDD,
                          value: e.target.value,
                        });
                        validateMotionOrderResponseSequence();
                      }}
                    />
                  </FormGroup>
                  <hr className="border-top-2px border-base-lighter" />
                  <FormGroup
                    className="order-response-form-group"
                    errorText={validationErrors.additionalOrderText}
                  >
                    {motionOrderResponseFormHelper.showStrikeCheckBox && (
                      <div className="usa-checkbox">
                        <input
                          checked={form.strickenFromTrialSession || false}
                          className="usa-checkbox__input"
                          id="case-is-stricken-from-trial-session"
                          name="strickenFromTrialSession"
                          type="checkbox"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: !form.strickenFromTrialSession,
                            });
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="case-is-stricken-from-trial-session"
                        >
                          Strike from trial session and retain jurisdiction
                        </label>
                      </div>
                    )}
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="custom-text"
                        id="custom-text-label"
                      >
                        Additional order text{' '}
                      </label>
                      <textarea
                        aria-describedby="additional-text-label"
                        aria-label="additional text"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field textarea-resize-vertical"
                        id="additional-text"
                        maxLength={constants.MAX_ORDER_RESPONSE_TEXT_CHARACTERS}
                        name="additionalOrderText"
                        value={form.additionalOrderText || ''}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateMotionOrderResponseSequence();
                        }}
                      ></textarea>
                      <CharactersRemainingHint
                        maxCharacters={
                          constants.MAX_ORDER_RESPONSE_TEXT_CHARACTERS
                        }
                        stringToCount={form.additionalOrderText}
                      />
                    </div>
                  </FormGroup>
                </div>
              </div>
              <Button
                link
                className="order-response-clear-button"
                data-testid="clear-all-fields"
                onClick={e => {
                  e.preventDefault();
                  clearMotionOrderResponseFormSequence();
                }}
              >
                Clear All
              </Button>
              <div className="margin-bottom-2 margin-top-2 button-container">
                <Button
                  className="margin-right-1"
                  data-testid="save-draft-button"
                  id="save-draft-button"
                  onClick={() => submitMotionOrderResponseSequence()}
                >
                  Save as Draft
                </Button>
                <Button
                  secondary
                  className="margin-right-1"
                  data-testid="preview-pdf-button"
                  id="preview-pdf-button"
                  onClick={() => {
                    motionOrderResponsePdfPreviewSequence();
                  }}
                >
                  Preview PDF
                </Button>
                <Button link onClick={() => navigateBackSequence()}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="grid-col-7">
              <div>
                <span className="text-bold">Docket entry preview:</span> Order
              </div>
              <div
                className="motionResponseOrderPdfPreview"
                data-testid="motion-response-order-pdf-preview"
              >
                <PdfPreview />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

OrderResponse.displayName = 'OrderResponse';
