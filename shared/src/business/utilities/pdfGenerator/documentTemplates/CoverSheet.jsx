const classNames = require('classnames');
const React = require('react');

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
}) => {
  const reduceMarginTopOnTitle =
    consolidatedCases && consolidatedCases.length > 10;

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
            {consolidatedCases && ' et al.,'}
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

      {certificateOfService && (
        <div id="certificate-of-service">Certificate of Service</div>
      )}
    </div>
  );
};
