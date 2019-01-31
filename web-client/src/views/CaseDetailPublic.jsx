import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state } from 'cerebral';
import React from 'react';

export default connect(
  {
    caseDetail: state.formattedCaseDetail,
  },
  function CaseDetail({ caseDetail }) {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back to dashboard
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket Number: {caseDetail.docketNumberWithSuffix}
          </h1>
          <p>Petitioner v. Commissioner of Internal Revenue, Respondent</p>
        </section>
      </React.Fragment>
    );
  },
);
