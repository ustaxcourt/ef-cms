import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { CharactersRemainingHint } from '../../ustc-ui/CharactersRemainingHint/CharactersRemainingHint';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerUserHeader } from './PractitionerUserHeader';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PractitionerAddEditDocument = connect(
  {
    constants: state.constants,
    documentTypes: state.constants.PRACTITIONER_DOCUMENT_TYPES,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    isEditingPractitionerDocument: state.isEditingPractitionerDocument,
    practitionerDocumentationFormHelper:
      state.practitionerDocumentationFormHelper,
    showModal: state.modal.showModal,
    submitAddPractitionerDocumentSequence:
      sequences.submitAddPractitionerDocumentSequence,
    submitEditPractitionerDocumentSequence:
      sequences.submitEditPractitionerDocumentSequence,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
    validateAddPractitionerDocumentSequence:
      sequences.validateAddPractitionerDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function PractitionerAddEditDocument({
    constants,
    documentTypes,
    form,
    formCancelToggleCancelSequence,
    practitionerDocumentationFormHelper,
    showModal,
    submitAddPractitionerDocumentSequence,
    submitEditPractitionerDocumentSequence,
    usStates,
    usStatesOther,
    validateAddPractitionerDocumentSequence,
    validationErrors,
  }) {
    return (
      <>
        <PractitionerUserHeader />

        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <h1 className="margin-bottom-1">
            {form.isEditingDocument ? 'Edit' : 'Add'} File
          </h1>
          <div className="grid-row margin-bottom-4">
            <div className="grid-col-12">
              <p>All fields required unless otherwise noted</p>
              <h2>Practitioner File Information</h2>
              <div className="blue-container">
                <div className="grid-row grid-gap">
                  <div className="grid-col-5">
                    <FormGroup
                      errorText={validationErrors.practitionerDocumentFile}
                    >
                      <label
                        className={classNames(
                          'usa-label ustc-upload with-hint',
                        )}
                        htmlFor="practitioner-document-file"
                        id="practitioner-document-label"
                      >
                        Upload your file{' '}
                      </label>
                      <span className="usa-hint">
                        File must be in PDF format (.pdf), MS-Word (.doc, .docx)
                        or an image file (.jpg, .jpeg, .png). Max file size{' '}
                        {constants.MAX_FILE_SIZE_MB}MB.
                      </span>
                      <StateDrivenFileInput
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                        aria-describedby="practitioner-document-file-label"
                        id="practitioner-document-file"
                        name="practitionerDocumentFile"
                        updateFormValueSequence="updateFormValueSequence"
                        validationSequence="validateAddPractitionerDocumentSequence"
                      />
                    </FormGroup>
                    <FormGroup errorText={validationErrors.categoryType}>
                      <label
                        className="usa-label"
                        htmlFor="category-type"
                        id="category-type-label"
                      >
                        Category
                      </label>
                      <BindedSelect
                        aria-describedby="documentation-category-label"
                        aria-label="documentation category dropdown"
                        bind="form.categoryType"
                        id="category-type"
                        name="categoryType"
                        onChange={validateAddPractitionerDocumentSequence}
                      >
                        <option value="">-- Select --</option>
                        {documentTypes.map(fileType => (
                          <option key={fileType} value={fileType}>
                            {fileType}
                          </option>
                        ))}
                      </BindedSelect>
                    </FormGroup>
                    {practitionerDocumentationFormHelper.isCertificateOfGoodStanding && (
                      <FormGroup errorText={validationErrors.location}>
                        <label
                          className="usa-label"
                          htmlFor="location"
                          id="location-label"
                        >
                          State/Territory
                        </label>
                        <BindedSelect
                          aria-describedby="location"
                          aria-label="documentation location dropdown"
                          bind="form.location"
                          className="usa-input"
                          id="location"
                          name="location"
                          onChange={validateAddPractitionerDocumentSequence}
                        >
                          <option value="">- Select -</option>
                          <optgroup label="State">
                            {Object.keys(usStates).map(abbrev => {
                              const fullStateName = usStates[abbrev];
                              return (
                                <option
                                  key={fullStateName}
                                  value={fullStateName}
                                >
                                  {fullStateName}
                                </option>
                              );
                            })}
                          </optgroup>
                          <optgroup label="Other">
                            {Object.keys(usStatesOther).map(abbrev => {
                              const fullOtherStateName = usStatesOther[abbrev];
                              return (
                                <option
                                  key={fullOtherStateName}
                                  value={fullOtherStateName}
                                >
                                  {fullOtherStateName}
                                </option>
                              );
                            })}
                          </optgroup>
                        </BindedSelect>
                      </FormGroup>
                    )}
                    <FormGroup>
                      <label
                        className="usa-label"
                        htmlFor="documentation-notes"
                        id="documentation-notes-label"
                      >
                        Description <span className="usa-hint">(optional)</span>
                      </label>
                      <BindedTextarea
                        bind="form.description"
                        id="documentation-notes"
                        maxLength={
                          constants.MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS
                        }
                        required={false}
                      ></BindedTextarea>
                      <CharactersRemainingHint
                        maxCharacters={
                          constants.MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS
                        }
                        stringToCount={form.description}
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="grid-row margin-bottom-6 margin-top-5">
                <div className="grid-col-12">
                  {form.isEditingDocument ? (
                    <Button
                      onClick={() => {
                        submitEditPractitionerDocumentSequence();
                      }}
                    >
                      Update File
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        submitAddPractitionerDocumentSequence();
                      }}
                    >
                      Add File
                    </Button>
                  )}
                  <Button
                    link
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>

                  {showModal === 'FormCancelModalDialog' && (
                    <FormCancelModalDialog onCancelSequence="closeModalAndReturnToPractitionerDocumentsPageSequence" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

PractitionerAddEditDocument.displayName = 'PractitionerAddEditDocument';
