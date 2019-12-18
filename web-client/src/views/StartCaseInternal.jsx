import { BigHeader } from './BigHeader';
import { Button } from '../ustc-ui/Button/Button';
import { CaseTypeSelect } from './StartCase/CaseTypeSelect';
import { Contacts } from './StartCase/Contacts';
import { ErrorNotification } from './ErrorNotification';
import { FileUploadErrorModal } from './FileUploadErrorModal';
import { FileUploadStatusModal } from './FileUploadStatusModal';
import { Focus } from '../ustc-ui/Focus/Focus';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { ProcedureType } from './StartCase/ProcedureType';
import { ScanBatchPreviewer } from './ScanBatchPreviewer';
import { TrialCityOptions } from './TrialCityOptions';
import { connect } from '@cerebral/react';
import { limitLength } from '../ustc-ui/utils/limitLength';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StartCaseInternal = connect(
  {
    caseTypes: state.caseTypes,
    constants: state.constants,
    documentSelectedForScan: state.documentSelectedForScan,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    scanHelper: state.scanHelper,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    startCaseInternalHelper: state.startCaseInternalHelper,
    startScanSequence: sequences.startScanSequence,
    submitPetitionFromPaperSequence: sequences.submitPetitionFromPaperSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateStartCaseInternalPartyTypeSequence:
      sequences.updateStartCaseInternalPartyTypeSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypes,
    constants,
    documentSelectedForScan,
    form,
    formCancelToggleCancelSequence,
    showModal,
    startCaseInternalHelper,
    submitPetitionFromPaperSequence,
    updateFormValueSequence,
    updateStartCaseInternalPartyTypeSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) => {
    return (
      <>
        <BigHeader text="Create Case" />
        <section className="usa-section grid-container">
          <form
            noValidate
            aria-labelledby="start-case-header"
            role="form"
            onSubmit={e => {
              e.preventDefault();
              submitPetitionFromPaperSequence();
            }}
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <ErrorNotification />
            <div className="grid-row grid-gap">
              <div className="grid-col-12">
                <Focus>
                  <h2 className="margin-bottom-105">Case Information</h2>
                </Focus>
                <p className="margin-bottom-3 margin-top-0 required-statement">
                  *All fields required unless otherwise noted
                </p>
              </div>

              <div className="grid-col-5">
                <div className="blue-container margin-bottom-4 document-detail-one-third">
                  <FormGroup errorText={validationErrors.receivedAt}>
                    <fieldset className="usa-fieldset margin-bottom-0">
                      <legend className="usa-legend" id="date-received-legend">
                        Date received
                      </legend>
                      <div className="usa-memorable-date">
                        <div className="usa-form-group usa-form-group--month margin-bottom-0">
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="month, two digits"
                            className="usa-input usa-input-inline"
                            id="date-received-month"
                            max="12"
                            min="1"
                            name="month"
                            placeholder="MM"
                            type="number"
                            onBlur={() => {
                              validatePetitionFromPaperSequence();
                            }}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: limitLength(e.target.value, 2),
                              });
                            }}
                          />
                        </div>
                        <div className="usa-form-group usa-form-group--day margin-bottom-0">
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="day, two digits"
                            className="usa-input usa-input-inline"
                            id="date-received-day"
                            max="31"
                            min="1"
                            name="day"
                            placeholder="DD"
                            type="number"
                            onBlur={() => {
                              validatePetitionFromPaperSequence();
                            }}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: limitLength(e.target.value, 2),
                              });
                            }}
                          />
                        </div>
                        <div className="usa-form-group usa-form-group--year margin-bottom-0">
                          <input
                            aria-describedby="date-received-legend"
                            aria-label="year, four digits"
                            className="usa-input usa-input-inline"
                            id="date-received-year"
                            max="2100"
                            min="1900"
                            name="year"
                            placeholder="YYYY"
                            type="number"
                            onBlur={() => {
                              validatePetitionFromPaperSequence();
                            }}
                            onChange={e => {
                              updateFormValueSequence({
                                key: e.target.name,
                                value: limitLength(e.target.value, 4),
                              });
                            }}
                          />
                        </div>
                      </div>
                    </fieldset>
                  </FormGroup>

                  <FormGroup errorText={validationErrors.caseCaption}>
                    <label className="usa-label" htmlFor="case-caption">
                      Case caption
                    </label>
                    <textarea
                      className="usa-textarea"
                      id="case-caption"
                      name="caseCaption"
                      onBlur={() => {
                        validatePetitionFromPaperSequence();
                      }}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <p className="margin-top-1">
                      {constants.CASE_CAPTION_POSTFIX}
                    </p>
                  </FormGroup>

                  <CaseTypeSelect
                    allowDefaultOption={true}
                    caseTypes={caseTypes}
                    legend="Notice/case type"
                    validation="validatePetitionFromPaperSequence"
                    value={form.caseType}
                    onChange="updateFormValueSequence"
                  />

                  <ProcedureType
                    legend="Case procedure"
                    value={form.procedureType}
                    onChange={e => {
                      updateFormValueSequence({
                        key: 'procedureType',
                        value: e.target.value,
                      });
                      validatePetitionFromPaperSequence();
                    }}
                  />

                  <FormGroup errorText={validationErrors.preferredTrialCity}>
                    <label className="usa-label" htmlFor="preferred-trial-city">
                      Trial location{' '}
                      <span className="usa-hint">(Required with RQT)</span>
                    </label>
                    <select
                      className="usa-select"
                      id="preferred-trial-city"
                      name="preferredTrialCity"
                      value={form.preferredTrialCity}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validatePetitionFromPaperSequence();
                      }}
                    >
                      <option value="">- Select -</option>
                      <TrialCityOptions />
                    </select>
                  </FormGroup>

                  <FormGroup errorText={validationErrors.partyType}>
                    <label className="usa-label" htmlFor="party-type">
                      Party type
                    </label>
                    <select
                      className="usa-select"
                      id="party-type"
                      name="partyType"
                      value={form.partyType}
                      onChange={e => {
                        updateStartCaseInternalPartyTypeSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validatePetitionFromPaperSequence();
                      }}
                    >
                      <option value="">- Select -</option>
                      {Object.keys(startCaseInternalHelper.partyTypes).map(
                        partyType => (
                          <option
                            key={partyType}
                            value={
                              startCaseInternalHelper.partyTypes[partyType]
                            }
                          >
                            {startCaseInternalHelper.partyTypes[partyType]}
                          </option>
                        ),
                      )}
                    </select>
                  </FormGroup>

                  {(startCaseInternalHelper.showPrimaryContact ||
                    startCaseInternalHelper.showSecondaryContact) && (
                    <div className="subsection contacts">
                      <Contacts
                        bind="form"
                        contactsHelper="startCaseInternalContactsHelper"
                        emailBind="form.contactPrimary"
                        parentView="StartCaseInternal"
                        showPrimaryContact={
                          startCaseInternalHelper.showPrimaryContact
                        }
                        showSecondaryContact={
                          startCaseInternalHelper.showSecondaryContact
                        }
                        onBlur="validatePetitionFromPaperSequence"
                        onChange="updateFormValueSequence"
                      />
                    </div>
                  )}
                </div>
                <Button id="submit-case" type="submit">
                  Create Case
                </Button>
                <Button
                  link
                  onClick={() => {
                    formCancelToggleCancelSequence();
                    return false;
                  }}
                >
                  Cancel
                </Button>
              </div>

              <div className="grid-col-7">
                <ScanBatchPreviewer
                  documentTabs={[
                    {
                      documentType: 'petitionFile',
                      title: 'Petition',
                    },
                    {
                      documentType: 'stinFile',
                      title: 'STIN',
                    },
                    {
                      documentType: 'requestForPlaceOfTrialFile',
                      title: 'RQT',
                    },
                    {
                      documentType: 'ownershipDisclosureFile',
                      title: 'ODS',
                    },
                    {
                      documentType: 'applicationForWaiverOfFilingFeeFile',
                      title: 'APW',
                    },
                  ]}
                  documentType={documentSelectedForScan}
                  title="Add Document(s)"
                />
              </div>
            </div>
          </form>
          {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
          {showModal === 'FileUploadErrorModal' && (
            <FileUploadErrorModal
              confirmSequence={submitPetitionFromPaperSequence}
            />
          )}
        </section>
      </>
    );
  },
);
