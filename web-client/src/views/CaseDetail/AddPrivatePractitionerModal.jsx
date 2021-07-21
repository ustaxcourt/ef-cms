import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddPrivatePractitionerModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailPractitionerSearchHelper:
      state.caseDetailPractitionerSearchHelper,
    confirmSequence: sequences.associatePrivatePractitionerWithCaseSequence,
    formattedCaseDetail: state.formattedCaseDetail,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddPrivatePractitionerSequence,
    validationErrors: state.validationErrors,
  },
  function AddPrivatePractitionerModal({
    cancelSequence,
    caseDetailPractitionerSearchHelper,
    confirmSequence,
    formattedCaseDetail,
    modal,
    updateModalValueSequence,
    validateSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="counsel-modal"
        confirmLabel="Add to Case"
        confirmSequence={confirmSequence}
        title="Add Petitioner Counsel"
      >
        <div className="ustc-add-counsel-modal">
          <FormGroup errorText={validationErrors.user}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="counsel-matches-legend">
                {
                  caseDetailPractitionerSearchHelper.practitionerSearchResultsCount
                }{' '}
                Counsel match(es) found
              </legend>

              {caseDetailPractitionerSearchHelper.showOnePractitioner && (
                <span>
                  {
                    caseDetailPractitionerSearchHelper
                      .practitionerMatchesFormatted[0].name
                  }{' '}
                  (
                  {
                    caseDetailPractitionerSearchHelper
                      .practitionerMatchesFormatted[0].barNumber
                  }
                  )
                  <br />
                  {
                    caseDetailPractitionerSearchHelper
                      .practitionerMatchesFormatted[0].cityStateZip
                  }
                </span>
              )}
              <div className="practitioner-matches">
                {caseDetailPractitionerSearchHelper.showMultiplePractitioners &&
                  caseDetailPractitionerSearchHelper.practitionerMatchesFormatted.map(
                    (counsel, idx) => (
                      <div
                        className={classNames(
                          'usa-radio',
                          'padding-1',
                          counsel.isAlreadyInCase && 'bg-gold',
                        )}
                        key={counsel.userId}
                      >
                        {counsel.isAlreadyInCase && (
                          <div className="float-right text-italic padding-right-1">
                            Counsel is already associated with this case.
                          </div>
                        )}
                        {!counsel.isAlreadyInCase && (
                          <input
                            aria-describedby="counsel-matches-legend"
                            checked={
                              (modal.user &&
                                modal.user.userId === counsel.userId) ||
                              false
                            }
                            className="usa-radio__input"
                            id={`counsel-${idx}`}
                            name="user"
                            type="radio"
                            onChange={e => {
                              updateModalValueSequence({
                                key: e.target.name,
                                value: counsel,
                              });
                              validateSequence();
                            }}
                          />
                        )}
                        <label
                          className={classNames(
                            counsel.isAlreadyInCase && 'hide-radio',
                            'usa-radio__label',
                          )}
                          htmlFor={`counsel-${idx}`}
                        >
                          {counsel.name} ({counsel.barNumber})
                          <br />
                          {counsel.cityStateZip}
                        </label>
                      </div>
                    ),
                  )}
              </div>
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.representing}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend id="representing-legend">
                Who is this counsel representing?
              </legend>

              {formattedCaseDetail.petitioners.map(petitioner => (
                <div className="usa-checkbox" key={petitioner.contactId}>
                  <input
                    aria-describedby="representing-legend"
                    checked={
                      modal.representingMap[petitioner.contactId] || false
                    }
                    className="usa-checkbox__input"
                    id={`representing-${petitioner.contactId}`}
                    name={`representingMap.${petitioner.contactId}`}
                    type="checkbox"
                    onChange={e => {
                      updateModalValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                      validateSequence();
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor={`representing-${petitioner.contactId}`}
                  >
                    {petitioner.displayName}
                  </label>
                </div>
              ))}
            </fieldset>
          </FormGroup>

          <ServiceIndicatorRadios
            bind="modal"
            validationErrors="validationErrors"
          />
        </div>
      </ModalDialog>
    );
  },
);
