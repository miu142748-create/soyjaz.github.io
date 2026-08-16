pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const bookElement = document.getElementById('book');

pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 });

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

    // Initialize StPageFlip in single-page mode
    const pageFlip = new St.PageFlip(bookElement, {
        width: 420,  
        height: 580, 
        size: "stretch",
        minWidth: 280,
        maxWidth: 550,
        minHeight: 400,
        maxHeight: 750,
        showCover: true,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.3,
        display: "single"
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    // Set initial page text
    updatePageInfo();

    // Hook up button triggers safely inside the promise
    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pageFlip.flipPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pageFlip.flipNext();
    });

    // Update counter whenever a page changes
    pageFlip.on('flip', (e) => {
        updatePageInfo();
    });

    function updatePageInfo() {
        const currentPage = pageFlip.getCurrentPageIndex() + 1;
        pageInfo.textContent = `Page ${currentPage} of ${numPages}`;
    }

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});