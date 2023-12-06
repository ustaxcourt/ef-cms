import { STRICKEN_FROM_TRIAL_SESSION_MESSAGE } from '../../../entities/EntityConstants';

import React from 'react';
import classNames from 'classnames';

export const CoverSheet = ({
  caseCaptionExtension,
  caseTitle,
  certificateOfService,
  consolidatedCases,
  dateFiledLodged,
  dateFiledLodgedLabel,
  dateReceived,
  docketNumberWithSuffix,
  documentTitle,
  electronicallyFiled,
  index,
  mailingDate,
  stamp,
}) => {
  const reduceMarginTopOnTitle =
    consolidatedCases && consolidatedCases.length > 10;

  const filingOnMultipleConsolidatedCases =
    consolidatedCases && consolidatedCases.length > 1;

  return (
    <div id="document-cover-sheet">
      <div>
        <div className="width-half float-left">
          <div className="width-half float-left">
            <div className="us-tax-court-seal"></div>
          </div>
          <div className="width-half float-right">
            {dateReceived && (
              <div id="date-received">
                <b>Received</b>
                <br />
                {dateReceived}
              </div>
            )}
          </div>
          <div className="clear"></div>
        </div>
        <div
          className="width-half float-right text-center"
          id="filed-or-lodged"
        >
          <b>{dateFiledLodgedLabel}</b>
          <br />
          {dateFiledLodged}
        </div>
        <div className="clear"></div>
      </div>

      <div className="case-information margin-top-40">
        <div className="border-none" id="caption">
          <div id="caption-title">
            {caseTitle}
            {filingOnMultipleConsolidatedCases && ' et al.,'}
          </div>
          <div id="caption-extension">{caseCaptionExtension}</div>
          <div id="caption-v">v.</div>
          <div id="caption-commissioner">Commissioner of Internal Revenue</div>
          <div id="caption-respondent">Respondent</div>
        </div>

        <div id="docket-number">
          {electronicallyFiled && <div>Electronically Filed</div>}
          {mailingDate && <div>{mailingDate}</div>}

          {consolidatedCases ? (
            <div className="consolidated-cases">
              {consolidatedCases.map(({ docketNumber, documentNumber }) => (
                <div key={docketNumber}>
                  Docket No. {docketNumber}
                  {documentNumber && ` Document No. ${documentNumber}`}
                </div>
              ))}
            </div>
          ) : (
            <>
              <div>Docket No. {docketNumberWithSuffix}</div>
              <div>Document No. {index}</div>
            </>
          )}
        </div>

        <div className="clear"></div>
      </div>

      <h2
        className={classNames('text-center', {
          'reduce-margin': reduceMarginTopOnTitle,
        })}
        id="document-title"
      >
        {documentTitle}
      </h2>

      {stamp && (
        <div className="stamp-box margin-top-140 font-sans-xs">
          <span className="text-normal text-center" id="stamp-text">
            It is ORDERED as follows:
            <br />
            <span>
              This motion is{' '}
              <span className="text-ls-1 text-bold font-sans-lg">
                {stamp.disposition?.toUpperCase()}
              </span>{' '}
              {stamp.deniedAsMoot && 'as moot '}
              {stamp.deniedWithoutPrejudice && 'without prejudice'}
              <br />
            </span>
            {(stamp.strickenFromTrialSession ||
              stamp.jurisdictionalOption ||
              (stamp.dueDateMessage && stamp.date) ||
              stamp.customText) && <hr className="narrow-hr" />}
            {stamp.strickenFromTrialSession && (
              <>
                - {STRICKEN_FROM_TRIAL_SESSION_MESSAGE} -
                <br />
              </>
            )}
            {stamp.jurisdictionalOption && (
              <>
                - {stamp.jurisdictionalOption} -<br />
              </>
            )}
            {stamp.dueDateMessage && (
              <>
                - {stamp.dueDateMessage} {stamp.date} -
                <br />
              </>
            )}
            {stamp.customText && <> - {stamp.customText} - </>}
            <hr className="narrow-hr" />
            <span className="text-bold" id="stamp-signature">
              (Signed) {stamp.nameForSigning}
              <br />
              {stamp.nameForSigningLine2}
            </span>
          </span>
        </div>
      )}

      {certificateOfService && (
        <div id="certificate-of-service">Certificate of Service</div>
      )}
    </div>
  );
};
