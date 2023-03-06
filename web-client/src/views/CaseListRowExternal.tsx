import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import React from 'react';
import classNames from 'classnames';

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
          <span
            className={classNames({
              'margin-left-2':
                formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase,
            })}
          >
            <ConsolidatedCaseIcon
              consolidatedIconTooltipText={
                formattedCase.consolidatedIconTooltipText
              }
              inConsolidatedGroup={formattedCase.inConsolidatedGroup}
              showLeadCaseIcon={formattedCase.isLeadCase}
            />
          </span>
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
