import { Button } from '../../ustc-ui/Button/Button';
import { Button as DawsonButton } from '@web-client/dawson-ui/ui/button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '@web-client/ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import { StatusReportDueDateFields } from './StatusReportDueDateFields';
import type { StatusReportDueDateFieldsProps } from './StatusReportDueDateFields';
import { updateGrantDenyMotionFormValueSequence } from '@web-client/presenter/sequences/GrantDenyMotion/updateGrantDenyMotionFormValueSequence';
import { validateGrantDenyMotionSequence as validateGrantDenyMotionSequenceFn } from '@web-client/presenter/sequences/GrantDenyMotion/validateGrantDenyMotionSequence';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const MAX_ADDITIONAL_TEXT_CHARS = 256;

export const GrantDenyMotion = connect(
  {
    addAdditionalOrderTextSequence: sequences.addAdditionalOrderTextSequence,
    clearGrantDenyMotionFormSequence:
      sequences.clearGrantDenyMotionFormSequence,
    constants: state.constants,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    grantDenyMotionFormHelper: state.grantDenyMotionFormHelper,
    grantDenyMotionPdfPreviewSequence:
      sequences.grantDenyMotionPdfPreviewSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    removeAdditionalOrderTextSequence:
      sequences.removeAdditionalOrderTextSequence,
    submitGrantDenyMotionSequence: sequences.submitGrantDenyMotionSequence,
    updateFormValueSequence: sequences.updateGrantDenyMotionFormValueSequence,
    validateGrantDenyMotionSequence: sequences.validateGrantDenyMotionSequence,
    validationErrors: state.validationErrors,
  },
  function GrantDenyMotion({
    addAdditionalOrderTextSequence,
    clearGrantDenyMotionFormSequence,
    constants,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    grantDenyMotionFormHelper,
    grantDenyMotionPdfPreviewSequence,
    navigateBackSequence,
    removeAdditionalOrderTextSequence,
    submitGrantDenyMotionSequence,
    updateFormValueSequence,
    validateGrantDenyMotionSequence,
    validationErrors,
  }) {
    const additionalOrderText: string[] = form.additionalOrderText || [''];
    const isDenied = form.disposition === constants.MOTION_DISPOSITIONS.DENIED;
    const { isCalendared } = grantDenyMotionFormHelper;
    const isStrickenFromTrialSessionSelected = !!form.strickenFromTrialSession;
    const jurisdictionOptionsEnabled =
      isCalendared && isStrickenFromTrialSessionSelected;
    const calendaredDisabledTitle = isCalendared
      ? ''
      : 'Case is not calendared';
    const jurisdictionDisabledTitle = !isCalendared
      ? calendaredDisabledTitle
      : !isStrickenFromTrialSessionSelected
        ? 'Select "This case is stricken from the trial session" first'
        : '';
    const deniedOptionsDisabledTitle = isDenied ? '' : 'Select "DENIED" first';
    const grantDenyOptions = constants.GRANT_DENY_MOTION_OPTIONS;
    const docketEntryPreview = 'Order';

    const statusReportDueDateFieldsProps: StatusReportDueDateFieldsProps = {
      constants,
      dueDate: form.dueDate ?? undefined,
      dueDateErrorText: validationErrors.dueDate,
      filingParty: form.filingParty,
      filingPartyErrorText: validationErrors.filingParty,
      filingPartyOptions: grantDenyOptions.filingPartyOptions,
      formatAndUpdateDateFromDatePickerSequence,
      minDate: grantDenyMotionFormHelper.minDate,
      updateFormValueSequence:
        updateFormValueSequence as typeof updateGrantDenyMotionFormValueSequence,
      validateGrantDenyMotionSequence:
        validateGrantDenyMotionSequence as typeof validateGrantDenyMotionSequenceFn,
    };

    return (
      <>
        <CaseDetailHeader />
        <div className="grid-container">
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <h1 className="heading-1" id="page-title">
              Grant/Deny Motion
            </h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="tw:basis-5/12">
              <Button
                link
                icon={['fa', 'arrow-alt-circle-left']}
                onClick={() => navigateBackSequence()}
              >
                Back
              </Button>

              <div className="border border-base-lighter">
                <div className="grid-header grid-row padding-left-205">
                  Action
                </div>
                <div className="grant-deny-motion-form tw:px-4 tw:pt-3 tw:pb-4">
                  {grantDenyMotionFormHelper.isLeadCase && (
                    <>
                      <FormGroup errorText={validationErrors.issueOrder}>
                        <label
                          className="usa-label"
                          htmlFor="issue-order-radios"
                        >
                          This is the lead case in a consolidated group. Issue
                          this order in:
                        </label>
                        <div className="usa-radio">
                          <input
                            aria-describedby="issue-order-radios"
                            aria-label="all cases in group"
                            checked={
                              form.issueOrder ===
                              grantDenyOptions.issueOrderOptions.allCasesInGroup
                            }
                            className="usa-radio__input"
                            data-testid="issue-order-all-cases"
                            id="issue-order-all-cases"
                            name="issueOrder"
                            type="radio"
                            value={
                              grantDenyOptions.issueOrderOptions.allCasesInGroup
                            }
                            onChange={e =>
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="issue-order-all-cases"
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
                              grantDenyOptions.issueOrderOptions.justThisCase
                            }
                            className="usa-radio__input"
                            data-testid="issue-order-just-this-case"
                            id="issue-order-just-this-case"
                            name="issueOrder"
                            type="radio"
                            value={
                              grantDenyOptions.issueOrderOptions.justThisCase
                            }
                            onChange={e =>
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="issue-order-just-this-case"
                          >
                            Just this case
                          </label>
                        </div>
                      </FormGroup>
                      <hr className="border-top-2px border-base-lighter" />
                    </>
                  )}

                  <FormGroup errorText={validationErrors.disposition}>
                    {[
                      constants.MOTION_DISPOSITIONS.GRANTED,
                      constants.MOTION_DISPOSITIONS.DENIED,
                    ].map(option => (
                      <div className="usa-radio" key={option}>
                        <input
                          aria-label={`disposition-${option}`}
                          checked={form.disposition === option}
                          className="usa-radio__input"
                          data-testid={`motion-disposition-${option}`}
                          id={`motion-disposition-${option}`}
                          name="disposition"
                          type="radio"
                          value={option}
                          onChange={e =>
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            })
                          }
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`motion-disposition-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                    <div className="tw:flex tw:gap-8 tw:pl-7 tw:mt-2">
                      <div>
                        <input
                          checked={!!form.deniedAsMoot}
                          className="usa-checkbox__input"
                          data-testid="denied-as-moot"
                          disabled={!isDenied}
                          id="deniedAsMoot"
                          name="deniedAsMoot"
                          type="checkbox"
                          onChange={e =>
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="deniedAsMoot"
                          style={isDenied ? undefined : { color: '#757575' }}
                          title={deniedOptionsDisabledTitle}
                        >
                          As moot
                        </label>
                      </div>
                      <div>
                        <input
                          checked={!!form.deniedWithoutPrejudice}
                          className="usa-checkbox__input"
                          data-testid="denied-without-prejudice"
                          disabled={!isDenied}
                          id="deniedWithoutPrejudice"
                          name="deniedWithoutPrejudice"
                          type="checkbox"
                          onChange={e =>
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="deniedWithoutPrejudice"
                          style={isDenied ? undefined : { color: '#757575' }}
                          title={deniedOptionsDisabledTitle}
                        >
                          Without prejudice
                        </label>
                      </div>
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup>
                    <label className="usa-label">
                      <span className="text-bold">Select any that apply</span>{' '}
                      <span className="usa-hint">(optional)</span>
                    </label>

                    <div className="grant-deny-motion-optional-options">
                      <div className="usa-checkbox">
                        <input
                          aria-label="this case is stricken from the trial session"
                          checked={!!form.strickenFromTrialSession}
                          className="usa-checkbox__input"
                          data-testid="stricken-from-trial-session"
                          disabled={!isCalendared}
                          id="stricken-from-trial-session"
                          name="strickenFromTrialSession"
                          type="checkbox"
                          onChange={e =>
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            })
                          }
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="stricken-from-trial-session"
                          style={
                            isCalendared ? undefined : { color: '#757575' }
                          }
                          title={calendaredDisabledTitle}
                        >
                          This case is stricken from the trial session
                        </label>
                      </div>

                      <hr className="border-top-2px border-base-lighter tw:my-2" />

                      <div className="grant-deny-motion-jurisdiction-options">
                        <div className="usa-radio">
                          <input
                            aria-label="restore to general docket"
                            checked={
                              form.jurisdiction ===
                              grantDenyOptions.jurisdictionOptions.restored
                            }
                            className="usa-radio__input"
                            data-testid="jurisdiction-restored"
                            disabled={!jurisdictionOptionsEnabled}
                            id="jurisdiction-restored"
                            name="jurisdiction"
                            type="radio"
                            value={
                              grantDenyOptions.jurisdictionOptions.restored
                            }
                            onChange={e =>
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="jurisdiction-restored"
                            style={
                              jurisdictionOptionsEnabled
                                ? undefined
                                : { color: '#757575' }
                            }
                            title={jurisdictionDisabledTitle}
                          >
                            Restore to general docket
                          </label>
                        </div>
                        <div className="usa-radio">
                          <input
                            aria-label="jurisdiction retained"
                            checked={
                              form.jurisdiction ===
                              grantDenyOptions.jurisdictionOptions.retained
                            }
                            className="usa-radio__input"
                            data-testid="jurisdiction-retained"
                            disabled={!jurisdictionOptionsEnabled}
                            id="jurisdiction-retained"
                            name="jurisdiction"
                            type="radio"
                            value={
                              grantDenyOptions.jurisdictionOptions.retained
                            }
                            onChange={e =>
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              })
                            }
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor="jurisdiction-retained"
                            style={
                              jurisdictionOptionsEnabled
                                ? undefined
                                : { color: '#757575' }
                            }
                            title={jurisdictionDisabledTitle}
                          >
                            Jurisdiction retained
                          </label>
                        </div>
                      </div>

                      <hr className="border-top-2px border-base-lighter tw:my-2" />

                      <div className="usa-checkbox">
                        <input
                          aria-label="file status report"
                          checked={
                            form.dueDateMessage ===
                            grantDenyOptions.dueDateMessageOptions.statusReport
                          }
                          className="usa-checkbox__input"
                          data-testid="due-date-message-status-report"
                          id="due-date-message-status-report"
                          name="dueDateMessage"
                          type="checkbox"
                          onChange={() => {
                            const optionValue =
                              grantDenyOptions.dueDateMessageOptions
                                .statusReport;
                            updateFormValueSequence({
                              key: 'dueDateMessage',
                              value:
                                form.dueDateMessage === optionValue
                                  ? null
                                  : optionValue,
                            });
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="due-date-message-status-report"
                        >
                          File Status Report
                        </label>
                      </div>
                      {form.dueDateMessage ===
                        grantDenyOptions.dueDateMessageOptions.statusReport && (
                        <StatusReportDueDateFields
                          {...statusReportDueDateFieldsProps}
                        />
                      )}
                      <div className="usa-checkbox">
                        <input
                          aria-label="file status report or proposed stipulated decision"
                          checked={
                            form.dueDateMessage ===
                            grantDenyOptions.dueDateMessageOptions
                              .statusReportOrStipulatedDecision
                          }
                          className="usa-checkbox__input"
                          data-testid="due-date-message-stip"
                          id="due-date-message-stip"
                          name="dueDateMessage"
                          type="checkbox"
                          onChange={() => {
                            const optionValue =
                              grantDenyOptions.dueDateMessageOptions
                                .statusReportOrStipulatedDecision;
                            updateFormValueSequence({
                              key: 'dueDateMessage',
                              value:
                                form.dueDateMessage === optionValue
                                  ? null
                                  : optionValue,
                            });
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="due-date-message-stip"
                        >
                          File Status Report/Proposed Stip Decision
                        </label>
                      </div>
                      {form.dueDateMessage ===
                        grantDenyOptions.dueDateMessageOptions
                          .statusReportOrStipulatedDecision && (
                        <StatusReportDueDateFields
                          {...statusReportDueDateFieldsProps}
                        />
                      )}
                    </div>
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    errorText={
                      grantDenyMotionFormHelper.additionalOrderTextErrorText
                    }
                  >
                    {additionalOrderText.map((value, index) => (
                      <div
                        data-testid={`additional-order-text-row-${index}`}
                        key={index}
                      >
                        <label
                          className="usa-label tw:mt-4"
                          htmlFor={`additional-order-text-${index}`}
                          id={`additional-order-text-label-${index}`}
                        >
                          Additional order text
                        </label>
                        <textarea
                          aria-describedby={`additional-order-text-label-${index}`}
                          aria-label={`additional order text ${index + 1}`}
                          autoCapitalize="none"
                          className="usa-textarea maxw-none height-8 usa-character-count__field textarea-resize-vertical"
                          data-testid={`additional-order-text-${index}`}
                          id={`additional-order-text-${index}`}
                          maxLength={MAX_ADDITIONAL_TEXT_CHARS}
                          name="additionalOrderText"
                          value={value}
                          onChange={e =>
                            updateFormValueSequence({
                              allowEmptyString: true,
                              index,
                              key: 'additionalOrderText',
                              value: e.target.value,
                            })
                          }
                        />
                        <CharactersRemainingHint
                          className="tw:mb-0"
                          maxCharacters={MAX_ADDITIONAL_TEXT_CHARS}
                          stringToCount={value}
                        />
                        {index > 0 && (
                          <DawsonButton
                            className="tw:block"
                            data-testid={`remove-additional-order-text-${index}`}
                            icon="circle-xmark"
                            iconPosition="left"
                            variant="destructiveTertiary"
                            onClick={e => {
                              e.preventDefault();
                              removeAdditionalOrderTextSequence({ index });
                            }}
                          >
                            Remove
                          </DawsonButton>
                        )}
                      </div>
                    ))}
                    <hr />
                    <DawsonButton
                      data-testid="add-additional-order-text"
                      icon="plus"
                      iconPosition="left"
                      variant="primaryTertiary"
                      onClick={e => {
                        e.preventDefault();
                        addAdditionalOrderTextSequence();
                      }}
                    >
                      Add additional order text
                    </DawsonButton>
                  </FormGroup>
                </div>
              </div>

              <Button
                link
                data-testid="clear-grant-deny-form"
                onClick={e => {
                  e.preventDefault();
                  clearGrantDenyMotionFormSequence();
                }}
              >
                Clear All
              </Button>

              <div className="tw:my-4 button-container">
                <Button
                  className="margin-right-1"
                  data-testid="save-draft-button"
                  id="save-draft-button"
                  onClick={() => submitGrantDenyMotionSequence()}
                >
                  Save as Draft
                </Button>
                <Button
                  secondary
                  className="margin-right-1"
                  data-testid="preview-pdf-button"
                  id="preview-pdf-button"
                  onClick={() => grantDenyMotionPdfPreviewSequence()}
                >
                  Preview PDF
                </Button>
                <Button link onClick={() => navigateBackSequence()}>
                  Cancel
                </Button>
              </div>
            </div>

            <div className="tw:basis-7/12">
              <div className="tw:mb-2">
                <span className="text-bold">Docket entry preview:</span>{' '}
                <span data-testid="docket-entry-preview">
                  {docketEntryPreview}
                </span>
              </div>
              <div
                className="grantDenyMotionPdfPreview"
                data-testid="grant-deny-motion-pdf-preview"
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

GrantDenyMotion.displayName = 'GrantDenyMotion';
