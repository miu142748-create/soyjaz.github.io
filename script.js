pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const bookElement = document.getElementById('book');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let pageFlip;

// Navigation Controls
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageFlip) pageFlip.flipPrev();
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageFlip) pageFlip.flipNext();
});

// Render PDF and Initialize Flipbook
pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        
        // Render scale 3.0 keeps text crisp on all screen DPIs
        const viewport = page.getViewport({ scale: 3.0 });

        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
       
        pageDiv.appendChild(canvas);
        bookElement.appendChild(pageDiv);
    }

    // Initialize PageFlip locked to portrait proportions (500x647 = 8.5x11 ratio)
    pageFlip = new St.PageFlip(bookElement, {
        width: 500,           // Single page portrait width
        height: 647,          // Single page portrait height
        size: "stretch",      // Scaled fluidly inside .flipbook-container
        minWidth: 300,
        maxWidth: 600,
        minHeight: 400,
        maxHeight: 800,
        drawShadow: true,
        showCover: false,
        usePortrait: true,    // Enforces single page layout
        startPage: 0,
        mobileScrollSupport: true
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    updatePageInfo();

    pageFlip.on('flip', () => {
        updatePageInfo();
    });

    function updatePageInfo() {
        const currentPage = pageFlip.getCurrentPageIndex() + 1;
        pageInfo.textContent = `Page ${currentPage} of ${numPages}`;
    }

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
    pageInfo.textContent = 'Error loading PDF';
});