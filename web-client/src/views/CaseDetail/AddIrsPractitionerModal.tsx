import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddIrsPractitionerModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailPractitionerSearchHelper:
      state.caseDetailPractitionerSearchHelper,
    confirmSequence: sequences.associateIrsPractitionerWithCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddIrsPractitionerSequence,
    validationErrors: state.validationErrors,
  },
  function AddIrsPractitionerModal({
    cancelSequence,
    caseDetailPractitionerSearchHelper,
    confirmSequence,
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
        title="Add Respondent Counsel"
      >
        <div className="ustc-add-counsel-modal">
          <FormGroup errorText={validationErrors.user}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="counsel-matches-legend">
                {
                  caseDetailPractitionerSearchHelper.respondentSearchResultsCount
                }{' '}
                counsel match(es) found
              </legend>

              {caseDetailPractitionerSearchHelper.showOneRespondent && (
                <span>
                  {
                    caseDetailPractitionerSearchHelper
                      .respondentMatchesFormatted[0].name
                  }{' '}
                  (
                  {
                    caseDetailPractitionerSearchHelper
                      .respondentMatchesFormatted[0].barNumber
                  }
                  )
                  <br />
                  {
                    caseDetailPractitionerSearchHelper
                      .respondentMatchesFormatted[0].cityStateZip
                  }
                </span>
              )}
              <div className="respondent-matches">
                {caseDetailPractitionerSearchHelper.showMultipleRespondents &&
                  caseDetailPractitionerSearchHelper.respondentMatchesFormatted.map(
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

          <ServiceIndicatorRadios
            bind="modal"
            validationErrors="validationErrors"
          />
        </div>
      </ModalDialog>
    );
  },
);

AddIrsPractitionerModal.displayName = 'AddIrsPractitionerModal';
