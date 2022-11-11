import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkingCopyFilterHeader = connect(
  {
    autoSaveTrialSessionWorkingCopySequence:
      sequences.autoSaveTrialSessionWorkingCopySequence,
    filters: state.trialSessionWorkingCopy.filters,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
    updatedTrialSessionTypesEnabled:
      state.trialSessionWorkingCopyHelper.updatedTrialSessionTypesEnabled,
  },
  function WorkingCopyFilterHeader({
    autoSaveTrialSessionWorkingCopySequence,
    filters = {},
    trialSessionWorkingCopyHelper,
    updatedTrialSessionTypesEnabled,
  }) {
    return (
      <div className="working-copy-filters">
        <div className="working-copy-filters--header header-with-blue-background">
          <div className="grid-row">
            <div className="grid-col-6">
              <h3>Show Cases by Trial Status</h3>
            </div>
            <div className="grid-col-6 text-right">
              <span>
                Total Shown: {trialSessionWorkingCopyHelper.casesShownCount}
              </span>
            </div>
          </div>
        </div>

        <div className="working-copy-filters--content">
          <div className="grid-row">
            <div className="grid-col-1 show-all-sessions">
              <div className="usa-checkbox">
                <input
                  checked={!!filters.showAll}
                  className="usa-checkbox__input"
                  id="filters.showAll"
                  name="filters.showAll"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.showAll"
                >
                  Show All
                </label>
              </div>
            </div>

            <div className="grid-col-2 grid-offset-1">
              {updatedTrialSessionTypesEnabled ? (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.probableSettlement}
                    className="usa-checkbox__input"
                    id="filters.probableSettlement"
                    name="filters.probableSettlement"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.probableSettlement"
                  >
                    Probable Settlement
                  </label>
                </div>
              ) : (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.setForTrial}
                    className="usa-checkbox__input"
                    id="filters.setForTrial"
                    name="filters.setForTrial"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.setForTrial"
                  >
                    Set for Trial
                  </label>
                </div>
              )}
              {updatedTrialSessionTypesEnabled ? (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.probableTrial}
                    className="usa-checkbox__input"
                    id="filters.probableTrial"
                    name="filters.probableTrial"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.probableTrial"
                  >
                    Probable Trial
                  </label>
                </div>
              ) : (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.dismissed}
                    className="usa-checkbox__input"
                    id="filters.dismissed"
                    name="filters.dismissed"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.dismissed"
                  >
                    Dismissed
                  </label>
                </div>
              )}
            </div>

            <div className="grid-col-2">
              <div className="usa-checkbox">
                <input
                  checked={!!filters.continued}
                  className="usa-checkbox__input"
                  id="filters.continued"
                  name="filters.continued"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.continued"
                >
                  Continued
                </label>
              </div>

              <div className="usa-checkbox">
                <input
                  checked={!!filters.rule122}
                  className="usa-checkbox__input"
                  id="filters.rule122"
                  name="filters.rule122"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.rule122"
                >
                  Rule 122
                </label>
              </div>
            </div>

            <div className="grid-col-2">
              <div className="usa-checkbox">
                <input
                  checked={!!filters.basisReached}
                  className="usa-checkbox__input"
                  id="filters.basisReached"
                  name="filters.basisReached"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.basisReached"
                >
                  {!updatedTrialSessionTypesEnabled ? 'A' : ''} Basis Reached
                </label>
              </div>

              {updatedTrialSessionTypesEnabled ? (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.definiteTrial}
                    className="usa-checkbox__input"
                    id="filters.definiteTrial"
                    name="filters.definiteTrial"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.definiteTrial"
                  >
                    Definite Trial
                  </label>
                </div>
              ) : (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.settled}
                    className="usa-checkbox__input"
                    id="filters.settled"
                    name="filters.settled"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.settled"
                  >
                    Settled
                  </label>
                </div>
              )}
            </div>

            <div className="grid-col-2">
              <div className="usa-checkbox">
                <input
                  checked={!!filters.recall}
                  className="usa-checkbox__input"
                  id="filters.recall"
                  name="filters.recall"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label className="usa-checkbox__label" htmlFor="filters.recall">
                  Recall
                </label>
              </div>

              <div className="usa-checkbox">
                <input
                  checked={!!filters.submittedCAV}
                  className="usa-checkbox__input"
                  id="filters.submittedCAV"
                  name="filters.submittedCAV"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.submittedCAV"
                >
                  {updatedTrialSessionTypesEnabled
                    ? 'Submitted/CAV'
                    : 'Taken Under Advisement'}
                </label>
              </div>
            </div>

            <div className="grid-col-2">
              {updatedTrialSessionTypesEnabled && (
                <div className="usa-checkbox">
                  <input
                    checked={!!filters.motionToDismiss}
                    className="usa-checkbox__input"
                    id="filters.motionToDismiss"
                    name="filters.motionToDismiss"
                    type="checkbox"
                    onChange={e => {
                      autoSaveTrialSessionWorkingCopySequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="filters.motionToDismiss"
                  >
                    Motion To Dismiss
                  </label>
                </div>
              )}
              <div className="usa-checkbox">
                <input
                  checked={!!filters.statusUnassigned}
                  className="usa-checkbox__input"
                  id="filters.statusUnassigned"
                  name="filters.statusUnassigned"
                  type="checkbox"
                  onChange={e => {
                    autoSaveTrialSessionWorkingCopySequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="filters.statusUnassigned"
                >
                  Unassigned
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
