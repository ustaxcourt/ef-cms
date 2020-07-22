import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDefaultViewerCorrespondenceToDisplayAction } from './getDefaultViewerCorrespondenceToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getDefaultViewerCorrespondenceToDisplayAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns the first correspondence document as the default', async () => {
    const result = await runAction(
      getDefaultViewerCorrespondenceToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            correspondence: [
              {
                documentId: '123',
              },
              {
                documentId: '234',
              },
              {
                documentId: '345',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerCorrespondenceToDisplay: { documentId: '123' },
    });
  });

  it('returns viewerCorrespondenceToDisplay undefined if there are no correspondence documents', async () => {
    const result = await runAction(
      getDefaultViewerCorrespondenceToDisplayAction,
      {
        modules: {
          presenter,
        },
        state: {
          caseDetail: {
            correspondence: [],
          },
        },
      },
    );
    expect(result.output).toEqual({
      viewerCorrespondenceToDisplay: undefined,
    });
  });
});
