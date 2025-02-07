import {
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { getJudgeLastName } from '@shared/business/utilities/getFormattedJudgeName';
import { getTodaysOpinionsInteractor } from '@shared/proxies/public/getTodaysOpinionsProxy';
import { useQuery } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '@web-client/ustc-ui/CaseLink/CaseLink';
import { BigHeader } from '@web-client/views/BigHeader';
import React from 'react';
import { publicDefaultLayoutRoute } from 'web-client-public/src/routes/_default-layout/_defaultLayoutComponent';

export function TodaysOpinions() {
  const query = useQuery({
    queryKey: ['/public-api/todays-opinions'],
    queryFn: getTodaysOpinionsInteractor,
  });

  const currentDate = createISODateString();
  const formattedCurrentDate = formatDateString(currentDate, 'MONTH_DAY_YEAR');

  const todaysOpinions = query.data || [];
  const formattedOpinions = todaysOpinions.map(opinion => ({
    ...opinion,
    formattedFilingDate: formatDateString(opinion.filingDate, 'MMDDYY'),
    formattedJudgeName: getJudgeLastName(
      opinion.judge || opinion.signedJudgeName,
    ),
    numberOfPagesFormatted: opinion.numberOfPages ?? 'n/a',
  }));

  return (
    <>
      <BigHeader text="Today’s Opinions" />

      <section className="usa-section grid-container todays-opinions">
        <h1>{formattedCurrentDate}</h1>

        <p>
          Any online sourced citations in these opinions can be viewed directly
          from the associated docket record.
        </p>

        {formattedOpinions.length === 0 && (
          <h3 className="maxw-tablet">
            Opinions are generally filed at 3:00 PM. If you are receiving this
            message after 3:00 PM, there are no opinions today.
          </h3>
        )}

        {formattedOpinions.length > 0 && (
          <table
            aria-label="todays opinions"
            className="usa-table gray-header todays-opinions responsive-table row-border-only"
          >
            <thead>
              <tr>
                <th aria-hidden="true" />
                <th aria-hidden="true" />
                <th aria-label="Docket Number">Docket No.</th>
                <th>Case Title</th>
                <th>Opinion Type</th>
                <th>Pages</th>
                <th>Date</th>
                <th>Judge</th>
              </tr>
            </thead>
            <tbody>
              {formattedOpinions.map((opinion, idx) => (
                <tr key={`opinion-row-${opinion.docketEntryId}`}>
                  <td className="center-column">{idx + 1}</td>
                  <td aria-hidden="true"></td>
                  <td>
                    <CaseLink formattedCase={opinion} />
                  </td>
                  <td>{opinion.caseCaption}</td>
                  <td>
                    <Button
                      link
                      aria-label={`View PDF: ${opinion.descriptionDisplay}`}
                      className="text-left line-height-standard padding-0"
                      onClick={() => {
                        // openCaseDocumentDownloadUrlSequence({
                        //   docketEntryId: opinion.docketEntryId,
                        //   docketNumber: opinion.docketNumber,
                        //   isPublic: true,
                        //   useSameTab: true,
                        // });
                      }}
                    >
                      {opinion.documentType}
                    </Button>
                  </td>
                  <td>{opinion.numberOfPagesFormatted}</td>
                  <td>{opinion.formattedFilingDate}</td>
                  <td>{opinion.formattedJudgeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

export const todaysOpinionsRoute = createRoute({
  component: TodaysOpinions,
  getParentRoute: () => publicDefaultLayoutRoute,
  path: '/todays-opinions',
});
