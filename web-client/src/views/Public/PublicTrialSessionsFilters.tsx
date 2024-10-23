import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const ROOT = 'publicTrialSessionData';
const props = {
  publicTrialSessionData: state[ROOT],
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const PublicTrialSessionsFilters = connect(
  props,
  function ({
    publicTrialSessionData,
    publicTrialSessionsHelper,
    updateFormValueSequence,
  }) {
    const PROCEEDING_TYPES = Object.entries({
      all: 'All',
      ...TRIAL_SESSION_PROCEEDING_TYPES,
    });

    const {
      judges = {},
      locations = {},
      proceedingType = 'All',
      sessionTypes = {},
    } = publicTrialSessionData;

    function proceedingTypeRadioOption(key: string, value: string) {
      return (
        <div className="usa-radio usa-radio__inline" key={key}>
          <input
            aria-describedby="proceeding-type-legend"
            checked={proceedingType === value}
            className="usa-radio__input"
            id={`${key}-proceeding`}
            name="proceedingType"
            type="radio"
            value={value}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                root: ROOT,
                value: e.target.value,
              });
            }}
          />
          <label
            aria-label={value}
            className="smaller-padding-right usa-radio__label"
            data-testid={`${value}-proceeding-label`}
            htmlFor={`${key}-proceeding`}
            id={`${key}-proceeding-label`}
          >
            {value}
          </label>
        </div>
      );
    }

    return (
      <>
        <div>
          Information on this page is current as of{' '}
          {publicTrialSessionsHelper.fetchedDateString}
        </div>

        <FormGroup>
          <fieldset
            className="usa-fieldset margin-top-2"
            data-testid="trial-session-proceeding-type"
          >
            <legend className="usa-legend" id="proceeding-type-legend">
              Proceeding type
            </legend>
            {PROCEEDING_TYPES.map(([key, value]) =>
              proceedingTypeRadioOption(key, value),
            )}
          </fieldset>
        </FormGroup>

        <div className="tablet:grid-col grid-col-12">
          <div className="grid-row">
            <div className="tablet:grid-col-4 grid-col-12 padding-right-2">
              <div className="margin-bottom-1">
                <label
                  className="usa-label"
                  htmlFor="session-type-filter"
                  id="session-type-filter-label"
                >
                  Session type{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="session-type-filter-label"
                  data-testid="trial-session-type-filter-search"
                  inputId="session-type-filter"
                  name="sessionType"
                  options={publicTrialSessionsHelper.sessionTypeOptions}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: '',
                  }}
                  onChange={sessionType => {
                    if (sessionType) {
                      updateFormValueSequence({
                        key: `sessionTypes.${sessionType.value}`,
                        root: ROOT,
                        value: sessionType.label,
                      });
                    }
                  }}
                />
              </div>
              <div>
                {Object.entries(
                  sessionTypes as {
                    [key: string]: string;
                  },
                ).map(([sessionTypeKey, sessionTypeLabel]) => (
                  <PillButton
                    key={sessionTypeLabel}
                    text={sessionTypeLabel}
                    onRemove={() => {
                      updateFormValueSequence({
                        key: `sessionTypes.${sessionTypeKey}`,
                        root: ROOT,
                        value: undefined,
                      });
                      console.log('sessionType', sessionTypeLabel);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="tablet:grid-col-4 grid-col-12 padding-right-2">
              <div className="margin-bottom-1">
                <label
                  className="usa-label"
                  htmlFor="session-type-filter"
                  id="session-type-filter-label"
                >
                  Location{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="location-filter-label"
                  data-testid="trial-session-location-filter-search"
                  inputId="location-filter"
                  name="location"
                  options={publicTrialSessionsHelper.trialCitiesByState}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: '',
                  }}
                  onChange={location => {
                    if (location) {
                      updateFormValueSequence({
                        key: `locations.${location.value}`,
                        root: ROOT,
                        value: location.label,
                      });
                    }
                  }}
                />
              </div>
              <div>
                {Object.entries(
                  locations as {
                    [key: string]: string;
                  },
                ).map(([locationKey, locationLabel]) => (
                  <PillButton
                    key={locationLabel}
                    text={locationLabel}
                    onRemove={() => {
                      updateFormValueSequence({
                        key: `locations.${locationKey}`,
                        root: ROOT,
                        value: undefined,
                      });
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="tablet:grid-col-4 grid-col-12 padding-right-2">
              <div className="margin-bottom-1">
                <label
                  className="usa-label"
                  htmlFor="judges-filter"
                  id="judges-filter-label"
                >
                  Judge <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="judges-filter-label"
                  data-testid="trial-session-judge-filter-search"
                  inputId="judges-filter"
                  name="judges"
                  options={publicTrialSessionsHelper.trialSessionJudgeOptions}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: { name: '', userId: '' },
                  }}
                  onChange={judgeInfo => {
                    if (judgeInfo) {
                      updateFormValueSequence({
                        key: `judges.${judgeInfo.value.name}`,
                        root: ROOT,
                        value: judgeInfo.value.name,
                      });
                    }
                  }}
                />
              </div>
              <div>
                {Object.entries(judges as { [key: string]: string }).map(
                  ([judgeKey, judgeLabel]) => (
                    <PillButton
                      key={judgeKey}
                      text={judgeLabel}
                      onRemove={() => {
                        updateFormValueSequence({
                          key: `judges.${judgeKey}`,
                          root: ROOT,
                          value: undefined,
                        });
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
