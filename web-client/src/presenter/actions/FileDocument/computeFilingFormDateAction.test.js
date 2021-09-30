import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { computeFilingFormDateAction } from './computeFilingFormDateAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('computeFilingFormDateAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it("computes the document's filingDate from date parts", async () => {
    const result = await runAction(computeFilingFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDateDay: '6',
          filingDateMonth: '1',
          filingDateYear: '2019',
        },
      },
    });

    expect(result.state.form.filingDate).toEqual('2019-01-06T05:00:00.000Z');
  });

  it("does not set document's filingDate when some value needed is not present", async () => {
    const result = await runAction(computeFilingFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDateDay: '6',
          filingDateYear: '2019',
        },
      },
    });

    expect(result.state.form.filingDate).toBeUndefined();
  });

  it('leaves leaves original state of filing date unchanged if some filing date input value is not present', async () => {
    const result = await runAction(computeFilingFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDate: '2019-03-01T02:01:00.000Z',
          filingDateDay: '5',
          filingDateMonth: '1',
          filingDateYear: undefined,
        },
      },
    });

    expect(result.state.form.filingDate).toEqual('2019-03-01T02:01:00.000Z');
  });
});
