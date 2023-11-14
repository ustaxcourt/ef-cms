import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_USERS } from '../../../test/mockUsers';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  calculateAfterDate,
  getDocumentQCServedForSectionInteractor,
} from './getDocumentQCServedForSectionInteractor';
import {
  calculateISODate,
  createISODateAtStartOfDayEST,
} from '../../../business/utilities/DateHandler';

describe('getDocumentQCServedForSectionInteractor', () => {
  describe('interactor', () => {
    let user;

    beforeEach(() => {
      user = {
        role: ROLES.docketClerk,
        userId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      };
      applicationContext.getCurrentUser.mockReturnValue(user);

      applicationContext.getPersistenceGateway().getDocumentQCServedForSection =
        () => [
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
              isMinuteEntry: false,
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
              isMinuteEntry: false,
              isOnDocketRecord: true,
              userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
            },
            docketNumber: '101-18',
            docketNumberWithSuffix: '101-18S',
            section: DOCKET_SECTION,
          },
        ];
      applicationContext.getPersistenceGateway().getUserById = ({ userId }) =>
        MOCK_USERS[userId];

      applicationContext.getUniqueId.mockReturnValue(
        'eca3e1ba-7ee6-4097-958e-2365a6515f8e',
      );
    });

    it('throws an error if the user does not have access to the work item', async () => {
      user = {
        role: ROLES.petitioner,
        userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
      };
      applicationContext.getCurrentUser.mockReturnValue(user);

      await expect(
        getDocumentQCServedForSectionInteractor(applicationContext, {
          section: DOCKET_SECTION,
        }),
      ).rejects.toThrow(UnauthorizedError);
    });

    it('successfully returns the work item for a docketclerk', async () => {
      const result = await getDocumentQCServedForSectionInteractor(
        applicationContext,
        {
          section: DOCKET_SECTION,
        },
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
      user = {
        role: ROLES.petitionsClerk,
        userId: '4b423e1f-4eb2-4011-a845-873b82bee0a8',
      };
      applicationContext.getCurrentUser.mockReturnValue(user);

      const result = await getDocumentQCServedForSectionInteractor(
        applicationContext,
        {
          section: PETITIONS_SECTION,
        },
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
      const expected = calculateISODate({
        dateString: startOfDay,
        howMuch: -5,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is seven days ago', async () => {
      mockDaysToRetrieve = 7;
      const expected = calculateISODate({
        dateString: startOfDay,
        howMuch: -7,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is twelve days ago', async () => {
      mockDaysToRetrieve = 12;
      const expected = calculateISODate({
        dateString: startOfDay,
        howMuch: -12,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });

    it('should get a date that is seven (default) days ago', async () => {
      mockDaysToRetrieve = 'twelve';
      const expected = calculateISODate({
        dateString: startOfDay,
        howMuch: -7,
        units: 'days',
      });
      const actual = await calculateAfterDate(applicationContext);
      expect(actual).toEqual(expected);
    });
  });
});
