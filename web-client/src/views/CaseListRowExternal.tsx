import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { TAssociatedCaseFormatted } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';
import React from 'react';
import classNames from 'classnames';
import { Button } from '@web-client/ustc-ui/Button/Button';

export const CaseListRowExternal = ({
  formattedCase,
  isNestedCase,
  showFilingFee,
  showCaseStatusInfoSequence,
  showCaseStatus,
}: {
  formattedCase: TAssociatedCaseFormatted;
  isNestedCase: boolean;
  showFilingFee: boolean;
  showCaseStatusInfoSequence: any;
  showCaseStatus: boolean;
}) => {
  return (
    <>
      <NonPhone>
        <React.Fragment key={formattedCase.docketNumber}>
          <tr data-testid={formattedCase.docketNumber}>
            <td>
              <span
                className={classNames({
                  'margin-left-2':
                    formattedCase.inConsolidatedGroup &&
                    !formattedCase.isLeadCase,
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
            <td>
              <div className={isNestedCase ? 'margin-left-2' : ''}>
                <CaseLink
                  formattedCase={formattedCase}
                  onlyText={formattedCase.isRequestingUserAssociated === false}
                />
              </div>
            </td>
            <td>{formattedCase.caseTitle}</td>
            <td>{formattedCase.createdAtFormatted}</td>
            {showCaseStatus && (
              <td className="tw:max-w-[175px]">
                <Button
                  link
                  onClick={() =>
                    showCaseStatusInfoSequence({
                      status: formattedCase.status,
                    })
                  }
                >
                  {formattedCase.formattedStatus}
                </Button>
              </td>
            )}
            {showFilingFee && (
              <td data-testid="petition-payment-status">
                {formattedCase.petitionPaymentStatus}
              </td>
            )}
          </tr>
          {formattedCase.consolidatedCases &&
            formattedCase.consolidatedCases.map(consolidatedCase => {
              return (
                <CaseListRowExternal
                  isNestedCase
                  formattedCase={consolidatedCase}
                  key={consolidatedCase.docketNumber}
                  showFilingFee={showFilingFee}
                  showCaseStatusInfoSequence={showCaseStatusInfoSequence}
                  showCaseStatus
                />
              );
            })}
        </React.Fragment>
      </NonPhone>

      <Phone>
        <tr key={formattedCase.docketNumber}>
          <td data-label="Docket no.">
            <span
              className={classNames({
                'margin-left-205':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
                'margin-right-2': formattedCase.isLeadCase, // todo: why?
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
            <span className={isNestedCase ? 'margin-left-205' : ''}>
              <CaseLink
                formattedCase={formattedCase}
                onlyText={formattedCase.isRequestingUserAssociated === false}
              />
            </span>
          </td>
          <td
            className={classNames({
              'consolidated-case-padding':
                formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase,
            })}
            data-label="Case Title"
          >
            {formattedCase.caseTitle}
          </td>
          <td
            className={classNames({
              'consolidated-case-padding':
                formattedCase.inConsolidatedGroup && !formattedCase.isLeadCase,
            })}
            data-label="Filed Date"
          >
            {formattedCase.createdAtFormatted}
          </td>
          {showCaseStatus && (
            <td
              className={classNames({
                'consolidated-case-padding':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
              })}
              data-label="status"
            >
              <Button
                link
                onClick={() =>
                  showCaseStatusInfoSequence({
                    status: formattedCase.status,
                  })
                }
              >
                {formattedCase.formattedStatus}
              </Button>
            </td>
          )}
          {showFilingFee && (
            <td
              className={classNames({
                'consolidated-case-padding':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
              })}
              data-label="Filing Fee*"
              data-testid="petition-payment-status"
            >
              {formattedCase.petitionPaymentStatus}
            </td>
          )}
        </tr>
        {formattedCase.consolidatedCases &&
          formattedCase.consolidatedCases.map(consolidatedCase => {
            return (
              <CaseListRowExternal
                isNestedCase
                formattedCase={consolidatedCase}
                key={consolidatedCase.docketNumber}
                showFilingFee={showFilingFee}
                showCaseStatusInfoSequence={showCaseStatusInfoSequence}
                showCaseStatus
              />
            );
          })}
      </Phone>
    </>
  );
};

CaseListRowExternal.displayName = 'CaseListRowExternal';
