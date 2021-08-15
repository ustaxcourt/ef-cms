import { CerebralTest } from 'cerebral/test';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { loginWithCodeSequence } from '../sequences/loginWithCodeSequence';
import { presenter } from '../presenter-mock';

describe('loginWithCodeSequence', () => {
  let cerebralTest;

  const TOKEN =
    'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRk5mZ2tQZlVmTTBRRWtuak5Ic1lWQSIsInN1YiI6Ijc0YzA2NDBjLTljYjQtNGE0Ny04OWMyLThjOGU5YmFiMmUyNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83dVJrRjBBeG4iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRjMDY0MGMtOWNiNC00YTQ3LTg5YzItOGM4ZTliYWIyZTI2IiwiYXVkIjoiNnR1Nmoxc3R2NXVnY3V0N2Rxc3FkdXJuOHEiLCJldmVudF9pZCI6ImQ5MGRjMGJlLTZhYjYtMTFlOS04YWI2LWMzNTYyYjI5YmEwOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTU2NTY2OTE3LCJuYW1lIjoiVGVzdCBwZXRpdGlvbnNjbGVyazEiLCJleHAiOjE1NTY1NzA1MTcsImN1c3RvbTpyb2xlIjoicGV0aXRpb25zY2xlcmsiLCJpYXQiOjE1NTY1NjY5MTcsImVtYWlsIjoicGV0aXRpb25zY2xlcmsxQGV4YW1wbGUuY29tIn0.mXE2yMgVhP_wHqpohtBHHcmL5WrxXxLB2KzvNMlldLRF-WcuGHIwhL1yXuYCp1Jobi1j823nYeXhAhPF4mzQLB6weXUga3UVT1op-KENSxvpfJJvuty2AGCBcjx6j85UDtA3KE9nx-xqWJkRpVHvfTVezMMc_v3QpmVuiPyfdO1gPCDUNiMpndVrBZW6iA6ANhMsud7IHx3R9ENauoDzohJBl_Zb1O-S34J-JjhbN6_fGKguzW8Hxwb3h-WImF_qZgKsR5B5gMzvhQhMAcSjltZI7a88L2OBwbTZjggxp5RAeju6GT_zY7xC_5vpUnJka8p4NwdLJyATi2GMXTSVDg';
  const NEW_TOKEN =
    'eyJraWQiOiJ2U2pTa3FZVkJjVkJOWk5qZ1gzWFNzcERZSjU4QmQ3OGYrSzlDSXhtck44PSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiRk5mZ2tQZlVmTTBRRWtuak5Ic1lWQSIsInN1YiI6Ijc0YzA2NDBjLTljYjQtNGE0Ny04OWMyLThjOGU5YmFiMmUyNiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV83dVJrRjBBeG4iLCJjb2duaXRvOnVzZXJuYW1lIjoiNzRjMDY0MGMtOWNiNC00YTQ3LTg5YzItOGM4ZTliYWIyZTI2IiwiYXVkIjoiNnR1Nmoxc3R2NXVnY3V0N2Rxc3FkdXJuOHEiLCJldmVudF9pZCI6ImQ5MGRjMGJlLTZhYjYtMTFlOS04YWI2LWMzNTYyYjI5YmEwOCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTU2NTY2OTE3LCJuYW1lIjoiVGVzdCBwZXRpdGlvbnNjbGVyazEiLCJleHAiOjE1NTY1NzA1MTcsImN1c3RvbTpyb2xlIjoicGV0aXRpb25zY2xlcmsiLCJpYXQiOjE1NTY1NjY5MTcsImVtYWlsIjoicGV0aXRpb25zY2xlcmsxQGV4YW1wbGUuY29tIn0.mXE2yMgVhP_wHqpohtBHHcmL5WrxXxLB2KzvNMlldLRF-WcuGHIwhL1yXuYCp1Jobi1j823nYeXhAhPF4mzQLB6weXUga3UVT1op-KENSxvpfJJvuty2AGCBcjx6j85UDtA3KE9nx-xqWJkRpVHvfTVezMMc_v3QpmVuiPyfdO1gPCDUNiMpndVrBZW6iA6ANhMsud7IHx3R9ENauoDzohJBl_Zb1O-S34J-JjhbN6_fGKguzW8Hxwb3h-WImF_qZgKsR5B5gMzvhQhMAcSjltZI7a88L2OBwbTZjggxp5RAeju6GT_zY7xC_5vpUnJka8p4NwdLJyATi2GMXTSVDg';
  const USER = {
    role: ROLES.petitionsClerk,
  };
  beforeAll(() => {
    applicationContext.getUseCases().authorizeCodeInteractor.mockReturnValue({
      refreshToken: TOKEN,
      token: TOKEN,
    });
    applicationContext.getUseCases().getUserInteractor.mockReturnValue(USER);
    applicationContext.getUseCases().setItemInteractor.mockReturnValue(null);

    applicationContext.getUseCases().refreshTokenInteractor.mockReturnValue({
      token: TOKEN,
    });
    jest.spyOn(global, 'setInterval').mockImplementation(cb => cb());
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      route: () => null,
    };
    presenter.sequences = {
      loginWithCodeSequence,
    };
    cerebralTest = CerebralTest(presenter);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should use the code to fetch the token and put it onto the store', async () => {
    await cerebralTest.runSequence('loginWithCodeSequence', {
      code: 'abc',
    });
    expect(
      applicationContext.getUseCases().refreshTokenInteractor.mock.calls[0][1]
        .refreshToken,
    ).toEqual(TOKEN);
    expect(cerebralTest.getState('token')).toEqual(NEW_TOKEN);
    expect(cerebralTest.getState('refreshToken')).toEqual(NEW_TOKEN);
    expect(cerebralTest.getState('user')).toEqual(USER);
    expect(cerebralTest.getState('refreshTokenInterval')).toBeDefined();
  });
});
