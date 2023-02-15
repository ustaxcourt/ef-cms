import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { Icon } from '../ustc-ui/Icon/Icon';
import React from 'react';

const getCaseRow = ({
  formattedCase,
  isNestedCase,
  onlyLinkIfRequestedUserAssociated,
  onlyText,
}) => {
  return (
    <React.Fragment key={formattedCase.docketNumber}>
      <tr>
        <td>
          {formattedCase.isInConsolidatedGroup && (
            <>
              <span
                className="fa-layers fa-fw"
                title={formattedCase.consolidatedIconTooltipText}
              >
                <Icon
                  aria-label={formattedCase.consolidatedIconTooltipText}
                  className="fa-icon-blue"
                  icon="copy"
                />
                {formattedCase.isLeadCase && (
                  <span className="fa-inverse lead-case-icon-text">L</span>
                )}
              </span>
            </>
          )}
        </td>
        <td className="hide-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
          </div>
        </td>
        <td className="hide-on-mobile">{formattedCase.caseTitle}</td>
        <td>{formattedCase.createdAtFormatted}</td>
        <td className="show-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
          </div>
          {formattedCase.caseTitle}
        </td>
      </tr>
      {formattedCase.consolidatedCases &&
        formattedCase.consolidatedCases.map(consolidatedCase =>
          getCaseRow({
            formattedCase: consolidatedCase,
            isNestedCase: true,
            onlyLinkIfRequestedUserAssociated,
            onlyText:
              onlyLinkIfRequestedUserAssociated &&
              consolidatedCase.isRequestingUserAssociated === false,
          }),
        )}
    </React.Fragment>
  );
};

export const CaseListRowExternal = ({
  formattedCase,
  onlyLinkIfRequestedUserAssociated,
}) =>
  getCaseRow({
    formattedCase,
    isNestedCase: false,
    onlyLinkIfRequestedUserAssociated,
    onlyText:
      onlyLinkIfRequestedUserAssociated &&
      formattedCase.isRequestingUserAssociated === false,
  });

CaseListRowExternal.displayName = 'CaseListRowExternal';
