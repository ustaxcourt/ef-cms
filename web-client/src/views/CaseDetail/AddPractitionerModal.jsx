import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddPractitionerModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetail: state.formattedCaseDetail,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.associatePractitionerWithCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddPractitionerSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    caseDetail,
    caseDetailHelper,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateSequence,
    validationErrors,
  }) => {
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
                {caseDetailHelper.practitionerSearchResultsCount} Counsel
                Match(es) Found
              </legend>

              {caseDetailHelper.practitionerSearchResultsCount === 1 && (
                <span>
                  {caseDetailHelper.practitionerMatchesFormatted[0].name} (
                  {caseDetailHelper.practitionerMatchesFormatted[0].barNumber}
                  )
                  <br />
                  {
                    caseDetailHelper.practitionerMatchesFormatted[0]
                      .cityStateZip
                  }
                </span>
              )}
              <div className="practitioner-matches">
                {caseDetailHelper.practitionerSearchResultsCount > 1 &&
                  caseDetailHelper.practitionerMatchesFormatted.map(
                    (counsel, idx) => (
                      <div
                        className={classNames(
                          'usa-radio',
                          'padding-1',
                          counsel.isAlreadyInCase && 'bg-gold',
                        )}
                        key={idx}
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

          <FormGroup errorText={validationErrors.representingPrimary}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend id="representing-legend">
                Who is this counsel representing?
              </legend>
              <div className="usa-checkbox">
                <input
                  aria-describedby="representing-legend"
                  checked={modal.representingPrimary || false}
                  className="usa-checkbox__input"
                  id="party-primary"
                  name="representingPrimary"
                  type="checkbox"
                  onChange={e => {
                    updateModalValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    validateSequence();
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="party-primary">
                  {caseDetail.contactPrimary.name}
                </label>
              </div>

              {caseDetail.contactSecondary && caseDetail.contactSecondary.name && (
                <div className="usa-checkbox">
                  <input
                    aria-describedby="representing-legend"
                    checked={modal.representingSecondary || false}
                    className="usa-checkbox__input"
                    id="party-secondary"
                    name="representingSecondary"
                    type="checkbox"
                    onChange={e => {
                      updateModalValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="party-secondary"
                  >
                    {caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
