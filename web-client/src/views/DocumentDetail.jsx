import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { state } from 'cerebral';
import React from 'react';

import ErrorNotification from './ErrorNotification';
import SuccessNotification from './SuccessNotification';

export default connect(
  {
    workItems: state.extractedWorkItems,
    caseDetail: state.formattedCaseDetail,
    document: state.extractedDocument,
  },
  function DocumentDetail({ workItems, caseDetail, document }) {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid">
          <h1 className="captioned" tabIndex="-1">
            Docket number: {caseDetail.docketNumber}
          </h1>
          <p>
            Tax Payer Petitioner v. Commissioner of Internal Revenue, Respondent
          </p>
          <p>
            <span
              className="usa-label case-status-label"
              aria-label={'status: general docket'}
            >
              <span aria-hidden="true">{caseDetail.status}</span>
            </span>
          </p>
          <hr />
          <SuccessNotification />
          <ErrorNotification />
          <div className="usa-grid-full">
            <div className="usa-width-one-third card">
              <h2>{document.documentType}</h2>
              <div className="usa-grid-full subsection">
                <div className="usa-width-one-half">
                  <span className="label">Date filed</span>
                  <p>{document.createdAtFormatted}</p>
                </div>
                <div className="usa-width-one-half">
                  <span className="label">Filed by</span>
                  <p>{document.userId}</p>
                </div>
              </div>
              <span className="label">Messages</span>
              {workItems.map((workItem, idx) => (
                <div className="card" key={idx}>
                  <div className="subsection">
                    <span className="label">
                      {workItem.messages[workItem.messages.length - 1].sentBy}
                    </span>
                    <span className="float-right">
                      {
                        workItem.messages[workItem.messages.length - 1]
                          .createdAtFormatted
                      }
                    </span>
                  </div>
                  <p>
                    {workItem.messages[workItem.messages.length - 1].message}
                  </p>
                  <div className="subsection">
                    <span>{workItem.assigneeName}</span>
                    <span className="float-right">
                      <a href="/">Forward</a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="usa-width-two-thirds">
              <iframe src="https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf" />
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  },
);
