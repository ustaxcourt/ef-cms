import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_USERS } from '../../../../../shared/src/test/mockUsers';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  calculateAfterDate,
  getDocumentQCServedForSectionInteractor,
} from './getDocumentQCServedForSectionInteractor';
import {
  calculateDate,
  createISODateAtStartOfDayEST,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { getDocumentQCServedForSection as getDocumentQCServedForSectionMock } from '@web-api/persistence/postgres/workitems/getDocumentQCServedForSection';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('getDocumentQCServedForSectionInteractor', () => {
  const getDocumentQCServedForSection =
    getDocumentQCServedForSectionMock as jest.Mock;
  describe('interactor', () => {
    beforeEach(() => {
      getDocumentQCServedForSection.mockReturnValue([
        {
          caseStatus: 'Closed',
          caseTitle: 'Lewis Dodgson does not have a case',
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            descriptionDisplay: 'Petition filed by Lewis Dodgson',
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentType: 'Petition',
            entityName: 'DocketEntry',
            eventCode: 'P',
            filedBy: 'Lewis Dodgson',
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isOnDocketRecord: true,
            sentBy: 'petitioner',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          },
          docketNumber: '101-18',
          docketNumberWithSuffix: '101-18S',
          section: DOCKET_SECTION,
          sentBy: 'docketclerk',
        },
        {
          caseStatus: 'Closed',
          caseTitle: 'Lewis Dodgson does not have a case',
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentType: 'Order',
            entityName: 'DocketEntry',
            eventCode: 'O',
            filedBy: 'Lewis Dodgson',
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isOnDocketRecord: true,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          },
          docketNumber: '101-18',
          docketNumberWithSuffix: '101-18S',
          section: DOCKET_SECTION,
        },
      ]);
      applicationContext.getPersistenceGateway().getUserById = ({ userId }) =>
        MOCK_USERS[userId];

      applicationContext.getUniqueId.mockReturnValue(
        'eca3e1ba-7ee6-4097-958e-2365a6515f8e',
      );
    });

    it('throws an error if the user does not have access to the work item', async () => {
      await expect(
        getDocumentQCServedForSectionInteractor(
          applicationContext,
          {
            section: DOCKET_SECTION,
          },
          mockPetitionerUser,
        ),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('successfully returns the work item for a docketclerk', async () => {
      const result = await getDocumentQCServedForSectionInteractor(
        applicationContext,
        {
          section: DOCKET_SECTION,
        },
        mockDocketClerkUser,
      );

      expect(result).toMatchObject([
        {
          caseStatus: 'Closed',
          caseTitle: 'Lewis Dodgson does not have a case',
          docketEntry: {
            descriptionDisplay: 'Petition filed by Lewis Dodgson',
            documentType: 'Petition',
            filedBy: 'Lewis Dodgson',
          },
          docketNumber: '101-18',
        },
        {
          caseStatus: 'Closed',
          caseTitle: 'Lewis Dodgson does not have a case',
          docketEntry: {
            documentType: 'Order',
            filedBy: 'Lewis Dodgson',
          },
          docketNumber: '101-18',
        },
      ]);

      expect(result[0].docketEntry.createdAt).toBeUndefined();
      expect(result[1].docketEntry.createdAt).toBeUndefined();
      expect(result.length).toEqual(2);
    });

    it('successfully returns the work item for a petitionsclerk', async () => {
      const result = await getDocumentQCServedForSectionInteractor(
        applicationContext,
        {
          section: PETITIONS_SECTION,
        },
        mockPetitionsClerkUser,
      );

      expect(result).toMatchObject([
        {
          caseStatus: 'Closed',
          caseTitle: 'Lewis Dodgson does not have a case',
          docketEntry: {
            descriptionDisplay: 'Petition filed by Lewis Dodgson',
            documentType: 'Petition',
            filedBy: 'Lewis Dodgson',
          },
          docketNumber: '101-18',
        },
        {
          docketEntry: {
            documentType: 'Order',
            eventCode: 'O',
            filedBy: 'Lewis Dodgson',
          },
          docketNumber: '101-18',
          section: DOCKET_SECTION,
        },
      ]);

      expect(result[0].docketEntry.createdAt).toBeUndefined();
    });
  });

  describe('calculateAfterDate', () => {
    let mockDaysToRetrieve;
    const startOfDay = createISODateAtStartOfDayEST();

    beforeEach(() => {
      mockDaysToRetrieve = 5;
      applicationContext
        .getPersistenceGateway()
        .getConfigurationItemValue.mockImplementation(() => mockDaysToRetrieve);
    });

    it('should get a date that is five days ago', async () => {
      const expected = calculateDate({
        dateString: startOfDay,
        howMuch: -5,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is seven days ago', async () => {
      mockDaysToRetrieve = 7;
      const expected = calculateDate({
        dateString: startOfDay,
        howMuch: -7,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is twelve days ago', async () => {
      mockDaysToRetrieve = 12;
      const expected = calculateDate({
        dateString: startOfDay,
        howMuch: -12,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is seven (default) days ago', async () => {
      mockDaysToRetrieve = 'twelve';
      const expected = calculateDate({
        dateString: startOfDay,
        howMuch: -7,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });
  });
});
