import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const RespondentExistsModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.clearModalSequence,
  },
  function RespondentExistsModal({
    cancelSequence,
    caseDetailHelper,
    confirmSequence,
  }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        className="ustc-counsel-exists-modal"
        confirmLabel="OK"
        confirmSequence={confirmSequence}
        title="Add Respondent Counsel"
      >
        <div>
          <div
            className={classNames(
              'bg-gold',
              'usa-form-group',
              'padding-1',
              'max-width-unset',
            )}
          >
            <div className="float-right text-italic padding-right-1">
              Counsel is already associated with this case.
            </div>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="counsel-matches-legend">
                Counsel match(es) found
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
            </fieldset>
          </div>
          <div className="margin-bottom-3">
            You can make changes by selecting Edit from the Respondent Counsel
            section.
          </div>
        </div>
      </ModalDialog>
    );
  },
);

RespondentExistsModal.displayName = 'RespondentExistsModal';
