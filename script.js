pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const viewerContainer = document.getElementById('pdf-viewer-container');

let pdfDoc = null;
let pageNum = 1;
const numPagesTotal = 9; // Update if your total page count changes

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Render a specific page cleanly into the container
async function renderPage(num) {
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: 1.1 });

    viewerContainer.innerHTML = ''; // Clear previous page

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
    canvas.style.borderRadius = '4px';

    viewerContainer.appendChild(canvas);

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    pageInfo.textContent = `Page ${num} of ${pdfDoc.numPages}`;
}

// Load the PDF document
pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});

// Button Controls
prevBtn.onclick = (e) => {
    e.preventDefault();
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
};

nextBtn.onclick = (e) => {
    e.preventDefault();
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
};