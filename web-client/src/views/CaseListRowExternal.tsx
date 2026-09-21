import { CaseLink } from '../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../ustc-ui/Icon/ConsolidatedCaseIcon';
import { NonPhone, Phone } from '@web-client/ustc-ui/Responsive/Responsive';
import { TAssociatedCaseFormatted } from '@web-client/presenter/computeds/Dashboard/externalUserCasesHelper';
import React from 'react';
import classNames from 'classnames';
import { Button } from '@web-client/ustc-ui/Button/Button';

const FilingFeeStatus = ({
  className,
  dataLabel,
  enablePaymentPortalIntegration,
  formattedCase,
  initMyCasesFilingFeePaymentSequence,
}: {
  className?: string;
  dataLabel?: string;
  enablePaymentPortalIntegration: boolean;
  formattedCase: TAssociatedCaseFormatted;
  initMyCasesFilingFeePaymentSequence: Function;
}) => {
  if (!enablePaymentPortalIntegration) {
    return (
      <td
        className={className}
        data-label={dataLabel}
        data-testid="petition-payment-status"
      >
        {formattedCase.petitionPaymentStatus}
      </td>
    );
  }

  const canPayFilingFee =
    formattedCase.petitionPaymentStatus === 'Not paid' &&
    formattedCase.isRequestingUserAssociated;

  return (
    <td
      className={className}
      data-label={dataLabel}
      data-testid="petition-payment-status"
    >
      {canPayFilingFee ? (
        <Button
          link
          className="tw:font-light tw:underline-offset-3 tw:decoration-1"
          data-testid="pay-filing-fee-button"
          onClick={() => {
            initMyCasesFilingFeePaymentSequence({
              caseDetail: formattedCase,
            });
          }}
        >
          Pay now
        </Button>
      ) : (
        formattedCase.petitionPaymentStatus
      )}
    </td>
  );
};

export const CaseListRowExternal = ({
  enablePaymentPortalIntegration,
  formattedCase,
  initMyCasesFilingFeePaymentSequence,
  isNestedCase,
  showFilingFee,
  showCaseStatusInfoSequence,
  showCaseStatus,
}: {
  enablePaymentPortalIntegration: boolean;
  formattedCase: TAssociatedCaseFormatted;
  initMyCasesFilingFeePaymentSequence: Function;
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
            <td className="tw:max-w-[15.6rem]">{formattedCase.caseTitle}</td>
            <td>{formattedCase.createdAtFormatted}</td>
            {showCaseStatus && (
              <td className="tw:max-w-[11rem]">
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
              <FilingFeeStatus
                enablePaymentPortalIntegration={enablePaymentPortalIntegration}
                formattedCase={formattedCase}
                initMyCasesFilingFeePaymentSequence={
                  initMyCasesFilingFeePaymentSequence
                }
              />
            )}
          </tr>
          {formattedCase.consolidatedCases &&
            formattedCase.consolidatedCases.map(consolidatedCase => {
              return (
                <CaseListRowExternal
                  enablePaymentPortalIntegration={
                    enablePaymentPortalIntegration
                  }
                  initMyCasesFilingFeePaymentSequence={
                    initMyCasesFilingFeePaymentSequence
                  }
                  isNestedCase
                  formattedCase={consolidatedCase}
                  key={consolidatedCase.docketNumber}
                  showFilingFee={showFilingFee}
                  showCaseStatusInfoSequence={showCaseStatusInfoSequence}
                  showCaseStatus={showCaseStatus}
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
              data-label="Case Status"
            >
              <Button
                link
                className="tw:text-left"
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
            <FilingFeeStatus
              className={classNames({
                'consolidated-case-padding':
                  formattedCase.inConsolidatedGroup &&
                  !formattedCase.isLeadCase,
              })}
              dataLabel="Filing Fee*"
              enablePaymentPortalIntegration={enablePaymentPortalIntegration}
              formattedCase={formattedCase}
              initMyCasesFilingFeePaymentSequence={
                initMyCasesFilingFeePaymentSequence
              }
            />
          )}
        </tr>
        {formattedCase.consolidatedCases &&
          formattedCase.consolidatedCases.map(consolidatedCase => {
            return (
              <CaseListRowExternal
                enablePaymentPortalIntegration={enablePaymentPortalIntegration}
                initMyCasesFilingFeePaymentSequence={
                  initMyCasesFilingFeePaymentSequence
                }
                isNestedCase
                formattedCase={consolidatedCase}
                key={consolidatedCase.docketNumber}
                showFilingFee={showFilingFee}
                showCaseStatusInfoSequence={showCaseStatusInfoSequence}
                showCaseStatus={showCaseStatus}
              />
            );
          })}
      </Phone>
    </>
  );
};

CaseListRowExternal.displayName = 'CaseListRowExternal';
