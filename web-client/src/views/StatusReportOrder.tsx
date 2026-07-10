import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '@web-client/ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { Button as DawsonButton } from '@web-client/dawson-ui/ui/button';
import React from 'react';
import { getAdditionalOrderTextArrayFormGroupErrors } from '@web-client/utilities/getAdditionalOrderTextArrayFormGroupErrors';

export const StatusReportOrder = connect(
  {
    clearStatusReportOrderFormSequence:
      sequences.clearStatusReportOrderFormSequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    statusReportOrderHelper: state.statusReportOrderHelper,
    statusReportOrderPdfPreviewSequence:
      sequences.statusReportOrderPdfPreviewSequence,
    submitStatusReportOrderSequence: sequences.submitStatusReportOrderSequence,
    updateFormValueSequence: sequences.updateStatusReportOrderFormValueSequence,
    validateStatusReportOrderSequence:
      sequences.validateStatusReportOrderSequence,
    validationErrors: state.validationErrors,
  },
  function StatusReportOrder({
    clearStatusReportOrderFormSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    navigateBackSequence,
    statusReportOrderHelper,
    statusReportOrderPdfPreviewSequence,
    submitStatusReportOrderSequence,
    updateFormValueSequence,
    validateStatusReportOrderSequence,
    validationErrors,
  }) {
    const additionalOrderTextArray = form.additionalOrderTextArray?.length
      ? form.additionalOrderTextArray
      : [''];
    const additionalOrderTextArrayFormErrors =
      getAdditionalOrderTextArrayFormGroupErrors(
        validationErrors,
        additionalOrderTextArray.length,
      );

    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Status Order Report
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Select one or more options:
                </div>
                <div className="status-report-order-form margin-top-2">
                  {statusReportOrderHelper.isLeadCase && (
                    <>
                      <FormGroup
                        className="status-report-order-form-group"
                        errorText={validationErrors.issueOrder}
                      >
                        <label
                          className="usa-label"
                          htmlFor="issue-order-radios"
                        >
                          This is the lead case in a consolidated group. Issue
                          this order in:
                        </label>
                        <div className="usa-radio usa-radio">
                          <input
                            aria-describedby="issue-order-radios"
                            aria-label="all cases in group"
                            checked={
                              form.issueOrder ===
                              constants.STATUS_REPORT_ORDER_OPTIONS
                                .issueOrderOptions.allCasesInGroup
                            }
                            className="usa-radio__input"
                            id="all-cases-in-group"
                            name="issueOrder"
                            type="radio"
                            value={
                              constants.STATUS_REPORT_ORDER_OPTIONS
                                .issueOrderOptions.allCasesInGroup
                            }
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="all-cases-in-group"
                          >
                            All cases in this group
                          </label>
                        </div>
                        <div className="usa-radio">
                          <input
                            aria-describedby="issue-order-radios"
                            aria-label="just this case"
                            checked={
                              form.issueOrder ===
                              constants.STATUS_REPORT_ORDER_OPTIONS
                                .issueOrderOptions.justThisCase
                            }
                            className="usa-radio__input"
                            id="just-this-case"
                            name="issueOrder"
                            type="radio"
                            value={
                              constants.STATUS_REPORT_ORDER_OPTIONS
                                .issueOrderOptions.justThisCase
                            }
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              });
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="just-this-case"
                          >
                            Just this case
                          </label>
                        </div>
                      </FormGroup>
                      <hr className="border-top-2px border-base-lighter" />
                    </>
                  )}

                  <FormGroup
                    className="status-report-order-form-group"
                    errorText={validationErrors.orderType}
                  >
                    <label className="usa-label" htmlFor="order-type-radios">
                      Order type
                    </label>
                    <div className="usa-radio">
                      <input
                        aria-describedby="order-type-radios"
                        aria-label="status report"
                        checked={
                          form.orderType ===
                          constants.STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions
                            .statusReport
                        }
                        className="usa-radio__input"
                        data-testid="order-type-status-report"
                        id="order-type-status-report"
                        name="orderType"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions
                            .statusReport
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="order-type-status-report"
                      >
                        Status Report
                      </label>
                    </div>

                    <div className="usa-radio">
                      <input
                        aria-describedby="order-type-radios"
                        aria-label="status report or stipulated decision"
                        checked={
                          form.orderType ===
                          constants.STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions
                            .stipulatedDecision
                        }
                        className="usa-radio__input"
                        data-testid="order-type-status-report-or-stipulated-decision"
                        id="order-type-or-stipulated-decision"
                        name="orderType"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions
                            .stipulatedDecision
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="order-type-or-stipulated-decision"
                      >
                        Status Report or Stipulated Decision
                      </label>
                    </div>
                  </FormGroup>

                  <FormGroup
                    className={statusReportOrderHelper.dueDateErrorClass}
                    errorText={statusReportOrderHelper.dueDateErrorText}
                    id="status-report-due-date-form-group"
                  >
                    <DateSelector
                      defaultValue={form.dueDate}
                      disabled={!form.orderType}
                      formGroupClassNames="display-inline-block padding-0"
                      id="status-report-due-date"
                      label="Due date"
                      minDate={statusReportOrderHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'dueDate',
                          toFormat: constants.DATE_FORMATS.YYYYMMDD,
                          value: e.target.value,
                        });
                        validateStatusReportOrderSequence();
                      }}
                    />
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="grid-container padding-left-2"
                    errorText={validationErrors.strickenFromTrialSessions}
                    id="stricken-from-trial-sessions-form-group"
                    data-testid="stricken-from-test-header"
                  >
                    <div>
                      <input
                        checked={form.strickenFromTrialSessions || false}
                        className="usa-checkbox__input"
                        id="stricken-from-trial-sessions"
                        name="strickenFromTrialSessions"
                        type="checkbox"
                        disabled={!statusReportOrderHelper.isCalendared}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.checked,
                          });
                        }}
                      />
                      <label
                        className="usa-checkbox__label"
                        htmlFor="stricken-from-trial-sessions"
                        id="stricken-from-trial-sessions-label"
                        style={
                          statusReportOrderHelper.isCalendared
                            ? {}
                            : { color: '#757575' }
                        }
                        title={
                          statusReportOrderHelper.isCalendared
                            ? ''
                            : 'Case is not calendared'
                        }
                      >
                        Case is stricken from the trial session
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className={statusReportOrderHelper.jurisdictionErrorClass}
                    errorText={statusReportOrderHelper.jurisdictionErrorText}
                    id="jurisdiction-form-group"
                  >
                    <label className="usa-label" htmlFor="jurisdiction-radios">
                      Jurisdiction
                    </label>
                    <div className="usa-radio">
                      <input
                        aria-describedby="jurisdiction-radios"
                        aria-label="retained"
                        checked={
                          form.jurisdiction ===
                          constants.STATUS_REPORT_ORDER_OPTIONS
                            .jurisdictionOptions.retained
                        }
                        className="usa-radio__input"
                        disabled={!form.strickenFromTrialSessions}
                        id="jurisdiction-retained"
                        name="jurisdiction"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_OPTIONS
                            .jurisdictionOptions.retained
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStatusReportOrderSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="jurisdiction-retained"
                        data-testid="jurisdiction-retained-label"
                        title={
                          statusReportOrderHelper.isCalendared
                            ? ''
                            : 'Case is not calendared'
                        }
                      >
                        Retained
                      </label>
                    </div>
                    <div className="usa-radio">
                      <input
                        aria-describedby="jurisdiction-radios"
                        aria-label="restored to general docket"
                        checked={
                          form.jurisdiction ===
                          constants.STATUS_REPORT_ORDER_OPTIONS
                            .jurisdictionOptions.restored
                        }
                        className="usa-radio__input"
                        disabled={!form.strickenFromTrialSessions}
                        id="jurisdiction-restored-to-general-docket"
                        name="jurisdiction"
                        type="radio"
                        value={
                          constants.STATUS_REPORT_ORDER_OPTIONS
                            .jurisdictionOptions.restored
                        }
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStatusReportOrderSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="jurisdiction-restored-to-general-docket"
                        data-testid="jurisdiction-restored-label"
                        title={
                          statusReportOrderHelper.isCalendared
                            ? ''
                            : 'Case is not calendared'
                        }
                      >
                        Restored to the general docket
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="status-report-order-form-group"
                    errorText={additionalOrderTextArrayFormErrors}
                  >
                    {additionalOrderTextArray.map((text, index) => (
                      <div key={index}>
                        <label
                          className="usa-label tw:mt-4"
                          htmlFor={`additional-order-text-array-${index}`}
                          id={`additional-order-text-array-label-${index}`}
                        >
                          Additional order text
                        </label>
                        <textarea
                          aria-describedby={`additional-order-text-array-label-${index}`}
                          aria-label="additional order text"
                          autoCapitalize="none"
                          className="usa-textarea maxw-none height-8 usa-character-count__field textarea-resize-vertical"
                          id={`additional-order-text-array-${index}`}
                          maxLength={
                            constants.MAX_STATUS_REPORT_ORDER_TEXT_CHARACTERS
                          }
                          name={`additionalOrderTextArray[${index}]`}
                          value={text}
                          onChange={e => {
                            updateFormValueSequence({
                              allowEmptyString: true,
                              key: 'additionalOrderTextArray',
                              index,
                              value: e.target.value,
                            });
                          }}
                        ></textarea>
                        <CharactersRemainingHint
                          className="tw:mb-0"
                          maxCharacters={
                            constants.MAX_STATUS_REPORT_ORDER_TEXT_CHARACTERS
                          }
                          stringToCount={text}
                        />
                        {index > 0 && (
                          <DawsonButton
                            className="tw:block"
                            iconPosition="left"
                            icon="circle-xmark"
                            onClick={() => {
                              updateFormValueSequence({
                                key: 'additionalOrderTextArray',
                                value: additionalOrderTextArray.filter(
                                  (_, i) => i !== index,
                                ),
                              });
                            }}
                            variant="destructiveTertiary"
                          >
                            Remove
                          </DawsonButton>
                        )}
                      </div>
                    ))}
                    <hr />
                    <DawsonButton
                      iconPosition="left"
                      icon="plus"
                      onClick={() => {
                        updateFormValueSequence({
                          key: 'additionalOrderTextArray',
                          value: [...additionalOrderTextArray, ''],
                        });
                      }}
                      variant="primaryTertiary"
                    >
                      Add additional order text
                    </DawsonButton>
                  </FormGroup>
                </div>
              </div>
              <Button
                link
                data-testid="clear-optional-fields"
                onClick={e => {
                  e.preventDefault();
                  clearStatusReportOrderFormSequence();
                }}
              >
                Clear All
              </Button>

              <div className="margin-bottom-2 margin-top-2 button-container">
                <Button
                  className="margin-right-1"
                  data-testid="save-draft-button"
                  id="save-draft-button"
                  onClick={() => submitStatusReportOrderSequence()}
                >
                  Save as Draft
                </Button>

                <Button
                  secondary
                  className="margin-right-1"
                  data-testid="preview-pdf-button"
                  id="preview-pdf-button"
                  onClick={() => {
                    statusReportOrderPdfPreviewSequence();
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
                <span className="text-bold">Docket entry preview:</span>{' '}
                {form.docketEntryDescription}
              </div>
              <div
                className="statusReportOrderPdfPreview"
                data-testid="status-report-order-pdf-preview"
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
