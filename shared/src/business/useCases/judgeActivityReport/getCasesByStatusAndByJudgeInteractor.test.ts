import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  docketClerkUser,
  judgeUser,
  petitionsClerkUser,
} from '../../../test/mockUsers';
import { getCasesByStatusAndByJudgeInteractor } from './getCasesByStatusAndByJudgeInteractor';

const mockSubmittedCase = {
  ...MOCK_CASE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-11T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  pk: `case|${MOCK_CASE.docketNumber}`,
  sk: `case|${MOCK_CASE.docketNumber}`,
};

const mockSubmittedCaseWithOddOnDocketRecord = {
  archivedDocketEntries: [],
  associatedJudge: judgeUser.name,
  caseCaption: 'Test Petitioner, Petitioner',
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-12T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.submitted,
    },
  ],
  caseType: CASE_TYPES_MAP.other,
  correspondence: [],
  createdAt: '2018-03-01T21:40:46.415Z',
  docketEntries: [
    {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'e6b81f4d-1e47-423a-8caf-6d2fdc3d3888',
      docketNumber: '101-19',
      documentTitle: `Order of Dismissal and Decision Entered, ${judgeUser.name} Dismissed`,
      documentType: 'Order of Dismissal and Decision',
      draftOrderState: {},
      entityName: 'DocketEntry',
      eventCode: 'ODD',
      filers: [],
      filingDate: '2018-03-01T05:00:00.000Z',
      index: 4,
      isDraft: false,
      isFileAttached: true,
      isMinuteEntry: false,
      isOnDocketRecord: false,
      isStricken: false,
      judge: 'Colvin',
      pending: false,
      processingStatus: 'complete',
      receivedAt: '2018-03-01T05:00:00.000Z',
      servedAt: '2019-05-24T18:41:36.122Z',
      servedParties: [
        {
          name: 'Bernard Lowe',
        },
        {
          name: 'IRS',
          role: 'irsSuperuser',
        },
      ],
      signedAt: '2019-05-24T18:41:36.122Z',
      signedByUserId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'John O. Colvin',
      stampData: {},
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ],
  docketNumber: '101-19',
  docketNumberWithSuffix: '101-19',
  entityName: 'Case',
  filingType: 'Myself',
  hasVerifiedIrsNotice: false,
  hearings: [],
  irsNoticeDate: '2018-03-01T00:00:00.000Z',
  irsPractitioners: [],
  partyType: PARTY_TYPES.petitioner,
  petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
  petitioners: [
    {
      address1: '123 Main St',
      city: 'Somewhere',
      contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      contactType: CONTACT_TYPES.primary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      entityName: 'Petitioner',
      isAddressSealed: false,
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      sealedAndUnavailable: false,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'TN',
      title: 'Executor',
    },
  ],
  pk: 'case|101-19',
  preferredTrialCity: 'Washington, District of Columbia',
  privatePractitioners: [],
  procedureType: 'Regular',
  receivedAt: '2018-03-01T21:40:46.415Z',
  sk: 'case|101-19',
  sortableDocketNumber: 2019000101,
  status: CASE_STATUS_TYPES.submitted,
};

let mockCavLeadCase = {
  ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-13T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.cav,
    },
  ],
  pk: `case|${MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sk: `case|${MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sortableDocketNumber: 2019000109,
  status: CASE_STATUS_TYPES.cav,
};

