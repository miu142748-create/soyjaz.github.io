// Ensure PDF.js worker is ready
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

const pdfUrl = 'terrell-cv.pdf';
let pageFlip = null;

function initFlipbook() {
    const bookElement = document.getElementById('book');
    const pageInfoElement = document.getElementById('page-info');

    if (!bookElement) return;
    if (typeof St === 'undefined' || typeof pdfjsLib === 'undefined') {
        if (pageInfoElement) pageInfoElement.textContent = 'Library Error';
        console.error('PageFlip or PDF.js libraries failed to load.');
        return;
    }

    // Single-page initialization configuration
    pageFlip = new St.PageFlip(bookElement, {
        width: 600,
        height: 775,
        size: "stretch",           // Dynamic resizing
        minWidth: 280,
        maxWidth: 600,
        minHeight: 360,
        maxHeight: 775,
        showCover: false,          // Prevents page-flip from splitting pages into a spread
        usePortrait: true,
        singlePageMode: true,      // Forces strict single-page rendering across all screen sizes
        startPage: 0,
        drawShadow: false,
        flippingTime: 500,
        useMouseEvents: true,
        showPageCorners: false
    });

    // Render PDF Pages into the Flipbook
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        const totalPages = pdf.numPages;
        const pagePromises = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            pagePromises.push(
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    return page.render(renderContext).promise.then(() => {
                        const pageDiv = document.createElement('div');
                        pageDiv.className = 'page';
                        pageDiv.appendChild(canvas);
                        return pageDiv;
                    });
                })
            );
        }

        Promise.all(pagePromises).then(pages => {
            pageFlip.loadFromHTML(pages);
            if (pageInfoElement) pageInfoElement.textContent = `Page 1 of ${totalPages}`;

            pageFlip.on('flip', (e) => {
                if (pageInfoElement) pageInfoElement.textContent = `Page ${e.data + 1} of ${totalPages}`;
            });

            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');

            if (prevBtn) {
                prevBtn.onclick = () => pageFlip.turnToPrevPage();
            }
            if (nextBtn) {
                nextBtn.onclick = () => pageFlip.turnToNextPage();
            }
        });
    }).catch(error => {
        if (pageInfoElement) pageInfoElement.textContent = 'PDF Error';
        console.error('Error loading PDF:', error);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlipbook);
} else {
    initFlipbook();
}

// Dynamically scale flipbook layout when changing window/screen dimensions
window.addEventListener('resize', () => {
    if (pageFlip) {
        const bookElement = document.getElementById('book');
        if (bookElement) {
            pageFlip.updateFromHtml(document.querySelectorAll('.page'));
        }
    }
});