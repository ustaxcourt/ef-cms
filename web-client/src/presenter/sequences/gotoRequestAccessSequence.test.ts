import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { gotoRequestAccessSequence } from '../sequences/gotoRequestAccessSequence';
import { presenter } from '../presenter-mock';
import { privatePractitionerUser } from '../../../../shared/src/test/mockUsers';

describe('gotoRequestAccessSequence', () => {
  let cerebralTest;

  const mockCase = {
    docketEntries: [{ docketEntryId: '123', documentType: 'Petition' }],
    docketNumber: '199-99',
    leadDocketNumber: '105-99',
  };

  const mockConsolidatedCases = [
    { docketNumber: '105-99', leadDocketNumber: '105-99' },
    { docketNumber: '200-99', leadDocketNumber: '105-99' },
  ];

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getCaseInteractor.mockReturnValue(mockCase);
    applicationContext
      .getUseCases()
      .getConsolidatedCasesByCaseInteractor.mockReturnValue(
        mockConsolidatedCases,
      );
    applicationContext.getCurrentUser.mockReturnValue(privatePractitionerUser);

    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      gotoRequestAccessSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  it('should set state.caseDetail including consolidatedCases', async () => {
    const expectedCaseDetail = {
      ...mockCase,
      consolidatedCases: mockConsolidatedCases,
    };
    cerebralTest.setState('currentPage', 'SomeOtherPage');
    cerebralTest.setState('caseDetail', {
      docketNumber: '199-99',
    });
    cerebralTest.setState('token', 'aTotallyValidToken');

    await cerebralTest.runSequence('gotoRequestAccessSequence', {
      docketNumber: '199-99',
    });

    expect(
      applicationContext.getUseCases().getCaseInteractor,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getUseCases().getConsolidatedCasesByCaseInteractor,
    ).toHaveBeenCalled();
    expect(cerebralTest.getState('currentPage')).toEqual('RequestAccessWizard');
    expect(cerebralTest.getState('caseDetail')).toMatchObject(
      expectedCaseDetail,
    );
  });
});
