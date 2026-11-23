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
const CI_IMAGE_TAGS = '4.3.103\t4.3.105\tSNAPSHOT-4.3.104-abc1234\t4.3.104';

const FAKE_AWS = `#!/usr/bin/env bash
echo "$*" >>"$FAKE_AWS_CALLS"
case "$1 $2" in
  "ssm get-parameter") response="\${FAKE_SSM_RESPONSE-}"; error="\${FAKE_SSM_ERROR-}" ;;
  "ecr describe-images")
    if [[ " $* " == *" --filter "* ]]; then
      response="\${FAKE_ECR_TAGS-}"; error="\${FAKE_ECR_TAGS_ERROR-}"
    else
      response="\${FAKE_ECR_RESPONSE-}"; error="\${FAKE_ECR_ERROR-}"
    fi ;;
  *) echo "unexpected aws call: $*" >&2; exit 99 ;;
esac
if [[ -n "$error" ]]; then
  echo "An error occurred ($error) when calling the operation: User: arn:aws:sts::${ERROR_ACCOUNT_ID}:assumed-role/github_actions_image_scan/run is not authorized" >&2
  exit 254
fi
printf '%s\\n' "$response"
`;

const TAG_LIST_CALL =
  'ecr describe-images --region us-east-1 --repository-name ef-cms-us-east-1 --filter tagStatus=TAGGED --query imageDetails[].imageTags[] --output text';

