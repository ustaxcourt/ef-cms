import { Button } from '../../ustc-ui/Button/Button';
import { CancelDraftDocumentModal } from '../CancelDraftDocumentModal';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmInitiateServiceModal } from '../ConfirmInitiateServiceModal';
import { CourtIssuedNonstandardForm } from './CourtIssuedNonstandardForm';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { DocumentDisplayIframe } from '../DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import {
  courtIssuedDocketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CourtIssuedDocketEntry = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    constants: state.constants,
    form: state.form,
    isEditingDocketEntry: state.isEditingDocketEntry,
    openCancelDraftDocumentModalSequence:
      sequences.openCancelDraftDocumentModalSequence,
    openConfirmInitiateServiceModalSequence:
      sequences.openConfirmInitiateServiceModalSequence,
    showModal: state.modal.showModal,
    submitCourtIssuedDocketEntrySequence:
      sequences.submitCourtIssuedDocketEntrySequence,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function CourtIssuedDocketEntry({
    addCourtIssuedDocketEntryHelper,
    constants,
    form,
    isEditingDocketEntry,
    openCancelDraftDocumentModalSequence,
    openConfirmInitiateServiceModalSequence,
    showModal,
    submitCourtIssuedDocketEntrySequence,
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

          {isEditingDocketEntry && (
            <Hint exclamation fullWidth>
              This docket entry has not been served on the parties.
            </Hint>
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
                            htmlFor={`service-stamp-${idx}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </fieldset>
                  </FormGroup>
                )}

                <div className="usa-label" htmlFor="service-parties">
                  Service parties
                </div>

                <div id="service-parties">
                  {addCourtIssuedDocketEntryHelper.serviceParties.map(party => (
                    <div className="margin-bottom-2" key={party.displayName}>
                      {party.displayName}
                      <div className="float-right">
                        <b>Service: </b>
                        {party.serviceIndicator}
                      </div>
                    </div>
                  ))}
                </div>

                {addCourtIssuedDocketEntryHelper.showReceivedDate && (
                  <DateInput
                    className="margin-top-4"
                    errorText={validationErrors.filingDate}
                    id="date-received"
                    label="Filed date"
                    names={{
                      day: 'filingDateDay',
                      month: 'filingDateMonth',
                      year: 'filingDateYear',
                    }}
                    values={{
                      day: form.filingDateDay,
                      month: form.filingDateMonth,
                      year: form.filingDateYear,
                    }}
                    onBlur={validateCourtIssuedDocketEntrySequence}
                    onChange={updateCourtIssuedDocketEntryFormValueSequence}
                  />
                )}
              </div>

              <section className="usa-section DocumentDetail">
                <div className="margin-top-5">
                  {addCourtIssuedDocketEntryHelper.showSaveAndServeButton && (
                    <Button
                      id="serve-to-parties-btn"
                      onClick={() => {
                        openConfirmInitiateServiceModalSequence();
                      }}
                    >
                      Save and Serve
                    </Button>
                  )}
                  <Button
                    secondary
                    id="save-entry-button"
                    onClick={() => submitCourtIssuedDocketEntrySequence()}
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
        {showModal === 'ConfirmInitiateServiceModal' && (
          <ConfirmInitiateServiceModal
            documentTitle={
              addCourtIssuedDocketEntryHelper.formattedDocumentTitle
            }
          />
        )}
        {showModal === 'CancelDraftDocumentModal' && (
          <CancelDraftDocumentModal />
        )}
      </>
    );
  },
);
