import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

type WorkflowArtifact = {
  archive_download_url: string;
  expired: boolean;
  name: string;
};

type WorkflowArtifactsResponse = {
  artifacts: WorkflowArtifact[];
};

type WorkflowRun = {
  conclusion: string | null;
  head_sha: string;
  id: number;
};

type WorkflowRunsResponse = {
  workflow_runs: WorkflowRun[];
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

const MAX_WORKFLOW_RUN_PAGES = 5;
const WORKFLOW_RUNS_PER_PAGE = 100;
const MAX_ANCESTOR_COMMITS_TO_SCAN =
  MAX_WORKFLOW_RUN_PAGES * WORKFLOW_RUNS_PER_PAGE + 1;

export const getAncestorCommitShas = ({
  currentSha,
  gitCommandRunner = execFileSync,
}: {
  currentSha: string;
  gitCommandRunner?: typeof execFileSync;
}): string[] => {
  // Keep the local git search horizon aligned with the paginated GitHub workflow
  // search so we do not read more commit SHAs than the API lookup can ever use.
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
    .filter((sha): sha is string => Boolean(sha) && sha !== currentSha);
};

export const findClosestAncestorWorkflowRun = ({
  ancestorCommitShas,
  workflowRuns,
}: {
  ancestorCommitShas: string[];
  workflowRuns: WorkflowRun[];
}): WorkflowRun | undefined => {
  const successfulWorkflowRunsBySha = new Map<string, WorkflowRun>();

  for (const workflowRun of workflowRuns) {
    if (
      workflowRun.conclusion === 'success' &&
      !successfulWorkflowRunsBySha.has(workflowRun.head_sha)
    ) {
      successfulWorkflowRunsBySha.set(workflowRun.head_sha, workflowRun);
    }
  }

  for (const ancestorCommitSha of ancestorCommitShas) {
    const workflowRun = successfulWorkflowRunsBySha.get(ancestorCommitSha);

    if (workflowRun) {
      return workflowRun;
    }
  }

  return undefined;
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

const findTimingArtifact = ({
  artifacts,
  artifactNamePrefix,
  commitSha,
  workflowFileName,
}: {
  artifactNamePrefix: string;
  artifacts: WorkflowArtifact[];
  commitSha: string;
  workflowFileName: string;
}): WorkflowArtifact | undefined => {
  const artifactNames = [
    `${workflowFileName}-${artifactNamePrefix}-${commitSha}`,
  ];

  for (const artifactName of artifactNames) {
    const artifact = artifacts.find(
      currentArtifact =>
        currentArtifact.name === artifactName && !currentArtifact.expired,
    );

    if (artifact) {
      return artifact;
    }
  }

  return undefined;
};

export const downloadHistoricalTestFileTimes = async (
  args: string[] = process.argv.slice(2),
): Promise<void> => {
  const [workflowFileName, artifactName, outputFilePath] = args;

  if (!workflowFileName || !artifactName || !outputFilePath) {
    throw new Error(
      'Usage: scripts/github-actions/download-historical-test-file-times.helpers.ts <workflow-file-name> <artifact-name> <output-path>',
    );
  }

  const repository = getRequiredEnvironmentVariable('GITHUB_REPOSITORY');
  const currentSha = getRequiredEnvironmentVariable('GITHUB_SHA');
  const ancestorCommitShas = getAncestorCommitShas({ currentSha });
  let exceededWorkflowRunPageLimit = true;

  // Cap pagination to avoid runaway API requests if GitHub returns unexpected data.
  for (let page = 1; page <= MAX_WORKFLOW_RUN_PAGES; page += 1) {
    const workflowRuns = await githubGet<WorkflowRunsResponse>(
      `https://api.github.com/repos/${repository}/actions/workflows/${workflowFileName}/runs?status=completed&per_page=100&page=${page}`,
    );

    if (workflowRuns.workflow_runs.length === 0) {
      exceededWorkflowRunPageLimit = false;
      break;
    }

    let candidateWorkflowRuns = workflowRuns.workflow_runs;

    while (candidateWorkflowRuns.length > 0) {
      const closestAncestorWorkflowRun = findClosestAncestorWorkflowRun({
        ancestorCommitShas,
        workflowRuns: candidateWorkflowRuns,
      });

      if (!closestAncestorWorkflowRun) {
        break;
      }

      let workflowArtifacts: WorkflowArtifactsResponse;

      try {
        workflowArtifacts = await githubGet<WorkflowArtifactsResponse>(
          `https://api.github.com/repos/${repository}/actions/runs/${closestAncestorWorkflowRun.id}/artifacts`,
        );
      } catch (error: unknown) {
        if (
          error instanceof GitHubApiRequestError &&
          (error.status === 403 || error.status === 404)
        ) {
          console.warn(
            `Skipping historical timing artifact lookup for workflow run ${closestAncestorWorkflowRun.id} (${closestAncestorWorkflowRun.head_sha}) because GitHub returned ${error.status}; continuing to older ancestor runs.`,
          );
          candidateWorkflowRuns = candidateWorkflowRuns.filter(
            workflowRun => workflowRun.id !== closestAncestorWorkflowRun.id,
          );
          continue;
        }

        throw error;
      }

      const timingArtifact = findTimingArtifact({
        artifactNamePrefix: artifactName,
        artifacts: workflowArtifacts.artifacts,
        commitSha: closestAncestorWorkflowRun.head_sha,
        workflowFileName,
      });

      if (timingArtifact) {
        await downloadArtifact({
          archiveDownloadUrl: timingArtifact.archive_download_url,
          outputFilePath,
        });
        return;
      }

      candidateWorkflowRuns = candidateWorkflowRuns.filter(
        workflowRun => workflowRun.id !== closestAncestorWorkflowRun.id,
      );
    }
  }

  if (exceededWorkflowRunPageLimit) {
    throw new Error(
      `Exceeded workflow run pagination limit (${MAX_WORKFLOW_RUN_PAGES} pages) while searching for historical test timings.`,
    );
  }

  console.log(
    'No successful ancestor workflow run with test timing artifact found.',
  );
};
