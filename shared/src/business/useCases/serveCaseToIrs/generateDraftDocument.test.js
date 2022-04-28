const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  formatDateString,
  formatNow,
  FORMATS,
  getBusinessDateInFuture,
} = require('../../utilities/DateHandler');
const {
  INITIAL_DOCUMENT_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { generateDraftDocument } = require('./generateDraftDocument');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateDraftDocument', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = { ...MOCK_CASE };

    applicationContext
      .getUseCaseHelpers()
      .addDocketEntryForSystemGeneratedOrder.mockImplementation(() => {});
  });

  it('should call addDocketEntryForSystemGeneratedOrder with correct content', async () => {
    mockCase = {
      ...MOCK_CASE,
      orderForAmendedPetitionAndFilingFee: true,
    };
    const { orderForAmendedPetitionAndFilingFee } =
      SYSTEM_GENERATED_DOCUMENT_TYPES;

    const petitionFilingDate = mockCase.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    ).filingDate;
    const expectedFilingDate = formatDateString(
      petitionFilingDate,
      FORMATS.MONTH_DAY_YEAR,
    );
    const mockTodayPlus60 = getBusinessDateInFuture({
      numberOfDays: 60,
      startDate: formatNow(FORMATS.ISO),
    });

    const caseEntity = new Case(mockCase, { applicationContext });

    await generateDraftDocument({
      applicationContext,
      caseEntity,
      document: orderForAmendedPetitionAndFilingFee,
      replacements: [expectedFilingDate, mockTodayPlus60, mockTodayPlus60],
    });

    expect(
      await applicationContext.getUseCaseHelpers()
        .addDocketEntryForSystemGeneratedOrder.mock.calls[0][0]
        .systemGeneratedDocument,
    ).toMatchObject({
      content: `&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on ${expectedFilingDate}, a document as the petition of the above-named
      petitioner(s) at the docket number indicated. That docket number MUST appear on all documents
      and papers subsequently sent to the Court for filing or otherwise. The document did not comply with
      the Rules of the Court as to the form and content of a proper petition. The filing fee was not paid.<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;ORDERED that on or before ${mockTodayPlus60}, petitioner(s) shall file a proper
      amended petition and pay the $60.00 filing fee. Waiver of the filing fee requires an affidavit
      containing specific financial information regarding the inability to make such payment. An
      Application for Waiver of Filing Fee and Affidavit form is available under "Case Related Forms" on
      the Court's website at www.ustaxcourt.gov/case_related_forms.html.<br/>
      <br/>
      If, by ${mockTodayPlus60}, petitioner(s) do not file an Amended Petition and either pay the Court's
      $60.00 filing fee or submit an Application for Waiver of the Filing Fee, the case will be dismissed or
      other action taken as the Court deems appropriate.`,
    });
  });
});
