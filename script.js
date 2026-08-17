pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const bookElement = document.getElementById('book');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let pageFlip;

// Navigation Event Listeners
prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageFlip) {
        pageFlip.flipPrev();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageFlip) {
        pageFlip.flipNext();
    }
});

// Fetch and Render PDF Pages
pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        // Render at higher resolution scale for clear rendering
        const viewport = page.getViewport({ scale: 2.0 });

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

    // Initialize PageFlip with strict single-page settings
    pageFlip = new St.PageFlip(bookElement, {
        width: 450,           // Width of a single page
        height: 600,          // Height of a single page
        size: "fixed",        // Prevents automatic expansion into spreads
        mode: "single",       // Forces single page orientation
        showCover: false,     // Keeps single flow consistent from page 1
        usePortrait: true,    // Locks portrait display
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