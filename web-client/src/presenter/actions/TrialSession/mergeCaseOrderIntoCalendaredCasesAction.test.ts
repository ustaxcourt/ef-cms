import { mergeCaseOrderIntoCalendaredCasesAction } from './mergeCaseOrderIntoCalendaredCasesAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('mergeCaseOrderIntoCalendaredCasesAction', () => {
  it('should merge case order into associated calendared cases', async () => {
    const result = await runAction(mergeCaseOrderIntoCalendaredCasesAction, {
      state: {
        trialSession: {
          calendaredCases: [{ docketNumber: '123-45' }],
          caseOrder: [
            {
              caseOrderProperty: 'foobar',
              docketNumber: '123-45',
            },
          ],
        },
      },
    });

    expect(result.state.trialSession.calendaredCases).toEqual([
      { caseOrderProperty: 'foobar', docketNumber: '123-45' },
    ]);
  });
});
