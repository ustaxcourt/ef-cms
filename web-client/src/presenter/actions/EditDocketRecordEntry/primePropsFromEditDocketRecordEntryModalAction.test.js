import { presenter } from '../../presenter';
import { primePropsFromEditDocketRecordEntryModalAction } from './primePropsFromEditDocketRecordEntryModalAction';
import { runAction } from 'cerebral/test';

describe('primePropsFromEditDocketRecordEntryModalAction', () => {
  it('should update the props from state', async () => {
    const result = await runAction(
      primePropsFromEditDocketRecordEntryModalAction,
      {
        modules: { presenter },
        state: { modal: { form: { something: '123' } } },
      },
    );

    expect(result.output).toEqual({
      docketRecordEntry: { something: '123' },
    });
  });
});
