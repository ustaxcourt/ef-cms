import { requireEnvVars } from '../../../shared/admin-tools/util';
import { setEnvironmentVariables } from '../../../shared/admin-tools/aws/lambdaHelper';

requireEnvVars(['LAMBDA', 'LAMBDA_ENV']);

const FunctionName = process.env.LAMBDA!;
const Environment = { Variables: JSON.parse(process.env.LAMBDA_ENV!) };
const region = process.env.LAMBDA_REGION!;

(async () => {
  await setEnvironmentVariables({
    Environment,
    FunctionName,
    region: region.length > 0 ? region : undefined,
  });
})();
