import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

type WorkflowArtifact = {
  archive_download_url: string;
  created_at: string;
  expired: boolean;
  name: string;
};

type WorkflowArtifactsResponse = {
  artifacts: WorkflowArtifact[];
};

type WorkflowRunResponse = {
  run_started_at: string;
};

class GitHubApiRequestError extends Error {
  readonly status: number;
  readonly url: string;

  constructor({ status, url }: { status: number; url: string }) {
    super(`GitHub API request failed (${status}): ${url}`);
    this.name = 'GitHubApiRequestError';
    this.status = status;
    this.url = url;
  }
}

const MAX_ANCESTOR_COMMITS_TO_SCAN = 501;

export const getAncestorCommitShas = ({
  gitCommandRunner = execFileSync,
}: {
  gitCommandRunner?: typeof execFileSync;
} = {}): string[] => {
  const gitOutput = gitCommandRunner(
    'git',
    ['rev-list', `--max-count=${MAX_ANCESTOR_COMMITS_TO_SCAN}`, 'HEAD'],
    {
      encoding: 'utf8',
    },
  );

  return gitOutput
    .split('\n')
    .map(sha => sha.trim())
    .filter((sha): sha is string => Boolean(sha));
};

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const githubGet = async <T>(url: string): Promise<T> => {
  const token = getRequiredEnvironmentVariable('GITHUB_TOKEN');
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ef-cms-test-file-times',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new GitHubApiRequestError({
      status: response.status,
      url,
    });
  }

  return (await response.json()) as T;
};

const downloadArtifact = async ({
  archiveDownloadUrl,
  outputFilePath,
}: {
  archiveDownloadUrl: string;
  outputFilePath: string;
}): Promise<void> => {
  const token = getRequiredEnvironmentVariable('GITHUB_TOKEN');
  const response = await fetch(archiveDownloadUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'ef-cms-test-file-times',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Artifact download failed (${response.status}): ${archiveDownloadUrl}`,
    );
  }

  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'historical-test-file-times-'),
  );
  try {
    const archivePath = path.join(tempDir, 'artifact.zip');
    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(archivePath, buffer);
    execFileSync('unzip', ['-o', archivePath, '-d', tempDir], {
      stdio: 'ignore',
    });

    const extractedJsonFiles = fs
      .readdirSync(tempDir)
      .filter(
        fileName => fileName !== 'artifact.zip' && fileName.endsWith('.json'),
      );

    if (extractedJsonFiles.length !== 1) {
      throw new Error(
        `Downloaded artifact must contain exactly one json timing file, found ${extractedJsonFiles.length}`,
      );
    }

    fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
    fs.copyFileSync(path.join(tempDir, extractedJsonFiles[0]), outputFilePath);
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
};

// Returns the current workflow run's start time as an ISO 8601 string, used
// to filter out artifacts uploaded after this run began. Without this cutoff,
// parallel matrix shards can observe different snapshots of artifacts as
// concurrent runs upload them, producing inconsistent weight maps and
// overlapping/missing shard splits. ISO 8601 UTC strings sort lexically the
// same as chronologically, so plain string comparison is sufficient.
const getCurrentRunStartedAt = async ({
  repository,
}: {
  repository: string;
}): Promise<string | undefined> => {
  const runId = process.env.GITHUB_RUN_ID;
  if (!runId) {
    return undefined;
  }

  try {
    const run = await githubGet<WorkflowRunResponse>(
      `https://api.github.com/repos/${repository}/actions/runs/${runId}`,
    );
    return run.run_started_at;
  } catch (error: unknown) {
    console.log(
      `Could not fetch workflow run start time; proceeding without race-filter. (${
        error instanceof Error ? error.message : String(error)
      })`,
    );
    return undefined;
  }
};

export const downloadHistoricalTestFileTimes = async ({
  artifactName,
  outputFilePath,
  workflowFileName,
}: {
  artifactName: string;
  outputFilePath: string;
  workflowFileName: string;
}): Promise<void> => {
  const repository = getRequiredEnvironmentVariable('GITHUB_REPOSITORY');
  const allCommitShas = getAncestorCommitShas();

  // We exclude the current testing SHA and the actual HEAD (which is the SHA
  // of a potential merge commit that may or may not happen) to ensure we are
  // searching for strictly historical timing data.
  const currentSha = process.env.GITHUB_SHA;
  const ancestorCommitShas = allCommitShas.filter(
    sha => sha !== currentSha && sha !== allCommitShas[0],
  );

  const runStartedAt = await getCurrentRunStartedAt({ repository });

  console.log(
    `Searching for historical test timings for ${workflowFileName} in ancestor commits...`,
  );

  const BATCH_SIZE = 10;

  for (let i = 0; i < ancestorCommitShas.length; i += BATCH_SIZE) {
    const batch = ancestorCommitShas.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async (sha: string): Promise<WorkflowArtifact | undefined> => {
        const fullArtifactName = `${workflowFileName}-${artifactName}-${sha}`;
        try {
          const response = await githubGet<WorkflowArtifactsResponse>(
            `https://api.github.com/repos/${repository}/actions/artifacts?name=${fullArtifactName}&per_page=1`,
          );

          return response.artifacts.find(
            artifact =>
              artifact.name === fullArtifactName &&
              !artifact.expired &&
              (!runStartedAt || artifact.created_at < runStartedAt),
          );
        } catch (error: unknown) {
          if (
            error instanceof GitHubApiRequestError &&
            (error.status === 403 || error.status === 404)
          ) {
            return undefined;
          }
          throw error;
        }
      }),
    );

    const timingArtifact = results.find(
      (artifact): artifact is WorkflowArtifact => Boolean(artifact),
    );

    if (timingArtifact) {
      console.log(
        `Found historical test timings artifact: ${timingArtifact.name}`,
      );
      await downloadArtifact({
        archiveDownloadUrl: timingArtifact.archive_download_url,
        outputFilePath,
      });
      return;
    }
  }

  console.log(
    'No successful ancestor workflow run with test timing artifact found.',
  );
};
