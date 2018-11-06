import { connect } from '@cerebral/react';
import React from 'react';

/**
 * Footer
 */
export default connect(
  {},
  function Footer() {
    return (
      <footer className="usa-footer usa-footer-medium site" role="contentinfo">
        <div className="footer-section-bottom">
          <div className="usa-grid"></div>
        </div>
      </footer>
    );
  },
);
