import { applicationContext } from '../../applicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { viewCounselHelper as viewCounselHelperComputed } from './viewCounselHelper';
import { withAppContextDecorator } from '../../../src/withAppContext';

const viewCounselHelper = withAppContextDecorator(
  viewCounselHelperComputed,
  applicationContext,
);

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
