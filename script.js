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

    // Fully responsive proportions that adapt cleanly to desktop and mobile viewports
    pageFlip = new St.PageFlip(bookElement, {
        width: 600,  
        height: 800, 
        size: "stretch",
        minWidth: 250,
        maxWidth: 800,
        minHeight: 350,
        maxHeight: 1050,
        showCover: false,
        usePortrait: true,     
        singlePageMode: true,  
        mobileScrollSupport: true,
        maxShadowOpacity: 0.3
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // FIX: Only apply height constraints on actual mobile portrait screens
    if (window.innerWidth <= 600 && window.innerHeight > window.innerWidth) {
        const stfWrapper = document.querySelector('.stf__wrapper');
        const stfParent = document.querySelector('.stf__parent');
        if (stfWrapper) stfWrapper.style.maxHeight = '520px';
        if (stfParent) stfParent.style.maxHeight = '520px';
    }

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