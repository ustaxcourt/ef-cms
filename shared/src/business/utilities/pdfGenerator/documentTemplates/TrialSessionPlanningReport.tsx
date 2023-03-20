/* eslint-disable react/no-array-index-key */
const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.tsx');
const { ReportsHeader } = require('../components/ReportsHeader.tsx');

const getTermHeaders = (termData, idx) => {
  return <th key={`th-${idx}`}>{termData.termDisplay}</th>;
};

const parseTermData = data =>
  data && data.map((datum, idx) => <div key={`datum-${idx}`}>{datum}</div>);

const getLocationDataFactory = parentIndex =>
  function getLocationData(termData, idx) {
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
}) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader subtitle={term} title="Trial Session Planning Report" />

      <table>
        <thead>
          <tr>
            <th>State</th>
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
                  <td>{trialLocation.stateAbbreviation}</td>
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
