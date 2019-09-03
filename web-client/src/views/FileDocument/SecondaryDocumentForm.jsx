import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InclusionsForm } from './InclusionsForm';
import { ObjectionsForm } from './ObjectionsForm';
import { StateDrivenFileInput } from './StateDrivenFileInput';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SecondaryDocumentForm = connect(
  {
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    validationErrors: state.validationErrors,
  },
  ({ constants, fileDocumentHelper, form, validationErrors }) => {
    return (
      <React.Fragment>
        <h2 className="margin-top-4">{form.secondaryDocument.documentTitle}</h2>
        <div className="blue-container">
          <div
            className={`usa-form-group ${
              validationErrors.secondaryDocumentFile
                ? 'usa-form-group--error'
                : ''
            } ${
              !fileDocumentHelper.showSecondaryDocumentInclusionsForm &&
              !fileDocumentHelper.secondaryDocument.showObjection
                ? 'margin-bottom-0'
                : ''
            }`}
          >
            <label
              className={
                'usa-label ustc-upload with-hint ' +
                (fileDocumentHelper.showSecondaryDocumentValid
                  ? 'validated'
                  : '')
              }
              htmlFor="secondary-document"
              id="secondary-document-label"
            >
              Upload your document{' '}
              <span className="success-message padding-left-1">
                <FontAwesomeIcon icon="check-circle" size="sm" />
              </span>{' '}
              {fileDocumentHelper.isSecondaryDocumentUploadOptional && (
                <span className="usa-hint">(optional)</span>
              )}
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <StateDrivenFileInput
              aria-describedby="secondary-document-label"
              id="secondary-document"
              name="secondaryDocumentFile"
              updateFormValueSequence="updateFileDocumentWizardFormValueSequence"
              validationSequence="validateExternalDocumentInformationSequence"
            />

            <Text
              bind="validationErrors.secondaryDocumentFile"
              className="usa-error-message"
            />
          </div>

          {fileDocumentHelper.showSecondaryDocumentInclusionsForm && (
            <InclusionsForm
              bind="form.secondaryDocument"
              type="secondaryDocument"
              validationBind="validationErrors.secondaryDocument"
            />
          )}
          {fileDocumentHelper.secondaryDocument.showObjection && (
            <ObjectionsForm
              bind="form.secondaryDocument"
              type="secondaryDocument"
              validationBind="validationErrors.secondaryDocument"
            />
          )}
        </div>
      </React.Fragment>
    );
  },
);
