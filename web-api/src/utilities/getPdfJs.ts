export async function getPdfJs(): Promise<typeof pdfJs> {
  const pdfJs = await import('pdfjs-dist');
  pdfJs.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
  return pdfJs;
}
