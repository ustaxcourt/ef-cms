import { Icon } from './Icon';
import React from 'react';

/**
 * Icon component for conditionally rendering the icon for consolidated and lead cases
 *
 * @param {object} caseItem the case to be passed to the FontAwesomeIcon
 * @returns {object} a react component
 */
export const ConsolidatedCaseIcon = ({ caseItem }) => {
  return (
    caseItem.inConsolidatedGroup && (
      <span
        className="fa-layers fa-fw"
        title={caseItem.consolidatedIconTooltipText}
      >
        <Icon
          aria-label={caseItem.consolidatedIconTooltipText}
          className="fa-icon-blue"
          icon="copy"
        />
        {caseItem.leadCase && (
          <span className="fa-inverse lead-case-icon-text">L</span>
        )}
      </span>
    )
  );
};

ConsolidatedCaseIcon.displayName = 'ConsolidatedCaseIcon';
