import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { Button } from '@web-client/dawson-ui/ui/button';
import { EditContactInformationModal } from '../CaseDetail/EditContactInformationModal';

export const NoticeOfWithdrawalForm = connect(
  {
    caseDetail: state.caseDetail,
    noticeOfWithdrawalFormHelper: state.noticeOfWithdrawalHelper,
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
    noticeOfWithdrawalFormHelper,
    form,
    openEditContactInformationModalSequence,
    showModal,
    updateFileDocumentWizardFormValueSequence,
    validationErrors,
    validateExternalDocumentInformationSequence,
  }) {
    return (
      <>
        <fieldset className="usa-fieldset margin-bottom-0">
          <FormGroup errorText={validationErrors?.filers}>
            <legend>
              Who are you removing yourself as counsel of record for?
            </legend>
            <span className="usa-hint">Check all that apply.</span>
            {noticeOfWithdrawalFormHelper.partiesToWithdrawFrom.map(party => (
              <div className="usa-checkbox" key={party.contactId}>
                <input
                  aria-describedby="who-legend"
                  checked={form.partiesToWithdrawFrom?.[party.contactId]}
                  className="usa-checkbox__input"
                  id={`party-${party.contactId}`}
                  name={`filersMap.${party.contactId}`}
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
                  htmlFor={`party-${party.contactId}`}
                >
                  {party.name}
                </label>
              </div>
            ))}
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

          <FormGroup errorText={validationErrors?.confirmPetitioners}>
            <legend className="with-hint">
              Is petitioner&apos;s contact information in the record of the case
              current?
              <span className="usa-hint">(Optional)</span>
            </legend>
            <div className="tw:flex">
              {noticeOfWithdrawalFormHelper.partiesToWithdrawFrom.map(party => (
                <>
                  <div
                    className="tw:w-sm"
                    key={`edit-contact-${party.contactId}`}
                  >
                    <span className="tw:block tw:mb-[5px]">{party.name}</span>
                    <span className="tw:block">{party.address1}</span>
                    <span className="tw:block">{party.address2}</span>
                    <span className="tw:block">{party.address3}</span>
                    <span className="tw:block">{`${party.city}, ${party.state} ${party.postalCode}`}</span>
                    <span className="tw:block">{party.country}</span>
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
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <label
                      className="usa-checkbox__label"
                      htmlFor={`confirmPetitionersContactInformationMap-${party.contactId}`}
                    >
                      Yes, this information is current
                    </label>
                    <Button
                      variant="primaryTertiary"
                      icon="pencil"
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
                  </div>
                  {showModal === 'EditContactInformationModal' && (
                    <EditContactInformationModal />
                  )}
                </>
              ))}
            </div>
          </FormGroup>
        </fieldset>
      </>
    );
  },
);

NoticeOfWithdrawalForm.displayName = 'NoticeOfWithdrawalForm';
