import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getOpinionPamphletsAction } from './getOpinionPamphletsAction';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';

describe('getOpinionPamphletsAction', () => {
  const mockOpinionPamphlets = [
    {
      docketEntryId: '1234',
      documentTitle: 'More opinion reports',
      eventCode: 'TCRP',
    },
    {
      docketEntryId: '5678',
      documentTitle: 'Opinion reports',
      eventCode: 'TCRP',
    },
  ];

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .getOpinionPamphletsInteractor.mockReturnValue(mockOpinionPamphlets);
  });

  it('should return a list of opinion pamphlets as props', async () => {
    const { output } = await runAction(getOpinionPamphletsAction, {
      modules: {
        presenter,
      },
    });

    expect(output.opinionPamphlets).toMatchObject(mockOpinionPamphlets);
  });
});
