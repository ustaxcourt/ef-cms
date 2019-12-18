import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddRespondentModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.associateRespondentWithCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddRespondentSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
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
        title="Add Respondent Counsel"
      >
        <div className="ustc-add-counsel-modal">
          <FormGroup errorText={validationErrors.user}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="counsel-matches-legend">
                {caseDetailHelper.respondentSearchResultsCount} counsel
                match(es) found
              </legend>

              {caseDetailHelper.respondentSearchResultsCount === 1 && (
                <span>
                  {caseDetailHelper.respondentMatchesFormatted[0].name} (
                  {caseDetailHelper.respondentMatchesFormatted[0].barNumber}
                  )
                  <br />
                  {caseDetailHelper.respondentMatchesFormatted[0].cityStateZip}
                </span>
              )}
              <div className="respondent-matches">
                {caseDetailHelper.respondentSearchResultsCount > 1 &&
                  caseDetailHelper.respondentMatchesFormatted.map(
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
        </div>
      </ModalDialog>
    );
  },
);
