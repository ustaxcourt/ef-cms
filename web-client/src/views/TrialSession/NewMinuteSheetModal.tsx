import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const NewMinuteSheetModal = connect(
  {
    clearModalFormSequence: sequences.clearModalFormSequence,
    form: state.modal.form,
    newMinuteSheetModalHelper: state.newMinuteSheetModalHelper,
    searchNewMinuteSheetCaseSequence:
      sequences.searchNewMinuteSheetCaseSequence,
    submitNewMinuteSheetSequence: sequences.submitNewMinuteSheetSequence,
    updateModalFormValueSequence: sequences.updateModalFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function NewMinuteSheetModal({
    clearModalFormSequence,
    form,
    newMinuteSheetModalHelper,
    searchNewMinuteSheetCaseSequence,
    submitNewMinuteSheetSequence,
    updateModalFormValueSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        className="new-minute-sheet-modal"
        noCancel={true}
        noConfirm={true}
        showModalWhen="NewMinuteSheetModal"
        title="New Minutes Sheet"
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={clearModalFormSequence}
      >
        <form
          className="usa-search usa-search--small ustc-search"
          role="search"
          onSubmit={e => {
            e.preventDefault();
            searchNewMinuteSheetCaseSequence();
          }}
        >
          <label className="usa-sr-only" htmlFor="docket-number">
            Docket Number
          </label>
          <input
            className="usa-input"
            data-testid="new-minute-sheet-docket-number-input"
            id="docket-number"
            name="docketNumber"
            placeholder="Enter docket no. (123-19)"
            type="search"
            value={form?.docketNumber || ''}
            onChange={e => {
              updateModalFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
          <Button
            overrideReadOnly
            className="ustc-search-button"
            data-testid="new-minute-sheet-search-button"
            type="submit"
          >
            <span className="usa-search-submit-text">Search</span>
          </Button>
        </form>

        {validationErrors.caseSelected &&
          !newMinuteSheetModalHelper.caseInfo &&
          !newMinuteSheetModalHelper.noResultsFound &&
          !newMinuteSheetModalHelper.isCaseAlreadyOnTrialSession && (
            <div className="margin-top-2" data-testid="search-error-message">
              <span className="usa-error-message">
                <FontAwesomeIcon
                  className="margin-right-05"
                  icon="exclamation-circle"
                />
                {validationErrors.caseSelected}
              </span>
            </div>
          )}

        {newMinuteSheetModalHelper.noResultsFound && (
          <div className="margin-top-2" data-testid="no-results-found-message">
            <span className="usa-error-message">No results found</span>
            <p className="margin-top-1">Please try your search again.</p>
          </div>
        )}

        {newMinuteSheetModalHelper.isCaseAlreadyOnTrialSession && (
          <div
            className="margin-top-2"
            data-testid="case-already-on-trial-session-message"
          >
            <span className="text-secondary-dark">
              <FontAwesomeIcon
                className="margin-right-05"
                icon="exclamation-circle"
              />
              This case is currently active in this trial session
            </span>
          </div>
        )}

        {newMinuteSheetModalHelper.showCaseConfirmation &&
          newMinuteSheetModalHelper.caseInfo && (
            <div className="margin-top-2">
              <p className="text-bold margin-bottom-1">Confirm</p>
              <div
                className={
                  validationErrors.caseSelected ? 'usa-form-group--error' : ''
                }
              >
                <div className="usa-checkbox">
                  <input
                    checked={form?.caseSelected || false}
                    className="usa-checkbox__input"
                    data-testid="new-minute-sheet-case-checkbox"
                    id="case-selected"
                    name="caseSelected"
                    type="checkbox"
                    onChange={e => {
                      updateModalFormValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    data-testid="new-minute-sheet-case-label"
                    htmlFor="case-selected"
                  >
                    {newMinuteSheetModalHelper.caseInfo
                      .docketNumberWithSuffix ||
                      newMinuteSheetModalHelper.caseInfo.docketNumber}{' '}
                    {newMinuteSheetModalHelper.caseInfo.caseCaption}
                  </label>
                </div>
                {validationErrors.caseSelected && (
                  <span
                    className="usa-error-message"
                    data-testid="case-selected-error-message"
                  >
                    <FontAwesomeIcon
                      className="margin-right-05"
                      icon="exclamation-circle"
                    />
                    {validationErrors.caseSelected}
                  </span>
                )}
              </div>
            </div>
          )}

        <div className="margin-top-4">
          <Button
            data-testid="modal-confirm"
            onClick={() => submitNewMinuteSheetSequence()}
          >
            Add
          </Button>

          <Button
            link
            className="margin-left-1 no-underline"
            data-testid="confirm-modal-cancel-btn"
            onClick={() => clearModalFormSequence()}
          >
            Close
          </Button>
        </div>

        {newMinuteSheetModalHelper.editUnscheduledMinutesList.length > 0 && (
          <>
            <hr className="margin-top-4 margin-bottom-4" />
            <div data-testid="edit-unscheduled-minutes-section">
              <p className="text-semibold margin-bottom-2">
                Edit Unscheduled Minutes
              </p>
              {newMinuteSheetModalHelper.editUnscheduledMinutesList.map(
                (caseItem: any) => (
                  <div
                    className="margin-top-1"
                    data-testid={`edit-unscheduled-minute-${caseItem.docketNumber}`}
                    key={caseItem.docketNumber}
                  >
                    <a
                      className="usa-link"
                      href={`/trial-session-detail/${newMinuteSheetModalHelper.trialSessionId}/case/${caseItem.docketNumber}/minutes?isUnscheduledCase=true`}
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      <FontAwesomeIcon
                        icon="pencil-alt"
                        size="1x"
                        style={{ marginRight: '4px' }}
                      />
                      {caseItem.docketNumberWithSuffix || caseItem.docketNumber}{' '}
                      {caseItem.caseCaption}
                    </a>
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </ConfirmModal>
    );
  },
);

NewMinuteSheetModal.displayName = 'NewMinuteSheetModal';
