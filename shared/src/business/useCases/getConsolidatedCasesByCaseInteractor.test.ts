import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

const docketClerkUser = MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'];
const petitionsClerkUser = MOCK_USERS['c7d90c05-f6cd-442c-a168-202db587f16f'];
const petitionerUser = MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'];
const privatePractitionerUser =
  MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'];
const irsPractitionerUser = MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];

describe('getConsolidatedCasesByCaseInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Bobby Flay',
          docketNumber: '101-20',
        },
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Gordon Ramsay',
          docketNumber: '102-20',
          leadDocketNumber: '101-20',
        },
      ]);
  });

  [docketClerkUser, petitionsClerkUser].forEach(internalUser => {
    it(`should return Case entity for consolidated cases by the leadDocketNumber for ${internalUser.name}`, async () => {
      applicationContext.getCurrentUser.mockReturnValueOnce(internalUser);

      let cases = await getConsolidatedCasesByCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-20',
        },
      );

      expect(cases).toMatchObject([
        {
          caseCaption: 'Guy Fieri vs. Bobby Flay',
          docketNumber: '101-20',
          entityName: 'Case',
        },
        {
          caseCaption: 'Guy Fieri vs. Gordon Ramsay',
          docketNumber: '102-20',
          entityName: 'Case',
        },
      ]);

      expect(
        applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
      ).toHaveBeenCalled();
    });
  });

  [petitionerUser, privatePractitionerUser, irsPractitionerUser].forEach(
    externalUser => {
      it(`should return Case entity for ${externalUser.name} when associated to the case and PublicCase entity when not associated`, async () => {
        applicationContext
          .getPersistenceGateway()
          .verifyCaseForUser.mockResolvedValueOnce(false)
          .mockResolvedValueOnce(true);

        applicationContext.getCurrentUser.mockReturnValue(externalUser);

        let cases = await getConsolidatedCasesByCaseInteractor(
          applicationContext,
          {
            docketNumber: '101-20',
          },
        );

        expect(cases).toMatchObject([
          {
            caseCaption: 'Guy Fieri vs. Bobby Flay',
            docketNumber: '101-20',
            entityName: 'PublicCase',
          },
          {
            caseCaption: 'Guy Fieri vs. Gordon Ramsay',
            docketNumber: '102-20',
            entityName: 'Case',
          },
        ]);
      });
    },
  );

  describe('with CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER feature flag on', () => {
    it('should return all full consolidated cases if the petitioner is part of the group', async () => {
      applicationContext
        .getUseCases()
        .getFeatureFlagValueInteractor.mockResolvedValueOnce(true);
      applicationContext.getCurrentUser.mockReturnValueOnce(petitionerUser);
      const mockCases = [
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Bobby Flay',
          docketNumber: '101-20',
          docketNumberWithSuffix: '101-20',
          petitioners: [
            { ...MOCK_CASE.petitioners[0], contactId: petitionerUser.userId },
          ],
        },
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Gordon Ramsay',
          docketNumber: '102-20',
          docketNumberWithSuffix: '102-20',
          leadDocketNumber: '101-20',
        },
      ];
      applicationContext
        .getPersistenceGateway()
        .getCasesByLeadDocketNumber.mockResolvedValueOnce(mockCases);

      let cases = await getConsolidatedCasesByCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-20',
        },
      );

      expect(cases[0].entityName).toEqual('Case');
      expect(cases[1].entityName).toEqual('Case');
    });
  });

  it('should return all public consolidated cases if the petitioner is not associated with the group', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockResolvedValueOnce(true);

    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    let cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases[0].entityName).toEqual('PublicCase');
    expect(cases[1].entityName).toEqual('PublicCase');
  });
});
