import { Icon } from './Icon';
import React from 'react';

export const ConsolidatedCaseIcon = ({
  consolidatedIconTooltipText,
  inConsolidatedGroup,
  showLeadCaseIcon,
}: {
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string | undefined;
  showLeadCaseIcon: boolean;
}) => {
  return (
    <>
      {inConsolidatedGroup && (
        <span className="fa-layers fa-fw" title={consolidatedIconTooltipText}>
          <Icon
            aria-label={consolidatedIconTooltipText}
            className="fa-icon-blue"
            icon="copy"
          />
          {showLeadCaseIcon && (
            <span className="fa-inverse lead-case-icon-text">L</span>
          )}
        </span>
      )}
    </>
  );
};

ConsolidatedCaseIcon.displayName = 'ConsolidatedCaseIcon';
