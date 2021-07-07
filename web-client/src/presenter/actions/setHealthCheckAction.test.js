import { runAction } from 'cerebral/test';
import { setHealthCheckAction } from './setHealthCheckAction';

describe('setHealthCheckAction', () => {
  it('sets the state.health to the passed in props.health', async () => {
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
        'dev.ustc-case-mgmt.flexion.us-quarantine-local-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-quarantine-local-us-west-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-local-us-east-1': false,
        'dev.ustc-case-mgmt.flexion.us-temp-documents-local-us-west-1': false,
        'failover.dev.ustc-case-mgmt.flexion.us': false,
      },
    };

    const result = await runAction(setHealthCheckAction, {
      props: {
        health: mockHealth,
      },
      state: { health: {} },
    });
    expect(result.state.health).toEqual(mockHealth);
  });
});
