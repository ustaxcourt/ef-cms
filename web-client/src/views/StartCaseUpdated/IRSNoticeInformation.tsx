import { Button } from '@web-client/ustc-ui/Button/Button';
import { CardHeader } from './CardHeader';
import { getCaseDescription } from '@shared/business/utilities/getCaseDescription';
import React from 'react';
import classNames from 'classnames';

export function IRSNoticeInformation({ petitionFormatted }) {
  return (
    <div className="border-top-1px padding-top-2 padding-bottom-2 height-full margin-bottom-0">
      <div className="content-wrapper">
        <CardHeader step={3} title="IRS Notice" />
        <div className="petition-review-irs-notice-section">
          {!petitionFormatted.hasIrsNotice && (
            <div>
              <div className="line-height-2" data-testid="irs-notice-type">
                <div className="margin-bottom-1 semi-bold">
                  Type of notice/case
                </div>
                <div className="margin-bottom-2px">
                  {getCaseDescription(
                    petitionFormatted.hasIrsNotice,
                    petitionFormatted.originalCaseType,
                  )}
                </div>
              </div>
            </div>
          )}

          {petitionFormatted.hasIrsNotice &&
            petitionFormatted.irsNotices.map((irsNotice, index) => {
              const isFirstNotice = index === 0;
              return (
                <div
                  className={classNames(
                    'line-height-2',
                    !isFirstNotice && 'petition-review-spacing',
                  )}
                  data-testid={`irs-notice-info-${index}`}
                  key={`${irsNotice.caseType}`}
                >
                  <div className="margin-bottom-1 semi-bold">
                    IRS notice {index + 1}
                  </div>
                  <div className="margin-bottom-2px">
                    {getCaseDescription(
                      petitionFormatted.hasIrsNotice,
                      irsNotice.originalCaseType,
                    )}
                  </div>
                  {irsNotice.taxYear && (
                    <div className="margin-bottom-2px">{irsNotice.taxYear}</div>
                  )}
                  {irsNotice.noticeIssuedDate && (
                    <div className="margin-bottom-2px">
                      {irsNotice.noticeIssuedDateFormatted}
                    </div>
                  )}
                  {irsNotice.cityAndStateIssuingOffice && (
                    <div className="margin-bottom-2px">
                      {irsNotice.cityAndStateIssuingOffice}
                    </div>
                  )}
                  {irsNotice.irsNoticeFileUrl && (
                    <Button
                      link
                      className="padding-0 text-left word-break"
                      data-testid="atp-preview-button"
                      href={irsNotice.irsNoticeFileUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {irsNotice.file.name}
                    </Button>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
