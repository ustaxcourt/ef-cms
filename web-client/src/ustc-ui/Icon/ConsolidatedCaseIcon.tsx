import { Icon } from './Icon';
import React from 'react';

export const ConsolidatedCaseIcon = ({
  consolidatedIconTooltipText,
  inConsolidatedGroup,
  showLeadCaseIcon,
  'data-testid': dataTestId,
}: {
  inConsolidatedGroup: boolean;
  consolidatedIconTooltipText: string | undefined;
  showLeadCaseIcon: boolean;
  'data-testid'?: string;
}) => {
  return (
    <>
      {inConsolidatedGroup && (
        <span
          className="fa-layers fa-fw"
          title={consolidatedIconTooltipText}
          data-testid={dataTestId}
        >
          <Icon
            aria-label={consolidatedIconTooltipText}
            className="fa-icon-blue"
            icon="copy"
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
