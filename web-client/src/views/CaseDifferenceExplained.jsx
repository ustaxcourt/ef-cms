import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export const CaseDifferenceExplained = () => (
  <div className="subsection case-difference">
    <h2>Which case procedure should I choose?</h2>
    <p>
      Small cases must adhere to the following dollar limits depending on the
      notice you received:
    </p>
    <table
      aria-labelledby="small-case-qualifications"
      className="usa-table responsive-table small-case-qualifications-table"
    >
      <thead>
        <tr>
          <th colSpan="4">Do I qualify for a small tax case procedure?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Deficiency</th>
          <th>Collection</th>
          <th>Spousal Relief</th>
          <th>Worker Classification</th>
        </tr>
        <tr>
          <td>
            <span className="responsive-label">Deficiency</span>
            Less than $50,000 for each year
          </td>
          <td>
            <span className="responsive-label">Collection</span>
            Less than $50,000 for all years
          </td>
          <td>
            <span className="responsive-label">Spousal Relief</span>
            Less than $50,000 for all years
          </td>
          <td>
            <span className="responsive-label">Worker Classification</span>
            Less than $50,000 for any calendar quarter
          </td>
        </tr>
      </tbody>
    </table>

    <h3>If You File as a Small Tax Case, You’ll Have:</h3>
    <div className="small-case-features grid-container padding-x-0" role="list">
      <div className="grid-row">
        <div className="grid-col-3 feature" role="listitem">
          <h4>More Location Options</h4>
          <p>
            Small case trials are held in 15 more locations than regular cases
          </p>
        </div>
        <div className="grid-col-3 feature" role="listitem">
          <h4>Less Formal Procedures</h4>
          <p>
            Small case pre-trial and trial procedures are less formal than
            regular cases
          </p>
        </div>
        <div className="grid-col-3 feature" role="listitem">
          <h4>Relaxed Evidence Rules</h4>
          <p>Judges can consider any evidence that’s relevant</p>
        </div>
        <div className="grid-col-3 feature warning" role="listitem">
          <h4>
            <FontAwesomeIcon icon="exclamation-triangle" />
            No Appeals Process
          </h4>
          <p>
            If you lose your case, or lose some issues in your case, you can’t
            appeal the decision
          </p>
        </div>
      </div>
    </div>
  </div>
);
