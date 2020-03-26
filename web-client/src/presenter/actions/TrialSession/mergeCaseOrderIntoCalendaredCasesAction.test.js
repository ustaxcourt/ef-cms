import { mergeCaseOrderIntoCalendaredCasesAction } from './mergeCaseOrderIntoCalendaredCasesAction';
import { runAction } from 'cerebral/test';

describe('mergeCaseOrderIntoCalendaredCasesAction', () => {
  it('should merge case order into associated calendared cases', async () => {
    const result = await runAction(mergeCaseOrderIntoCalendaredCasesAction, {
      state: {
        trialSession: {
          calendaredCases: [{ caseId: 'case-id-123' }],
          caseOrder: [
            {
              caseId: 'case-id-123',
              caseOrderProperty: 'foobar',
            },
          ],
        },
      },
    });

    expect(result.state.trialSession.calendaredCases).toEqual([
      { caseId: 'case-id-123', caseOrderProperty: 'foobar' },
    ]);
  });
});
