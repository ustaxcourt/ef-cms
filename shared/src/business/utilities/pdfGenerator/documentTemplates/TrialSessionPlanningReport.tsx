/* eslint-disable react/no-array-index-key */
import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/useCases/trialSessions/runTrialSessionPlanningReportInteractor';
import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import React from 'react';

const getTermHeaders = (termData: PreviousTerm, idx: number) => {
  return <th key={`th-${idx}`}>{termData.termDisplay}</th>;
};

const parseTermData = (data: string[]) =>
  data && data.map((datum, idx) => <div key={`datum-${idx}`}>{datum}</div>);

const getLocationDataFactory = (parentIndex: number) =>
  function getLocationData(termData: string[], idx: number) {
    const hasData = Array.isArray(termData) && termData.length > 0;

    return (
      <td key={`${parentIndex}-${idx}`}>
        {hasData && parseTermData(termData)}
        {!hasData && <div className="calendar-icon" />}
      </td>
    );
  };

export const TrialSessionPlanningReport = ({
  locationData,
  previousTerms,
  term,
}: {
  locationData: TrialLocationData[];
  previousTerms: PreviousTerm[];
  term: string;
}) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={term} title="Trial Session Planning Report" />

      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>All</th>
            <th>Small</th>
            <th>Regular</th>
            {previousTerms.map(getTermHeaders)}
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
                    trialLocation.previousTermsData.map(
                      getLocationDataFactory(idx),
                    )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
