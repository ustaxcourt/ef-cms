import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PetitionSuccessHeader = connect(
  {
    CASE_CAPTION_POSTFIX: state.constants.CASE_CAPTION_POSTFIX,
    caseDetail: state.caseDetail,
  },
  function PetitionSuccessHeader({
    CASE_CAPTION_POSTFIX,
    caseDetail,
  }: {
    CASE_CAPTION_POSTFIX: string;
    caseDetail: object;
  }) {
    return (
      <div className="big-blue-header">
        <div className="grid-container">
          <h1
            className="heading-2 captioned docket-number-header"
            data-testid="header-text"
            tabIndex={-1}
          >
            <CaseLink formattedCase={caseDetail}>
              Docket Number:{' '}
              <span data-testid="case-link-docket-number">
                {caseDetail.docketNumberWithSuffix}
              </span>
            </CaseLink>
          </h1>
          <p className="margin-y-0" id="case-title">
            <span>
              {caseDetail.caseCaption} {CASE_CAPTION_POSTFIX}
            </span>
          </p>
        </div>
      </div>
    );
  },
);
PetitionSuccessHeader.displayName = 'PetitionSuccessHeader';
