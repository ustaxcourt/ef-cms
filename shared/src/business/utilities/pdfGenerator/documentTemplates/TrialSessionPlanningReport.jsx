const React = require('react');

const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

const getTermHeaders = (termData, idx) => {
  return (
    <th key={`th-${idx}`}>
      {termData.name} {termData.year}
    </th>
  );
};

const getRowContent = data => {
  data && data.map((datum, idx) => <div key={`datum-${idx}`}>{datum}</div>);
};

const getLocationData = parentIndex => (location, idx) => {
  const content = getRowContent(location);
  return (
    <td key={`${parentIndex}-${idx}`}>
      {content}
      {!content && <div className="calendar-icon"></div>}
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
            <th>State</th>
            {previousTerms.map(getTermHeaders)}
          </tr>
        </thead>
        <tbody>
          {locationData &&
            locationData.map((location, idx) => {
              return (
                <tr key={`row-${idx}`}>
                  <td>{location.stateAbbreviation}</td>
                  <td>{location.trialCityState}</td>
                  <td>{location.allCaseCount}</td>
                  <td>{location.smallCaseCount}</td>
                  <td>{location.regularCaseCount}</td>
                  <td>{location.stateAbbreviation}</td>
                  {location.previousTermsData &&
                    location.previousTermsData.map(getLocationData(idx))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
