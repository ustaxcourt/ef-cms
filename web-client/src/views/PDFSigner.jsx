import * as pdfjsLib from 'pdfjs-dist';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';

import React from 'react';

const pdfUrl =
  'http://localhost:3000/v1/documents/f1aa4aa2-c214-424c-8870-d0049c5744d7/documentDownloadUrl?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b206cm9sZSI6InBldGl0aW9uc2NsZXJrIiwiZW1haWwiOiJwZXRpdGlvbnNjbGVya0BleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFBldGl0aW9uc2NsZXJrIiwicm9sZSI6InBldGl0aW9uc2NsZXJrIiwic2VjdGlvbiI6InBldGl0aW9ucyIsInVzZXJJZCI6IjM4MDVkMWFiLTE4ZDAtNDNlYy1iYWZiLTY1NGU4MzQwNTQxNiIsInN1YiI6IjM4MDVkMWFiLTE4ZDAtNDNlYy1iYWZiLTY1NGU4MzQwNTQxNiIsImlhdCI6MTU2MTEzOTQyMX0.JoZKSvEEkpuTXRbzzVFLQxEaU-ImEqlcRUyTnN_5E2g';

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// pdf document id
export const PDFSigner = connect(
  {},
  () => {
    const loadingTask = pdfjsLib.getDocument(pdfUrl);
    const scale = 1;

    let x = 0;
    let y = 0;
    let xWithOffset = 0;
    let yWithOffset = 0;

    const moveSig = (sig, x, y) => {
      sig.style.top = y + 'px';
      sig.style.left = x + 'px';
    };

    const stop = canvasEl => {
      canvasEl.onmousemove = null;
    };

    const start = (canvasEl, sigEl) => {
      canvasEl.onmousemove = function(e) {
        const { offsetLeft, offsetTop } = canvasEl;

        x = e.pageX - this.offsetLeft;
        y = e.pageY - this.offsetTop;
        moveSig(sigEl, x + offsetLeft, y + offsetTop);
      };

      canvasEl.onmousedown = function() {
        console.log(x, y);
        stop(canvasEl);
      };

      sigEl.onmousedown = function() {
        console.log(x, y);
        stop(canvasEl);
      };
    };

    loadingTask.promise.then(
      function(pdf) {
        const canvas = document.getElementById('the-canvas');
        const signature = document.getElementById('signature');

        var context = canvas.getContext('2d');

        pdf.getPage(2).then(function(page) {
          const viewport = page.getViewport(scale);
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          page.render(renderContext);
          start(canvas, signature);
        });
      },
      err => console.log(err),
    );

    return (
      <div>
        <span id="signature" style={{ position: 'absolute' }}>
          (Signed) Joseph Dredd
        </span>
        <canvas id="the-canvas"></canvas>
      </div>
    );
  },
);
