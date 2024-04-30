import { ROLES } from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '../../applicationContext';
import { docketClerk1User, petitionsClerkUser } from '@shared/test/mockUsers';
import { orderTypesHelper as orderTypesHelperComputed } from './orderTypesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('orderTypesHelper', () => {
  let user: RawUser = docketClerk1User;

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
          petitionsClerk: ROLES.petitionsClerk,
        },
      };
    },
    getCurrentUser: () => user,
  });

  it('should return all event codes for docketclerk', () => {
    const result = runCompute(orderTypesHelper, { state: {} });

    expect(result.orderTypes).toEqual([
      { code: 'Simba', documentType: 'Lion', eventCode: 'ROAR' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'HAHA' },
      { code: 'Shenzi', documentType: 'Hyena', eventCode: 'O' },
    ]);
  });

  it('should filter out and only return type O for petitionsclerk', () => {
    user = petitionsClerkUser;

    const result = runCompute(orderTypesHelper, { state: {} });

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
