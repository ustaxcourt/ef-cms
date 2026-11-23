import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '../..');
const SCRIPT = path.join(
  REPO_ROOT,
  '.github/actions/dawson-deployed-image/resolve-deployed-image.sh',
);

const ACCOUNT_ID = '111122223333';
const ERROR_ACCOUNT_ID = '123456789012';
const DIGEST = `sha256:${'a1'.repeat(32)}`;

const FAKE_AWS = `#!/usr/bin/env bash
echo "$*" >>"$FAKE_AWS_CALLS"
case "$1 $2" in
  "ssm get-parameter") response="\${FAKE_SSM_RESPONSE-}"; error="\${FAKE_SSM_ERROR-}" ;;
  "ecr describe-images") response="\${FAKE_ECR_RESPONSE-}"; error="\${FAKE_ECR_ERROR-}" ;;
  *) echo "unexpected aws call: $*" >&2; exit 99 ;;
esac
if [[ -n "$error" ]]; then
  echo "An error occurred ($error) when calling the operation: User: arn:aws:sts::${ERROR_ACCOUNT_ID}:assumed-role/github_actions_image_scan/run is not authorized" >&2
  exit 254
fi
printf '%s\\n' "$response"
`;

const ciConfig = (imageLine: string): string =>
  `version: 2.1\norbs:\n  git-shallow-clone: guitarrapc/git-shallow-clone@2.8.0\n\n${imageLine}\n\nparameters:\n  run_build_and_deploy:\n`;

const CI_IMAGE_LINE =
  'efcms-docker-image: &efcms-docker-image $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:4.3.103';

type RunResult = {
  calls: string[];
  output: string;
  status: number | null;
  stderr: string;
  stdout: string;
};

