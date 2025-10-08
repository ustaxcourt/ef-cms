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
            className="fa-icon-blue"
            data-prefix="fas"
            data-icon="calendar-plus"
            role="img"
            aria-label="Manually added indicator"
          />
          {showLeadCaseIcon && (
            <span aria-hidden={true} className="fa-inverse lead-case-icon-text">
              L
            </span>
          )}
        </span>
      )}
    </>
  );
};

ConsolidatedCaseIcon.displayName = 'ConsolidatedCaseIcon';
