import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getHealthCheckAction } from './getHealthCheckAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getHealthCheckAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should retrieve the application health', async () => {
    const mockHealth = {
      clamAV: false,
      cognito: false,
      dynamo: { efcms: true, efcmsDeploy: false },
      dynamsoft: false,
      elasticsearch: true,
      emailService: true,
      s3: {
        'app.dev.ustc-case-mgmt.flexion.us': false,
        'app-failover.dev.ustc-case-mgmt.flexion.us': false,
        'dev.ustc-case-mgmt.flexion.us': false,
        'dev.ustc-case-mgmt.flexion.us-documents-local-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-documents-local-us-west-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-local-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-local-us-west-1': false,
        'failover.dev.ustc-case-mgmt.flexion.us': false,
      },
    };
    applicationContext
      .getUseCases()
      .getHealthCheckInteractor.mockReturnValue(mockHealth);

    const result = await runAction(getHealthCheckAction, {
      modules: {
        presenter,
      },
    });

    expect(result.output.health).toMatchObject(mockHealth);
  });
});
