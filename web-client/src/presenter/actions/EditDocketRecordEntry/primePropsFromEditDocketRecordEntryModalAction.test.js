import { presenter } from '../../presenter';
import { primePropsFromEditDocketRecordEntryModalAction } from './primePropsFromEditDocketRecordEntryModalAction';
import { runAction } from 'cerebral/test';

describe('primePropsFromEditDocketRecordEntryModalAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(
      primePropsFromEditDocketRecordEntryModalAction,
      {
        modules: { presenter },
        state: {
          modal: {
            caseId: '456',
            docketRecordIndex: 1,
            form: { something: '123' },
          },
        },
      },
    );

    expect(result.output).toEqual({
      caseId: '456',
      docketRecordEntry: { something: '123' },
      docketRecordIndex: 1,
      fromModal: true,
    });
  });
});
