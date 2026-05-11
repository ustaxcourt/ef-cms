#!/usr/bin/env -S npx ts-node --transpile-only

// Baseline microbenchmark for the pdf-lib work performed inside
// serveExternallyFiledDocumentInteractor, with a parallel qpdf path for
// comparison.
//
// Phases match the three S3-GET / pdf-lib cycles the request thread does
// today:
//
//   1. countPagesInDocument                  (interactor line ~73)
//   2. addCoverToPdf (inside addCoversheet)  (addCoverToPdf.ts ~42-67)
//   3. serveDocumentAndGetPaperServicePdf    (~47-65, per paper party)
//
// Run:
//   ./scripts/benchmark-serve-coversheet.ts                # qpdf only
//   ./scripts/benchmark-serve-coversheet.ts --baseline     # pdf-lib + qpdf
//   ./scripts/benchmark-serve-coversheet.ts <path-to.pdf>  # custom PDF
//
// S3 round-trip time is excluded — we measure pdf-engine CPU/wall-time
// only. The file is read from local disk once at the top.

import { PDFDocument } from 'pdf-lib';
import { performance } from 'node:perf_hooks';
import { readFile, writeFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import os from 'node:os';
import path from 'node:path';

const execFileP = promisify(execFile);

const args = process.argv.slice(2);
const runBaseline = args.includes('--baseline');
const pdfArg = args.find(a => !a.startsWith('--'));
const PDF_PATH = path.resolve(
  pdfArg ?? path.join(__dirname, '..', 'huge.pdf'),
);

const numberFmt = new Intl.NumberFormat('en-US');

function fmtMs(ms: number): string {
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)} s`;
  return `${numberFmt.format(Math.round(ms))} ms`;
}

function fmtMb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function memSnapshot(): string {
  const m = process.memoryUsage();
  return `rss=${fmtMb(m.rss)} heap=${fmtMb(m.heapUsed)}`;
}

async function timed<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<{ elapsed: number; result: T }> {
  if (global.gc) global.gc();
  const memBefore = memSnapshot();
  const start = performance.now();
  const result = await fn();
  const elapsed = performance.now() - start;
  const memAfter = memSnapshot();
  console.log(
    `  ${label.padEnd(56)} ${fmtMs(elapsed).padStart(10)}  ${memBefore} -> ${memAfter}`,
  );
  return { elapsed, result };
}

async function buildSmallPdf(text: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage();
  page.drawText(text, { x: 50, y: 700, size: 18 });
  return doc.save();
}

async function main() {
  console.log(`PDF: ${PDF_PATH}`);
  const fileInfo = await stat(PDF_PATH);
  console.log(`File size on disk: ${fmtMb(fileInfo.size)}\n`);

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'serve-bench-'));

  try {
    // ─── Pre-stage small fixture PDFs (cover sheet + address label) ───────
    // Generation cost is negligible — done once, off the benchmark clock.
    const coverBytes = await buildSmallPdf('Cover Sheet (benchmark)');
    const addressBytes = await buildSmallPdf('Address: 123 Test Way');
    const coverPath = path.join(tmpDir, 'cover.pdf');
    const addressPath = path.join(tmpDir, 'address.pdf');
    await writeFile(coverPath, coverBytes);
    await writeFile(addressPath, addressBytes);

    // ─── pdf-lib baseline (optional, slow) ────────────────────────────────
    if (runBaseline) {
      console.log('Baseline (pdf-lib, mirrors current production):');
      const pdfBytes = await readFile(PDF_PATH);

      const baselineStart = performance.now();

      await timed('1. pdf-lib countPagesInDocument (load + getPageCount)', async () => {
        const doc = await PDFDocument.load(pdfBytes);
        return doc.getPageCount();
      });

      const phase2 = await timed(
        '2. pdf-lib addCoverToPdf (load + insertPage + save)',
        async () => {
          const pdfDoc = await PDFDocument.load(pdfBytes);
          const coverDoc = await PDFDocument.load(coverBytes);
          const [coverPage] = await pdfDoc.copyPages(
            coverDoc,
            coverDoc.getPageIndices(),
          );
          pdfDoc.insertPage(0, coverPage);
          return pdfDoc.save();
        },
      );

      await timed('3. pdf-lib paperServicePdf (load + copyPages + save)', async () => {
        const sourceDoc = await PDFDocument.load(phase2.result);
        const newDoc = await PDFDocument.create();
        const addressDoc = await PDFDocument.load(addressBytes);
        const [addrPage] = await newDoc.copyPages(addressDoc, addressDoc.getPageIndices());
        newDoc.addPage(addrPage);
        const copied = await newDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
        for (const p of copied) newDoc.addPage(p);
        return newDoc.save();
      });

      console.log(`  pdf-lib total: ${fmtMs(performance.now() - baselineStart)}\n`);
    } else {
      console.log(
        '(pdf-lib baseline skipped — pass --baseline to include it)\n',
      );
    }

    // ─── qpdf path ────────────────────────────────────────────────────────
    console.log('qpdf engine (shell-out via execFile):');
    const qpdfStart = performance.now();

    // 1. countPagesInDocument equivalent
    await timed('1. qpdf --show-npages', async () => {
      const { stdout } = await execFileP('qpdf', ['--show-npages', PDF_PATH]);
      return parseInt(stdout.trim(), 10);
    });

    // 2. addCoverToPdf equivalent: prepend cover.pdf to notice
    const coverAttachedPath = path.join(tmpDir, 'coverAttached.pdf');
    await timed('2. qpdf addCoverToPdf (--pages cover.pdf notice.pdf)', async () => {
      await execFileP('qpdf', [
        '--empty',
        '--pages',
        coverPath,
        PDF_PATH,
        '--',
        coverAttachedPath,
      ]);
      const s = await stat(coverAttachedPath);
      return s.size;
    });

    // 3. paperServicePdf — single paper party: [address, full notice]
    const paper1Path = path.join(tmpDir, 'paper-1party.pdf');
    await timed('3. qpdf paperServicePdf (1 paper party)', async () => {
      await execFileP('qpdf', [
        '--empty',
        '--pages',
        addressPath,
        coverAttachedPath,
        '--',
        paper1Path,
      ]);
      const s = await stat(paper1Path);
      return s.size;
    });

    // 3b. paperServicePdf — 3 paper parties: 3× [address, full notice]
    const paper3Path = path.join(tmpDir, 'paper-3party.pdf');
    await timed('3b. qpdf paperServicePdf (3 paper parties)', async () => {
      await execFileP('qpdf', [
        '--empty',
        '--pages',
        addressPath, coverAttachedPath,
        addressPath, coverAttachedPath,
        addressPath, coverAttachedPath,
        '--',
        paper3Path,
      ]);
      const s = await stat(paper3Path);
      return s.size;
    });

    console.log(`  qpdf total: ${fmtMs(performance.now() - qpdfStart)}\n`);

    // ─── Output sanity check ──────────────────────────────────────────────
    const coverAttachedInfo = await stat(coverAttachedPath);
    const paper1Info = await stat(paper1Path);
    const paper3Info = await stat(paper3Path);
    const { stdout: nCover } = await execFileP('qpdf', [
      '--show-npages',
      coverAttachedPath,
    ]);
    const { stdout: n1 } = await execFileP('qpdf', ['--show-npages', paper1Path]);
    const { stdout: n3 } = await execFileP('qpdf', ['--show-npages', paper3Path]);
    console.log('Output sanity:');
    console.log(`  coverAttached.pdf: ${nCover.trim()} pages, ${fmtMb(coverAttachedInfo.size)}`);
    console.log(`  paper-1party.pdf:  ${n1.trim()} pages, ${fmtMb(paper1Info.size)}`);
    console.log(`  paper-3party.pdf:  ${n3.trim()} pages, ${fmtMb(paper3Info.size)}`);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
