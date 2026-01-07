import { readFile } from 'fs/promises';

async function getPdfJs(): Promise<typeof pdfJs> {
  // Come back later to this polyfill definition 
  //if (typeof globalThis.Path2D === 'undefined') {
  //     globalThis.Path2D = class Path2D {
  //     constructor(_path?: any) {}
  //     addPath(_path: any, _transform?: any) {}
  //     arc(
  //       _x: number,
  //       _y: number,
  //       _radius: number,
  //       _startAngle: number,
  //       _endAngle: number,
  //       _anticlockwise?: boolean,
  //     ) {}
  //     arcTo(_x1: number, _y1: number, _x2: number, _y2: number, _radius: number) {}
  //     bezierCurveTo(
  //       _cp1x: number,
  //       _cp1y: number,
  //       _cp2x: number,
  //       _cp2y: number,
  //       _x: number,
  //       _y: number,
  //     ) {}
  //     closePath() {}
  //     ellipse(
  //       _x: number,
  //       _y: number,
  //       _radiusX: number,
  //       _radiusY: number,
  //       _rotation: number,
  //       _startAngle: number,
  //       _endAngle: number,
  //       _anticlockwise?: boolean,
  //     ) {}
  //     lineTo(_x: number, _y: number) {}
  //     moveTo(_x: number, _y: number) {}
  //     quadraticCurveTo(_cpx: number, _cpy: number, _x: number, _y: number) {}
  //     rect(_x: number, _y: number, _w: number, _h: number) {}
  //     roundRect(
  //       _x: number,
  //       _y: number,
  //       _w: number,
  //       _h: number,
  //       _radii?: number | number[],
  //     ) {}
  //   };
  // }

  const pdfJs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfJs.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
  return pdfJs;
}

export async function parsePdf({
  filePath,
}: {
  filePath: string;
}): Promise<string> {
  try {
    const dataBuffer = await readFile(filePath);
    const pdfDocUint8 = new Uint8Array(dataBuffer);
    const pdfJs = await getPdfJs();

    const pdfDocument = await pdfJs.getDocument({ data: pdfDocUint8 }).promise;

    const pdfText = await extractPdfText(pdfDocument);
    return pdfText;
  } catch (error: any) {
    console.error('Parse PDF error:', error);
    throw new Error(`Failed to parse PDF ${error?.message}`);
  }
}

async function extractPdfText(pdfDocument: any) {
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const pageText = await extractPageText(page);
    fullText += pageText + '\n';
  }

  return fullText;
}

async function extractPageText(page: any) {
  const textContent = await page.getTextContent();

  let lastX: number | null = null;
  let lastY: number | null = null;
  let pageText = '';

  textContent.items.forEach((item: any) => {
    // Check if the current text item is on the same line and close to the previous item.
    // If not, add a space to separate them.
    if (lastX !== null && lastY !== null) {
      const sameLine = Math.abs(item.transform[5] - lastY) < 5;
      const closeToLastItem = Math.abs(item.transform[4] - lastX) < 5;

      if (!sameLine || !closeToLastItem) {
        pageText += ' ';
      }
    }

    pageText += item.str;
    lastX = item.transform[4] + item.width;
    lastY = item.transform[5];
  });

  return pageText;
}
