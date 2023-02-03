import { preparePrintableFormattedCasesAction } from './preparePrintableFormattedCasesAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('preparePrintableFormattedCasesAction', () => {
  it('should concatenate formattedCase.consolidatedCases to after their lead case', async () => {
    const result = await runAction(preparePrintableFormattedCasesAction, {
      modules: {
        presenter,
      },
      props: {
        formattedCases: [
          { docketNumber: '131-22' },
          {
            consolidatedCases: [
              { docketNumber: '112-22' },
              { docketNumber: '113-22' },
            ],
            docketNumber: '111-22',
            leadCase: true,
          },
          { docketNumber: '101-22' },
        ],
      },
      state: {},
    });
    expect(result.output.formattedCases).toEqual([
      { docketNumber: '131-22' },
      {
        consolidatedCases: [
          { docketNumber: '112-22' },
          { docketNumber: '113-22' },
        ],
        docketNumber: '111-22',
        leadCase: true,
      },
      { docketNumber: '112-22' },
      { docketNumber: '113-22' },
      { docketNumber: '101-22' },
    ]);
  });
});
