import {
  AMENDED_PETITION_FORM_NAME,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { addDocketEntryForSystemGeneratedOrder } from './addDocketEntryForSystemGeneratedOrder';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { testPdfDoc } from '@shared/business/test/getFakeFile';

describe('addDocketEntryForSystemGeneratedOrder', () => {
  const caseEntity = new Case(MOCK_CASE, { applicationContext });

  const {
    noticeOfAttachmentsInNatureOfEvidence,
    orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee,
    orderForFilingFee,
  } = SYSTEM_GENERATED_DOCUMENT_TYPES;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getConfigurationItemValue.mockResolvedValue({
        name: 'James Bond',
        title: 'Clerk of the Court (Interim)',
      });
  });

  it('should add a draft docket entry for a system generated order', async () => {
    const newDocketEntriesFromNewCaseCount =
      caseEntity.docketEntries.length + 1;

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(caseEntity.docketEntries.length).toEqual(
      newDocketEntriesFromNewCaseCount,
    );

    const naneDocketEntry = caseEntity.docketEntries.find(
      entry => entry.eventCode === 'NOT',
    );
    expect(naneDocketEntry.isDraft).toEqual(true);

    const passedInNoticeTitle =
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data
        .orderTitle;

    expect(passedInNoticeTitle).toEqual(passedInNoticeTitle.toUpperCase());
  });

  it('should only add freeText to notices', async () => {
    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    const mostRecentDocketEntry =
      caseEntity.docketEntries[caseEntity.docketEntries.length - 1];

    expect('freeText' in mostRecentDocketEntry).toEqual(true);
    expect('freeText' in mostRecentDocketEntry.draftOrderState).toEqual(true);
  });

  it('should set the title and the name of clerk for notices', async () => {
    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data,
    ).toMatchObject({
      nameOfClerk: 'James Bond',
      titleOfClerk: 'Clerk of the Court (Interim)',
    });
  });

  it('should not set a title or the name of clerk for orders', async () => {
    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForFilingFee,
    });

    expect(
      applicationContext.getDocumentGenerators().order.mock.calls[0][0].data,
    ).toMatchObject({
      nameOfClerk: '',
      titleOfClerk: '',
    });
  });

  it('should upload a generated pdf for the provided document', async () => {
    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocument,
    ).toHaveBeenCalled();
  });

  it('should save documentContents and richText for editing the order', async () => {
    const mockClonedSystemDocument = {
      content: 'Something else',
      documentTitle: 'The Trials and Tribulations of Rufio the Jester',
    };

    const contentToStore = {
      documentContents: 'Something else',
      richText: 'Something else',
    };

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: mockClonedSystemDocument,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].document,
    ).toEqual(Buffer.from(JSON.stringify(contentToStore)));
  });

  it('should append additional pdf form data when the document is an orderForAmendedPetition', async () => {
    const mockCombinedPdfsReturnVal = 'Antonia Lafaso';
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(mockCombinedPdfsReturnVal);

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForAmendedPetition,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0]
        .key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);
    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0]
        .secondPdf,
    ).toEqual(testPdfDoc);
  });

  it('should append additional pdf form data when the document is an orderForAmendedPetitionAndFilingFee', async () => {
    const mockCombinedPdfsReturnVal = 'Antonia Lafaso';
    applicationContext
      .getUtilities()
      .combineTwoPdfs.mockReturnValue(mockCombinedPdfsReturnVal);

    await addDocketEntryForSystemGeneratedOrder({
      applicationContext,
      caseEntity,
      systemGeneratedDocument: orderForAmendedPetitionAndFilingFee,
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument.mock.calls[0][0]
        .key,
    ).toEqual(AMENDED_PETITION_FORM_NAME);
    expect(
      applicationContext.getUtilities().combineTwoPdfs.mock.calls[0][0]
        .secondPdf,
    ).toEqual(testPdfDoc);
  });
});
