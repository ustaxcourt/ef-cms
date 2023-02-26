import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { viewCounselHelper as viewCounselHelperComputed } from './viewCounselHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

let globalUser;

const viewCounselHelper = withAppContextDecorator(viewCounselHelperComputed, {
  ...applicationContext,
  getCurrentUser: () => {
    return globalUser;
  },
});

describe('viewCounselHelper', () => {
  it('returns the expected state when selected work items are set', () => {
    const result = runCompute(viewCounselHelper, {
      state: {
        caseDetail: {
          petitioners: [
            {
              contactId: '123',
              name: 'bob',
            },
          ],
        },
        modal: {
          contact: {
            representing: ['123'],
          },
        },
      },
    });
    expect(result).toMatchObject({
      representingNames: ['bob'],
    });
  });
});
