import { applicationContextPublic } from '../../src/applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

export const unauthedUserViewsCaseDetail = test => {
  return it('View case detail', async () => {
    await test.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.currentRouteUrl.includes('/case-detail')).toBeTruthy();
    expect(test.getState('caseDetail.contactPrimary.name')).toBeDefined();
    expect(test.getState('caseDetail.contactPrimary.address1')).toBeUndefined();

    const helper = runCompute(publicCaseDetailHelper, {
      state: test.getState(),
    });

    expect(helper.formattedDocketEntries).toMatchObject([
      {
        description: 'Petition',
        hasDocument: true,
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showServed: false,
      },
      {
        description: 'Request for Place of Trial at Seattle, Washington',
        hasDocument: false,
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: undefined,
      },
      {
        description: 'Order of Dismissal Entered, Judge Buch for Something',
        hasDocument: true,
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
        showServed: true,
      },
      {
        description: 'Transcript of Anything on 01-01-2019',
        hasDocument: true,
        showDocumentDescriptionWithoutLink: true,
        showLinkToDocument: false,
        showServed: true,
      },
    ]);

    expect(helper.formattedCaseDetail.docketRecord.length).toEqual(4);
    expect(helper.formattedCaseDetail.docketRecord).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ description: 'Petition' }),
        expect.objectContaining({
          description: 'Request for Place of Trial at Seattle, Washington',
        }),
        expect.objectContaining({
          description: 'Order of Dismissal Entered, Judge Buch for Something',
        }),
        expect.objectContaining({
          description: 'Transcript of Anything on 01-01-2019',
        }),
      ]),
    );

    expect(helper.formattedCaseDetail.documents.length).toEqual(4);
    expect(helper.formattedCaseDetail.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'Petition',
        }),
        expect.objectContaining({
          documentType: 'Statement of Taxpayer Identification',
        }),
        expect.objectContaining({
          documentType: 'Order of Dismissal Entered',
        }),
        expect.objectContaining({ documentType: 'Transcript' }),
      ]),
    );
  });
};
