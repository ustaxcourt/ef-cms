import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const WorkingCopyFilterHeader = connect(
  {
    autoSaveTrialSessionWorkingCopySequence:
      sequences.autoSaveTrialSessionWorkingCopySequence,
    filters: state.trialSessionWorkingCopy.filters,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
  },
  function WorkingCopyFilterHeader({
    autoSaveTrialSessionWorkingCopySequence,
    filters = {},
    trialSessionWorkingCopyHelper,
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
                  checked={!!filters.aBasisReached}
                  className="usa-checkbox__input"
                  id="filters.aBasisReached"
                  name="filters.aBasisReached"
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
                  htmlFor="filters.aBasisReached"
                >
                  A Basis Reached
                </label>
              </div>

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
                  checked={!!filters.takenUnderAdvisement}
                  className="usa-checkbox__input"
                  id="filters.takenUnderAdvisement"
                  name="filters.takenUnderAdvisement"
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
                  htmlFor="filters.takenUnderAdvisement"
                >
                  Taken Under Advisement
                </label>
              </div>
            </div>

            <div className="grid-col-2">
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
                  Status unassigned
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
