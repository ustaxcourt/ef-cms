import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CityInfo } from '@web-client/presenter/computeds/trialSessionPlanningReportViewHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state as cerebralState } from '@web-client/presenter/app.cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const TrialSessionPlanningReportView = connect(
  {
    trialSessionPlanningReportData:
      cerebralState.trialSessionPlanningReportData,
    trialSessionPlanningReportViewHelper:
      cerebralState.trialSessionPlanningReportViewHelper,
  },
  function TrialSessionPlanningReportView({
    trialSessionPlanningReportData,
    trialSessionPlanningReportViewHelper,
  }) {
    const { trialTerm, trialYear } = trialSessionPlanningReportData;
    const { citiesNotCalendaredInTwoPreviousTerms } =
      trialSessionPlanningReportViewHelper;

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
          trialTerm={trialTerm}
          trialYear={trialYear}
        />

        <CitiesNotCalendaredInPastTwoTerms
          cities={citiesNotCalendaredInTwoPreviousTerms}
        ></CitiesNotCalendaredInPastTwoTerms>

        <TrialSessionPlanningReportTable
          locationData={trialSessionPlanningReportData.trialLocationData}
          previousTerms={trialSessionPlanningReportData.previousTerms}
        />
      </>
    );
  },
);

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReport';

type TrialSessionPlanningReportHeaderParams = {
  trialTerm: string;
  trialYear: number;
};

function TrialSessionPlanningReportHeader({
  trialTerm,
  trialYear,
}: TrialSessionPlanningReportHeaderParams) {
  return (
    <div className="grid-container display-flex height-6">
      <div
        className="flex-auto border-bottom-2px border-primary"
        style={{
          fontFamily: 'Noto Serif JP',
          fontSize: '32px',
        }}
      >
        {trialTerm} {trialYear}
      </div>
      <div className="flex-fill text-right height-6 border-bottom-1px border-gray-10">
        <Button
          link
          className="margin-bottom-3"
          href="/trial-sessions"
          icon="print"
        >
          Print
        </Button>
      </div>
    </div>
  );
}

function TrialSessionPlanningReportTable({ locationData, previousTerms }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>All</th>
            <th>Small</th>
            <th>Regular</th>
            {previousTerms.map((term, index) => {
              return <th key={`th-${index}`}>{term.termDisplay}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {locationData &&
            locationData.map((trialLocation, idx) => {
              return (
                <tr key={`row-${idx}`}>
                  <td>{trialLocation.trialCityState}</td>
                  <td>{trialLocation.allCaseCount}</td>
                  <td>{trialLocation.smallCaseCount}</td>
                  <td>{trialLocation.regularCaseCount}</td>
                  {trialLocation.previousTermsData &&
                    trialLocation.previousTermsData.map((prevTerm, index) => {
                      const hasData =
                        Array.isArray(prevTerm) && prevTerm.length > 0;

                      return (
                        <td key={`${idx}-${index}`}>
                          {hasData &&
                            prevTerm.map(data => (
                              <div key={`datum-${idx}`}>{data}</div>
                            ))}
                          {!hasData && <div className="calendar-icon" />}
                        </td>
                      );
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

type CitiesNotCalendaredInPastTwoTermsParams = {
  cities: CityInfo[][];
};

function CitiesNotCalendaredInPastTwoTerms({
  cities,
}: CitiesNotCalendaredInPastTwoTermsParams) {
  return (
    <div className="grid-container margin-top-5">
      <div className="border-1px border-gray-30">
        <div
          className="bg-yellow padding-top-2 padding-bottom-2 padding-left-3 border-bottom-1px border-gray-30"
          style={{
            fontWeight: 600,
          }}
        >
          <FontAwesomeIcon
            className="fa-icon-blue-vivid margin-right-2"
            icon="info-circle"
            size="lg"
          />
          Cities not calendared in two previous terms:
        </div>
        <div className="grid-row margin-top-3 margin-bottom-3 margin-left-10 margin-right-10">
          {cities
            .filter(cg => !!cg.length)
            .map(cityGroup => (
              <div
                className="grid-col-3"
                key={`column-${cityGroup[0].city},${cityGroup[0].state}`}
              >
                {cityGroup.map(({ city, state: locationState }) => (
                  <CityInformation
                    city={city}
                    key={`${city},${locationState}`}
                    state={locationState}
                  />
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function CityInformation({ city, state: locationState }: CityInfo) {
  return (
    <div className="padding-bottom-1 margin-right-1">
      {city}, {locationState}
    </div>
  );
}
