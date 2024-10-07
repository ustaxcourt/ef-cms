import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { generatePractitionerCaseListPdfInteractor } from './generatePractitionerCaseListPdfInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('generatePractitionerCaseListPdfInteractor', () => {
  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      barNumber: 'PT1234',
      name: 'Ben Matlock',
    });
  });

  it('returns an unauthorized error on non internal users', async () => {
    applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor.mockImplementation(() => {
        throw new Error('Unauthorized');
      });
    await expect(
      generatePractitionerCaseListPdfInteractor(
        applicationContext,
        {
          userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('looks up the practitioner by the given userId', async () => {
    applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor.mockResolvedValue({
        closedCases: [
          {
            ...MOCK_CASE,
            docketNumber: '108-07',
            status: CASE_STATUS_TYPES.closed,
          },
          {
            ...MOCK_CASE,
            docketNumber: '101-17',
            status: CASE_STATUS_TYPES.closed,
          },
        ],
        openCases: [
          { ...MOCK_CASE, docketNumber: '201-07' },
          { ...MOCK_CASE, docketNumber: '202-17' },
        ],
      });

    applicationContext.getDocumentGenerators().practitionerCaseList = jest
      .fn()
      .mockResolvedValue('pdf');

    await generatePractitionerCaseListPdfInteractor(
      applicationContext,
      {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error if a practitioner user with the given userId does not exist', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      firstName: 'Nadia',
      lastName: 'Practitioner',
    });

    await expect(
      generatePractitionerCaseListPdfInteractor(
        applicationContext,
        {
          userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Practitioner not found');
  });

  it('generates the practitioner case list PDF', async () => {
    applicationContext
      .getUseCases()
      .getPractitionerCasesInteractor.mockResolvedValue({
        closedCases: [
          {
            ...MOCK_CASE,
            caseTitle: 'Test Petitioner',
            status: CASE_STATUS_TYPES.closed,
          },
        ],
        openCases: [{ ...MOCK_CASE, caseTitle: 'Test Petitioner' }],
      });

    applicationContext.getDocumentGenerators().practitionerCaseList = jest
      .fn()
      .mockResolvedValue('pdf');

    await generatePractitionerCaseListPdfInteractor(
      applicationContext,
      {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCases().getPractitionerCasesInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.closedCases,
    ).toEqual([
      {
        ...MOCK_CASE,
        caseTitle: 'Test Petitioner',
        status: CASE_STATUS_TYPES.closed,
      },
    ]);
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.openCases,
    ).toEqual([{ ...MOCK_CASE, caseTitle: 'Test Petitioner' }]);
  });
});
