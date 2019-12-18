import { applicationContext } from '../../../applicationContext';
import {
  deconstructDate,
  deconstructDatesToFormAction,
} from './deconstructDatesToFormAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;
describe('deconstructDate', () => {
  it('returns month, day, and year when provided a valid ISO timestamp', () => {
    const input = '2019-10-30T12:39:54.007Z';
    const result = deconstructDate(input, { applicationContext });
    expect(result).toMatchObject({ day: '30', month: '10', year: '2019' });
  });
  it('returns undefined if given a value not representative of an ISO timestamp', () => {
    const input = '';
    const result = deconstructDate(input, { applicationContext });
    expect(result).toBeUndefined();
  });
});

describe('deconstructDatesToFormAction', () => {
  it('returns undefined if no valid date is provided', () => {});
  it('deconstructs the date', async () => {
    const result = await runAction(deconstructDatesToFormAction, {
      modules: {
        presenter: {
          providers: {
            applicationContext,
          },
        },
      },
      props: {
        docketEntry: {
          certificateOfServiceDate: '2011-10-11',
          receivedAt: '2005-02-05',
          secondaryDocument: {
            serviceDate: '2008-09-10',
          },
          serviceDate: '2010-12-25',
        },
      },
    });

    expect(result.state.form).toEqual({
      certificateOfServiceDay: '11',
      certificateOfServiceMonth: '10',
      certificateOfServiceYear: '2011',
      dateReceivedDay: '5',
      dateReceivedMonth: '2',
      dateReceivedYear: '2005',
      day: '25',
      month: '12',
      secondaryDocument: {
        day: '10',
        month: '9',
        year: '2008',
      },
      year: '2010',
    });
  });
  it('deconstructs no dates', async () => {
    const result = await runAction(deconstructDatesToFormAction, {
      modules: {
        presenter: {
          providers: {
            applicationContext,
          },
        },
      },
      props: {
        docketEntry: {},
      },
    });

    expect(result.state.form).toBeUndefined();
  });
});
