import { Button } from '../../ustc-ui/Button/Button';
import { Contacts } from './Contacts';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { SpousePermissionConfirmModal } from './SpousePermissionConfirmModal';
import { StateDrivenFileInput } from '../FileDocument/StateDrivenFileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const StartCaseStep3 = connect(
  {
    PARTY_TYPES: state.constants.PARTY_TYPES,
    completeStartCaseWizardStepSequence:
      sequences.completeStartCaseWizardStepSequence,
    constants: state.constants,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateBackSequence: sequences.navigateBackSequence,
    showModal: state.modal.showModal,
    startCaseHelper: state.startCaseHelper,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence: sequences.validateStartCaseWizardSequence,
    validationErrors: state.validationErrors,
  },
  function StartCaseStep3({
    completeStartCaseWizardStepSequence,
    constants,
    form,
    formCancelToggleCancelSequence,
    navigateBackSequence,
    PARTY_TYPES,
    showModal,
    startCaseHelper,
    updateStartCaseFormValueSequence,
    validateStartCaseWizardSequence,
    validationErrors,
  }) {
    return (
      <>
        <Focus>
          <h2 className="focusable margin-bottom-105" tabIndex={-1}>
            3. Who Are You Filing This Petition For?
          </h2>
        </Focus>
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <div className="blue-container grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-5">
              <div
                className={classNames(
                  validationErrors.filingType && 'usa-form-group--error',
                )}
              >
                <fieldset
                  className="usa-fieldset usa-sans"
                  id="filing-type-radios"
                >
                  <legend id="filing-type-legend">
                    I am filing this petition on behalf of …
                  </legend>
                  {startCaseHelper.filingTypes.map((filingType, idx) => (
                    <div className="usa-radio" key={filingType}>
                      <input
                        aria-describedby="filing-type-legend"
                        checked={form.filingType === filingType}
                        className="usa-radio__input"
                        data-type={filingType}
                        id={filingType}
                        name="filingType"
                        type="radio"
                        value={filingType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        data-testid={`filing-type-${idx}`}
                        htmlFor={filingType}
                        id={`filing-type-${idx}`}
                      >
                        {filingType}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            </div>
          </div>

          {startCaseHelper.showPetitionerDeceasedSpouseForm && (
            <div
              className={classNames(
                'ustc-secondary-question',
                validationErrors.partyType && 'usa-form-group--error',
              )}
            >
              <fieldset
                className="usa-fieldset usa-sans"
                id="deceased-spouse-radios"
              >
                <legend id="deceased-spouse-legend">
                  {startCaseHelper.deceasedSpouseLegend}
                </legend>
                {['Yes', 'No'].map((isSpouseDeceased, idx) => (
                  <div
                    className="usa-radio usa-radio__inline"
                    key={isSpouseDeceased}
                  >
                    <input
                      aria-describedby="deceased-spouse-radios"
                      checked={form.isSpouseDeceased === isSpouseDeceased}
                      className="usa-radio__input"
                      id={`isSpouseDeceased-${isSpouseDeceased}`}
                      name="isSpouseDeceased"
                      type="radio"
                      value={isSpouseDeceased}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`is-spouse-deceased-${idx}`}
                      htmlFor={`isSpouseDeceased-${isSpouseDeceased}`}
                      id={`is-spouse-deceased-${idx}`}
                    >
                      {isSpouseDeceased}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showBusinessFilingTypeOptions && (
            <div
              className={classNames(
                'ustc-secondary-question',
                validationErrors.partyType && 'usa-form-group--error',
              )}
            >
              <fieldset className="usa-fieldset" id="business-type-radios">
                <legend id="business-type-legend">
                  What type of business are you filing for?
                </legend>
                {[
                  constants.BUSINESS_TYPES.corporation,
                  constants.BUSINESS_TYPES.partnershipAsTaxMattersPartner,
                  constants.BUSINESS_TYPES.partnershipOtherThanTaxMatters,
                  constants.BUSINESS_TYPES.partnershipBBA,
                ].map((businessType, idx) => (
                  <div className="usa-radio" key={businessType}>
                    <input
                      aria-describedby="business-type-legend"
                      checked={form.businessType === businessType}
                      className="usa-radio__input"
                      id={`businessType-${businessType}`}
                      name="businessType"
                      type="radio"
                      value={businessType}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`businessType-${businessType}`}
                      id={`is-business-type-${idx}`}
                    >
                      {businessType}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showOtherFilingTypeOptions && (
            <div
              className={classNames(
                'ustc-secondary-question',
                validationErrors.partyType && 'usa-form-group--error',
              )}
            >
              <fieldset className="usa-fieldset" id="other-type-radios">
                <legend id="other-type-legend">
                  What other type of taxpayer are you filing for?
                </legend>
                {[
                  'An estate or trust',
                  'A minor or legally incompetent person',
                  PARTY_TYPES.donor,
                  PARTY_TYPES.transferee,
                  'Deceased Spouse',
                ].map((otherType, idx) => (
                  <div className="usa-radio" key={otherType}>
                    <input
                      aria-describedby="other-type-legend"
                      checked={form.otherType === otherType}
                      className="usa-radio__input"
                      id={`otherType-${otherType}`}
                      name="otherType"
                      type="radio"
                      value={otherType}
                      onChange={e => {
                        updateStartCaseFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateStartCaseWizardSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`otherType-${otherType}`}
                      id={`is-other-type-${idx}`}
                    >
                      {otherType}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          )}
          {startCaseHelper.showOtherFilingTypeOptions &&
            startCaseHelper.showEstateFilingOptions && (
              <div
                className={classNames(
                  'ustc-secondary-question',
                  validationErrors.partyType && 'usa-form-group--error',
                )}
              >
                <fieldset
                  className="usa-fieldset usa-sans"
                  id="estate-type-radios"
                >
                  <legend id="estate-type-legend">
                    What type of estate or trust are you filing for?
                  </legend>
                  {[
                    constants.ESTATE_TYPES.estate,
                    constants.ESTATE_TYPES.estateWithoutExecutor,
                    constants.ESTATE_TYPES.trust,
                  ].map((estateType, idx) => (
                    <div className="usa-radio" key={estateType}>
                      <input
                        aria-describedby="estate-type-legend"
                        checked={form.estateType === estateType}
                        className="usa-radio__input"
                        id={`estateType-${estateType}`}
                        name="estateType"
                        type="radio"
                        value={estateType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`estateType-${estateType}`}
                        id={`is-estate-type-${idx}`}
                      >
                        {estateType}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </div>
            )}
          {startCaseHelper.showOtherFilingTypeOptions &&
            startCaseHelper.showMinorIncompetentFilingOptions && (
              <FormGroup
                className="ustc-secondary-question"
                errorText={validationErrors.partyType}
              >
                <fieldset
                  className="usa-fieldset"
                  id="minorIncompetent-type-radios"
                >
                  <legend id="minorIncompetent-type-legend">
                    {startCaseHelper.minorIncompetentLegend}
                  </legend>
                  {[
                    constants.OTHER_TYPES.conservator,
                    constants.OTHER_TYPES.guardian,
                    constants.OTHER_TYPES.custodian,
                    constants.OTHER_TYPES.nextFriendForMinor,
                    constants.OTHER_TYPES.nextFriendForIncompetentPerson,
                  ].map((minorIncompetentType, idx) => (
                    <div className="usa-radio" key={minorIncompetentType}>
                      <input
                        aria-describedby="minorIncompetent-type-legend"
                        checked={
                          form.minorIncompetentType === minorIncompetentType
                        }
                        className="usa-radio__input"
                        id={`minorIncompetentType-${minorIncompetentType}`}
                        name="minorIncompetentType"
                        type="radio"
                        value={minorIncompetentType}
                        onChange={e => {
                          updateStartCaseFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                          validateStartCaseWizardSequence();
                        }}
                      />
                      <label
                        className="usa-radio__label"
                        htmlFor={`minorIncompetentType-${minorIncompetentType}`}
                        id={`is-minorIncompetent-type-${idx}`}
                      >
                        {minorIncompetentType}
                      </label>
                    </div>
                  ))}
                </fieldset>
              </FormGroup>
            )}
        </div>

        <Contacts
          bind="form"
          contactsHelper="contactsHelper"
          parentView="StartCase"
          showPrimaryContact={startCaseHelper.showPrimaryContact}
          showSecondaryContact={startCaseHelper.showSecondaryContact}
          useSameAsPrimary={true}
          onBlur="validateStartCaseWizardSequence"
          onChange="updateFormValueSequence"
        />

        {startCaseHelper.showCorporateDisclosure && (
          <>
            <h2 className="margin-top-4">Corporate Disclosure Statement</h2>
            <Hint>
              <a
                href="https://ustaxcourt.gov/rules.html"
                rel="noreferrer"
                target="_blank"
              >
                Tax Court Rule 60
              </a>{' '}
              requires a corporation, partnership, or limited liability company
              filing a Petition with the Court to also file a Corporate
              Disclosure Statement (CDS).
            </Hint>
            <div className="blue-container">
              <FormGroup
                errorText={
                  validationErrors.corporateDisclosureFile ||
                  validationErrors.corporateDisclosureFileSize
                }
              >
                <label
                  className={classNames(
                    'ustc-upload-cds usa-label with-hint',
                    startCaseHelper.showCorporateDisclosureValid && 'validated',
                  )}
                  htmlFor="corporate-disclosure-file"
                  id="corporate-disclosure-file-label"
                >
                  Upload your Corporate Disclosure Statement
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <p className="margin-top-0">
                  <Button
                    link
                    className="usa-link--external text-left  mobile-text-wrap"
                    href="https://www.ustaxcourt.gov/resources/forms/Corporate_Disclosure_Statement_Form.pdf"
                    icon="file-pdf"
                    iconColor="blue"
                    overrideMargin="margin-right-1"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Download Corporate Disclosure Statement (T.C. Form 6)
                  </Button>
                  <span className="margin-top-0 display-block">
                    if you haven’t already done so
                  </span>
                </p>
                <StateDrivenFileInput
                  aria-describedby="corporate-disclosure-file-label"
                  id="corporate-disclosure-file"
                  name="corporateDisclosureFile"
                  updateFormValueSequence="updateStartCaseFormValueSequence"
                  validationSequence="validateStartCaseWizardSequence"
                />
              </FormGroup>
            </div>
          </>
        )}

        <div className="margin-top-5">
          <Button
            data-testid="complete-step-3"
            id="submit-case"
            onClick={() => {
              completeStartCaseWizardStepSequence({ nextStep: 4 });
            }}
          >
            Continue to Step 4 of 5
          </Button>
          <Button secondary onClick={() => navigateBackSequence()}>
            Back
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
        {showModal === 'SpousePermissionConfirmModal' && (
          <SpousePermissionConfirmModal />
        )}
      </>
    );
  },
);

StartCaseStep3.displayName = 'StartCaseStep3';
