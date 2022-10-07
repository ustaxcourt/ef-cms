import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@cerebral/react';
import { /*props, sequences,*/ state } from 'cerebral';
import React from 'react';

export const PractitionerAddDocument = connect(
  {
    documentTypes: state.constants.PRACTITIONER_DOCUMENT_TYPES,
    usStates: state.constants.US_STATES,
    usStatesOther: state.constants.US_STATES_OTHER,
  },
  function PractitionerAddDocument({ documentTypes, usStates, usStatesOther }) {
    console.log(documentTypes);
    return (
      <>
        <div className="grid-row margin-bottom-4">
          <div className="grid-col-12">
            <p>All fields required unless otherwise noted</p>
            <h2>Practitioner File Information</h2>
            <div className="blue-container">
              <div className="grid-row grid-gap">
                <div className="grid-col-3">
                  <FormGroup>
                    <p>Upload your file</p>
                    <p>Max file size 250MB</p>
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
                      className="dropdown-label-serif margin-right-3 padding-top-05"
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
            <Button>Add File</Button>
            <Button>Cancel</Button>
          </div>
        </div>
      </>
    );
  },
);
