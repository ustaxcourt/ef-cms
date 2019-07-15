import { CaseDifferenceExplained } from './CaseDifferenceExplained';
import { CaseTypeSelect } from './StartCase/CaseTypeSelect';
import { Contacts } from './StartCase/Contacts';
import { ErrorNotification } from './ErrorNotification';
import { FileUploadErrorModal } from './FileUploadErrorModal';
import { FileUploadStatusModal } from './FileUploadStatusModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { Hint } from '../ustc-ui/Hint/Hint';
import { ProcedureType } from './StartCase/ProcedureType';
import { Text } from '../ustc-ui/Text/Text';
import { TrialCity } from './StartCase/TrialCity';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';

import React from 'react';

export const StartCase = connect(
  {
    caseTypeDescriptionHelper: state.caseTypeDescriptionHelper,
    clearPreferredTrialCitySequence: sequences.clearPreferredTrialCitySequence,
    constants: state.constants,
    filingTypes: state.filingTypes,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
    submitFilePetitionSequence: sequences.submitFilePetitionSequence,
    toggleCaseDifferenceSequence: sequences.toggleCaseDifferenceSequence,
    trialCitiesHelper: state.trialCitiesHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateHasIrsNoticeFormValueSequence:
      sequences.updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence: sequences.updatePetitionValueSequence,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    validateStartCaseSequence: sequences.validateStartCaseSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseTypeDescriptionHelper,
    clearPreferredTrialCitySequence,
    constants,
    filingTypes,
    form,
    formCancelToggleCancelSequence,
    screenMetadata,
    showModal,
    startCaseHelper,
    submitFilePetitionSequence,
    toggleCaseDifferenceSequence,
    trialCitiesHelper,
    updateFormValueSequence,
    updateHasIrsNoticeFormValueSequence,
    updatePetitionValueSequence,
    updateStartCaseFormValueSequence,
    validateStartCaseSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex="-1">
                  <span className="hide-on-mobile">File a Petition</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <form
            noValidate
            aria-labelledby="start-case-header"
            className="usa-form maxw-none"
            role="form"
            onSubmit={e => {
              e.preventDefault();
              submitFilePetitionSequence();
            }}
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
            )}
            <ErrorNotification />
            <h1
              className="margin-bottom-05"
              id="start-case-header"
              tabIndex="-1"
            >
              Start a Case
            </h1>
            <p className="required-statement margin-top-05 margin-bottom-5">
              All fields required unless otherwise noted
            </p>
            <h2>Upload Your Petition to Start Your Case</h2>

            <div className="blue-container grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-7 push-right">
                  <Hint>
                    This should include your Petition form and any IRS notice
                    <span aria-hidden="true">(s)</span> you received.
                  </Hint>
                </div>
                <div className="mobile-lg:grid-col-5">
                  <div
                    className={`usa-form-group ${
                      validationErrors.petitionFile
                        ? 'usa-form-group--error'
                        : ''
                    }`}
                  >
                    <label
                      className={
                        'usa-label ustc-upload-petition with-hint ' +
                        (startCaseHelper.showPetitionFileValid
                          ? 'validated'
                          : '')
                      }
                      htmlFor="petition-file"
                    >
                      Upload Your Petition{' '}
                      <span className="success-message">
                        <FontAwesomeIcon icon="check-circle" size="1x" />
                      </span>
                    </label>
                    <span className="usa-hint">
                      File must be in PDF format (.pdf). Max file size{' '}
                      {constants.MAX_FILE_SIZE_MB}MB.
                    </span>
                    <input
                      accept=".pdf"
                      aria-describedby="petition-hint"
                      className="usa-input"
                      id="petition-file"
                      name="petitionFile"
                      type="file"
                      onChange={e => {
                        limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                          updatePetitionValueSequence({
                            key: e.target.name,
                            value: e.target.files[0],
                          });
                          updatePetitionValueSequence({
                            key: `${e.target.name}Size`,
                            value: e.target.files[0].size,
                          });
                          validateStartCaseSequence();
                        });
                      }}
                    />
                    <Text
                      bind="validationErrors.petitionFile"
                      className="usa-error-message"
                    />
                    <Text
                      bind="validationErrors.petitionFileSize"
                      className="usa-error-message"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="margin-top-4">
              Upload Your Statement of Taxpayer Identification
            </h2>
            <div className="blue-container">
              <div
                className={`usa-form-group ${
                  validationErrors.stinFile ? 'usa-form-group--error' : ''
                }`}
              >
                <label
                  className={
                    'usa-label ustc-upload-stin with-hint ' +
                    (startCaseHelper.showStinFileValid ? 'validated' : '')
                  }
                  htmlFor="stin-file"
                >
                  Upload Your Statement of Taxpayer Identification
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="1x" />
                  </span>
                </label>
                <span className="usa-hint">
                  File must be in PDF format (.pdf). Max file size{' '}
                  {constants.MAX_FILE_SIZE_MB}MB.
                </span>
                <input
                  accept=".pdf"
                  className="usa-input"
                  id="stin-file"
                  name="stinFile"
                  type="file"
                  onChange={e => {
                    limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                      updatePetitionValueSequence({
                        key: e.target.name,
                        value: e.target.files[0],
                      });
                      updatePetitionValueSequence({
                        key: `${e.target.name}Size`,
                        value: e.target.files[0].size,
                      });
                      validateStartCaseSequence();
                    });
                  }}
                />
                <Text
                  bind="validationErrors.stinFile"
                  className="usa-error-message"
                />
                <Text
                  bind="validationErrors.stinFileSize"
                  className="usa-error-message"
                />
              </div>
            </div>

            <h2 className="margin-top-4">Who is Filing This Case?</h2>
            <div className="blue-container grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div className="mobile-lg:grid-col-7 push-right">
                  <Hint>
                    To file a case on behalf of another taxpayer, you must be
                    authorized to litigate in this Court as provided by the Tax
                    Court Rules of Practice and Procedure (Rule 60). Enrolled
                    agents, certified public accountants, and powers of attorney
                    who are not admitted to practice before the Court are not
                    eligible to represent taxpayers.
                  </Hint>
                </div>
                <div className="mobile-lg:grid-col-5">
                  <div
                    className={
                      validationErrors.filingType ? 'usa-form-group--error' : ''
                    }
                  >
                    <fieldset
                      className="usa-fieldset usa-sans"
                      id="filing-type-radios"
                    >
                      <legend htmlFor="filing-type-radios">
                        I am filing this petition on behalf of …
                      </legend>
                      {filingTypes.map((filingType, idx) => (
                        <div className="usa-radio" key={filingType}>
                          <input
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
                              validateStartCaseSequence();
                            }}
                          />
                          <label
                            className="usa-radio__label"
                            htmlFor={filingType}
                            id={`filing-type-${idx}`}
                          >
                            {filingType}
                          </label>
                        </div>
                      ))}
                      <Text
                        bind="validationErrors.partyType"
                        className="usa-error-message"
                      />
                    </fieldset>
                  </div>
                </div>
              </div>

              {startCaseHelper.showPetitionerDeceasedSpouseForm && (
                <div
                  className={
                    'ustc-secondary-question ' +
                    (validationErrors.partyType ? 'usa-form-group--error' : '')
                  }
                >
                  <fieldset
                    className="usa-fieldset usa-sans"
                    id="deceased-spouse-radios"
                  >
                    <legend htmlFor="deceased-spouse-radios">
                      {startCaseHelper.deceasedSpouseLegend}
                    </legend>
                    {['Yes', 'No'].map((isSpouseDeceased, idx) => (
                      <div
                        className="usa-radio usa-radio__inline"
                        key={isSpouseDeceased}
                      >
                        <input
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
                            validateStartCaseSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
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
                  className={
                    'ustc-secondary-question ' +
                    (validationErrors.partyType ? 'usa-form-group--error' : '')
                  }
                >
                  <fieldset className="usa-fieldset" id="business-type-radios">
                    <legend htmlFor="business-type-radios">
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
                            validateStartCaseSequence();
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
                  className={
                    'ustc-secondary-question ' +
                    (validationErrors.partyType ? 'usa-form-group--error' : '')
                  }
                >
                  <fieldset className="usa-fieldset" id="other-type-radios">
                    <legend htmlFor="other-type-radios">
                      What other type of taxpayer are you filing for?
                    </legend>
                    {[
                      'An estate or trust',
                      'A minor or legally incompetent person',
                      'Donor',
                      'Transferee',
                      'Deceased Spouse',
                    ].map((otherType, idx) => (
                      <div className="usa-radio" key={otherType}>
                        <input
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
                            validateStartCaseSequence();
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
                    className={
                      'ustc-secondary-question ' +
                      (validationErrors.partyType
                        ? 'usa-form-group--error'
                        : '')
                    }
                  >
                    <fieldset
                      className="usa-fieldset usa-sans"
                      id="estate-type-radios"
                    >
                      <legend htmlFor="estate-type-radios">
                        What type of estate or trust are you filing for?
                      </legend>
                      {[
                        constants.ESTATE_TYPES.estate,
                        constants.ESTATE_TYPES.estateWithoutExecutor,
                        constants.ESTATE_TYPES.trust,
                      ].map((estateType, idx) => (
                        <div className="usa-radio" key={estateType}>
                          <input
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
                              validateStartCaseSequence();
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
                  <div
                    className={
                      'ustc-secondary-question ' +
                      (validationErrors.partyType
                        ? 'usa-form-group--error'
                        : '')
                    }
                  >
                    <fieldset
                      className="usa-fieldset"
                      id="minorIncompetent-type-radios"
                    >
                      <legend htmlFor="minorIncompetent-type-radios">
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
                              validateStartCaseSequence();
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
                  </div>
                )}
            </div>

            <Contacts
              bind="form"
              contactsHelper="contactsHelper"
              emailBind="user"
              parentView="StartCase"
              showPrimaryContact={startCaseHelper.showPrimaryContact}
              showSecondaryContact={startCaseHelper.showSecondaryContact}
              onBlur="validateStartCaseSequence"
              onChange="updateFormValueSequence"
            />

            {/*start ods*/}
            {startCaseHelper.showOwnershipDisclosure && (
              <>
                <h2 className="margin-top-4">Ownership Disclosure Statement</h2>
                <p>
                  Tax Court Rules of Practice and Procedure (Rule 60) requires a
                  corporation, partnership, or limited liability company, filing
                  a Petition with the Court to also file an Ownership Disclosure
                  Statement (ODS). Complete your{' '}
                  <a
                    href="https://www.ustaxcourt.gov/forms/Ownership_Disclosure_Statement_Form_6.pdf"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Ownership Disclosure Statement Form 6
                  </a>
                  .
                </p>
                <div className="blue-container">
                  <label
                    className={
                      'ustc-upload-ods usa-label with-hint ' +
                      (startCaseHelper.showOwnershipDisclosureValid
                        ? 'validated'
                        : '')
                    }
                    htmlFor="ownership-disclosure-file"
                  >
                    Upload your Ownership Disclosure Statement
                    <span className="success-message">
                      <FontAwesomeIcon icon="check-circle" size="1x" />
                    </span>
                  </label>
                  <span className="usa-hint">
                    File must be in PDF format (.pdf). Max file size{' '}
                    {constants.MAX_FILE_SIZE_MB}MB.
                  </span>
                  <input
                    accept=".pdf"
                    className="usa-input"
                    id="ownership-disclosure-file"
                    name="ownershipDisclosureFile"
                    type="file"
                    onChange={e => {
                      limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                        updatePetitionValueSequence({
                          key: e.target.name,
                          value: e.target.files[0],
                        });
                        updatePetitionValueSequence({
                          key: `${e.target.name}Size`,
                          value: e.target.files[0].size,
                        });
                        validateStartCaseSequence();
                      });
                    }}
                  />
                  <Text
                    bind="validationErrors.ownershipDisclosureFile"
                    className="usa-error-message"
                  />
                  <Text
                    bind="validationErrors.ownershipDisclosureFileSize"
                    className="usa-error-message"
                  />
                </div>
              </>
            )}

            <h2 className="margin-top-4">What Kind of Case Are You Filing?</h2>
            <div className="blue-container">
              <div className="usa-form-group">
                <fieldset
                  className={
                    'usa-fieldset ' +
                    (validationErrors.hasIrsNotice
                      ? 'usa-form-group--error'
                      : '')
                  }
                  id="irs-notice-radios"
                >
                  <legend className="usa-legend">
                    {startCaseHelper.noticeLegend}
                  </legend>
                  <div className="usa-form-group">
                    {['Yes', 'No'].map((hasIrsNotice, idx) => (
                      <div
                        className="usa-radio usa-radio__inline"
                        key={hasIrsNotice}
                      >
                        <input
                          className="usa-radio__input"
                          id={`hasIrsNotice-${hasIrsNotice}`}
                          name="hasIrsNotice"
                          type="radio"
                          value={hasIrsNotice === 'Yes'}
                          onChange={e => {
                            updateHasIrsNoticeFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'true',
                            });
                            validateStartCaseSequence();
                          }}
                        />
                        <label
                          className="usa-radio__label"
                          htmlFor={`hasIrsNotice-${hasIrsNotice}`}
                          id={`hasIrsNotice-${idx}`}
                        >
                          {hasIrsNotice}
                        </label>
                      </div>
                    ))}
                    <Text
                      bind="validationErrors.hasIrsNotice"
                      className="usa-error-message"
                    />
                  </div>
                </fieldset>

                {startCaseHelper.showHasIrsNoticeOptions && (
                  <React.Fragment>
                    <CaseTypeSelect
                      allowDefaultOption={true}
                      caseTypes={caseTypeDescriptionHelper.caseTypes}
                      legend="Type of Notice / Case"
                      validation="validateStartCaseSequence"
                      onChange="updateFormValueSequence"
                    />
                    <div
                      className={
                        'usa-form-group' +
                        (validationErrors.irsNoticeDate
                          ? ' usa-form-group--error'
                          : '')
                      }
                    >
                      <fieldset className="usa-fieldset">
                        <legend
                          className="usa-legend"
                          id="date-of-notice-legend"
                        >
                          Date of Notice
                        </legend>
                        <div className="usa-memorable-date">
                          <div className="usa-form-group usa-form-group--month">
                            <label
                              aria-hidden="true"
                              htmlFor="date-of-notice-month"
                            >
                              MM
                            </label>
                            <input
                              aria-describedby="date-of-notice-legend"
                              aria-label="month, two digits"
                              className="usa-input usa-input--inline"
                              id="date-of-notice-month"
                              max="12"
                              min="1"
                              name="month"
                              type="number"
                              onBlur={() => {
                                validateStartCaseSequence();
                              }}
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="usa-form-group usa-form-group--day">
                            <label
                              aria-hidden="true"
                              htmlFor="date-of-notice-day"
                            >
                              DD
                            </label>
                            <input
                              aria-describedby="date-of-notice-legend"
                              aria-label="day, two digits"
                              className="usa-input usa-input--inline"
                              id="date-of-notice-day"
                              max="31"
                              min="1"
                              name="day"
                              type="number"
                              onBlur={() => {
                                validateStartCaseSequence();
                              }}
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="usa-form-group usa-form-group--year">
                            <label
                              aria-hidden="true"
                              htmlFor="date-of-notice-year"
                            >
                              YYYY
                            </label>
                            <input
                              aria-describedby="date-of-notice-legend"
                              aria-label="year, four digits"
                              className="usa-input usa-input--inline"
                              id="date-of-notice-year"
                              max="2100"
                              min="1900"
                              name="year"
                              type="number"
                              onBlur={() => {
                                validateStartCaseSequence();
                              }}
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <Text
                            bind="validationErrors.irsNoticeDate"
                            className="usa-error-message"
                          />
                        </div>
                      </fieldset>
                    </div>
                  </React.Fragment>
                )}
                {startCaseHelper.showNotHasIrsNoticeOptions && (
                  <CaseTypeSelect
                    allowDefaultOption={true}
                    caseTypes={caseTypeDescriptionHelper.caseTypes}
                    legend="Which topic most closely matches your complaint with the
                IRS?"
                    validation="validateStartCaseSequence"
                    onChange="updateFormValueSequence"
                  />
                )}
              </div>
            </div>
            <h2 className="margin-top-4">How Do You Want This Case Handled?</h2>
            <p>
              Tax laws allow you to file your case as a “small case,” which
              means it’s handled a bit differently than a regular case. If you
              choose to have your case processed as a small case, the Tax Court
              must approve your choice. Generally, the Tax Court will agree with
              your request if you qualify.
            </p>
            <div className="usa-accordion start-a-case">
              <button
                aria-controls="case-difference-container"
                aria-expanded={!!screenMetadata.showCaseDifference}
                className="usa-accordion__button case-difference"
                type="button"
                onClick={() => toggleCaseDifferenceSequence()}
              >
                <span className="usa-accordion__heading usa-banner__button-text">
                  <FontAwesomeIcon icon="question-circle" size="lg" />
                  How is a small case different than a regular case, and do I
                  qualify?
                  {screenMetadata.showCaseDifference ? (
                    <FontAwesomeIcon icon="caret-up" />
                  ) : (
                    <FontAwesomeIcon icon="caret-down" />
                  )}
                </span>
              </button>
              <div
                aria-hidden={!screenMetadata.showCaseDifference}
                className="usa-accordion__content"
                id="case-difference-container"
              >
                <CaseDifferenceExplained />
              </div>
            </div>
            <div className="blue-container">
              <ProcedureType
                legend="Select Case Procedure"
                value={form.procedureType}
                onChange={e => {
                  updateFormValueSequence({
                    key: 'procedureType',
                    value: e.target.value,
                  });
                  clearPreferredTrialCitySequence();
                  validateStartCaseSequence();
                }}
              />
              {startCaseHelper.showSelectTrial && (
                <TrialCity
                  label="Select a Trial Location"
                  showDefaultOption={true}
                  showHint={true}
                  showRegularTrialCitiesHint={
                    startCaseHelper.showRegularTrialCitiesHint
                  }
                  showSmallTrialCitiesHint={
                    startCaseHelper.showSmallTrialCitiesHint
                  }
                  trialCitiesByState={
                    trialCitiesHelper(form.procedureType).trialCitiesByState
                  }
                  value={form.preferredTrialCity}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value || null,
                    });
                    validateStartCaseSequence();
                  }}
                />
              )}
              <Text
                bind="validationErrors.procedureType"
                className="usa-error-message"
              />
              {!validationErrors.procedureType && (
                <Text
                  bind="validationErrors.preferredTrialCity"
                  className="usa-error-message"
                />
              )}
            </div>
            <h2 className="margin-top-4">Review Your Information</h2>
            <p>
              You can’t edit your case once you submit it. Please make sure all
              your information appears the way you want it to.
            </p>
            <div className="blue-container">
              <h3>Your Case is Ready to Submit If&nbsp;…</h3>
              <ol className="usa-list">
                <li>You have confirmed the timeliness of your Petition.</li>
                <li>
                  You have redacted all personal information from your
                  documents.
                </li>
                <li>You have not included any evidence with your Petition.</li>
                <li>
                  Your Petition and any IRS notices have been saved and uploaded
                  as a single PDF.
                </li>
              </ol>

              <div
                className={
                  'usa-checkbox ' +
                  (validationErrors.signature ? 'usa-form-group--error' : '')
                }
              >
                <legend>Review and Sign</legend>
                <input
                  className="usa-checkbox__input"
                  id="signature"
                  name="signature"
                  type="checkbox"
                  onBlur={() => {
                    validateStartCaseSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked ? true : undefined,
                    });
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="signature">
                  Checking this box acts as your digital signature,
                  acknowledging that you’ve verified all information is correct.
                  You won’t be able to edit your case once it’s submitted.
                </label>
                <Text
                  bind="validationErrors.signature"
                  className="usa-error-message"
                />
              </div>
            </div>

            <button
              className="usa-button margin-right-205"
              id="submit-case"
              type="submit"
            >
              Submit to U.S. Tax Court
            </button>
            <button
              className="usa-button usa-button--outline"
              type="button"
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </button>
          </form>
          {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
          {showModal === 'FileUploadErrorModal' && (
            <FileUploadErrorModal
              confirmSequence={submitFilePetitionSequence}
            />
          )}
        </section>
      </>
    );
  },
);
