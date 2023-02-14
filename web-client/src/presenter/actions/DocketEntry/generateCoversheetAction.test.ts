import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateCoversheetAction } from './generateCoversheetAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('generateCoversheetAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should call addCoversheetInteractor', async () => {
    const mockDocketEntryId = '456';
    const mockDocketNumber = '123-45';
    await runAction(generateCoversheetAction, {
      modules: {
        presenter,
      },
      props: {
        docketEntryId: mockDocketEntryId,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
      },
    });

    expect(
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls[0][1],
    ).toMatchObject({
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });
  });
});
