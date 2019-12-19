import { applicationContext } from '../../applicationContext';
import { orderTypesHelper as orderTypesHelperComputed } from './orderTypesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

let user = {
  role: 'docketclerk',
};

const orderTypesHelper = withAppContextDecorator(orderTypesHelperComputed, {
  ...applicationContext,

  getConstants: () => {
    return {
      COURT_ISSUED_EVENT_CODES: [
        { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
      ],
      USER_ROLES: {
        petitionsClerk: 'petitionsclerk',
      },
    };
  },
  getCurrentUser: () => user,
});

const state = {
  constants: {
    ORDER_TYPES_MAP: [
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ],
    USER_ROLES: {
      petitionsClerk: 'petitionsclerk',
    },
  },
};

describe('orderTypesHelper', () => {
  it('should filter out and only return type O for docketclerk', () => {
    const result = runCompute(orderTypesHelper, { state });
    expect(result.orderTypes).toEqual([
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ]);
  });

  it('should filter out and only return type O for petitionsclerk', () => {
    user.role = 'petitionsclerk';
    const result = runCompute(orderTypesHelper, { state });
    expect(result.orderTypes).toEqual([
      {
        code: 'Shenzi',
        documentType: 'Hyena',
        eventCode: 'O',
      },
    ]);
  });
});
