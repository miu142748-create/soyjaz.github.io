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

    // Initialize StPageFlip in standard spread mode to show 2 pages side by side
    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,  
        height: 560, 
        size: "stretch",
        minWidth: 280,
        maxWidth: 600,
        minHeight: 400,
        maxHeight: 800,
        showCover: true,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.3
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

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
        const currentPages = pageFlip.getPageDetails();
        // currentPages returns an object or array containing visible page indices
        let pageText = "";
        
        // StPageFlip layout can show 1 or 2 pages depending on view position
        const visibleIndices = pageFlip.getPagesIndices();
        const actualIndices = visibleIndices.map(i => i + 1);

        if (actualIndices.length === 1 || actualIndices[0] === actualIndices[actualIndices.length - 1]) {
            pageText = `Page ${actualIndices[0]} of ${numPages}`;
        } else {
            pageText = `Pages ${actualIndices[0]}–${actualIndices[actualIndices.length - 1]} of ${numPages}`;
        }
        
        pageInfo.textContent = pageText;
    }

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});