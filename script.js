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

    // Initialize StPageFlip safely
    const PageFlipConstructor = window.St ? window.St.PageFlip : window.PageFlip;
    const pageFlip = new PageFlipConstructor(bookElement, {
        width: 450,  
        height: 620, 
        size: "fixed",
        showCover: false,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.2
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // Setup Navigation Controls
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    function updatePageInfo() {
        const current = pageFlip.getCurrentPageIndex() + 1;
        pageInfo.textContent = `Page ${current} of ${numPages}`;
    }

    updatePageInfo();

    prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pageFlip.flipPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        pageFlip.flipNext();
    });

    pageFlip.on('flip', () => {
        updatePageInfo();
    });

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});