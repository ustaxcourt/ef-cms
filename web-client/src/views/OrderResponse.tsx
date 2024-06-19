import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '@web-client/ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
// import React, { useEffect, useRef } from 'react';

export const OrderResponse = connect(
  {
    // clearDueDateSequence: sequences.clearDueDateSequence,
    clearStatusReportOrderResponseFormSequence:
      sequences.clearStatusReportOrderResponseFormSequence,
    constants: state.constants,
    form: state.form,

    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    orderResponseHelper: state.orderResponseHelper,
    // navigateBackSequence: sequences.navigateBackSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    // validationErrors: state.validationErrors,
  },
  function OrderResponse({
    clearStatusReportOrderResponseFormSequence,
    // clearDueDateSequence,
    // clearOptionalFieldsStampFormSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    orderResponseHelper,
    // navigateBackSequence,
    // setPDFStampDataSequence,
    updateFormValueSequence,
    // validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Status Report Order Response
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Select one or more options:
                </div>
                <div className="stamp-order-form">
                  {/* TODO this field will conditionally render if the case is a lead CaseDetail */}
                  <FormGroup
                  // className={applyStampFormHelper.dispositionErrorClass}
                  // errorText={validationErrors.disposition}
                  >
                    <label className="usa-label" htmlFor="issue-order">
                      This is the lead case in a consolidateed group. Issue this
                      order in:
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="stricken from trial session"
                        checked={form.issueOrder === 'allCasesInGroup'}
                        className="usa-radio__input"
                        id="all-cases-in-group"
                        name="issueOrder"
                        type="radio"
                        value="allCasesInGroup"
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
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="stricken from trial session"
                        checked={form.issueOrder === 'orStipulatedDecision'}
                        className="usa-radio__input"
                        id="just-this-case"
                        name="issueOrder"
                        type="radio"
                        value="orStipulatedDecision"
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

                  <FormGroup className="stamp-form-group">
                    <label
                      className="usa-label"
                      htmlFor="stricken-from-trial-session-radio"
                    >
                      Order type
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="stricken from trial session"
                        checked={
                          form.statusReportOrStipulatedDecision ===
                          'statusReport'
                        }
                        className="usa-radio__input"
                        id="status-report"
                        name="statusReportOrStipulatedDecision"
                        type="radio"
                        value={'statusReport'}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'status-report'}
                      >
                        Status Report
                      </label>
                    </div>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="stricken from trial session"
                        checked={
                          form.statusReportOrStipulatedDecision ===
                          'orStipulatedDecision'
                        }
                        className="usa-radio__input"
                        id="or-stipulated-decision"
                        name="statusReportOrStipulatedDecision"
                        type="radio"
                        value="orStipulatedDecision"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'or-stipulated-decision'}
                      >
                        Status Report or Stipulated Decision
                      </label>
                    </div>
                    <label
                      className="usa-label"
                      htmlFor="stricken-from-trial-session-radio"
                    >
                      Due date
                    </label>

                    <DateSelector
                      defaultValue={''}
                      disabled={!form.statusReportOrStipulatedDecision}
                      formGroupClassNames="display-inline-block padding-0 margin-left-5"
                      id="status-report-due-date"
                      minDate={orderResponseHelper.minDate}
                      placeHolderText="MM/DD/YYYY"
                      onChange={e => {
                        formatAndUpdateDateFromDatePickerSequence({
                          key: 'dueDate',
                          toFormat: constants.DATE_FORMATS.MMDDYY,
                          value: e.target.value,
                        });
                        //validateStampSequence();
                      }}
                    />
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup className="grid-container stamp-form-group denied-checkboxes">
                    <div className="display-inline-block grid-col-6">
                      <input
                        checked={form.strikenFromTrialSessions || false}
                        className="usa-checkbox__input"
                        id="strikenFromTrialSessions"
                        name="strikenFromTrialSessions"
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
                        htmlFor="strikenFromTrialSessions"
                        id="striken-from-trial-sessions-label"
                      >
                        Case is striken from the trial sessions
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup className="stamp-form-group">
                    <label className="usa-label" htmlFor="jurisdiction">
                      Jurisdiction
                    </label>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="tk"
                        checked={form.jurisdiction === 'retained'}
                        className="usa-radio__input"
                        id="retained"
                        name="jurisdiction"
                        type="radio"
                        value="retained"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label className="usa-radio__label" htmlFor="retained">
                        Retained
                      </label>
                    </div>
                    <div className="usa-radio usa-radio__inline">
                      <input
                        aria-label="tk"
                        checked={
                          form.jurisdiction === 'restoredToGeneralDocket'
                        }
                        className="usa-radio__input"
                        id="restored-to-general-docket"
                        name="jurisdiction"
                        type="radio"
                        value="restoredToGeneralDocket"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={'restored-to-general-docket'}
                      >
                        Restored to the general docket
                      </label>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="stamp-form-group"
                    // errorText={validationErrors.customText}
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="additional-order-text"
                        id="additional-order-text-label"
                      >
                        Additional order text{' '}
                        <span className="usa-hint">(optional)</span>
                      </label>
                      <textarea
                        aria-describedby="tk"
                        aria-label="tk"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="additional-order-text"
                        maxLength={80}
                        name="additionalOrderText"
                        type="text"
                        value={form.additionalOrderText}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      <CharactersRemainingHint
                        maxCharacters={80}
                        stringToCount={form.additionalOrderText}
                      />
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    className="stamp-form-group"
                    // errorText={validationErrors.customText}
                  >
                    <div>
                      <label
                        className="usa-label"
                        htmlFor="docket-entry-description"
                        id="docket-entry-description-label"
                      >
                        Docket entry description{' '}
                        <span className="usa-hint">(optional)</span>
                      </label>
                      <textarea
                        aria-describedby="docket-entry-description-label"
                        aria-label="custom text"
                        autoCapitalize="none"
                        className="usa-textarea maxw-none height-8 usa-character-count__field"
                        id="docket-entry-description"
                        // TODO 10102 should there be a character limit for this field?
                        // maxLength={constants.MAX_STAMP_CUSTOM_TEXT_CHARACTERS}
                        name="docketEntryDescription"
                        type="text"
                        value={form.docketEntryDescription}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      ></textarea>
                      {/*
                      TODO does this need character limit hint
                      <CharactersRemainingHint
                        maxCharacters={
                          constants.MAX_STAMP_CUSTOM_TEXT_CHARACTERS
                        }
                        stringToCount={form.customText}
                      /> */}
                    </div>
                  </FormGroup>
                </div>
              </div>
              <Button
                link
                className="margin-left-205"
                data-testid="clear-optional-fields"
                onClick={e => {
                  e.preventDefault();
                  clearStatusReportOrderResponseFormSequence();
                }}
              >
                Clear All
              </Button>

              <div className="margin-bottom-1 display-flex flex-justify-end">
                <Button
                  className="margin-right-0"
                  data-testid="save-signature-button"
                  // disabled={!applyStampFormHelper.canSaveStampOrder}
                  id="save-signature-button"
                  // onClick={() => submitStampMotionSequence()}
                >
                  Save as Draft
                </Button>

                <Button
                  link
                  icon={['fa', 'arrow-alt-circle-left']}
                  // onClick={() => navigateBackSequence()}
                >
                  Cancel
                </Button>
              </div>
            </div>
            <div className="grid-col-7">
              <div className="grid-row">
                <div className="grid-col-12">
                  {/* <div className="sign-pdf-interface">
                    <span id="stamp" ref={signatureRef}>
                      <span className="text-normal" id="stamp-text">
                        It is ORDERED as follows:
                        <br />
                        <span className="font-sans-2xs">
                          This motion is{' '}
                          <span className="text-ls-1 text-bold font-sans-lg">
                            {form.disposition?.toUpperCase()}
                          </span>{' '}
                          {form.deniedAsMoot && 'as moot '}
                          {form.deniedWithoutPrejudice && 'without prejudice'}
                          <br />
                        </span>
                        {(form.strickenFromTrialSession ||
                          form.jurisdictionalOption ||
                          (form.dueDateMessage && form.date) ||
                          form.customText) && <hr className="narrow-hr" />}
                        {form.strickenFromTrialSession && (
                          <>
                            - {constants.STRICKEN_FROM_TRIAL_SESSION_MESSAGE} -
                            <br />
                          </>
                        )}
                        {form.jurisdictionalOption && (
                          <>
                            - {form.jurisdictionalOption} -<br />
                          </>
                        )}
                        <span>
                          {form.date && (
                            <>
                              - {form.dueDateMessage} {form.date} -
                              <br />
                            </>
                          )}
                          {form.customText && <>- {form.customText} -</>}
                        </span>
                      </span>
                      <hr className="narrow-hr" />
                      <span id="stamp-signature">
                        (Signed) {pdfForSigning.nameForSigning}
                        <br />
                        {pdfForSigning.nameForSigningLine2}
                      </span>
                    </span>
                    <canvas id="sign-pdf-canvas" ref={canvasRef}></canvas>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
