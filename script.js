pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf';
const bookElement = document.getElementById('book');

pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });

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

    const PageFlipConstructor = window.St ? window.St.PageFlip : window.PageFlip;
    const pageFlip = new PageFlipConstructor(bookElement, {
        width: 400,  
        height: 540, 
        size: "fixed",
        showCover: false,
        mobileScrollSupport: true,
        maxShadowOpacity: 0.3
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    function updatePageInfo() {
        const current = pageFlip.getCurrentPageIndex() + 1;
        pageInfo.textContent = `Page ${current} of ${numPages}`;
    }

    setTimeout(updatePageInfo, 100);

    prevBtn.onclick = (e) => {
        e.preventDefault();
        pageFlip.flipPrev();
    };

    nextBtn.onclick = (e) => {
        e.preventDefault();
        pageFlip.flipNext();
    };

    pageFlip.on('flip', () => {
        updatePageInfo();
    });

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});