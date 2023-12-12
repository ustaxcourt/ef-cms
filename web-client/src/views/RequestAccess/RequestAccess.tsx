import { Button } from '../../ustc-ui/Button/Button';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PartiesRepresenting } from './PartiesRepresenting';
import { RequestAccessDocumentForm } from './RequestAccessDocumentForm';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import { reactSelectValue } from '../../ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
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
  function RequestAccess({
    form,
    formCancelToggleCancelSequence,
    requestAccessHelper,
    reviewRequestAccessInformationSequence,
    updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h1
            className="margin-bottom-105"
            id="file-a-document-header"
            tabIndex={-1}
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
        <div>
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

            <SelectSearch
              aria-describedby="document-type-label"
              className={classNames(
                'select-react-element',
                validationErrors.documentType && 'usa-select--error',
              )}
              data-testid="document-type"
              id="document-type"
              name="documentType"
              options={requestAccessHelper.documentsForSelect}
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
          {requestAccessHelper.showPartiesRepresenting && (
            <PartiesRepresenting />
          )}
          <RequestAccessDocumentForm />

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

RequestAccess.displayName = 'RequestAccess';
