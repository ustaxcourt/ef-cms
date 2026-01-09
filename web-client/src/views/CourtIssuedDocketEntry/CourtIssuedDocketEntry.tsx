import { CancelDraftDocumentModal } from '../CancelDraftDocumentModal';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateSaveModal } from '../ConfirmInitiateSaveModal';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { CourtIssuedNonstandardForm } from './CourtIssuedNonstandardForm';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { WarningNotificationComponent } from '../WarningNotification';
import { WorkItemAlreadyCompletedModal } from '../DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { reactSelectValue } from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { pullAt } from 'lodash';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { Button } from '@web-client/dawson-ui/ui/button';

export const CourtIssuedDocketEntry = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    confirmWorkItemAlreadyCompleteSequence:
      sequences.confirmWorkItemAlreadyCompleteSequence,
    constants: state.constants,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence:
      sequences.fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    isEditingDocketEntry: state.isEditingDocketEntry,
    openCancelDraftDocumentModalSequence:
      sequences.openCancelDraftDocumentModalSequence,
    openConfirmInitiateCourtIssuedFilingServiceModalSequence:
      sequences.openConfirmInitiateCourtIssuedFilingServiceModalSequence,
    saveCourtIssuedDocketEntrySequence:
      sequences.saveCourtIssuedDocketEntrySequence,
    showModal: state.modal.showModal,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function CourtIssuedDocketEntry({
    addCourtIssuedDocketEntryHelper,
    confirmWorkItemAlreadyCompleteSequence,
    constants,
    fileAndServeCourtIssuedDocumentFromDocketEntrySequence,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    isEditingDocketEntry,
    openCancelDraftDocumentModalSequence,
    openConfirmInitiateCourtIssuedFilingServiceModalSequence,
    saveCourtIssuedDocketEntrySequence,
    showModal,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container margin-top-5">
          <SuccessNotification />
          <ErrorNotification />

          {!addCourtIssuedDocketEntryHelper.showServiceWarning &&
            isEditingDocketEntry && (
              <Hint fullWidth>
                This docket entry has not been served on the parties.
              </Hint>
            )}

          {addCourtIssuedDocketEntryHelper.showServiceWarning && (
            <WarningNotificationComponent
              alertWarning={{
                message:
                  'Document cannot be served until the Petition is served.',
              }}
              dismissible={false}
              scrollToTop={false}
            />
          )}
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <h1
                className="margin-bottom-105"
                data-testid="court-issued-docket-entry-title"
              >
                {isEditingDocketEntry ? 'Edit' : 'Add'} Docket Entry
              </h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div
                  className="margin-top-1 margin-bottom-1 docket-entry-preview-text"
                  data-testid="docket-entry-preview-text"
                >
                  <span className="text-bold">Docket entry preview: </span>
                  {addCourtIssuedDocketEntryHelper.formattedDocumentTitle}
                </div>
              </div>
            </div>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <div className="blue-container">
                <FormGroup errorText={validationErrors.documentType}>
                  <label
                    className="usa-label"
                    htmlFor="document-type"
                    id="document-type-label"
                  >
                    Document type
                  </label>
                  <SelectSearch
                    aria-labelledby="document-type-label"
                    data-testid="court-issued-document-type-search"
                    id="document-type"
                    isClearable={true}
                    name="eventCode"
                    options={addCourtIssuedDocketEntryHelper.documentTypes}
                    value={reactSelectValue({
                      documentTypes:
                        addCourtIssuedDocketEntryHelper.documentTypes,
                      selectedEventCode: form.eventCode,
                    })}
                    onChange={inputValue => {
                      [
                        'documentType',
                        'documentTitle',
                        'eventCode',
                        'scenario',
                      ].forEach(key =>
                        updateCourtIssuedDocketEntryFormValueSequence({
                          key,
                          value: inputValue ? inputValue[key] : '',
                        }),
                      );
                      validateCourtIssuedDocketEntrySequence();
                    }}
                    onInputChange={inputText => {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: 'searchText',
                        value: inputText,
                      });
                    }}
                  />
                </FormGroup>

                {form.eventCode && <CourtIssuedNonstandardForm />}

                {DocketEntry.isOrder(form.eventCode) && (
                  <FormGroup>
                    <fieldset className="usa-fieldset">
                      <div className="usa-checkbox">
                        <input
                          className="usa-checkbox__input"
                          id="dispositionOrder"
                          data-testid="disposition-order-checkbox"
                          name="dispositionOrder"
                          type="checkbox"
                          onChange={e => {
                            if (e.target.checked) {
                              updateCourtIssuedDocketEntryFormValueSequence({
                                key: 'affectedDocketEntries',
                                value: [{}],
                              });
                            } else {
                              updateCourtIssuedDocketEntryFormValueSequence({
                                key: 'affectedDocketEntries',
                                value: undefined,
                              });
                            }
                            validateCourtIssuedDocketEntrySequence();
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="dispositionOrder"
                        >
                          This order is dispositive for at least one motion
                        </label>
                      </div>
                    </fieldset>
                  </FormGroup>
                )}
                {DocketEntry.isOrder(form.eventCode) &&
                  form.affectedDocketEntries && (
                    <div>
                      {form.affectedDocketEntries.map((motion, i) => {
                        return (
                          <div key={motion.arrayKey} className="tw:mb-[16px]">
                            <FormGroup
                              errorText={
                                validationErrors[
                                  `affectedDocketEntries-${i}-docketEntryId`
                                ]
                              }
                            >
                              <label
                                className="usa-label"
                                htmlFor="affectedMotion"
                                id="related-motion-label"
                                data-testid="related-motion-label"
                              >
                                What motion is being acted on?
                              </label>
                              <SelectSearch
                                aria-labelledby="related-motion-label"
                                data-testid="related-motion-type-search"
                                id="affectedMotion"
                                isClearable={true}
                                name="affectedMotion"
                                options={
                                  addCourtIssuedDocketEntryHelper.caseMotions
                                }
                                onChange={(inputValue: any) => {
                                  updateCourtIssuedDocketEntryFormValueSequence(
                                    {
                                      key: 'affectedDocketEntries',
                                      index: i,
                                      value: Object.assign(
                                        form.affectedDocketEntries[i],
                                        {
                                          docketEntryId: inputValue?.value,
                                        },
                                      ),
                                    },
                                  );

                                  validateCourtIssuedDocketEntrySequence();
                                }}
                              />
                            </FormGroup>
                            <FormGroup
                              errorText={
                                validationErrors[
                                  `affectedDocketEntries-${i}-disposition`
                                ]
                              }
                              className="tw:mb-[0px]"
                            >
                              <label
                                className="usa-label"
                                htmlFor="related-motion-disposition"
                                id="related-motion-disposition-label"
                              >
                                What action is being taken?
                              </label>
                              <SelectSearch
                                aria-labelledby="related-motion-disposition-label"
                                data-testid="related-motion-disposition-type-search"
                                id="related-motion-disposition"
                                isClearable={true}
                                name="relatedMotionDisposition"
                                options={
                                  addCourtIssuedDocketEntryHelper.relatedMotionDispositions
                                }
                                onChange={(inputValue: any) => {
                                  updateCourtIssuedDocketEntryFormValueSequence(
                                    {
                                      key: 'affectedDocketEntries',
                                      index: i,
                                      value: Object.assign(
                                        form.affectedDocketEntries[i],
                                        {
                                          disposition: inputValue?.value,
                                        },
                                      ),
                                    },
                                  );

                                  validateCourtIssuedDocketEntrySequence();
                                }}
                              />
                            </FormGroup>
                            {form.affectedDocketEntries.length > 1 && (
                              <>
                                <Button
                                  variant="destructiveTertiary"
                                  icon="minus-circle"
                                  className="tw:mt-[16px] tw:mb-[16px]"
                                  onClick={() => {
                                    const motions = [
                                      ...form.affectedDocketEntries,
                                    ];
                                    pullAt(motions, i);
                                    updateCourtIssuedDocketEntryFormValueSequence(
                                      {
                                        key: 'affectedDocketEntries',
                                        value: motions,
                                      },
                                    );
                                  }}
                                >
                                  Remove Motion
                                </Button>
                                <hr className="tw:m-[0px]"></hr>
                              </>
                            )}
                          </div>
                        );
                      })}

                      <Button
                        variant="primaryTertiary"
                        icon="plus-circle"
                        className="tw:mb-[16px]"
                        onClick={() => {
                          updateCourtIssuedDocketEntryFormValueSequence({
                            key: 'affectedDocketEntries',
                            value: [
                              ...form.affectedDocketEntries,
                              { arrayKey: createISODateString() },
                            ],
                          });
                        }}
                      >
                        Add new motion
                      </Button>
                    </div>
                  )}

                {addCourtIssuedDocketEntryHelper.showAttachmentAndServiceFields && (
                  <FormGroup errorText={validationErrors.attachments}>
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Inclusions</legend>
                      <div className="usa-checkbox">
                        <input
                          checked={form.attachments}
                          className="usa-checkbox__input"
                          id="attachments"
                          name="attachments"
                          type="checkbox"
                          onChange={e => {
                            updateCourtIssuedDocketEntryFormValueSequence({
                              key: e.target.name,
                              value: e.target.checked,
                            });
                            validateCourtIssuedDocketEntrySequence();
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor="attachments"
                        >
                          Attachment(s)
                        </label>
                      </div>
                    </fieldset>
                  </FormGroup>
                )}

                {addCourtIssuedDocketEntryHelper.showServiceStamp && (
                  <FormGroup errorText={validationErrors.serviceStamp}>
                    <fieldset className="usa-fieldset">
                      <legend className="usa-legend">Service stamp</legend>
                      {constants.SERVICE_STAMP_OPTIONS.map((option, idx) => (
                        <div
                          className="usa-radio usa-radio__inline"
                          key={`stamp_${option}`}
                        >
                          <input
                            checked={form.serviceStamp === option}
                            className="usa-radio__input"
                            id={`service-stamp-${idx}`}
                            name="serviceStamp"
                            type="radio"
                            onChange={e => {
                              updateCourtIssuedDocketEntryFormValueSequence({
                                key: e.target.name,
                                value: option,
                              });
                              validateCourtIssuedDocketEntrySequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            data-testid={`service-stamp-${option}`}
                            htmlFor={`service-stamp-${idx}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </fieldset>
                  </FormGroup>
                )}

                {addCourtIssuedDocketEntryHelper.showAttachmentAndServiceFields && (
                  <>
                    <label className="usa-label" htmlFor="service-parties">
                      Service parties
                    </label>

                    <div id="service-parties">
                      {addCourtIssuedDocketEntryHelper.serviceParties.map(
                        party => (
                          <div
                            className="service-party"
                            key={party.displayName}
                          >
                            <div className="service-party-name">
                              {party.displayName}
                            </div>
                            <div className="service-party-indicator">
                              <b>Service: </b>
                              {party.serviceIndicator}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </>
                )}

                {addCourtIssuedDocketEntryHelper.showReceivedDate && (
                  <DateSelector
                    showDateHint
                    defaultValue={form.filingDate}
                    errorText={validationErrors.filingDate}
                    formGroupClassNames="margin-top-4"
                    id="date-received"
                    label="Filed date"
                    onChange={e => {
                      formatAndUpdateDateFromDatePickerSequence({
                        key: 'filingDate',
                        toFormat: constants.DATE_FORMATS.ISO,
                        value: e.target.value,
                      });
                      validateCourtIssuedDocketEntrySequence();
                    }}
                  />
                )}
              </div>
              <section className="usa-section DocumentDetail">
                <div className="margin-top-5 button-container">
                  {addCourtIssuedDocketEntryHelper.showSaveAndServeButton && (
                    <Button
                      className="tw:mr-[1rem]"
                      data-testid="serve-to-parties-btn"
                      id="serve-to-parties-btn"
                      onClick={() => {
                        openConfirmInitiateCourtIssuedFilingServiceModalSequence();
                      }}
                    >
                      Save and Serve
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    className="tw:mr-[1rem]"
                    data-testid="save-docket-entry-button"
                    onClick={() => {
                      saveCourtIssuedDocketEntrySequence();
                    }}
                  >
                    Save Entry
                  </Button>
                  <Button
                    className="tw:mr-[1rem]"
                    variant="primaryTertiary"
                    id="cancel-button"
                    onClick={() => {
                      openCancelDraftDocumentModalSequence();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </section>
            </div>
            <div className="grid-col-7">
              <DocumentDisplayIframe />
            </div>
          </div>
        </section>
        {showModal === 'ConfirmInitiateCourtIssuedFilingServiceModal' && (
          <ConfirmInitiateServiceModal
            confirmSequence={
              fileAndServeCourtIssuedDocumentFromDocketEntrySequence
            }
            documentTitle={
              addCourtIssuedDocketEntryHelper.formattedDocumentTitle
            }
          />
        )}
        {showModal === 'ConfirmInitiateSaveModal' && (
          <ConfirmInitiateSaveModal
            documentTitle={
              addCourtIssuedDocketEntryHelper.formattedDocumentTitle
            }
          />
        )}
        {showModal === 'CancelDraftDocumentModal' && (
          <CancelDraftDocumentModal />
        )}
        {showModal === 'WorkItemAlreadyCompletedModal' && (
          <WorkItemAlreadyCompletedModal
            confirmSequence={confirmWorkItemAlreadyCompleteSequence}
          />
        )}
      </>
    );
  },
);

CourtIssuedDocketEntry.displayName = 'CourtIssuedDocketEntry';
