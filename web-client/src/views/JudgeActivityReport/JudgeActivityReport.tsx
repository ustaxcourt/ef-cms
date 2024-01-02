import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { PendingMotion } from '@web-client/views/PendingMotion/PendingMotion';
import { Statistics } from '@web-client/views/JudgeActivityReport/Statistics';
import { SubmittedAndCav } from '@web-client/views/JudgeActivityReport/SubmittedAndCav';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const JudgeActivityReport = connect(
  {
    judgeActivityReport: state.judgeActivityReport,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    judgeActivityReportJudges: state.judges,
    pendingMotionsHelper: state.pendingMotionsHelper,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
  },
  function JudgeActivityReport({
    judgeActivityReport,
    judgeActivityReportHelper,
    judgeActivityReportJudges,
    pendingMotionsHelper,
    submitJudgeActivityReportSequence,
  }) {
    return (
      <>
        <BigHeader text="Reports" />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <div className="title" data-testid="activity-report-header">
            <h1>Activity - {judgeActivityReportHelper.reportHeader}</h1>
          </div>

          <JudgeDropdown
            judgeName={judgeActivityReport.filters.judgeName}
            judges={judgeActivityReportJudges}
            onChange={submitJudgeActivityReportSequence}
          />

          <>
            <Tabs>
              <Tab tabName="statistics" title="Statistics">
                <Statistics />
              </Tab>

              <Tab
                data-testid="submitted-and-cav-tab"
                tabName="caseWorksheet"
                title={`Submitted/CAV (${judgeActivityReportHelper.progressDescriptionTableTotal})`}
              >
                <SubmittedAndCav />
              </Tab>

              <Tab
                data-testid="pending-motions-tab"
                tabName="pendingMotions"
                title={`Pending Motions (${pendingMotionsHelper.formattedPendingMotions.length})`}
              >
                <PendingMotion isReadOnly showJudgeColumn />
              </Tab>
            </Tabs>
          </>
        </section>
      </>
    );
  },
);

function JudgeDropdown({ judgeName, judges, onChange }) {
  return (
    <div className="grid-col-auto padding-y-2">
      <div className="display-flex align-items-baseline">
        <label
          className="dropdown-label-serif margin-right-3"
          htmlFor="judge-selection"
          id="judge-selection-label"
        >
          Show items for
        </label>
        <select
          aria-describedby="judge-selection-label"
          aria-label="judge"
          className="usa-select select-left width-card-lg"
          data-testid="judge-select"
          name="associatedJudge"
          value={judgeName}
          onChange={e => {
            onChange({
              judgeName: e.target.value,
            });
          }}
        >
          <option key="all" value="All Judges">
            All Judges
          </option>
          <option key="All Regular Judges" value="All Regular Judges">
            All Regular Judges
          </option>
          <option key="All Senior Judges" value="All Senior Judges">
            All Senior Judges
          </option>
          <option
            key="All Special Trial Judges"
            value="All Special Trial Judges"
          >
            All Special Trial Judges
          </option>
          {(judges || []).map(judge => (
            <option key={judge.name} value={judge.name}>
              {judge.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
