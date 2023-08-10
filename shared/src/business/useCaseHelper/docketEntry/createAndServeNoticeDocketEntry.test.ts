import { getFakeFile } from '../../test/getFakeFile';

import { Case } from '../../entities/cases/Case';
import { MOCK_CASE } from '../../../test/mockCase';
import {
  SERVICE_INDICATOR_TYPES,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createAndServeNoticeDocketEntry } from './createAndServeNoticeDocketEntry';
import { docketClerk1User } from '../../../test/mockUsers';

describe('createAndServeDocketEntry', () => {
  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const mockNotice = Buffer.from('The rain falls mainly on the plane');

  const mockCaseEntity = new Case(
    {
      ...MOCK_CASE,
    },
    { applicationContext },
  );

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf.mockReturnValue({});

    applicationContext.getUniqueId.mockReturnValue(mockDocketEntryId);

    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({}),
      },
    });
  });

  it('should save the generated notice to s3', async () => {
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      user: docketClerk1User,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockNotice,
      key: mockDocketEntryId,
    });
  });

  it('should create and serve a docket entry and add it to the docket record', async () => {
    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseEntity,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      user: docketClerk1User,
    });

    const expectedNotice = mockCaseEntity.docketEntries.find(
      doc =>
        doc.documentTitle ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
          .documentTitle,
    );
    expect(expectedNotice).toMatchObject({
      isOnDocketRecord: true,
      servedAt: expect.anything(),
      servedParties: [
        {
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
        },
      ],
    });
  });

  it('should make a call to serveGeneratedNoticesOnCase', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...mockCaseEntity,
        petitioners: [
          {
            ...mockCaseEntity.petitioners[0],
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await createAndServeNoticeDocketEntry(applicationContext, {
      caseEntity: mockCaseWithPaperService,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      user: docketClerk1User,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase,
    ).toHaveBeenCalled();
  });
});
