import { Button } from '../../ustc-ui/Button/Button';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PartiesRepresenting } from './PartiesRepresenting';
import { RequestAccessDocumentForm } from './RequestAccessDocumentForm';
import { connect } from '@cerebral/react';
import { reactSelectValue } from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

export const RequestAccess = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    requestAccessHelper: state.requestAccessHelper,
    reviewRequestAccessInformationSequence:
      sequences.reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    requestAccessHelper,
    reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) => {
    return (
      <>
        <Focus>
          <h1
            className="margin-bottom-105"
            id="file-a-document-header"
            tabIndex="-1"
          >
            Request Access to This Case
          </h1>
        </Focus>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <div>
          <h2 className="header-with-link-button">
            Type of Document You’re Filing
          </h2>
        </div>
        <div className="blue-container">
          <FormGroup errorText={validationErrors.documentType}>
            <label
              className="usa-label"
              htmlFor="react-select-2-input"
              id="document-type-label"
            >
              Document type
            </label>
            <span className="usa-hint">
              Enter your document name to see available document types,
              <br />
              or use the dropdown to select your document type.
            </span>

            <Select
              aria-describedby="document-type-label"
              className={classNames(
                'select-react-element',
                validationErrors.documentType && 'usa-select--error',
              )}
              classNamePrefix="select-react-element"
              id="document-type"
              name="documentType"
              options={requestAccessHelper.documentsForSelect}
              placeholder="- Select -"
              value={reactSelectValue({
                documentTypes: requestAccessHelper.documentsForSelect,
                selectedEventCode: form.eventCode,
              })}
              onChange={e => {
                updateCaseAssociationFormValueSequence({
                  key: 'documentType',
                  value: e.label,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'documentTitleTemplate',
                  value: e.documentTitleTemplate,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'eventCode',
                  value: e.eventCode,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'scenario',
                  value: e.scenario,
                });
                validateCaseAssociationRequestSequence();
              }}
            />
          </FormGroup>
          <RequestAccessDocumentForm />
          {requestAccessHelper.showPartiesRepresenting && (
            <PartiesRepresenting />
          )}
          <div className="margin-top-5">
            <Button
              id="submit-document"
              type="submit"
              onClick={() => {
                reviewRequestAccessInformationSequence();
              }}
            >
              Review Filing
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </>
    );
  },
);
