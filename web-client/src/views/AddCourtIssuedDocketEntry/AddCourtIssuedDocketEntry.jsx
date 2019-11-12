import { Button } from '../../ustc-ui/Button/Button';
import { CancelDraftDocumentModal } from '../CancelDraftDocumentModal';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { CourtIssuedNonstandardForm } from './CourtIssuedNonstandardForm';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
import { ErrorNotification } from '../ErrorNotification';
import { Inclusions } from '../AddDocketEntry/Inclusions';

import {
  docketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';

import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
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
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    addCourtIssuedDocketEntryHelper,
    form,
    openCancelDraftDocumentModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) => {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-row grid-gap">
            <div className="grid-col-12">
              <Button className="float-right" onClick={() => {}}>
                Serve to Parties
              </Button>
              <h1 className="margin-bottom-105">Add Docket Entry</h1>
            </div>

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
                      docketEntryOnChange({
                        action,
                        inputValue,
                        name,
                        updateSequence: updateFormValueSequence,
                        validateSequence: () => {},
                      });
                      return true;
                    }}
                    onInputChange={(inputText, { action }) => {
                      onInputChange({
                        action,
                        inputText,
                        updateSequence: updateFormValueSequence,
                      });
                    }}
                  />
                </FormGroup>

                {form.eventCode && <CourtIssuedNonstandardForm />}

                <Inclusions />
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
                    onClick={() => {}}
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
