import React from 'react';
import { connect } from '@cerebral/react';

/**
 * Footer
 */
export default connect(
  {},
  function Footer() {
    return (
      <footer className="usa-footer usa-footer-medium site" role="contentinfo">
        <div className="footer-section-bottom">
          <div className="usa-grid">
            To contact the Webmaster for technical issues or problems with the
            Web site, send an e-mail to{' '}
            <a href="mailto:webmaster@ustaxcourt.gov">
              webmaster@ustaxcourt.gov
            </a>
            . For your information, no documents can be filed with the Court at
            this or any other e-mail address. For all non-technical questions,
            including procedural, case-related, or general questions about the
            Court, you must contact the Office of the Clerk of the Court at
            (202) 521-0700 or by postal mail at U.S. Tax Court, 400 Second
            Street, N.W., Washington, DC 20217, Attention: Office of the Clerk
            of the Court.
          </div>
        </div>
      </footer>
    );
  },
);
