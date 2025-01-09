import {
  PreviousTerm,
  TrialLocationData,
} from '@shared/business/utilities/trialSessionPlanningReport/trialSessionPlanningReportDataTypes';
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

      <CitiesNotCalendaredInPastTwoTerms
        locationData={locationData}
      ></CitiesNotCalendaredInPastTwoTerms>

      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>All</th>
            <th>Small</th>
            <th>Regular</th>
            {previousTerms.map(getTermHeaders)}
            <th>Special</th>
            <th>Blocked</th>
          </tr>
        </thead>
        <tbody>
          {locationData &&
            locationData.map((trialLocation, idx) => {
              return (
                <tr
                  key={`row-${idx}`}
                  style={{
                    backgroundColor:
                      getAllCitiesNotCalendaredInTwoPreviousTerms(
                        locationData,
                      ).includes(trialLocation.trialCityState)
                        ? '#FFE396'
                        : '',
                  }}
                >
                  <td>{trialLocation.trialCityState}</td>
                  <td>{trialLocation.allCaseCount}</td>
                  <td>{trialLocation.smallCaseCount}</td>
                  <td>{trialLocation.regularCaseCount}</td>
                  {trialLocation.previousTermsData &&
                    trialLocation.previousTermsData.map(
                      getLocationDataFactory(idx),
                    )}
                  <td>{trialLocation.specialCaseCount}</td>
                  <td>{trialLocation.blockedCaseCount}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

function getAllCitiesNotCalendaredInTwoPreviousTerms(
  trialLocationData: TrialLocationData[],
): string[] {
  return trialLocationData
    .filter(locationData => {
      return (
        !locationData.previousTermsData[0].length &&
        !locationData.previousTermsData[1].length
      );
    })
    .map(locationData => locationData.trialCityState)
    .sort();
}

export function formatCities(
  allCities: string[],
  numberOfCols: number = 4,
): string[][] {
  const NUMBER_OF_COLUMNS = numberOfCols;
  const equalParts = Math.floor(allCities.length / NUMBER_OF_COLUMNS);
  const remainderCount = allCities.length % NUMBER_OF_COLUMNS;
  const results = Array.from(
    { length: NUMBER_OF_COLUMNS },
    () => [] as string[],
  );

  for (let index = 0; index < NUMBER_OF_COLUMNS; index++) {
    const poppedElements = allCities.splice(0, equalParts);
    results[index].push(...poppedElements);

    if (remainderCount < 0) continue;
    if (index >= remainderCount) continue;
    const remainingElement = allCities.splice(0, 1);
    results[index].push(...remainingElement);
  }

  return results;
}

type CitiesNotCalendaredInPastTwoTermsParams = {
  locationData: TrialLocationData[];
};

function CitiesNotCalendaredInPastTwoTerms({
  locationData,
}: CitiesNotCalendaredInPastTwoTermsParams) {
  const cities = formatCities(
    getAllCitiesNotCalendaredInTwoPreviousTerms(locationData),
    3,
  );
  return (
    <>
      <table style={{ marginBottom: '20px', width: '100%' }}>
        <thead>
          <th colSpan={4} style={{ backgroundColor: '#FFE396' }}>
            Cities not calendared in two previous terms:
          </th>
        </thead>
        <tbody>
          <tr>
            {cities.map((cityLocations, index) => (
              <td key={index}>
                {cityLocations.map(location => (
                  <div key={location}>{location}</div>
                ))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </>
  );
}