describe('resolve-deployed-image.sh', () => {
  let workDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'resolve-deployed-image-'));
    mkdirSync(path.join(workDir, 'bin'));
    writeFileSync(path.join(workDir, 'bin/aws'), FAKE_AWS);
    chmodSync(path.join(workDir, 'bin/aws'), 0o755);
  });

  afterEach(() => {
    rmSync(workDir, { force: true, recursive: true });
  });

  const run = ({
    config = ciConfig(CI_IMAGE_LINE),
    env = {},
  }: {
    config?: string | null;
    env?: Record<string, string | undefined>;
  } = {}): RunResult => {
    const configFile = path.join(workDir, 'deploy-config.yml');
    const outputFile = path.join(workDir, 'github_output');
    const callsFile = path.join(workDir, 'aws_calls');
    if (config !== null) {
      writeFileSync(configFile, config);
    }
    writeFileSync(outputFile, '');
    writeFileSync(callsFile, '');

    const fullEnv: Record<string, string | undefined> = {
      CI_CONFIG: configFile,
      DEPLOY_ENV: 'prod',
      FAKE_AWS_CALLS: callsFile,
      FAKE_ECR_RESPONSE: `${ACCOUNT_ID}\t${DIGEST}`,
      FAKE_SSM_RESPONSE: 'blue',
      GITHUB_OUTPUT: outputFile,
      IMAGE: 'ci-image',
      PATH: `${path.join(workDir, 'bin')}:${process.env.PATH}`,
      ...env,
    };
    const result = spawnSync('bash', [SCRIPT], {
      encoding: 'utf-8',
      env: Object.fromEntries(
        Object.entries(fullEnv).filter(([, value]) => value !== undefined),
      ),
    });

    return {
      calls: readFileSync(callsFile, 'utf-8').split('\n').filter(Boolean),
      output: readFileSync(outputFile, 'utf-8'),
      status: result.status,
      stderr: result.stderr,
      stdout: result.stdout,
    };
  };

  const describeImagesCalls = (calls: string[]): string[] =>
    calls.filter(call => call.startsWith('ecr describe-images'));

  const expectFailure = (result: RunResult, message: string): void => {
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('::error::');
    expect(result.stderr).toContain(message);
    expect(result.output).toBe('');
  };

  describe('ci-image', () => {
    it('looks up the tag the deploy config names and writes a digest-pinned reference', () => {
      const result = run();

      expect(result.status).toBe(0);
      expect(result.calls).toEqual([
        'ecr describe-images --region us-east-1 --repository-name ef-cms-us-east-1 --image-ids imageTag=4.3.103 --query imageDetails[0].[registryId,imageDigest] --output text',
      ]);
      expect(result.output).toBe(
        `image_ref=${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1@${DIGEST}\n`,
      );
      expect(result.stdout).toContain(
        `Scanning ef-cms-us-east-1:4.3.103 at ${DIGEST}`,
      );
    });

    it('does not read SSM', () => {
      const { calls } = run();

      expect(calls.some(call => call.startsWith('ssm'))).toBe(false);
    });

    it('accepts trailing whitespace after the tag', () => {
      const { calls, status } = run({ config: ciConfig(`${CI_IMAGE_LINE}  `) });

      expect(status).toBe(0);
      expect(describeImagesCalls(calls)[0]).toContain('imageTag=4.3.103');
    });

    it.each([
      ['the image line is missing', ciConfig('other: value')],
      [
        'the tag is not a version',
        ciConfig(CI_IMAGE_LINE.replace('4.3.103', 'latest')),
      ],
      [
        'the image line appears twice',
        ciConfig(`${CI_IMAGE_LINE}\n${CI_IMAGE_LINE}`),
      ],
      [
        'the image line names another repository',
        ciConfig(CI_IMAGE_LINE.replace('ef-cms-us-east-1:', 'other-repo:')),
      ],
    ])('fails without calling AWS when %s', (_, config) => {
      const result = run({ config });

      expectFailure(result, 'No version tag for ef-cms-us-east-1');
      expect(result.calls).toEqual([]);
    });

    it('fails without calling AWS when the deploy config is missing', () => {
      const result = run({ config: null });

      expectFailure(result, 'No deploy config at');
      expect(result.calls).toEqual([]);
    });

    it('reads a version tag from the repository deploy config', () => {
      const { calls, status } = run({
        env: { CI_CONFIG: path.join(REPO_ROOT, '.circleci/config.yml') },
      });

      expect(status).toBe(0);
      expect(describeImagesCalls(calls)[0]).toMatch(
        / --repository-name ef-cms-us-east-1 --image-ids imageTag=\d+\.\d+\.\d+ /,
      );
    });
  });

  describe('batch', () => {
    it.each(['blue', 'green'])(
      'looks up latest in the %s repository when SSM names that color',
      color => {
        const result = run({
          env: { FAKE_SSM_RESPONSE: color, IMAGE: 'batch' },
        });

        expect(result.status).toBe(0);
        expect(result.calls).toEqual([
          'ssm get-parameter --region us-east-1 --name /DAWSON/prod/current-color --query Parameter.Value --output text',
          `ecr describe-images --region us-east-1 --repository-name docket-entry-zipper-prod-${color}-us-east-1 --image-ids imageTag=latest --query imageDetails[0].[registryId,imageDigest] --output text`,
        ]);
        expect(result.output).toBe(
          `image_ref=${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-prod-${color}-us-east-1@${DIGEST}\n`,
        );
      },
    );

    it('uses the environment name for the parameter and the repository', () => {
      const { calls, status } = run({
        env: { DEPLOY_ENV: 'stg', IMAGE: 'batch' },
      });

      expect(status).toBe(0);
      expect(calls[0]).toContain('--name /DAWSON/stg/current-color');
      expect(calls[1]).toContain(
        '--repository-name docket-entry-zipper-stg-blue-us-east-1',
      );
    });

    it('does not need a deploy config', () => {
      const { status } = run({ config: null, env: { IMAGE: 'batch' } });

      expect(status).toBe(0);
    });

    it.each(['', 'BLUE', 'purple', 'blue extra', 'None'])(
      "fails without looking up an image when SSM returns '%s'",
      color => {
        const result = run({
          env: { FAKE_SSM_RESPONSE: color, IMAGE: 'batch' },
        });

        expectFailure(result, 'expected blue or green');
        expect(describeImagesCalls(result.calls)).toEqual([]);
      },
    );
  });

  describe('digest lookup', () => {
    it.each([
      ['no image details', 'None\tNone'],
      ['an empty response', ''],
      ['a short registry ID', `1111\t${DIGEST}`],
    ])('fails on %s', (_, response) => {
      const result = run({ env: { FAKE_ECR_RESPONSE: response } });

      expectFailure(
        result,
        'describe-images returned no registry ID for ef-cms-us-east-1:4.3.103',
      );
      expect(result.calls).toHaveLength(1);
    });

    it.each([
      ['a missing digest', `${ACCOUNT_ID}\tNone`],
      ['a short digest', `${ACCOUNT_ID}\tsha256:abc`],
      ['another algorithm', `${ACCOUNT_ID}\tsha512:${'a1'.repeat(32)}`],
    ])('fails on %s', (_, response) => {
      const result = run({ env: { FAKE_ECR_RESPONSE: response } });

      expectFailure(
        result,
        'describe-images returned no digest for ef-cms-us-east-1:4.3.103',
      );
      expect(result.calls).toHaveLength(1);
    });
  });

  describe('AWS errors', () => {
    it.each([
      ['SSM', 'AccessDeniedException', 'aws ssm get-parameter failed'],
      ['SSM', 'ParameterNotFound', 'aws ssm get-parameter failed'],
      ['ECR', 'AccessDeniedException', 'aws ecr describe-images failed'],
      ['ECR', 'ImageNotFoundException', 'aws ecr describe-images failed'],
      ['ECR', 'RepositoryNotFoundException', 'aws ecr describe-images failed'],
    ])(
      'reports the %s error code %s without the account ID',
      (service, code, message) => {
        const result = run({
          env: { [`FAKE_${service}_ERROR`]: code, IMAGE: 'batch' },
        });

        expectFailure(result, `${message}: ${code}`);
        expect(result.stdout + result.stderr).not.toContain(ERROR_ACCOUNT_ID);
      },
    );

    it('names the image it was looking up when ECR fails', () => {
      const { stdout } = run({
        env: { FAKE_ECR_ERROR: 'ImageNotFoundException', IMAGE: 'batch' },
      });

      expect(stdout).toContain(
        'Looking up docket-entry-zipper-prod-blue-us-east-1:latest',
      );
    });

    it('reports an unknown error when the CLI fails without an error code', () => {
      writeFileSync(
        path.join(workDir, 'bin/aws'),
        `#!/usr/bin/env bash\necho "Unable to locate credentials for ${ERROR_ACCOUNT_ID}" >&2\nexit 253\n`,
      );

      const result = run();

      expectFailure(result, 'aws ecr describe-images failed: unknown error');
      expect(result.stdout + result.stderr).not.toContain(ERROR_ACCOUNT_ID);
    });
  });

  describe('masking', () => {
    it('masks the account ID and prints it nowhere else', () => {
      const { stderr, stdout } = run({ env: { IMAGE: 'batch' } });

      expect(stdout).toContain(`::add-mask::${ACCOUNT_ID}\n`);
      expect(stdout.split(ACCOUNT_ID)).toHaveLength(2);
      expect(stderr).not.toContain(ACCOUNT_ID);
    });
  });

  describe('inputs', () => {
    it.each([
      ['unset', undefined],
      ['unknown', 'puppeteer'],
    ])('fails without calling AWS when IMAGE is %s', (_, image) => {
      const result = run({ env: { IMAGE: image } });

      expectFailure(result, 'IMAGE must be ci-image or batch');
      expect(result.calls).toEqual([]);
    });

    it.each([
      ['unset', undefined],
      ['a path', 'prod/../other'],
      ['upper case', 'PROD'],
    ])('fails without calling AWS when DEPLOY_ENV is %s', (_, deployEnv) => {
      const result = run({ env: { DEPLOY_ENV: deployEnv, IMAGE: 'batch' } });

      expectFailure(result, 'DEPLOY_ENV must be a DAWSON environment name');
      expect(result.calls).toEqual([]);
    });

    it('fails when GITHUB_OUTPUT is unset', () => {
      const result = run({ env: { GITHUB_OUTPUT: undefined } });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('GITHUB_OUTPUT is not set');
      expect(result.calls).toEqual([]);
    });
  });

  it('matches the image the batch job definition runs', () => {
    const batchTf = path.join(
      REPO_ROOT,
      'web-api/terraform/modules/batch/batch.tf',
    );

    expect(existsSync(batchTf)).toBe(true);
    expect(readFileSync(batchTf, 'utf-8')).toContain(
      '.amazonaws.com/docket-entry-zipper-${var.environment}-${var.current_color}-${var.region}:latest"',
    );
  });
});
