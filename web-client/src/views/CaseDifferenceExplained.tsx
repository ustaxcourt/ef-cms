import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const CaseDifferenceExplained = () => {
  return (
    <div className="subsection case-difference">
      <h2 className="which-procedure-header">
        Which Case Procedure Should I Choose?
      </h2>
      <h3 className="margin-bottom-4">Do I Qualify for a Small Tax Case?</h3>
      <p>
        For specific case types, the amount of the tax owed will affect whether
        or not you qualify to select a small tax case procedure. And if you do
        qualify, you don’t have to select a small case procedure.
      </p>
      <table
        aria-labelledby="small-case-qualifications"
        className="usa-table responsive-table ustc-table small-case-qualifications-table"
      >
        <thead>
          <tr>
            <th>Case Type</th>
            <th>Dollar Limit to Qualify for Small Tax Case</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Deficiency</td>
            <td>
              The amount of deficiency (including any additions to tax and
              penalties) cannot exceed $50,000 for any one year
            </td>
          </tr>
          <tr>
            <td>Collection (Lien/Levy)</td>
            <td>
              The total amount of unpaid tax cannot exceed $50,000 for all years
              combined
            </td>
          </tr>
          <tr>
            <td>Innocent Spouse Relief</td>
            <td>
              The amount of spousal relief sought cannot exceed $50,000 for all
              years combined
            </td>
          </tr>
          <tr>
            <td>Worker Classification</td>
            <td>
              The amount in dispute cannot exceed $50,000 for any calendar
              quarter
            </td>
          </tr>
          <tr>
            <td>Interest Abatement</td>
            <td>The amount of the abatement sought cannot exceed $50,000</td>
          </tr>
          {[
            'Partnership',
            'Whistleblower cases',
            'Passport cases',
            'Declaratory Judgment cases',
          ].map(caseType => (
            <tr key={caseType}>
              <td>{caseType}</td>
              <td>Not eligible for Small tax case type</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>If you file as a small tax case, you’ll have:</h3>
      <div
        className="small-case-features grid-container padding-x-0"
        role="list"
      >
        <div className="grid-row grid-gap-3">
          <div className="tablet:grid-col-3" role="listitem">
            <div className="feature benefit">
              <h5>
                <FontAwesomeIcon icon="check-circle" />
                More Trial Location Options
              </h5>
              <p>
                Small case trials are held in 15 more locations than regular
                cases
              </p>
            </div>
          </div>
          <div className="tablet:grid-col-3" role="listitem">
            <div className="feature benefit">
              <h5>
                <FontAwesomeIcon icon="check-circle" />
                Less Formal Procedures
              </h5>
              <p>
                Small case pre-trial and trial procedures are less formal than
                regular cases
              </p>
            </div>
          </div>
          <div className="tablet:grid-col-3" role="listitem">
            <div className="feature benefit">
              <h5>
                <FontAwesomeIcon icon="check-circle" />
                Relaxed Evidence Rules
              </h5>
              <p>Judges can consider any evidence that’s relevant</p>
            </div>
          </div>
          <div className="tablet:grid-col-3" role="listitem">
            <div className="feature warning">
              <h5>
                <FontAwesomeIcon icon="exclamation-triangle" />
                No Appeals Process
              </h5>
              <p>
                If you lose your case, or lose some issues in your case, you
                can’t appeal the decision
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CaseDifferenceExplained.displayName = 'CaseDifferenceExplained';
