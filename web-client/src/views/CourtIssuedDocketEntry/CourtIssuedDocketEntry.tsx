import { Button } from '../../ustc-ui/Button/Button';
import { CancelDraftDocumentModal } from '../CancelDraftDocumentModal';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateSaveModal } from '../ConfirmInitiateSaveModal';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { CourtIssuedNonstandardForm } from './CourtIssuedNonstandardForm';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { WarningNotificationComponent } from '../WarningNotification';
import { WorkItemAlreadyCompletedModal } from '../DocketEntryQc/WorkItemAlreadyCompletedModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  courtIssuedDocketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

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
              <h1 className="margin-bottom-105">
                {isEditingDocketEntry ? 'Edit' : 'Add'} Docket Entry
              </h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div className="margin-top-1 margin-bottom-1 docket-entry-preview-text">
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
                    data-testid="primary-document"
                    id="document-type"
                    name="eventCode"
                    options={addCourtIssuedDocketEntryHelper.documentTypes}
                    value={reactSelectValue({
                      documentTypes:
                        addCourtIssuedDocketEntryHelper.documentTypes,
                      selectedEventCode: form.eventCode,
                    })}
                    onChange={(inputValue, { action, name }) => {
                      courtIssuedDocketEntryOnChange({
                        action,
                        inputValue,
                        name,
                        updateSequence:
                          updateCourtIssuedDocketEntryFormValueSequence,
                        validateSequence:
                          validateCourtIssuedDocketEntrySequence,
                      });
                      return true;
                    }}
                    onInputChange={(inputText, { action }) => {
                      onInputChange({
                        action,
                        inputText,
                        updateSequence:
                          updateCourtIssuedDocketEntryFormValueSequence,
                      });
                    }}
                  />
                </FormGroup>

                {form.eventCode && <CourtIssuedNonstandardForm />}

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
                    <div className="usa-label" htmlFor="service-parties">
                      Service parties
                    </div>

                    <div id="service-parties">
                      {addCourtIssuedDocketEntryHelper.serviceParties.map(
                        party => (
                          <div
                            className="margin-bottom-2"
                            key={party.displayName}
                          >
                            {party.displayName}
                            <div className="float-right">
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
                <div className="margin-top-5">
                  {addCourtIssuedDocketEntryHelper.showSaveAndServeButton && (
                    <Button
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
                    secondary
                    id="save-entry-button"
                    onClick={() => {
                      saveCourtIssuedDocketEntrySequence();
                    }}
                  >
                    Save Entry
                  </Button>
                  <Button
                    link
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