const detailsCall = (repo: string, tag: string): string =>
  `ecr describe-images --region us-east-1 --repository-name ${repo} --image-ids imageTag=${tag} --query imageDetails[0].[registryId,imageDigest] --output text`;

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

  const run = (env: Record<string, string | undefined> = {}): RunResult => {
    const outputFile = path.join(workDir, 'github_output');
    const callsFile = path.join(workDir, 'aws_calls');
    writeFileSync(outputFile, '');
    writeFileSync(callsFile, '');

    const fullEnv: Record<string, string | undefined> = {
      DEPLOY_ENV: 'prod',
      FAKE_AWS_CALLS: callsFile,
      FAKE_ECR_RESPONSE: `${ACCOUNT_ID}\t${DIGEST}`,
      FAKE_ECR_TAGS: CI_IMAGE_TAGS,
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

  const lookedUpTag = (calls: string[]): string | undefined =>
    calls.at(-1)?.match(/--image-ids imageTag=(\S+)/)?.[1];

  const expectFailure = (result: RunResult, message: string): void => {
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('::error::');
    expect(result.stderr).toContain(message);
    expect(result.output).toBe('');
  };

  describe('ci-image', () => {
    it('looks up the highest version tag and writes a digest-pinned reference', () => {
      const result = run();

      expect(result.status).toBe(0);
      expect(result.calls).toEqual([
        TAG_LIST_CALL,
        detailsCall('ef-cms-us-east-1', '4.3.105'),
      ]);
      expect(result.output).toBe(
        `image_ref=${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1@${DIGEST}\n`,
      );
      expect(result.stdout).toContain(
        `Scanning ef-cms-us-east-1:4.3.105 at ${DIGEST}`,
      );
    });

    it.each([
      ['compares versions numerically', '4.3.9\t4.3.10\t4.2.99', '4.3.10'],
      [
        'ignores snapshot and other non-version tags',
        '4.3.103\tSNAPSHOT-4.3.200-abc1234\tlatest\tv4.3.300\t4.3.103-rc1',
        '4.3.103',
      ],
      ['reads tags across lines', '4.3.1\n4.3.2\t4.3.0', '4.3.2'],
    ])('%s', (_, tags, expected) => {
      const { calls, status } = run({ FAKE_ECR_TAGS: tags });

      expect(status).toBe(0);
      expect(lookedUpTag(calls)).toBe(expected);
    });

    it('does not read SSM', () => {
      const { calls } = run();

      expect(calls.some(call => call.startsWith('ssm'))).toBe(false);
    });

    it.each([
      ['no tags', ''],
      ['no tagged images', 'None'],
      ['only non-version tags', 'latest\tSNAPSHOT-4.3.104-abc1234'],
    ])('fails without looking up a digest when ECR has %s', (_, tags) => {
      const result = run({ FAKE_ECR_TAGS: tags });

      expectFailure(result, 'No version tag in ef-cms-us-east-1');
      expect(result.calls).toEqual([TAG_LIST_CALL]);
    });
  });

  describe('batch', () => {
    it.each(['blue', 'green'])(
      'looks up latest in the %s repository when SSM names that color',
      color => {
        const result = run({ FAKE_SSM_RESPONSE: color, IMAGE: 'batch' });

        expect(result.status).toBe(0);
        expect(result.calls).toEqual([
          'ssm get-parameter --region us-east-1 --name /DAWSON/prod/current-color --query Parameter.Value --output text',
          detailsCall(`docket-entry-zipper-prod-${color}-us-east-1`, 'latest'),
        ]);
        expect(result.output).toBe(
          `image_ref=${ACCOUNT_ID}.dkr.ecr.us-east-1.amazonaws.com/docket-entry-zipper-prod-${color}-us-east-1@${DIGEST}\n`,
        );
      },
    );

    it('uses the environment name for the parameter and the repository', () => {
      const { calls, status } = run({ DEPLOY_ENV: 'stg', IMAGE: 'batch' });

      expect(status).toBe(0);
      expect(calls[0]).toContain('--name /DAWSON/stg/current-color');
      expect(calls[1]).toContain(
        '--repository-name docket-entry-zipper-stg-blue-us-east-1',
      );
    });

    it.each(['', 'BLUE', 'purple', 'blue extra', 'None'])(
      "fails without looking up an image when SSM returns '%s'",
      color => {
        const result = run({ FAKE_SSM_RESPONSE: color, IMAGE: 'batch' });

        expectFailure(result, 'expected blue or green');
        expect(result.calls).toHaveLength(1);
      },
    );

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

  describe('digest lookup', () => {
    it.each([
      ['no image details', 'None\tNone'],
      ['an empty response', ''],
      ['a short registry ID', `1111\t${DIGEST}`],
    ])('fails on %s', (_, response) => {
      const result = run({ FAKE_ECR_RESPONSE: response, IMAGE: 'batch' });

      expectFailure(
        result,
        'describe-images returned no registry ID for docket-entry-zipper-prod-blue-us-east-1:latest',
      );
      expect(result.calls).toHaveLength(2);
    });

    it.each([
      ['a missing digest', `${ACCOUNT_ID}\tNone`],
      ['a short digest', `${ACCOUNT_ID}\tsha256:abc`],
      ['another algorithm', `${ACCOUNT_ID}\tsha512:${'a1'.repeat(32)}`],
    ])('fails on %s', (_, response) => {
      const result = run({ FAKE_ECR_RESPONSE: response, IMAGE: 'batch' });

      expectFailure(
        result,
        'describe-images returned no digest for docket-entry-zipper-prod-blue-us-east-1:latest',
      );
      expect(result.calls).toHaveLength(2);
    });
  });

  describe('AWS errors', () => {
    it.each([
      ['batch', 'FAKE_SSM_ERROR', 'AccessDeniedException', 'ssm get-parameter'],
      ['batch', 'FAKE_SSM_ERROR', 'ParameterNotFound', 'ssm get-parameter'],
      [
        'batch',
        'FAKE_ECR_ERROR',
        'AccessDeniedException',
        'ecr describe-images',
      ],
      [
        'batch',
        'FAKE_ECR_ERROR',
        'ImageNotFoundException',
        'ecr describe-images',
      ],
      [
        'batch',
        'FAKE_ECR_ERROR',
        'RepositoryNotFoundException',
        'ecr describe-images',
      ],
      [
        'ci-image',
        'FAKE_ECR_TAGS_ERROR',
        'AccessDeniedException',
        'ecr describe-images',
      ],
      [
        'ci-image',
        'FAKE_ECR_TAGS_ERROR',
        'RepositoryNotFoundException',
        'ecr describe-images',
      ],
    ])(
      'reports %s %s=%s without the account ID',
      (image, variable, code, command) => {
        const result = run({ IMAGE: image, [variable]: code });

        expectFailure(result, `aws ${command} failed: ${code}`);
        expect(result.stdout + result.stderr).not.toContain(ERROR_ACCOUNT_ID);
      },
    );

    it('names the image it was looking up when ECR fails', () => {
      const { stdout } = run({
        FAKE_ECR_ERROR: 'ImageNotFoundException',
        IMAGE: 'batch',
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
    it.each(['ci-image', 'batch'])(
      'masks the account ID for %s and prints it nowhere else',
      image => {
        const { stderr, stdout } = run({ IMAGE: image });

        expect(stdout).toContain(`::add-mask::${ACCOUNT_ID}\n`);
        expect(stdout.split(ACCOUNT_ID)).toHaveLength(2);
        expect(stderr).not.toContain(ACCOUNT_ID);
      },
    );
  });

  describe('inputs', () => {
    it.each([
      ['unset', undefined],
      ['unknown', 'puppeteer'],
    ])('fails without calling AWS when IMAGE is %s', (_, image) => {
      const result = run({ IMAGE: image });

      expectFailure(result, 'IMAGE must be ci-image or batch');
      expect(result.calls).toEqual([]);
    });

    it.each([
      ['unset', undefined],
      ['a path', 'prod/../other'],
      ['upper case', 'PROD'],
    ])('fails without calling AWS when DEPLOY_ENV is %s', (_, deployEnv) => {
      const result = run({ DEPLOY_ENV: deployEnv, IMAGE: 'batch' });

      expectFailure(result, 'DEPLOY_ENV must be a DAWSON environment name');
      expect(result.calls).toEqual([]);
    });

    it('fails when GITHUB_OUTPUT is unset', () => {
      const result = run({ GITHUB_OUTPUT: undefined });

      expect(result.status).toBe(1);
      expect(result.stderr).toContain('GITHUB_OUTPUT is not set');
      expect(result.calls).toEqual([]);
    });
  });
});
