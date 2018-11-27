import { connect } from '@cerebral/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sequences, state } from 'cerebral';
import moment from 'moment';
import React from 'react';

/**
 *
 */
export default connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    user: state.user,
    showDetails: state.paymentInfo.showDetails,
    togglePaymentDetails: sequences.togglePaymentDetails,
  },
  function CaseDetail({
    baseUrl,
    caseDetail,
    user,
    showDetails,
    togglePaymentDetails,
  }) {
    return (
      <section className="usa-section usa-grid">
        <h1 tabIndex="-1">Docket number: {caseDetail.docketNumber}</h1>
        <p>
          {user.firstName} {user.lastName}, Petitioner v. Commissioner of
          Internal Revenue, Respondent
        </p>
        <br />
        <h2>Required actions</h2>
        <ul className="usa-accordion">
          <li>
            <button
              className="usa-accordion-button"
              aria-expanded={showDetails}
              aria-controls="paymentInfo"
              id="actions-button"
              onClick={() => togglePaymentDetails()}
            >
              <span>
                <FontAwesomeIcon icon="flag" color="#CD2026" size="sm" /> Pay
                $60.00 filing fee.
              </span>
            </button>
            {showDetails && (
              <div
                id="paymentInfo"
                className="usa-accordion-content usa-grid-full"
                aria-hidden="false"
              >
                <div className="usa-width-one-half">
                  <h3>Pay by debit card/credit card.</h3>
                  <p>Copy your docket number(s) and pay online.</p>
                  <div id="paygov-link-container">
                    <a
                      className="usa-button"
                      href="https://pay.gov/public/form/start/60485840"
                      aria-label="pay.gov u.s. tax court filing fees"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pay now
                    </a>
                  </div>
                  <p>
                    <i>
                      Note: it may take up to X days for your payment to appear
                      online.
                    </i>
                  </p>
                </div>
                <div className="usa-width-one-half">
                  <h4>Canʼt afford to pay the fee?</h4>
                  <p>
                    You may be eligible for a filing fee waiver. File an
                    application to request a waiver.
                  </p>
                  <p>
                    <a
                      href="https://www.ustaxcourt.gov/forms/Application_for_Waiver_of_Filing_Fee.pdf"
                      aria-label="View download application pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download application
                    </a>
                  </p>
                  <h4>Mail in payment</h4>
                  <p>Make checks/money order payable to:</p>
                  <address>
                    Clerk, United States Tax Court
                    <br />
                    400 2nd St NW
                    <br />
                    Washington, DC 20217
                    <br />
                  </address>
                </div>
              </div>
            )}
          </li>
        </ul>
        <h2>Case activities</h2>
        <table className="responsive-table" id="case-activities">
          <thead>
            <tr>
              <th>Activity date</th>
              <th>Filings and proceedings</th>
              <th>Date served</th>
            </tr>
          </thead>
          <tbody>
            {!caseDetail.documents.length && (
              <tr>
                <td colSpan="3">(none)</td>
              </tr>
            )}
            {caseDetail.documents.map((item, idx) => (
              <tr key={idx}>
                <td className="responsive-title">
                  <span className="responsive-label">Activity date</span>
                  {moment(item.createdAt).format('LLL')}
                </td>
                <td>
                  <span className="responsive-label">
                    Filings and proceedings
                  </span>
                  <a
                    className="pdf-link"
                    aria-label="View PDF"
                    href={
                      baseUrl +
                      '/documents/' +
                      item.documentId +
                      '/downloadPolicy'
                    }
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <FontAwesomeIcon icon="file-pdf" />
                    {item.documentType}
                  </a>
                </td>
                <td>{item.dateServed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  },
);
