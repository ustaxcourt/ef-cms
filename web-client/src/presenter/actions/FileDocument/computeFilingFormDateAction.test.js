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

    expect(result.state.form.filingDate).toEqual('2019-01-06');
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

    expect(result.state.form.filingDate).toBeNull();
  });

  it('reconstructs the date with the time if the original filingDate has a time and is accesible', async () => {
    const result = await runAction(computeFilingFormDateAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          documentType: 'Proposed Stipulated Decision',
          filingDate: '2019-03-01T05:01:00.000Z',
          filingDateDay: '5',
          filingDateMonth: '1',
          filingDateYear: '2019',
        },
      },
    });

    expect(result.state.form.filingDate).toEqual('2019-01-05T05:01:00.000Z');
  });
});
