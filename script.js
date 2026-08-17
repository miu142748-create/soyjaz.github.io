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

// Fetch and Render PDF Pages
pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        
        // High render scale (3.5) keeps small text ultra-sharp when expanded
        const viewport = page.getViewport({ scale: 3.5 });

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

    // Initialize PageFlip scaled to standard 8.5 x 11 letter proportions (850 x 1100)
    pageFlip = new St.PageFlip(bookElement, {
        width: 850,           // Matches maximum site wrapper width
        height: 1100,         // Scaled height prevents vertical compression
        size: "stretch",      // Dynamically expands to container boundaries
        minWidth: 320,
        maxWidth: 900,
        minHeight: 450,
        maxHeight: 1200,
        mode: "single",       // Forces single-page view
        showCover: false,
        usePortrait: true,
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