import { Button } from '../../ustc-ui/Button/Button';
import { CaseAssociationRequestDocumentForm } from './CaseAssociationRequestDocumentForm';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PartiesRepresenting } from './PartiesRepresenting';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import { reactSelectValue } from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const CaseAssociationRequest = connect(
  {
    caseAssociationRequestHelper: state.caseAssociationRequestHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    reviewCaseAssociationRequestSequence:
      sequences.reviewCaseAssociationRequestSequence,
    updateCaseAssociationFormValueSequence:
      sequences.updateCaseAssociationFormValueSequence,
    validateCaseAssociationRequestSequence:
      sequences.validateCaseAssociationRequestSequence,
    validationErrors: state.validationErrors,
  },
  function CaseAssociationRequest({
    caseAssociationRequestHelper,
    form,
    formCancelToggleCancelSequence,
    reviewCaseAssociationRequestSequence,
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
            Represent a Party to this Case
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
                validationErrors.documentType && 'usa-select--error',
              )}
              data-testid="document-type"
              id="document-type"
              isClearable={true}
              name="documentType"
              options={caseAssociationRequestHelper.documentsForSelect}
              value={reactSelectValue({
                documentTypes: caseAssociationRequestHelper.documentsForSelect,
                selectedEventCode: form.eventCode,
              })}
              onChange={e => {
                updateCaseAssociationFormValueSequence({
                  key: 'documentType',
                  value: e?.label,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'documentTitleTemplate',
                  value: e?.documentTitleTemplate,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'eventCode',
                  value: e?.eventCode,
                });
                updateCaseAssociationFormValueSequence({
                  key: 'scenario',
                  value: e?.scenario,
                });
                validateCaseAssociationRequestSequence();
              }}
            />
          </FormGroup>
          {caseAssociationRequestHelper.showPartiesRepresenting && (
            <PartiesRepresenting />
          )}
          <CaseAssociationRequestDocumentForm />

          <div className="margin-top-5">
            <Button
              data-testid="request-access-submit-document"
              id="submit-document"
              type="submit"
              onClick={() => {
                reviewCaseAssociationRequestSequence();
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

CaseAssociationRequest.displayName = 'CaseAssociationRequest';
