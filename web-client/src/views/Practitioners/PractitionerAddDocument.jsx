import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { PractitionerUserHeader } from './PractitionerUserHeader';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@cerebral/react';
import { /*props, sequences,*/ state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PractitionerAddDocument = connect(
  {
    constants: state.constants,
    documentTypes: state.constants.PRACTITIONER_DOCUMENT_TYPES,
    navigateBackSequence: state.navigateBackSequence,
    practitionerDocumentationHelper: state.practitionerDocumentationHelper,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
  },
  function PractitionerAddDocument({
    constants,
    documentTypes,
    navigateBackSequence,
    practitionerDocumentationHelper,
    usStates,
    usStatesOther,
  }) {
    return (
      <>
        <PractitionerUserHeader />

        <section className="grid-container">
          <h1 className="margin-bottom-1">Add File</h1>
          <div className="grid-row margin-bottom-4">
            <div className="grid-col-12">
              <p>All fields required unless otherwise noted</p>
              <h2>Practitioner File Information</h2>
              <div className="blue-container">
                <div className="grid-row grid-gap">
                  <div className="grid-col-5">
                    <FormGroup>
                      <label
                        className={classNames(
                          'usa-label ustc-upload with-hint',
                        )}
                        htmlFor="primary-document-file"
                        id="primary-document-label"
                      >
                        Upload your file{' '}
                      </label>
                      <span className="usa-hint">
                        File must be in PDF format (.pdf), MS-Word (.doc, .docx)
                        or an image file (.jpg, .png). Max file size{' '}
                        {constants.MAX_FILE_SIZE_MB}MB.
                      </span>
                      <StateDrivenFileInput
                        aria-describedby="ownership-disclosure-file-label"
                        id="ownership-disclosure-file"
                        name="ownershipDisclosureFile"
                        updateFormValueSequence="updateStartCaseFormValueSequence"
                        validationSequence="validateStartCaseWizardSequence"
                      />
                    </FormGroup>
                    <FormGroup>
                      <label
                        className="usa-label"
                        htmlFor="documentation-category"
                        id="documentation-category-label"
                      >
                        Category
                      </label>
                      <BindedSelect
                        aria-describedby="documentation-category-label"
                        aria-label="documentation category dropdown"
                        bind="screenMetadata.documentationCategoryDropdown.documentationCategory"
                        id="documentation-category"
                        name="documentationCategory"
                      >
                        <option value="">-- Select --</option>
                        {documentTypes.map(fileType => (
                          <option key={fileType} value={fileType}>
                            {fileType}
                          </option>
                        ))}
                      </BindedSelect>
                    </FormGroup>
                    {practitionerDocumentationHelper.isCertificateOfGoodStanding && (
                      <FormGroup>
                        <label
                          className="usa-label"
                          htmlFor="documentation-location"
                          id="documentation-location-label"
                        >
                          State/Territory
                        </label>
                        <BindedSelect
                          aria-describedby="documentation-location"
                          aria-label="documentation location dropdown"
                          bind="screenMetadata.documentationLocationDropdown.documentationLocation"
                          className="usa-input"
                          id="documentation-location"
                          name="documentationLocation"
                        >
                          <option value="">- Select -</option>
                          <optgroup label="State">
                            {Object.keys(usStates).map(abbrev => {
                              const fullStateName = usStates[abbrev];
                              return (
                                <option key={fullStateName} value={abbrev}>
                                  {fullStateName}
                                </option>
                              );
                            })}
                          </optgroup>
                          <optgroup label="Other">
                            {usStatesOther.map(abbrev => {
                              return (
                                <option key={abbrev} value={abbrev}>
                                  {abbrev}
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
                        Description (optional)
                      </label>
                      <BindedTextarea
                        id="documentation-notes"
                        required={false}
                      ></BindedTextarea>
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="grid-row margin-bottom-6 margin-top-5">
                <div className="grid-col-12">
                  <Button>Add File</Button>
                  <Button link onClick={() => navigateBackSequence()}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
