import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CharactersRemainingHint } from '@web-client/ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
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
    const dueDateMessageSelected = !!form.dueDateMessage;
    const { isCalendared } = grantDenyMotionFormHelper;
    const calendaredDisabledTitle = isCalendared
      ? ''
      : 'Case is not calendared';
    const grantDenyOptions = constants.GRANT_DENY_MOTION_OPTIONS;
    const { filingPartyOptions } = grantDenyOptions;
    const docketEntryPreview = 'Order';

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

                    <div className="usa-radio">
                      <input
                        aria-label="this case is stricken from the trial session"
                        checked={!!form.strickenFromTrialSession}
                        className="usa-radio__input"
                        data-testid="stricken-from-trial-session"
                        disabled={!isCalendared}
                        id="stricken-from-trial-session"
                        name="strickenFromTrialSession"
                        type="radio"
                        onChange={() =>
                          updateFormValueSequence({
                            key: 'strickenFromTrialSession',
                            value: true,
                          })
                        }
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor="stricken-from-trial-session"
                        title={calendaredDisabledTitle}
                      >
                        This case is stricken from the trial session
                      </label>
                    </div>

                    <hr className="border-top-2px border-base-lighter tw:my-3" />

                    <div className="usa-radio">
                      <input
                        aria-label="restore to general docket"
                        checked={
                          form.jurisdiction ===
                          grantDenyOptions.jurisdictionOptions.restored
                        }
                        className="usa-radio__input"
                        data-testid="jurisdiction-restored"
                        disabled={!isCalendared}
                        id="jurisdiction-restored"
                        name="jurisdiction"
                        type="radio"
                        value={grantDenyOptions.jurisdictionOptions.restored}
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
                        title={calendaredDisabledTitle}
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
                        disabled={!isCalendared}
                        id="jurisdiction-retained"
                        name="jurisdiction"
                        type="radio"
                        value={grantDenyOptions.jurisdictionOptions.retained}
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
                        title={calendaredDisabledTitle}
                      >
                        Jurisdiction retained
                      </label>
                    </div>

                    <hr className="border-top-2px border-base-lighter tw:my-3" />

                    <div className="usa-radio">
                      <input
                        aria-label="file status report"
                        checked={
                          form.dueDateMessage ===
                          grantDenyOptions.dueDateMessageOptions.statusReport
                        }
                        className="usa-radio__input"
                        data-testid="due-date-message-status-report"
                        id="due-date-message-status-report"
                        name="dueDateMessage"
                        type="radio"
                        value={
                          grantDenyOptions.dueDateMessageOptions.statusReport
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
                        htmlFor="due-date-message-status-report"
                      >
                        File Status Report
                      </label>
                    </div>
                    <div className="usa-radio">
                      <input
                        aria-label="file status report or proposed stipulated decision"
                        checked={
                          form.dueDateMessage ===
                          grantDenyOptions.dueDateMessageOptions
                            .statusReportOrStipulatedDecision
                        }
                        className="usa-radio__input"
                        data-testid="due-date-message-stip"
                        id="due-date-message-stip"
                        name="dueDateMessage"
                        type="radio"
                        value={
                          grantDenyOptions.dueDateMessageOptions
                            .statusReportOrStipulatedDecision
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
                        htmlFor="due-date-message-stip"
                      >
                        File Status Report/Proposed Stip Decision
                      </label>
                    </div>

                    {dueDateMessageSelected && (
                      <div
                        className="tw:pl-7 tw:mt-3"
                        data-testid="status-report-due-date-fields"
                      >
                        <FormGroup errorText={validationErrors.dueDate}>
                          <DateSelector
                            defaultValue={form.dueDate}
                            formGroupClassNames="display-inline-block padding-0"
                            id="grant-deny-due-date"
                            label="Due date"
                            minDate={grantDenyMotionFormHelper.minDate}
                            placeHolderText="MM/DD/YYYY"
                            onChange={e => {
                              formatAndUpdateDateFromDatePickerSequence({
                                key: 'dueDate',
                                toFormat: constants.DATE_FORMATS.YYYYMMDD,
                                value: e.target.value,
                              });
                              validateGrantDenyMotionSequence();
                            }}
                          />
                        </FormGroup>

                        <FormGroup errorText={validationErrors.filingParty}>
                          <label className="usa-label" htmlFor="filing-party">
                            Filing party
                          </label>
                          <select
                            className="usa-select"
                            data-testid="filing-party"
                            id="filing-party"
                            name="filingParty"
                            value={form.filingParty || ''}
                            onChange={e =>
                              updateFormValueSequence({
                                key: e.target.name,
                                value: e.target.value,
                              })
                            }
                          >
                            <option value="">- Select -</option>
                            <option value={filingPartyOptions.petitioners}>
                              {filingPartyOptions.petitioners}
                            </option>
                            <option value={filingPartyOptions.respondent}>
                              {filingPartyOptions.respondent}
                            </option>
                            <option value={filingPartyOptions.joint}>
                              {filingPartyOptions.joint}
                            </option>
                          </select>
                        </FormGroup>
                      </div>
                    )}
                  </FormGroup>

                  <hr className="border-top-2px border-base-lighter" />

                  <FormGroup
                    errorText={
                      grantDenyMotionFormHelper.additionalOrderTextErrorText
                    }
                  >
                    <span className="usa-label text-bold">
                      Additional order text
                    </span>
                    {additionalOrderText.map((value, index) => (
                      <div
                        className="tw:mb-3"
                        data-testid={`additional-order-text-row-${index}`}
                        key={index}
                      >
                        <textarea
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
                          maxCharacters={MAX_ADDITIONAL_TEXT_CHARS}
                          stringToCount={value}
                        />
                        {additionalOrderText.length > 1 && (
                          <Button
                            link
                            data-testid={`remove-additional-order-text-${index}`}
                            icon="times"
                            onClick={e => {
                              e.preventDefault();
                              removeAdditionalOrderTextSequence({ index });
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      link
                      data-testid="add-additional-order-text"
                      icon="plus"
                      onClick={e => {
                        e.preventDefault();
                        addAdditionalOrderTextSequence();
                      }}
                    >
                      Add additional order text
                    </Button>
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
