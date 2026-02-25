import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';
import { EditContactInformationModal } from '../CaseDetail/EditContactInformationModal';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { AlertWarning } from '@web-client/dawson-ui/ui/Alert/AlertWarning';

export const NoticeOfWithdrawalForm = connect(
  {
    noticeOfWithdrawalHelper: state.noticeOfWithdrawalHelper,
    form: state.form,
    openEditContactInformationModalSequence:
      sequences.openEditContactInformationModalSequence,
    showModal: state.modal.showModal,
    updateFileDocumentWizardFormValueSequence:
      sequences.updateFileDocumentWizardFormValueSequence,
    validationErrors: state.validationErrors,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  function NoticeOfWithdrawalForm({
    noticeOfWithdrawalHelper,
    form,
    openEditContactInformationModalSequence,
    showModal,
    updateFileDocumentWizardFormValueSequence,
    validationErrors,
    validateExternalDocumentInformationSequence,
  }) {
    const alertWarning = {
      message:
        'If you are withdrawing as counsel from more than one case you must file a Notice of Withdrawal as Counsel for each case.',
      title: 'Case is in a Consolidated Group',
    };
    return (
      <>
        {noticeOfWithdrawalHelper.showConsolidatedCaseAlertWarning && (
          <AlertWarning
            alertWarning={alertWarning}
            className="tw:mt-2 tw:mb-3"
            dataTestId="consolidated-case-alert-warning"
            isDismissible={false}
          />
        )}
        <fieldset className="usa-fieldset margin-bottom-0">
          <FormGroup errorText={validationErrors?.partiesToWithdrawFrom}>
            <legend>
              From whom are you removing yourself as counsel of record?
            </legend>
            <span className="usa-hint">Check all that apply.</span>
            {noticeOfWithdrawalHelper.partiesToWithdrawFrom.map(party => (
              <div className="usa-checkbox" key={party.contactId}>
                <input
                  aria-describedby="who-legend"
                  checked={form.partiesToWithdrawFromMap?.[party.contactId]}
                  className="usa-checkbox__input"
                  id={`party-${party.contactId}`}
                  name={`partiesToWithdrawFromMap.${party.contactId}`}
                  type="checkbox"
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  data-testid={`party-label-${party.contactId}`}
                  htmlFor={`party-${party.contactId}`}
                >
                  {party.name}
                </label>
              </div>
            ))}
            {noticeOfWithdrawalHelper.showRespondent && (
              <div className="usa-checkbox">
                <input
                  aria-describedby="who-legend"
                  checked={form.partyIrsPractitioner || false}
                  className="usa-checkbox__input"
                  id="party-irs-practitioner"
                  name="partyIrsPractitioner"
                  type="checkbox"
                  onChange={e => {
                    updateFileDocumentWizardFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="party-irs-practitioner"
                  data-testid="party-irs-practitioner-label"
                >
                  Respondent
                </label>
              </div>
            )}
          </FormGroup>

          <FormGroup errorText={validationErrors?.allPartiesConsent}>
            <legend>
              Have all parties consented to your withdrawing as counsel?
            </legend>
            <div className="usa-radio">
              <input
                aria-describedby="all-parties-consent-radios"
                checked={form.allPartiesConsent === true}
                className="usa-radio__input"
                id="allPartiesConsent-yes"
                name="allPartiesConsent"
                type="radio"
                value="Yes"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: true,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-radio__label"
                data-testid="allPartiesConsent-yes-label"
                htmlFor="allPartiesConsent-yes"
              >
                Yes
              </label>
            </div>
            <div className="usa-radio">
              <input
                aria-describedby="all-parties-consent-radios"
                checked={form.allPartiesConsent === false}
                className="usa-radio__input"
                id="allPartiesConsent-no"
                name="allPartiesConsent"
                type="radio"
                value="No"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: e.target.name,
                    value: false,
                  });
                  validateExternalDocumentInformationSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="allPartiesConsent-no"
              >
                No
              </label>
            </div>
          </FormGroup>

          {noticeOfWithdrawalHelper.showEditContactInformation && (
            <FormGroup>
              <legend className="with-hint">
                Is petitioner&apos;s contact information in the record of the
                case current? <span className="usa-hint">(Optional)</span>
              </legend>
              <div
                className="tw:flex tw:flex-wrap tw:justify-between"
                data-testid="edit-contact-information-section"
              >
                {noticeOfWithdrawalHelper.partiesToWithdrawFrom.map(party => (
                  <div
                    className="tw:mt-6 tw:w-[300px]"
                    data-testid={`edit-contact-${party.contactId}`}
                    key={`edit-contact-${party.contactId}`}
                  >
                    <span className="tw:block tw:mb-1.25">{party.name}</span>
                    {party.secondaryName ? (
                      <span className="tw:block tw:mb-1.25">
                        c/o {party.secondaryName}
                        {party.title && <span>, {party.title}</span>}
                      </span>
                    ) : (
                      party.additionalName && (
                        <span className="tw:block tw:mb-1.25">
                          {party.additionalName}
                        </span>
                      )
                    )}
                    {party.isAddressSealed ? (
                      <span>ADDRESS SEALED BY COURT ORDER</span>
                    ) : (
                      <>
                        <span className="tw:block">{party.address1}</span>
                        <span className="tw:block">{party.address2}</span>
                        <span className="tw:block">{party.address3}</span>
                        <span className="tw:block">{`${party.city}, ${party.state} ${party.postalCode}`}</span>
                        {party.countryType === COUNTRY_TYPES.INTERNATIONAL && (
                          <span className="tw:block">{party.country}</span>
                        )}
                        <span className="tw:block">{party.phone}</span>
                        <input
                          checked={
                            form.confirmPetitionersContactInformationMap?.[
                              party.contactId
                            ]
                          }
                          className="usa-checkbox__input"
                          id={`confirmPetitionersContactInformationMap-${party.contactId}`}
                          name={`confirmPetitionersContactInformationMap.${party.contactId}`}
                          type="checkbox"
                          onChange={e => {
                            updateFileDocumentWizardFormValueSequence({
                              key: `confirmPetitionersContactInformationMap.${party.contactId}`,
                              value: e.target.checked,
                            });
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor={`confirmPetitionersContactInformationMap-${party.contactId}`}
                        >
                          Yes, this information is current
                        </label>
                        <Button
                          className="tw:mt-2"
                          data-testid={`edit-contact-information-button-${party.contactId}`}
                          variant="primaryTertiary"
                          icon="pen-to-square"
                          aria-label="Edit contact information"
                          onClick={() =>
                            openEditContactInformationModalSequence({
                              key: 'contact',
                              value: { ...party },
                            })
                          }
                        >
                          Edit contact information
                        </Button>
                        {showModal === 'EditContactInformationModal' && (
                          <EditContactInformationModal />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </FormGroup>
          )}

          {noticeOfWithdrawalHelper.partiesWithPaperService.length > 0 && (
            <FormGroup
              errorText={validationErrors?.paperServiceAcknowledgement}
            >
              <legend>Paper Service Acknowledgement</legend>
              <div className="tw:flex tw:flex-wrap tw:justify-between">
                {noticeOfWithdrawalHelper.partiesWithPaperService.map(party => (
                  <div
                    className="tw:w-[300px] tw:mb-5"
                    key={`paper-service-${party.contactId}`}
                  >
                    <span
                      className="tw:block tw:mb-1.25"
                      data-testid={`paper-service-acknowledgement-name-${party.contactId}`}
                    >
                      {party.name}
                    </span>
                    {party.isAddressSealed ? (
                      <span>ADDRESS SEALED BY COURT ORDER</span>
                    ) : (
                      <div
                        data-testid={`paper-service-acknowledgement-address-${party.contactId}`}
                      >
                        <span className="tw:block">{party.address1}</span>
                        <span className="tw:block">{party.address2}</span>
                        <span className="tw:block">{party.address3}</span>
                        <span className="tw:block">{`${party.city}, ${party.state} ${party.postalCode}`}</span>
                        {party.countryType === COUNTRY_TYPES.INTERNATIONAL && (
                          <span className="tw:block">{party.country}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <input
                checked={form.paperServiceAcknowledgement}
                className="usa-checkbox__input"
                id="paperServiceAcknowledgement"
                name="paperServiceAcknowledgement"
                type="checkbox"
                onChange={e => {
                  updateFileDocumentWizardFormValueSequence({
                    key: 'paperServiceAcknowledgement',
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label"
                htmlFor="paperServiceAcknowledgement"
              >
                I certify that I will serve any party who does not receive
                electronic service a copy of the Notice of Withdrawal of Counsel
                by mail <span className="tw:font-bold">today</span>.
              </label>
            </FormGroup>
          )}
        </fieldset>
      </>
    );
  },
);

NoticeOfWithdrawalForm.displayName = 'NoticeOfWithdrawalForm';
