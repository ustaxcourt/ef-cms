const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { MOCK_CASE } = require('../../../test/mockCase');
const { serveCaseToIrsInteractor } = require('./serveCaseToIrsInteractor');
const { User } = require('../../entities/User');

describe('serveCaseToIrsInteractor', () => {
  const MOCK_WORK_ITEMS = [
    {
      assigneeId: null,
      assigneeName: 'IRSBatchSystem',
      caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
      caseStatus: Case.STATUS_TYPES.new,
      completedAt: '2018-12-27T18:06:02.968Z',
      completedBy: 'Petitioner',
      completedByUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      createdAt: '2018-12-27T18:06:02.971Z',
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: {
        createdAt: '2018-12-27T18:06:02.968Z',
        documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
        documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
      },
      isInitializeCase: true,
      isQC: true,
      messages: [
        {
          createdAt: '2018-12-27T18:06:02.968Z',
          from: 'Petitioner',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'Petition ready for review',
          messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
          role: User.ROLES.petitioner,
          to: null,
        },
      ],
      section: 'irsBatchSection',
      sentBy: 'petitioner',
      updatedAt: '2018-12-27T18:06:02.968Z',
      workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    },
  ];

  const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

  const testPdfDocBytes = () => {
    return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
  };

  const testPdfDoc = testPdfDocBytes();

  const MOCK_PDF_DATA =
    'JVBERi0xLjcKJYGBgYEKCjUgMCBvYmoKPDwKL0ZpbHRlciAvRmxhdGVEZWNvZGUKL0xlbm' +
    'd0aCAxMDQKPj4Kc3RyZWFtCniccwrhMlAAwaJ0Ln2P1Jyy1JLM5ERdc0MjCwUjE4WQNC4Q' +
    '6cNlCFZkqGCqYGSqEJLLZWNuYGZiZmbkYuZsZmlmZGRgZmluDCQNzc3NTM2NzdzMXMxMjQ' +
    'ztFEKyuEK0uFxDuAAOERdVCmVuZHN0cmVhbQplbmRvYmoKCjYgMCBvYmoKPDwKL0ZpbHRl' +
    'ciAvRmxhdGVEZWNvZGUKL1R5cGUgL09ialN0bQovTiA0Ci9GaXJzdCAyMAovTGVuZ3RoID' +
    'IxNQo+PgpzdHJlYW0KeJxVj9GqwjAMhu/zFHkBzTo3nCCCiiKIHPEICuJF3cKoSCu2E8/b' +
    '20wPIr1p8v9/8kVhgilmGfawX2CGaVrgcAi0/bsy0lrX7IGWpvJ4iJYEN3gEmrrGBlQwGs' +
    'HHO9VBX1wNrxAqMX87RBD5xpJuddqwd82tjAHxzV1U5LPgy52DKXWnr1Lheg+j/c/pzGVr' +
    'iqV0VlwZPXGPCJjElw/ybkwUmeoWgxesDXGhHJC/D/iikp1Av80ptKU0FdBEe25pPihAM1' +
    'u6ytgaaWfs2Hrz35CJT1+EWmAKZW5kc3RyZWFtCmVuZG9iagoKNyAwIG9iago8PAovU2l6' +
    'ZSA4Ci9Sb290IDIgMCBSCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCi9UeXBlIC9YUmVmCi9MZW' +
    '5ndGggMzgKL1cgWyAxIDIgMiBdCi9JbmRleCBbIDAgOCBdCj4+CnN0cmVhbQp4nBXEwREA' +
    'EBAEsCwz3vrvRmOOyyOoGhZdutHN2MT55fIAVocD+AplbmRzdHJlYW0KZW5kb2JqCgpzdG' +
    'FydHhyZWYKNTEwCiUlRU9G';

  let mockCase;

  beforeAll(() => {
    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext
      .getUseCaseHelpers()
      .generatePaperServiceAddressPagePdf.mockResolvedValue(testPdfDoc);
  });

  it('should throw unauthorized error when user is unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'notauser',
    });

    await expect(
      serveCaseToIrsInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add a coversheet to the served petition', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);
    applicationContext
      .getUseCaseHelpers()
      .generateCaseConfirmationPdf.mockReturnValue(MOCK_PDF_DATA);

    await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).toHaveBeenCalled();
  });

  it('should not return a paper service pdf when the case is electronic', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: false,
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);

    const result = await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return a paper service pdf when the case is paper', async () => {
    mockCase = {
      ...MOCK_CASE,
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);

    const result = await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUseCaseHelpers().appendPaperServiceAddressPageToPdf,
    ).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should serve all initial document types when served', async () => {
    mockCase = {
      ...MOCK_CASE,
      documents: [
        ...MOCK_CASE.documents,
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketNumber: '101-18',
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Request for Place of Trial Flavortown, AR',
          documentType: 'Request for Place of Trial',
          eventCode: 'RPT',
          processingStatus: 'pending',
          userId: 'petitioner',
          workItems: [],
        },
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketNumber: '101-18',
          documentId: 'abc81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APW',
          processingStatus: 'pending',
          userId: 'petitioner',
          workItems: [],
        },
      ],
      isPaper: true,
      mailingDate: 'some day',
    };
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'bob',
        role: User.ROLES.petitionsClerk,
        userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    );
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCase);

    const result = await serveCaseToIrsInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    const documentWithServedParties = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.documents.find(
        document =>
          document.documentType ===
          Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
      );
    expect(result).toBeDefined();
    expect(
      applicationContext
        .getPersistenceGateway()
        .updateCase.mock.calls[0][0].caseToUpdate.documents.every(
          document => document.status === 'served',
        ),
    ).toEqual(true);
    expect(documentWithServedParties.servedParties).toBeDefined();
  });
});
