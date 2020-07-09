import { applicationContext } from '../../applicationContext';
import { orderTypesHelper as orderTypesHelperComputed } from './orderTypesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const { USER_ROLES } = applicationContext.getConstants();

let user = {
  role: USER_ROLES.docketClerk,
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
      ORDER_TYPES_MAP: [
        { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
        { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
      ],
      USER_ROLES: {
        petitionsClerk: USER_ROLES.petitionsClerk,
      },
    };
  },
  getCurrentUser: () => user,
});

describe('orderTypesHelper', () => {
  it('should return all event codes for docketclerk', () => {
    const result = runCompute(orderTypesHelper, {});
    expect(result.orderTypes).toEqual([
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ]);
  });

  it('should filter out and only return type O for petitionsclerk', () => {
    user.role = USER_ROLES.petitionsClerk;
    const result = runCompute(orderTypesHelper, {});
    expect(result.orderTypes).toEqual([
      {
        code: 'Shenzi',
        documentType: 'Hyena',
        eventCode: 'O',
      },
    ]);
  });

  it('should return showDocumentTitleInput true and documentTitleInputLabel if state.modal.eventCode is O', () => {
    const result = runCompute(orderTypesHelper, {
      state: { modal: { eventCode: 'O' } },
    });
    expect(result.showDocumentTitleInput).toEqual(true);
    expect(result.documentTitleInputLabel).toEqual('Order title');
  });

  it('should return showDocumentTitleInput true and documentTitleInputLabel if state.modal.eventCode is NOT', () => {
    const result = runCompute(orderTypesHelper, {
      state: { modal: { eventCode: 'NOT' } },
    });
    expect(result.showDocumentTitleInput).toEqual(true);
    expect(result.documentTitleInputLabel).toEqual('Notice title');
  });

  it('should return showDocumentTitleInput false if state.modal.eventCode is not O or NOT', () => {
    const result = runCompute(orderTypesHelper, {
      state: { modal: { eventCode: 'OTHER' } },
    });
    expect(result.showDocumentTitleInput).toEqual(false);
  });
});
