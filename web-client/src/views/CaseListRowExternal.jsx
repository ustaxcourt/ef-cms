import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const getCaseRow = ({
  formattedCase,
  isNestedCase,
  onlyLinkIfRequestedUserAssociated,
  onlyText,
}) => {
  return (
    <React.Fragment key={formattedCase.caseId}>
      <tr>
        <td>
          {formattedCase.isLeadCase && (
            <>
              <span className="usa-sr-only">Lead Case</span>
              <FontAwesomeIcon
                className="margin-right-1 icon-consolidated"
                icon="copy"
                size="1x"
              />
            </>
          )}
        </td>
        <td className="hide-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
          </div>
        </td>
        <td className="hide-on-mobile">{formattedCase.caseName}</td>
        <td>{formattedCase.createdAtFormatted}</td>
        <td className="show-on-mobile">
          <div className={isNestedCase ? 'margin-left-2' : ''}>
            <CaseLink formattedCase={formattedCase} onlyText={onlyText} />
          </div>
          {formattedCase.caseName}
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
