import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const Privacy = connect(
  {
    alertHelper: state.alertHelper,
    gotoPublicSearchSequence: sequences.gotoPublicSearchSequence,
    isPublic: state.isPublic,
  },
  function Privacy() {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-6">
                <h1 className="captioned" tabIndex={-1}>
                  Privacy
                </h1>
              </div>
            </div>
          </div>
        </div>
        <section className="grid-container margin-bottom-5">
          <p>
            DAWSON is a U.S. Tax Court federal government system, for official
            use by U.S. government employees, petitioners, practitioners, and
            the general public.
          </p>

          <p>
            Use of DAWSON may be monitored, recorded, and subject to audit by
            the U.S. Tax Court. There is no expectation of privacy for users of
            this system. By continuing to use this system, you consent to your
            use being monitored and recorded.
          </p>

          <p>
            Acceptable uses of DAWSON include electronically filing documents,
            managing cases, internal U.S. Tax Court workflow, and finding a
            case, order, or opinion.
          </p>

          <p>
            Unauthorized uses, including attempts to access, upload, or change
            information, are strictly prohibited. Individuals performing
            unauthorized use may be punishable by law, including the Computer
            Fraud and Abuse Act of 1986 and the National Information
            Infrastructure Protection Act of 1996.
          </p>

          <p>
            If you have questions about privacy or acceptable use, please email{' '}
            <a href="mailto:dawson.support@ustaxcourt.gov">
              dawson.support@ustaxcourt.gov
            </a>
            .
          </p>
        </section>
      </>
    );
  },
);

Privacy.displayName = 'Privacy';
