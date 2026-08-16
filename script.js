pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const bookElement = document.getElementById('book');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let pageFlip;

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

pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
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

    // Configured for ultra-wide horizontal single-page view
    pageFlip = new St.PageFlip(bookElement, {
        width: 1200,  
        height: 1050, 
        size: "stretch",
        minWidth: 600,
        maxWidth: 1400,
        minHeight: 500,
        maxHeight: 1200,
        showCover: false,
        usePortrait: true,   
        mobileScrollSupport: false,
        maxShadowOpacity: 0.3
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    updatePageInfo();

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