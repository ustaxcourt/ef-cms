import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from '@cerebral/react';

export default connect(
  {},
  function CaseDifferenceExplained() {
    return (
      <div className="subsection case-difference">
        <h3 id="small-case-qualifications">
          Do I Qualify for a Small Tax Case Procedure?
        </h3>
        <p>
          Small cases must adhere to the following dollar limits depending on
          the notice you received:
        </p>
        <table
          aria-labelledby="small-case-qualifications"
          className="responsive-table small-case-qualifications-table"
        >
          <thead>
            <tr>
              <th>Deficiency</th>
              <th>Collection</th>
              <th>Spousal Relief</th>
              <th>Worker Classification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className="responsive-label">Deficiency</span>
                &lt; $50,000 for each year
              </td>
              <td>
                <span className="responsive-label">Collection</span>
                &lt; $50,000 for all years
              </td>
              <td>
                <span className="responsive-label">Spousal Relief</span>
                &lt; $50,000 for all years
              </td>
              <td>
                <span className="responsive-label">Worker Classification</span>
                &lt; $50,000 for any calendar quarter
              </td>
            </tr>
          </tbody>
        </table>

        <h3>If You File as a Small Tax Case, You’ll Have:</h3>
        <div role="list" className="small-case-features usa-grid-full">
          <div role="listitem" className="usa-width-one-fourth feature">
            <h4>More Location Options</h4>
            <p>
              Small case trials are held in 15 more locations than regular cases
            </p>
          </div>
          <div role="listitem" className="usa-width-one-fourth feature">
            <h4>Less Formal Procedures</h4>
            <p>
              Small case pre-trial and trial procedures are less formal than
              regular cases
            </p>
          </div>
          <div role="listitem" className="usa-width-one-fourth feature">
            <h4>Relaxed Evidence Rules</h4>
            <p>Judges can consider any evidence that’s relevant</p>
          </div>
          <div role="listitem" className="usa-width-one-fourth feature warning">
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
    );
  },
);
