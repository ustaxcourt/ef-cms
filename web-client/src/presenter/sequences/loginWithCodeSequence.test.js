import { CerebralTest } from 'cerebral/test';
import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import sinon from 'sinon';

let test;

const TOKEN =
  'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRk5mZ2tQZlVmTTBRRWtuak5Ic1lWQSIsInN1YiI6Ijc0YzA2NDBjLTljYjQtNGE0Ny04OWMyLThjOGU5YmFiMmUyNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83dVJrRjBBeG4iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRjMDY0MGMtOWNiNC00YTQ3LTg5YzItOGM4ZTliYWIyZTI2IiwiYXVkIjoiNnR1Nmoxc3R2NXVnY3V0N2Rxc3FkdXJuOHEiLCJldmVudF9pZCI6ImQ5MGRjMGJlLTZhYjYtMTFlOS04YWI2LWMzNTYyYjI5YmEwOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTU2NTY2OTE3LCJuYW1lIjoiVGVzdCBwZXRpdGlvbnNjbGVyazEiLCJleHAiOjE1NTY1NzA1MTcsImN1c3RvbTpyb2xlIjoicGV0aXRpb25zY2xlcmsiLCJpYXQiOjE1NTY1NjY5MTcsImVtYWlsIjoicGV0aXRpb25zY2xlcmsxQGV4YW1wbGUuY29tIn0.mXE2yMgVhP_wHqpohtBHHcmL5WrxXxLB2KzvNMlldLRF-WcuGHIwhL1yXuYCp1Jobi1j823nYeXhAhPF4mzQLB6weXUga3UVT1op-KENSxvpfJJvuty2AGCBcjx6j85UDtA3KE9nx-xqWJkRpVHvfTVezMMc_v3QpmVuiPyfdO1gPCDUNiMpndVrBZW6iA6ANhMsud7IHx3R9ENauoDzohJBl_Zb1O-S34J-JjhbN6_fGKguzW8Hxwb3h-WImF_qZgKsR5B5gMzvhQhMAcSjltZI7a88L2OBwbTZjggxp5RAeju6GT_zY7xC_5vpUnJka8p4NwdLJyATi2GMXTSVDg';
const NEW_TOKEN =
  'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRk5mZ2tQZlVmTTBRRWtuak5Ic1lWQSIsInN1YiI6Ijc0YzA2NDBjLTljYjQtNGE0Ny04OWMyLThjOGU5YmFiMmUyNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83dVJrRjBBeG4iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRjMDY0MGMtOWNiNC00YTQ3LTg5YzItOGM4ZTliYWIyZTI2IiwiYXVkIjoiNnR1Nmoxc3R2NXVnY3V0N2Rxc3FkdXJuOHEiLCJldmVudF9pZCI6ImQ5MGRjMGJlLTZhYjYtMTFlOS04YWI2LWMzNTYyYjI5YmEwOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTU2NTY2OTE3LCJuYW1lIjoiVGVzdCBwZXRpdGlvbnNjbGVyazEiLCJleHAiOjE1NTY1NzA1MTcsImN1c3RvbTpyb2xlIjoicGV0aXRpb25zY2xlcmsiLCJpYXQiOjE1NTY1NjY5MTcsImVtYWlsIjoicGV0aXRpb25zY2xlcmsxQGV4YW1wbGUuY29tIn0.mXE2yMgVhP_wHqpohtBHHcmL5WrxXxLB2KzvNMlldLRF-WcuGHIwhL1yXuYCp1Jobi1j823nYeXhAhPF4mzQLB6weXUga3UVT1op-KENSxvpfJJvuty2AGCBcjx6j85UDtA3KE9nx-xqWJkRpVHvfTVezMMc_v3QpmVuiPyfdO1gPCDUNiMpndVrBZW6iA6ANhMsud7IHx3R9ENauoDzohJBl_Zb1O-S34J-JjhbN6_fGKguzW8Hxwb3h-WImF_qZgKsR5B5gMzvhQhMAcSjltZI7a88L2OBwbTZjggxp5RAeju6GT_zY7xC_5vpUnJka8p4NwdLJyATi2GMXTSVDg';
const USER = {
  role: 'petitionsclerk',
};

presenter.providers.router = {
  route: async () => null,
};

const refreshTokenStub = sinon.stub().resolves({
  token: TOKEN,
});

presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => ({
    authorizeCode: async () => ({
      refreshToken: TOKEN,
      token: TOKEN,
    }),
    getUserInteractor: async () => USER,
    refreshToken: refreshTokenStub,
    setItem: () => null,
  }),
};

test = CerebralTest(presenter);

describe('loginWithCodeSequence', () => {
  it('should use the code to fetch the token and put it onto the store', async () => {
    sinon.stub(global, 'setInterval').callsFake(cb => cb());
    global.window = {
      localStorage: {
        setItem() {},
      },
    };
    sinon.stub(window.localStorage, 'setItem');
    await test.runSequence('loginWithCodeSequence', {
      code: 'abc',
    });
    expect(
      presenter.providers.applicationContext
        .getUseCases()
        .refreshToken.getCall(0).args[0].refreshToken,
    ).toEqual(TOKEN);
    expect(test.getState('token')).toEqual(NEW_TOKEN);
    expect(test.getState('refreshToken')).toEqual(NEW_TOKEN);
    expect(test.getState('user')).toEqual(USER);
    expect(test.getState('refreshTokenInterval')).toBeDefined();
  });
});
