import { ATP_DOCKET_ENTRY } from '@shared/test/mockDocketEntry';
import { Case } from '../entities/cases/Case';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { serveCaseDocument } from './serveCaseDocument';

describe('serveCaseDocument', () => {
  let mockCase;

  beforeEach(() => {
    mockCase = new Case(MOCK_CASE, { applicationContext });
  });

  it('should not set as served or send service email for RQT when a file is not attached', async () => {
    mockCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
            docketNumber: '101-18',
            documentTitle: 'Request for Place of Trial Flavortown, AR',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            filedBy: 'Test Petitioner',
            isFileAttached: false,
            processingStatus: 'pending',
            userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
          },
        ],
      },
      { applicationContext },
    );

    await serveCaseDocument({
      applicationContext,
      caseEntity: mockCase,
      initialDocumentTypeKey: 'requestForPlaceOfTrial',
    });

    const rqtMinuteEntry = mockCase.docketEntries[0];

    expect(rqtMinuteEntry.servedParties).toBeUndefined();
    expect(rqtMinuteEntry.servedAt).toBeUndefined();
    expect(rqtMinuteEntry.servedPartiesCode).toBeUndefined();
  });
  it('should set as served and send service email for RQT when a file is attached', async () => {
    mockCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2018-11-21T20:49:28.192Z',
            docketEntryId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
            docketNumber: '101-18',
            documentTitle: 'Request for Place of Trial Flavortown, AR',
            documentType: 'Request for Place of Trial',
            eventCode: 'RQT',
            filedBy: 'Test Petitioner',
            isFileAttached: true,
            processingStatus: 'pending',
            userId: 'b88a8284-b859-4641-a270-b3ee26c6c068',
          },
        ],
      },
      { applicationContext },
    );

    await serveCaseDocument({
      applicationContext,
      caseEntity: mockCase,
      initialDocumentTypeKey: 'requestForPlaceOfTrial',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0].caseEntity.docketEntries[0],
    ).toMatchObject({
      servedAt: expect.anything(),
      servedParties: [
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      servedPartiesCode: 'R',
    });
  });

  it('should serve and send service emails for STIN document types', async () => {
    mockCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [MOCK_CASE.docketEntries[1]],
      },
      { applicationContext },
    );

    await serveCaseDocument({
      applicationContext,
      caseEntity: mockCase,
      initialDocumentTypeKey: 'stin',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails.mock
        .calls[0][0].caseEntity.docketEntries[0],
    ).toMatchObject({
      servedAt: expect.anything(),
      servedParties: [
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      servedPartiesCode: 'R',
    });
  });

  it('should send the IRS superuser email service for the served petition document', async () => {
    await serveCaseDocument({
      applicationContext,
      caseEntity: mockCase,
      initialDocumentTypeKey: 'petition',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendIrsSuperuserPetitionEmail.mock
        .calls[0][0].caseEntity.docketEntries[0],
    ).toMatchObject({
      servedAt: expect.anything(),
      servedParties: [
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      servedPartiesCode: 'R',
    });
  });

  it('should serve and send service emails for each attachment to petitions document', async () => {
    mockCase = new Case(
      {
        ...MOCK_CASE,
        docketEntries: [
          ATP_DOCKET_ENTRY,
          {
            ...ATP_DOCKET_ENTRY,
            docketEntryId: '33084b8e-7e7f-4864-abc8-0118df12e662',
          },
        ],
      },
      { applicationContext },
    );

    await serveCaseDocument({
      applicationContext,
      caseEntity: mockCase,
      initialDocumentTypeKey: 'attachmentToPetition',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);
  });
});
