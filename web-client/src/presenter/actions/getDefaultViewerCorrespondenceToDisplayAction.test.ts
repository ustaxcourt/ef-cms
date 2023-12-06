import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDefaultViewerCorrespondenceToDisplayAction } from './getDefaultViewerCorrespondenceToDisplayAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

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
                correspondenceId: '123',
              },
              {
                correspondenceId: '234',
              },
              {
                correspondenceId: '345',
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerCorrespondenceToDisplay: { correspondenceId: '123' },
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

  it('returns the correct document if props.correspondenceId is set', async () => {
    const result = await runAction(
      getDefaultViewerCorrespondenceToDisplayAction,
      {
        modules: {
          presenter,
        },
        props: { correspondenceId: '345' },
        state: {
          caseDetail: {
            correspondence: [
              {
                correspondenceId: '123',
                documentType: 'Petition',
              },
              {
                correspondenceId: '234',
                documentType: 'Order',
              },
              {
                correspondenceId: '345',
                documentType: 'Notice',
                isDraft: true,
              },
            ],
          },
        },
      },
    );
    expect(result.output).toMatchObject({
      viewerCorrespondenceToDisplay: { correspondenceId: '345' },
    });
  });
});
