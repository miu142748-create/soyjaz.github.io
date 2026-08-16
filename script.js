// Set the worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf'; // Path to your PDF file in the repository
const bookElement = document.getElementById('book');

pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    // Loop through every page of your PDF and convert to canvas elements
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // High-res scale

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

    // Initialize StPageFlip for single-page mode
    const pageFlip = new St.PageFlip(bookElement, {
        width: 450,  
        height: 620, 
        size: "fixed", // Forces fixed single-page view
        showCover: false,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.2
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // Hook up navigation buttons and page counter
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    updatePageInfo();

    prevBtn.addEventListener('click', () => {
        pageFlip.flipPrev();
    });

    nextBtn.addEventListener('click', () => {
        pageFlip.flipNext();
    });

    pageFlip.on('flip', (e) => {
        updatePageInfo();
    });

    function updatePageInfo() {
        const current = pageFlip.getCurrentPageIndex() + 1;
        pageInfo.textContent = `Page ${current} of ${numPages}`;
    }

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});