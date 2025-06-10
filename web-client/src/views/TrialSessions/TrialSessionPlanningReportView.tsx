import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  PreviousTermFormatted,
  TrialLocationDataFormatted,
} from '@web-client/presenter/computeds/trialSessionPlanningReportViewHelper';
import {
  state as cerebralState,
  sequences,
} from '@web-client/presenter/app.cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const TrialSessionPlanningReportView = connect(
  {
    runTrialSessionPlanningReportSequence:
      sequences.runTrialSessionPlanningReportSequence,
    trialSessionPlanningReportViewHelper:
      cerebralState.trialSessionPlanningReportViewHelper,
  },
  function TrialSessionPlanningReportView({
    runTrialSessionPlanningReportSequence,
    trialSessionPlanningReportViewHelper,
  }) {
    const {
      citiesNotCalendaredInTwoPreviousTerms,
      trialSessionPlanningReportHeader,
    } = trialSessionPlanningReportViewHelper;

    return (
      <>
        <BigHeader text="Trial Session Planning Report" />
        <div className="grid-container">
          <Button
            link
            className="margin-bottom-3"
            href="/trial-sessions"
            icon={['fa', 'arrow-alt-circle-left']}
          >
            Back to Trial Sessions
          </Button>
        </div>
        <TrialSessionPlanningReportHeader
          printSequence={runTrialSessionPlanningReportSequence}
          term={trialSessionPlanningReportViewHelper.trialTerm}
          trialSessionPlanningReportHeader={trialSessionPlanningReportHeader}
          year={trialSessionPlanningReportViewHelper.trialYear}
        />

        <CitiesNotCalendaredInPastTwoTerms
          cities={citiesNotCalendaredInTwoPreviousTerms}
        ></CitiesNotCalendaredInPastTwoTerms>

        <TrialSessionPlanningReportTable
          locationData={
            trialSessionPlanningReportViewHelper.trialLocationDataFormatted
          }
          previousTerms={
            trialSessionPlanningReportViewHelper.previousTermsFormatted
          }
        />
      </>
    );
  },
);

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReportView';

type TrialSessionPlanningReportHeaderParams = {
  trialSessionPlanningReportHeader: string;
  term: string;
  year: string;
  printSequence: typeof sequences.runTrialSessionPlanningReportSequence;
};

function TrialSessionPlanningReportHeader({
  printSequence,
  term,
  trialSessionPlanningReportHeader,
  year,
}: TrialSessionPlanningReportHeaderParams) {
  return (
    <div className="grid-container display-flex">
      <h1 className="padding-bottom-2 margin-bottom-0 h1-underline-border">
        {trialSessionPlanningReportHeader}
      </h1>
      <div className="flex-fill text-right border-bottom-1px border-gray-10">
        <Button
          link
          icon="print"
          onClick={() => {
            printSequence({
              term,
              year,
            });
          }}
        >
          Print
        </Button>
      </div>
    </div>
  );
}

type TrialSessionPlanningReportTableParams = {
  locationData: TrialLocationDataFormatted[];
  previousTerms: PreviousTermFormatted[];
};

function TrialSessionPlanningReportTable({
  locationData,
  previousTerms,
}: TrialSessionPlanningReportTableParams) {
  return (
    <div className="grid-container padding-top-3">
      <table className="usa-table ustc-table">
        <thead>
          <tr>
            <th></th>
            <th>Location</th>
            <th>All</th>
            <th>Small</th>
            <th>Regular</th>
            {previousTerms.map(term => {
              return (
                <th key={`th-${term.termDisplayFormatted}`}>
                  {term.termDisplayFormatted}
                </th>
              );
            })}
            <th>Special</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {locationData &&
            locationData.map(trialLocation => {
              return (
                <tr
                  className={
                    trialLocation.hasNotBeenCalendared
                      ? 'cities-not-calendated-yellow-background'
                      : undefined
                  }
                  key={`row-${trialLocation.trialCityState}`}
                >
                  <td>
                    {trialLocation.hasNotBeenCalendared && (
                      <FontAwesomeIcon
                        className="fa-icon-blue margin-right-2"
                        icon="info-circle"
                        size="lg"
                        title={trialLocation.lastVisitedDateFormatted}
                      />
                    )}
                  </td>
                  <td
                    data-testid={`trial-location-link-${trialLocation.trialCityState}`}
                    aria-label="hyperlink to trial location details"
                  >
                    <a href={trialLocation.trialLocationUrl}>
                      {trialLocation.trialCityState}
                    </a>
                  </td>
                  <td>{trialLocation.allCaseCount}</td>
                  <td>{trialLocation.smallCaseCount}</td>
                  <td>{trialLocation.regularCaseCount}</td>
                  {trialLocation.previousTermsData.map((prevTerm, index) => {
                    const hasData =
                      Array.isArray(prevTerm) && prevTerm.length > 0;

                    return (
                      <td
                        key={`${trialLocation.trialCityState}-previous-term-col`}
                      >
                        {hasData ? (
                          prevTerm.map(data => (
                            <div
                              key={`${trialLocation.trialCityState}-previous-term-${data}`}
                            >
                              {data}
                            </div>
                          ))
                        ) : (
                          <FontAwesomeIcon
                            aria-label={`${trialLocation.trialCityState} not scheduled for ${previousTerms[index].term} ${previousTerms[index].year}.`}
                            className="padding-1px"
                            icon={['far', 'calendar-times']}
                            size="lg"
                          />
                        )}
                      </td>
                    );
                  })}
                  <td>{trialLocation.specialCaseCount}</td>
                  <td>{trialLocation.blockedCaseCount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

type CitiesNotCalendaredInPastTwoTermsParams = {
  cities: string[][];
};

function CitiesNotCalendaredInPastTwoTerms({
  cities,
}: CitiesNotCalendaredInPastTwoTermsParams) {
  return (
    <div
      className="grid-container margin-top-5"
      data-testid="cities-not-calendared-in-past-two-terms-table"
    >
      <div className="border-1px border-gray-30">
        <div className="cities-not-calendated-yellow-background padding-top-2 padding-bottom-2 padding-left-3 border-bottom-1px border-gray-30 cities-not-calendared-header">
          <FontAwesomeIcon
            className="fa-icon-blue margin-right-2"
            icon="info-circle"
            size="lg"
          />
          Cities not calendared in two previous terms:
        </div>
        <div className="grid-row margin-top-3 margin-bottom-3 margin-left-10 margin-right-10">
          {cities
            .filter(cg => !!cg.length)
            .map(cityGroup => (
              <div className="grid-col-3" key={`column-${cityGroup[0]}`}>
                {cityGroup.map(trialCityState => (
                  <div
                    className="padding-bottom-1 margin-right-1"
                    key={trialCityState}
                  >
                    {trialCityState}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
