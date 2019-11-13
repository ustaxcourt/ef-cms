import { Button } from '../../ustc-ui/Button/Button';
import { CancelDraftDocumentModal } from '../CancelDraftDocumentModal';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { CourtIssuedNonstandardForm } from './CourtIssuedNonstandardForm';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import {
  courtIssuedDocketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';

export const AddCourtIssuedDocketEntry = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    form: state.form,
    openCancelDraftDocumentModalSequence:
      sequences.openCancelDraftDocumentModalSequence,
    showModal: state.showModal,
    submitCourtIssuedDocketEntrySequence:
      sequences.submitCourtIssuedDocketEntrySequence,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    addCourtIssuedDocketEntryHelper,
    form,
    openCancelDraftDocumentModalSequence,
    showModal,
    submitCourtIssuedDocketEntrySequence,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container margin-top-5">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-5">
              <h1 className="margin-bottom-105">Add Docket Entry</h1>
            </div>
            <div className="grid-col-7">
              <div className="display-flex flex-row flex-justify flex-align-center">
                <div className="margin-top-1 margin-bottom-1 docket-entry-preview-text">
                  <span className="text-bold">Docket Entry Preview: </span>
                  {form.generatedDocumentTitle}
                </div>
                <Button className="margin-right-0" onClick={() => {}}>
                  Serve to Parties
                </Button>
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
                    Document Type
                  </label>
                  <Select
                    aria-describedby="document-type-label"
                    className="select-react-element"
                    classNamePrefix="select-react-element"
                    id="document-type"
                    isClearable={true}
                    name="eventCode"
                    options={addCourtIssuedDocketEntryHelper.documentTypes}
                    placeholder="- Select -"
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
                        updateSequence: updateCourtIssuedDocketEntryFormValueSequence,
                        validateSequence: validateCourtIssuedDocketEntrySequence,
                      });
                      return true;
                    }}
                    onInputChange={(inputText, { action }) => {
                      onInputChange({
                        action,
                        inputText,
                        updateSequence: updateCourtIssuedDocketEntryFormValueSequence,
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

                <p>
                  <b>Service Parties</b>
                </p>

                {addCourtIssuedDocketEntryHelper.serviceParties.map(party => (
                  <div className="margin-bottom-2" key={party.displayName}>
                    {party.displayName}
                    <div className="float-right">
                      <b>Service: </b>
                      {party.serviceType || 'Electronic'}
                    </div>
                  </div>
                ))}
              </div>

              <section className="usa-section DocumentDetail">
                <div className="margin-top-5">
                  <Button
                    secondary
                    id="save-and-add-supporting"
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

        {showModal === 'CancelDraftDocumentModal' && (
          <CancelDraftDocumentModal />
        )}
      </>
    );
  },
);
