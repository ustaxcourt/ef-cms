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

export const isGitAncestor = ({
  ancestorSha,
  descendantSha,
}: {
  ancestorSha: string;
  descendantSha: string;
}): boolean => {
  try {
    execFileSync(
      'git',
      ['merge-base', '--is-ancestor', ancestorSha, descendantSha],
      {
        stdio: 'ignore',
      },
    );

    return true;
  } catch {
    return false;
  }
};

export const findClosestAncestorWorkflowRun = ({
  currentSha,
  isAncestor = isGitAncestor,
  workflowRuns,
}: {
  currentSha: string;
  isAncestor?: typeof isGitAncestor;
  workflowRuns: WorkflowRun[];
}): WorkflowRun | undefined => {
  return workflowRuns.find(
    workflowRun =>
      workflowRun.conclusion === 'success' &&
      workflowRun.head_sha !== currentSha &&
      isAncestor({
        ancestorSha: workflowRun.head_sha,
        descendantSha: currentSha,
      }),
  );
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
    throw new Error(`GitHub API request failed (${response.status}): ${url}`);
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
  const archivePath = path.join(tempDir, 'artifact.zip');
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(archivePath, buffer);
  execFileSync('unzip', ['-o', archivePath, '-d', tempDir], {
    stdio: 'ignore',
  });

  const extractedFileName = fs
    .readdirSync(tempDir)
    .find(fileName => fileName.endsWith('.json'));

  if (!extractedFileName) {
    throw new Error('Downloaded artifact did not contain a json timing file');
  }

  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
  fs.copyFileSync(path.join(tempDir, extractedFileName), outputFilePath);
  fs.rmSync(tempDir, { force: true, recursive: true });
};

export const main = async (
  args: string[] = process.argv.slice(2),
): Promise<void> => {
  const [workflowFileName, artifactName, outputFilePath] = args;

  if (!workflowFileName || !artifactName || !outputFilePath) {
    throw new Error(
      'Usage: npx ts-node scripts/github-actions/download-historical-test-file-times.ts <workflow-file-name> <artifact-name> <output-path>',
    );
  }

  const repository = getRequiredEnvironmentVariable('GITHUB_REPOSITORY');
  const currentSha = getRequiredEnvironmentVariable('GITHUB_SHA');
  const branchName =
    process.env.GITHUB_HEAD_REF ??
    getRequiredEnvironmentVariable('GITHUB_REF_NAME');

  const workflowRuns = await githubGet<WorkflowRunsResponse>(
    `https://api.github.com/repos/${repository}/actions/workflows/${workflowFileName}/runs?branch=${branchName}&event=pull_request&status=completed&per_page=100`,
  );

  const closestAncestorWorkflowRun = findClosestAncestorWorkflowRun({
    currentSha,
    workflowRuns: workflowRuns.workflow_runs,
  });

  if (!closestAncestorWorkflowRun) {
    console.log(
      'No successful ancestor workflow run with test timing artifact found.',
    );
    return;
  }

  const workflowArtifacts = await githubGet<WorkflowArtifactsResponse>(
    `https://api.github.com/repos/${repository}/actions/runs/${closestAncestorWorkflowRun.id}/artifacts`,
  );

  const timingArtifact = workflowArtifacts.artifacts.find(
    artifact => artifact.name === artifactName && !artifact.expired,
  );

  if (!timingArtifact) {
    console.log(
      'Ancestor workflow run did not include the expected timing artifact.',
    );
    return;
  }

  await downloadArtifact({
    archiveDownloadUrl: timingArtifact.archive_download_url,
    outputFilePath,
  });
};

/* istanbul ignore next */
if (require.main === module) {
  void main();
}
