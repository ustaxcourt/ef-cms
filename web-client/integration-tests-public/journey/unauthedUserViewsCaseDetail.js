import { applicationContextPublic } from '../../src/applicationContextPublic';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const publicCaseDetailHelper = withAppContextDecorator(
  publicCaseDetailHelperComputed,
  applicationContextPublic,
);

export default test => {
  return it('View case detail', async () => {
    await test.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.currentRouteUrl.includes('/case-detail')).toBeTruthy();
    expect(test.getState('caseDetail.contactPrimary.name')).toBeDefined();
    expect(test.getState('caseDetail.contactPrimary.address1')).toBeUndefined();

    expect(test.getState('caseDetail.docketRecord').length).toEqual(3);
    expect(test.getState('caseDetail.docketRecord')).toMatchObject([
      { description: 'Petition' },
      { description: 'Request for Place of Trial at Seattle, Washington' },
      { description: 'Order of Dismissal Entered, Judge Buch for Something' },
    ]);

    expect(test.getState('caseDetail.documents').length).toEqual(3);
    expect(test.getState('caseDetail.documents')).toMatchObject([
      {
        documentType: 'Petition',
      },
      { documentType: 'Statement of Taxpayer Identification' },
      { documentType: 'OD - Order of Dismissal Entered,' },
    ]);

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
        showDocumentDescriptionWithoutLink: undefined,
        showLinkToDocument: undefined,
      },
      {
        description: 'Order of Dismissal Entered, Judge Buch for Something',
        hasDocument: true,
        showDocumentDescriptionWithoutLink: false,
        showLinkToDocument: true,
        showServed: true,
      },
    ]);
  });
};
