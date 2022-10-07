import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerAddDocument = connect(
  {},
  function PractitionerAddDocument() {
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
                    <BindedSelect></BindedSelect>
                    <BindedTextarea></BindedTextarea>
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
