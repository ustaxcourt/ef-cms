import { applicationContextPublic } from '../../src/applicationContextPublic';
import { contactPrimaryFromState } from '../../integration-tests/helpers';
import { publicCaseDetailHelper as publicCaseDetailHelperComputed } from '../../src/presenter/computeds/Public/publicCaseDetailHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const unauthedUserViewsCaseDetail = cerebralTest => {
  const publicCaseDetailHelper = withAppContextDecorator(
    publicCaseDetailHelperComputed,
    applicationContextPublic,
  );
  const { INITIAL_DOCUMENT_TYPES } = applicationContextPublic.getConstants();

  return it('View case detail', async () => {
    await cerebralTest.runSequence('gotoPublicCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.currentRouteUrl.includes('/case-detail')).toBeTruthy();
    const contactPrimary = contactPrimaryFromState(cerebralTest);
    expect(contactPrimary.name).toBeDefined();
    expect(contactPrimary.address1).toBeUndefined();

    const helper = runCompute(publicCaseDetailHelper, {
      state: cerebralTest.getState(),
    });

    expect(helper.formattedDocketEntriesOnDocketRecord.length).toEqual(7);
    expect(helper.formattedDocketEntriesOnDocketRecord).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          descriptionDisplay: 'Petition',
          hasDocument: true,
          servedPartiesCode: 'R',
          showDocumentDescriptionWithoutLink: true,
          showLinkToDocument: false,
          showServed: true,
        }),
        expect.objectContaining({
          descriptionDisplay:
            'Request for Place of Trial at Seattle, Washington',
          hasDocument: false,
          servedPartiesCode: undefined,
          showDocumentDescriptionWithoutLink: true,
          showLinkToDocument: false,
        }),
        expect.objectContaining({
          descriptionDisplay: 'Notice of Receipt of Petition',
          eventCode: 'NOTR',
          hasDocument: true,
          servedPartiesCode: 'P',
          showLinkToDocument: false,
          showServed: true,
        }),
        expect.objectContaining({
          descriptionDisplay:
            'Motion making my way downtown, walking fast, all tests pass',
          hasDocument: true,
          servedPartiesCode: 'B',
          showDocumentDescriptionWithoutLink: true,
          showLinkToDocument: false,
          showServed: true,
        }),
        expect.objectContaining({
          descriptionDisplay:
            'Order of Dismissal Entered, Judge Buch for Something',
          hasDocument: true,
          servedPartiesCode: 'B',
          showDocumentDescriptionWithoutLink: false,
          showLinkToDocument: true,
          showServed: true,
        }),
        expect.objectContaining({
          descriptionDisplay: 'Transcript of Anything on 01-01-2019',
          hasDocument: true,
          servedPartiesCode: undefined,
          showDocumentDescriptionWithoutLink: true,
          showLinkToDocument: false,
          showServed: false,
        }),
        expect.objectContaining({
          descriptionDisplay:
            'Stipulated Decision Entered, Judge Ashford Anything',
          hasDocument: true,
          servedPartiesCode: 'B',
          showDocumentDescriptionWithoutLink: false,
          showLinkToDocument: true,
          showServed: true,
        }),
      ]),
    );

    expect(helper.formattedCaseDetail.docketEntries.length).toEqual(7);
    expect(helper.formattedCaseDetail.docketEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentType: 'Petition',
        }),
        expect.objectContaining({
          documentType: 'Motion',
        }),
        expect.objectContaining({
          documentType:
            INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
        }),
        expect.objectContaining({
          documentType: 'Notice of Receipt of Petition',
        }),
        expect.objectContaining({
          documentType: 'Order of Dismissal',
        }),
        expect.objectContaining({ documentType: 'Transcript' }),
        expect.objectContaining({ documentType: 'Stipulated Decision' }),
      ]),
    );
  });
};
