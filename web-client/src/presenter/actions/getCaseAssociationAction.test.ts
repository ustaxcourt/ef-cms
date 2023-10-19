import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getCaseAssociationAction } from './getCaseAssociationAction';
import { irsSuperuserUser } from '@shared/test/mockUsers';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCaseAssociation', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .verifyPendingCaseForUserInteractor.mockReturnValue(false);
  });

  describe('IRS SuperUser', () => {
    it('should return false for isAssociated and pendingAssociation if the user is an irsSuperuser and service is not allowed on the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser);

      const results = await runAction(getCaseAssociationAction, {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            docketEntries: [{ documentType: 'Petition' }],
            status: CASE_STATUS_TYPES.new,
          },
        },
      });

      expect(results.output).toEqual({
        isAssociated: false,
        isDirectlyAssociated: false,
        pendingAssociation: false,
      });
    });

    it('should return true for isAssociated and false for pendingAssociation if the user is an irsSuperuser and service is allowed for the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue(irsSuperuserUser);

      const results = await runAction(getCaseAssociationAction, {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            docketEntries: [
              {
                documentType: 'Legacy Petition',
                servedAt: '2019-03-01T21:40:46.415Z',
              },
            ],
            status: CASE_STATUS_TYPES.generalDocket,
          },
        },
      });

      expect(results.output).toEqual({
        isAssociated: true,
        isDirectlyAssociated: false,
        pendingAssociation: false,
      });
    });
  });

  describe('Internal user', () => {
    it('should return true for isAssociated and false for pendingAssociation if the user is an internal user', async () => {
      applicationContext.getCurrentUser.mockReturnValueOnce({
        role: ROLES.petitionsClerk,
        userId: '123',
      });

      const results = await runAction(getCaseAssociationAction, {
        modules: {
          presenter,
        },
        props: {},
        state: {
          caseDetail: {
            privatePractitioners: [{ userId: '123' }],
          },
        },
      });

      expect(results.output).toEqual({
        isAssociated: true,
        isDirectlyAssociated: false,
        pendingAssociation: false,
      });
    });
  });

  describe('Private Practitioner, Petitioner, IRS Practitioner', () => {
    beforeAll(() => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.privatePractitioner,
        userId: '123',
      });
    });
    describe('consolidatedCases', () => {});
    describe('nonConsolidatedCases', () => {
      it('should return that practitioner is associated', async () => {
        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              privatePractitioners: [{ userId: '123' }],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: true,
          isDirectlyAssociated: true,
          pendingAssociation: false,
        });
      });

      it('should return that private practitioner has pending association', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockResolvedValueOnce(true);

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              privatePractitioners: [{ userId: 'nothing' }],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: true,
        });
      });

      it('should return that private practitioner is not associated', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(false);

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              privatePractitioners: [
                { userId: 'I am very different and not associated' },
              ],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: false,
        });
      });

      it('should return that practitioner not associated because there are no practitioners on the case', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(false);

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              petitioners: [
                {
                  contactId: 'abc123',
                },
              ],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: false,
        });
      });

      it('should return that respondent is associated', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(false);
        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.irsPractitioner,
          userId: '789',
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              irsPractitioners: [{ userId: '789' }],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: true,
          isDirectlyAssociated: true,
          pendingAssociation: false,
        });
      });
      it('should return that respondent is not associated', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(true);
        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.irsPractitioner,
          userId: '789',
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              irsPractitioners: [{ userId: '123' }],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: false,
        });
      });
      it('should return that petitioner is associated when their userId is found in the case petitioners array', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(false);
        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.petitioner,
          userId: '123',
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              petitioners: [
                {
                  contactId: '123',
                },
              ],
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: true,
          isDirectlyAssociated: true,
          pendingAssociation: false,
        });
      });
      it('should return that petitioner is not associated', async () => {
        applicationContext
          .getUseCases()
          .verifyPendingCaseForUserInteractor.mockReturnValue(true);
        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.petitioner,
          userId: '789',
        });
        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              petitioners: [
                {
                  contactId: '456',
                },
              ],
              userId: '123',
            },
          },
        });

        expect(results.output).toEqual({
          isAssociated: false,
          isDirectlyAssociated: false,
          pendingAssociation: false,
        });
      });
    });
  });

  describe('with CONSOLIDATED_CASES_GROUP_ACCESS_PETITIONER feature flag', () => {
    describe('Feature Flag On', () => {
      it('isAssociated should be true when the petitioners userId exists in the consolidated group list', async () => {
        const petitionerContactId = '123';

        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.petitioner,
          userId: petitionerContactId,
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              consolidatedCases: [
                {
                  petitioners: [
                    {
                      contactId: petitionerContactId,
                    },
                  ],
                },
              ],
              leadDocketNumber: '101-20',
              petitioners: [
                {
                  contactId: 'not-petitioner-contact-id',
                },
              ],
            },
          },
        });

        expect(results.output.isAssociated).toBe(true);
        expect(results.output.isDirectlyAssociated).toBe(false);
      });

      it('should return true for isAssociated when and the case is not consolidated', async () => {
        const petitionerContactId = '123';

        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.petitioner,
          userId: petitionerContactId,
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              petitioners: [
                {
                  contactId: petitionerContactId,
                },
              ],
            },
          },
        });

        expect(results.output.isAssociated).toBe(true);
        expect(results.output.isDirectlyAssociated).toBe(true);
      });

      it('isDirectlyAssociated should be true when the id of the caseDetail petitioner matches the users id', async () => {
        const petitionerContactId = '123';

        applicationContext.getCurrentUser.mockReturnValue({
          role: ROLES.petitioner,
          userId: petitionerContactId,
        });

        const results = await runAction(getCaseAssociationAction, {
          modules: {
            presenter,
          },
          props: {},
          state: {
            caseDetail: {
              consolidatedCases: [],
              leadDocketNumber: '101-20',
              petitioners: [
                {
                  contactId: petitionerContactId,
                },
              ],
            },
          },
        });

        expect(results.output.isDirectlyAssociated).toBe(true);
      });
    });
  });
});
