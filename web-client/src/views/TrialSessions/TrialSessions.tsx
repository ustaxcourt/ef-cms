import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TrialSessionProceedingType,
} from '@shared/business/entities/EntityConstants';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialCityOptions } from '@web-client/views/TrialCityOptions';
import { TrialSessionsTable } from './TrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessions = connect(
  {
    defaultTab: state.screenMetadata.trialSessionFilters.status,
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    setTrialSessionsFiltersSequence: sequences.setTrialSessionsFiltersSequence,
    trialSessionHelper: state.trialSessionsHelper,
  },
  function TrialSessions({
    defaultTab,
    openTrialSessionPlanningModalSequence,
    setTrialSessionsFiltersSequence,
    trialSessionHelper,
  }) {
    return (
      <>
        <BigHeader text="Trial Sessions" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            bind="trialSessionsPage.filters.currentTab"
            defaultActiveTab={defaultTab || 'calendared'}
            headingLevel="2"
            id="trial-sessions-tabs"
            onSelect={tabName => {
              setTrialSessionsFiltersSequence({ currentTab: tabName });
            }}
          >
            <div className="ustc-ui-tabs ustc-ui-tabs--right-button-container">
              <Button
                link
                className="margin-top-1"
                icon="print"
                onClick={() => openTrialSessionPlanningModalSequence()}
              >
                Trial Session Planning Report
              </Button>
            </div>
            {trialSessionHelper.showNewTrialSession && (
              <Tab
                data-testid="new-trial-sessions-tab"
                id="new-trial-sessions-tab"
                tabName="new"
                title="New"
              >
                <TrialSessionFilters />
                <TrialSessionsTable filter="New" />
              </Tab>
            )}
            <Tab
              data-testid="calendared-trial-sessions-tab"
              id="calendared-trial-sessions-tab"
              tabName="calendared"
              title="Calendared"
            >
              <TrialSessionFilters />
              <TrialSessionsTable filter="All" />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

const TrialSessionFilters = connect(
  {
    setTrialSessionsFiltersSequence: sequences.setTrialSessionsFiltersSequence,
    trialSessionsHelper: state.trialSessionsHelper,
    trialSessionsPage: state.trialSessionsPage,
  },
  function TrialSessionFilters({
    setTrialSessionsFiltersSequence,
    trialSessionsHelper,
    trialSessionsPage,
  }) {
    console.log(trialSessionsPage.filters);
    return (
      <>
        <div className="margin-bottom-4">
          {trialSessionsHelper.showSessionStatus && (
            <div className="usa-radio usa-radio__inline">
              <legend>Session Status</legend>
              <input
                aria-describedby="petition-filing-method-radios"
                checked={trialSessionsPage.filters.sessionStatus === 'All'}
                className="usa-radio__input"
                id="sessionStatus-All"
                name="filingMethod"
                type="radio"
                value="All"
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    sessionStatus: e.target.value,
                  });
                }}
              />
              <label className="usa-radio__label" htmlFor="sessionStatus-All">
                All
              </label>
              <input
                aria-describedby="petition-filing-method-radios"
                checked={
                  trialSessionsPage.filters.sessionStatus ===
                  SESSION_STATUS_TYPES.open
                }
                className="usa-radio__input"
                id="sessionStatus-Open"
                name="filingMethod"
                type="radio"
                value={SESSION_STATUS_TYPES.open}
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    sessionStatus: e.target.value,
                  });
                }}
              />
              <label className="usa-radio__label" htmlFor="sessionStatus-Open">
                Open
              </label>
              <input
                aria-describedby="petition-filing-method-radios"
                checked={
                  trialSessionsPage.filters.sessionStatus ===
                  SESSION_STATUS_TYPES.closed
                }
                className="usa-radio__input"
                id="sessionStatus-Closed"
                name="filingMethod"
                type="radio"
                value={SESSION_STATUS_TYPES.closed}
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    sessionStatus: e.target.value,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="sessionStatus-Closed"
              >
                Closed
              </label>
            </div>
          )}
        </div>
        <div className="margin-bottom-5 grid-row flex-justify">
          <div>
            <label
              className="dropdown-label-serif margin-right-3"
              htmlFor="inline-select"
              id="trial-sessions-filter-label"
            >
              Filter by
            </label>
            <select
              aria-label="location"
              className="usa-select select-left width-180 inline-select"
              onChange={e => {
                setTrialSessionsFiltersSequence({
                  trialLocation: e.target.value,
                });
              }}
            >
              <option value="All">-Location-</option>
              <TrialCityOptions procedureType="AllPlusStandalone" />
            </select>
            <select
              aria-label="proceeding"
              className="usa-select select-left width-180 inline-select margin-left-1pt5rem"
              id="proceedingFilter"
              name="proceedingType"
              onChange={e => {
                setTrialSessionsFiltersSequence({
                  proceedingType: e.target.value as TrialSessionProceedingType,
                });
              }}
            >
              <option value="All">-Proceeding Type-</option>
              {Object.values(TRIAL_SESSION_PROCEEDING_TYPES).map(
                proceedingType => (
                  <option key={proceedingType} value={proceedingType}>
                    {proceedingType}
                  </option>
                ),
              )}
            </select>
            <select
              aria-label="session"
              className="usa-select select-left width-180 inline-select margin-left-1pt5rem"
              id="sessionFilter"
              name="sessionType"
              onChange={e => {
                setTrialSessionsFiltersSequence({
                  sessionType: e.target.value,
                });
              }}
            >
              <option value="All">-Session Type-</option>
              {Object.values(SESSION_TYPES).map(sessionType => (
                <option key={sessionType} value={sessionType}>
                  {sessionType}
                </option>
              ))}
            </select>
            <select
              aria-label="judge"
              className="usa-select select-left width-180 inline-select margin-left-1pt5rem"
              id="judgeFilter"
              name="judge"
              onChange={e => {
                setTrialSessionsFiltersSequence({
                  judgeId: e.target.value,
                });
              }}
            >
              <option value="All">-Judge-</option>
              {trialSessionsHelper.trialSessionJudges.map(judge => (
                <option key={judge.userId} value={judge.userId}>
                  {judge.name}
                </option>
              ))}

              {trialSessionsHelper.showUnassignedJudgeFilter && (
                <option
                  key={trialSessionsHelper.trialSessionJudges.length}
                  value="unassigned"
                >
                  Unassigned
                </option>
              )}
            </select>
          </div>
          {trialSessionsHelper.showNewTrialSession && (
            <Button
              data-testid="add-trial-session-button"
              href="/add-a-trial-session"
              icon="plus-circle"
            >
              Add Trial Session
            </Button>
          )}
        </div>
      </>
    );
  },
);

TrialSessions.displayName = 'TrialSessions';
