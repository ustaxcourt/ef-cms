export async function getPdfJs(): Promise<typeof pdfJs> {
  const pdfJs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfJs.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
  return pdfJs;
}

//pdfjs-dist/legacy/build/pdf