const mockCavConsolidatedMemberCase = {
  ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  associatedJudge: judgeUser.name,
  caseStatusHistory: [
    {
      changedBy: docketClerkUser.name,
      date: '2023-05-13T14:19:28.717Z',
      updatedCaseStatus: CASE_STATUS_TYPES.cav,
    },
  ],
  pk: `case|${MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sk: `case|${MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber}`,
  sortableDocketNumber: 2019000110,
  status: CASE_STATUS_TYPES.cav,
};

let mockReturnedDocketNumbers: Array<{ docketNumber: string }> = [];

let expectedConsolidatedCasesGroupCountMap = {};

describe('getCasesByStatusAndByJudgeInteractor', () => {
  const mockValidRequest = {
    judgeName: judgeUser.name,
    statuses: ['Submitted', 'CAV'],
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getCasesByStatusAndByJudgeInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCasesByStatusAndByJudgeInteractor(applicationContext, {
        judgeName: judgeUser.name,
        statuses: [undefined],
      }),
    ).rejects.toThrow();
  });

  it('should return an array of 2 cases and consolidatedCasesGroupMap (stripping out the consolidated member case)', async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockCavLeadCase.docketNumber },
      { docketNumber: mockCavConsolidatedMemberCase.docketNumber },
    ];

    const casesForLeadDocketNumber = [
      mockCavLeadCase,
      mockCavConsolidatedMemberCase,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${mockCavLeadCase.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockCavLeadCase)
      .mockResolvedValueOnce(mockCavConsolidatedMemberCase);

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValueOnce(
        casesForLeadDocketNumber,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '109-19',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual(
      expectedConsolidatedCasesGroupCountMap,
    );
  });

  it('should return an array of 2 cases and consolidatedCasesGroupMap (stripping out the member case of consolidated cases and case with ODD)', async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockSubmittedCaseWithOddOnDocketRecord.docketNumber },
      { docketNumber: mockCavLeadCase.docketNumber },
      { docketNumber: mockCavConsolidatedMemberCase.docketNumber },
    ];

    const casesForLeadDocketNumber = [
      mockCavLeadCase,
      mockCavConsolidatedMemberCase,
    ];

    expectedConsolidatedCasesGroupCountMap = {
      [`${mockCavLeadCase.docketNumber}`]: casesForLeadDocketNumber.length,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockSubmittedCaseWithOddOnDocketRecord)
      .mockResolvedValueOnce(mockCavLeadCase)
      .mockResolvedValueOnce(mockCavConsolidatedMemberCase);

    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValueOnce(
        casesForLeadDocketNumber,
      );

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '109-19',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual(
      expectedConsolidatedCasesGroupCountMap,
    );
  });

  it('should return an array of 1 case and consolidatedCasesGroupMap (stripping out the case with served ODD and no consolidated cases)', async () => {
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockSubmittedCaseWithOddOnDocketRecord.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockSubmittedCaseWithOddOnDocketRecord);

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(1);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual({});
  });

  it('should return an array of 2 cases (one case containing an ODD in draft status) and consolidatedCasesGroupMap', async () => {
    mockSubmittedCaseWithOddOnDocketRecord.docketEntries = [
      {
        ...mockSubmittedCaseWithOddOnDocketRecord.docketEntries[0],
        isDraft: true,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockSubmittedCaseWithOddOnDocketRecord.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockSubmittedCaseWithOddOnDocketRecord);

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '101-19',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual({});
  });

  it('should return an array of 2 cases (one case containing an unserved ODD) and consolidatedCasesGroupMap', async () => {
    mockSubmittedCaseWithOddOnDocketRecord.docketEntries = [
      {
        ...mockSubmittedCaseWithOddOnDocketRecord.docketEntries[0],
        isDraft: false,
        servedAt: undefined,
        servedParties: undefined,
      },
    ];
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockSubmittedCaseWithOddOnDocketRecord.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockSubmittedCaseWithOddOnDocketRecord);

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '101-19',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual({});
  });

  it('should return an array of 2 cases (one case containing an ODD has been stricken) and consolidatedCasesGroupMap', async () => {
    mockSubmittedCaseWithOddOnDocketRecord.docketEntries = [
      {
        ...mockSubmittedCaseWithOddOnDocketRecord.docketEntries[0],
        isStricken: true,
        strickenAt: '2023-05-25T16:15:59.058Z',
        strickenBy: 'Test Docketclerk',
        strickenByUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ];
    mockReturnedDocketNumbers = [
      { docketNumber: mockSubmittedCase.docketNumber },
      { docketNumber: mockSubmittedCaseWithOddOnDocketRecord.docketNumber },
    ];

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByStatusAndByJudge.mockReturnValue(
        mockReturnedDocketNumbers,
      );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(mockSubmittedCase)
      .mockResolvedValueOnce(mockSubmittedCaseWithOddOnDocketRecord);

    const result = await getCasesByStatusAndByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result.cases.length).toEqual(2);
    expect(result.cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          docketNumber: '101-18',
        }),
        expect.objectContaining({
          docketNumber: '101-19',
        }),
      ]),
    );
    expect(result.consolidatedCasesGroupCountMap).toEqual({});
  });
});
