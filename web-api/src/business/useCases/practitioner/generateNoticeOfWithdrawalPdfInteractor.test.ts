import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import { mockPrivatePractitionerUser } from '@shared/test/mockAuthUsers';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateNoticeOfWithdrawalPdfInteractor } from './generateNoticeOfWithdrawalPdfInteractor';
import { MOCK_PRACTITIONER } from '@shared/test/mockUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';

describe('generateNoticeOfWithdrawalPdfInteractor', () => {
  const getUserById = jest.mocked(getUserByIdMock);
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);

  const mockPdfBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52]);
  const mockPdfUrl = 'www.example.com';
  const mockCaseData = {
    docketNumber: '123-45',
    petitioners: [
      {
        contactId: 'filer1',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    ],
  };
  const mockInput = {
    caseCaptionExtension: 'Test Case Caption Extension',
    caseTitle: 'Test Case Title',
    docketNumber: '123-45',
    docketNumberWithSuffix: '123-45S',
    filers: ['filer1'],
    petitioners: [{ contactId: 'filer1', name: 'John Doe' }],
  };
  beforeEach(() => {
    jest.clearAllMocks();
    applicationContext.getDocumentGenerators = jest.fn().mockReturnValue({
      noticeOfWithdrawal: jest.fn().mockResolvedValue(mockPdfBytes),
      certificateOfService: jest.fn().mockResolvedValue(mockPdfBytes),
    });

    applicationContext.getPdfLib = jest.fn().mockReturnValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          getPageCount: () => 1,
          getPages: () => [{}],
        }),
      },
    });

    applicationContext.getUtilities = jest.fn().mockReturnValue({
      combineAllPdfDocuments: jest.fn().mockResolvedValue({
        save: jest.fn().mockResolvedValue(mockPdfBytes),
      }),
    });

    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockResolvedValue(mockPdfUrl);

    getUserById.mockResolvedValue(MOCK_PRACTITIONER as DbUser);
    getCaseByDocketNumber.mockResolvedValue(mockCaseData as RawCase);
  });
  it('should throw an unauthorized error when the user does not have permission to generate a notice of withdrawal PDF', async () => {
    const unauthorizedUser = {
      ...mockPrivatePractitionerUser,
      role: ROLES.general,
    };
    await expect(
      generateNoticeOfWithdrawalPdfInteractor(
        applicationContext,
        mockInput,
        unauthorizedUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should generate a notice of withdrawal PDF for private practitioners', async () => {
    const result = await generateNoticeOfWithdrawalPdfInteractor(
      applicationContext,
      mockInput,
      mockPrivatePractitionerUser,
    );
    expect(
      applicationContext.getDocumentGenerators().noticeOfWithdrawal,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          caseCaptionExtension: mockInput.caseCaptionExtension,
          caseTitle: mockInput.caseTitle,
          docketNumberWithSuffix: mockInput.docketNumberWithSuffix,
          filers: ['John Doe'],
          practitionerInformation: MOCK_PRACTITIONER,
        }),
      }),
    );
    expect(result).toEqual(mockPdfUrl);
  });
  it('should generate a notice of withdrawal PDF for irs practitioners', async () => {
    const mockIrsPractitionerUser = {
      ...mockPrivatePractitionerUser,
      role: ROLES.irsPractitioner,
    };
    await generateNoticeOfWithdrawalPdfInteractor(
      applicationContext,
      mockInput,
      mockIrsPractitionerUser,
    );
    expect(
      applicationContext.getDocumentGenerators().noticeOfWithdrawal,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getDocumentGenerators().certificateOfService,
    ).not.toHaveBeenCalled();
  });
  it('should generate notice of withdrawal and certificate of service PDFs for paper service petitioners', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseData,
      petitioners: [
        {
          contactId: 'filer1',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        {
          contactId: 'filer2',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
      ],
    } as RawCase);
    await generateNoticeOfWithdrawalPdfInteractor(
      applicationContext,
      {
        ...mockInput,
        petitioners: [
          { contactId: 'filer1', name: 'John Doe' },
          { contactId: 'filer2', name: 'Jane Smith' },
        ],
      },
      mockPrivatePractitionerUser,
    );
    expect(
      applicationContext.getDocumentGenerators().noticeOfWithdrawal,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getDocumentGenerators().certificateOfService,
    ).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if PDF generation fails', async () => {
    applicationContext
      .getDocumentGenerators()
      .noticeOfWithdrawal.mockRejectedValue(new Error('PDF generation failed'));
    await expect(
      generateNoticeOfWithdrawalPdfInteractor(
        applicationContext,
        mockInput,
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('PDF generation failed');
  });
});
