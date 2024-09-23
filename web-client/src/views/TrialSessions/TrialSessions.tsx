import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import {
  SESSION_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { SelectSearch2 } from '@web-client/ustc-ui/Select/SelectSearch2';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionsTable } from './TrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessions = connect(
  {
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    resetTrialSessionsFiltersSequence:
      sequences.resetTrialSessionsFiltersSequence,
    trialSessionsHelper: state.trialSessionsHelper,
  },
  function TrialSessions({
    openTrialSessionPlanningModalSequence,
    resetTrialSessionsFiltersSequence,
    trialSessionsHelper,
  }) {
    return (
      <>
        <BigHeader text="Trial Sessions" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <Tabs
            bind="trialSessionsPage.filters.currentTab"
            defaultActiveTab={'calendared'}
            headingLevel="2"
            id="trial-sessions-tabs"
            onSelect={tabName => {
              resetTrialSessionsFiltersSequence({ currentTab: tabName });
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
            {trialSessionsHelper.showNewTrialSession && (
              <Tab
                data-testid="new-trial-sessions-tab"
                id="new-trial-sessions-tab"
                key="new"
                tabName="new"
                title="New"
              >
                <TrialSessionFilters />
                <TrialSessionsTable />
              </Tab>
            )}
            <Tab
              data-testid="calendared-trial-sessions-tab"
              id="calendared-trial-sessions-tab"
              key="calendared"
              tabName="calendared"
              title="Calendared"
            >
              <TrialSessionFilters />
              <TrialSessionsTable />
            </Tab>
          </Tabs>
        </section>
      </>
    );
  },
);

const TrialSessionFilters = connect(
  {
    resetTrialSessionsFiltersSequence:
      sequences.resetTrialSessionsFiltersSequence,
    setTrialSessionsFiltersSequence: sequences.setTrialSessionsFiltersSequence,
    trialSessionsHelper: state.trialSessionsHelper,
    trialSessionsPage: state.trialSessionsPage,
  },
  function TrialSessionFilters({
    resetTrialSessionsFiltersSequence,
    setTrialSessionsFiltersSequence,
    trialSessionsHelper,
    trialSessionsPage,
  }) {
    return (
      <>
        <div className="grid-row gap-3">
          {trialSessionsHelper.showSessionStatus && (
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Session Status</legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={trialSessionsPage.filters.sessionStatus === 'All'}
                  className="usa-radio__input"
                  id="sessionStatus-All"
                  name="sessionStatus"
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
                  checked={
                    trialSessionsPage.filters.sessionStatus ===
                    SESSION_STATUS_TYPES.open
                  }
                  className="usa-radio__input"
                  id="sessionStatus-Open"
                  name="sessionStatus"
                  type="radio"
                  value={SESSION_STATUS_TYPES.open}
                  onChange={e => {
                    setTrialSessionsFiltersSequence({
                      sessionStatus: e.target.value,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="sessionStatus-Open"
                >
                  Open
                </label>
                <input
                  checked={
                    trialSessionsPage.filters.sessionStatus ===
                    SESSION_STATUS_TYPES.closed
                  }
                  className="usa-radio__input"
                  id="sessionStatus-Closed"
                  name="sessionStatus"
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
            </fieldset>
          )}
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Proceeding Type</legend>
            <div className="usa-radio usa-radio__inline">
              <input
                checked={trialSessionsPage.filters.proceedingType === 'All'}
                className="usa-radio__input"
                id="proceedingType-All"
                name="proceedingType"
                type="radio"
                value="All"
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    proceedingType: e.target.value as 'All',
                  });
                }}
              />
              <label className="usa-radio__label" htmlFor="proceedingType-All">
                All
              </label>
              <input
                checked={
                  trialSessionsPage.filters.proceedingType ===
                  TRIAL_SESSION_PROCEEDING_TYPES.inPerson
                }
                className="usa-radio__input"
                id="proceedingType-In-Person"
                name="proceedingType"
                type="radio"
                value={TRIAL_SESSION_PROCEEDING_TYPES.inPerson}
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    proceedingType: e.target
                      .value as TrialSessionProceedingType,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="proceedingType-In-Person"
              >
                In Person
              </label>
              <input
                checked={
                  trialSessionsPage.filters.proceedingType ===
                  TRIAL_SESSION_PROCEEDING_TYPES.remote
                }
                className="usa-radio__input"
                id="proceedingType-remote"
                name="proceedingType"
                type="radio"
                value={TRIAL_SESSION_PROCEEDING_TYPES.remote}
                onChange={e => {
                  setTrialSessionsFiltersSequence({
                    proceedingType: e.target
                      .value as TrialSessionProceedingType,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="proceedingType-remote"
              >
                Remote
              </label>
            </div>
          </fieldset>
          <DateRangePickerComponent
            endDateErrorText={trialSessionsHelper.endDateErrorMessage}
            endLabel={
              <span>
                Last start date{' '}
                <span className="optional-light-text">(optional)</span>
              </span>
            }
            endName="trialSessionStartDate"
            endValue={trialSessionsPage.filters.endDate}
            rangePickerCls={'display-flex'}
            startDateErrorText={trialSessionsHelper.startDateErrorMessage}
            startLabel={
              <span>
                First start date{' '}
                <span className="optional-light-text">(optional)</span>
              </span>
            }
            startName="trialSessionEndDate"
            startPickerCls="padding-right-2"
            startValue={trialSessionsPage.filters.startDate}
            onBlurEnd={e => {
              setTrialSessionsFiltersSequence({
                endDate: e.target.value,
              });
            }}
            onBlurStart={e => {
              setTrialSessionsFiltersSequence({
                startDate: e.target.value,
              });
            }}
          />
        </div>
        <div className="margin-bottom-2 grid-row flex-row gap-2">
          <div className="grid-col">
            <div className="margin-bottom-1">
              <label className="usa-label" htmlFor="session-type-filter">
                Session type{' '}
                <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch2
                id="session-type-filter"
                name="sessionType"
                options={trialSessionsHelper.sessionTypeOptions}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: '' as TrialSessionTypes,
                }}
                onChange={sessionType => {
                  if (sessionType) {
                    setTrialSessionsFiltersSequence({
                      sessionTypes: {
                        action: 'add',
                        sessionType: sessionType.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.sessionTypes).map(
                sessionType => (
                  <PillButton
                    key={sessionType}
                    text={sessionType}
                    onRemove={() => {
                      setTrialSessionsFiltersSequence({
                        sessionTypes: {
                          action: 'remove',
                          sessionType,
                        },
                      });
                    }}
                  />
                ),
              )}
            </div>
          </div>
          <div className="grid-col">
            <div className="margin-bottom-1">
              <label className="usa-label" htmlFor="location-filter">
                Location <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch2
                id="location-filter"
                name="location"
                options={trialSessionsHelper.trialCitiesByState}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: '',
                }}
                onChange={location => {
                  if (location) {
                    setTrialSessionsFiltersSequence({
                      trialLocations: {
                        action: 'add',
                        trialLocation: location.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.trialLocations).map(
                location => (
                  <PillButton
                    key={location}
                    text={location}
                    onRemove={() => {
                      setTrialSessionsFiltersSequence({
                        trialLocations: {
                          action: 'remove',
                          trialLocation: location,
                        },
                      });
                    }}
                  />
                ),
              )}
            </div>
          </div>
          <div className="grid-col">
            <div className="margin-bottom-1">
              <label className="usa-label" htmlFor="judge-filter">
                Judge <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch2
                id="judges"
                name="judges"
                options={trialSessionsHelper.trialSessionJudgeOptions}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: { name: '', userId: '' },
                }}
                onChange={inputValue => {
                  if (inputValue) {
                    setTrialSessionsFiltersSequence({
                      judges: {
                        action: 'add',
                        judge: inputValue.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.judges).map(judge => (
                <PillButton
                  key={judge.userId}
                  text={judge.name}
                  onRemove={() => {
                    setTrialSessionsFiltersSequence({
                      judges: {
                        action: 'remove',
                        judge,
                      },
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          link
          disabled={trialSessionsHelper.isResetFiltersDisabled}
          tooltip="Reset Filters"
          onClick={() => resetTrialSessionsFiltersSequence()}
        >
          Reset Filters
        </Button>
      </>
    );
  },
);

TrialSessions.displayName = 'TrialSessions';
