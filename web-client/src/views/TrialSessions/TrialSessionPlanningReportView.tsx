import { BigHeader } from '@web-client/views/BigHeader';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TrialLocationDataFormatted } from '@web-client/presenter/computeds/trialSessionPlanningReportViewHelper';
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
          trialSessionPlanningReportHeader={trialSessionPlanningReportHeader}
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

TrialSessionPlanningReportView.displayName = 'TrialSessionPlanningReport';

type TrialSessionPlanningReportHeaderParams = {
  trialSessionPlanningReportHeader: string;
};

function TrialSessionPlanningReportHeader({
  trialSessionPlanningReportHeader,
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
        {trialSessionPlanningReportHeader}
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

type TrialSessionPlanningReportTableParams = {
  locationData: TrialLocationDataFormatted[];
  previousTerms: { termDisplayFormatted }[];
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
            {previousTerms.map((term, index) => {
              return <th key={`th-${index}`}>{term.termDisplayFormatted}</th>;
            })}
            <th>Special</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {locationData &&
            locationData.map((trialLocation, idx) => {
              return (
                <tr
                  className={trialLocation.hasNotBeenCalendared && 'bg-yellow'}
                  key={`row-${idx}`}
                >
                  <td>
                    {trialLocation.hasNotBeenCalendared && (
                      <FontAwesomeIcon
                        className="fa-icon-blue-vivid margin-right-2"
                        icon="info-circle"
                        size="lg"
                      />
                    )}
                  </td>
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
                          {hasData ? (
                            prevTerm.map(data => (
                              <div key={`datum-${idx}`}>{data}</div>
                            ))
                          ) : (
                            <FontAwesomeIcon icon="calendar-times" size="lg" />
                          )}
                        </td>
                      );
                    })}
                  <td>{trialLocation.specialCaseCount || '-'}</td>
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
