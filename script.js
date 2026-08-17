// Ensure PDF.js worker is ready
if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

const pdfUrl = 'terrell-cv.pdf';
let pageFlip = null;

// Mobile-only scale handler: leaves desktop completely unaffected
function rescaleFlipbook() {
    const container = document.querySelector('.flipbook-container');
    const book = document.getElementById('book');
    if (!container || !book) return;

    const baseWidth = 600;
    const baseHeight = 775;

    // Check width of container on mobile screens
    const availableWidth = container.clientWidth;

    if (window.innerWidth <= 650 && availableWidth > 0) {
        const scale = availableWidth / baseWidth;
        book.style.transform = `scale(${scale})`;
        book.style.transformOrigin = 'top center';
        
        // Match container height to exact scaled height so buttons fit underneath naturally
        container.style.height = `${baseHeight * scale}px`;
    } else {
        // Desktop setting (100% original size, no scaling)
        book.style.transform = 'scale(1)';
        book.style.transformOrigin = 'top center';
        container.style.height = `${baseHeight}px`;
    }
}

function initFlipbook() {
    const bookElement = document.getElementById('book');
    const pageInfoElement = document.getElementById('page-info');

    if (!bookElement) return;
    if (typeof St === 'undefined' || typeof pdfjsLib === 'undefined') {
        if (pageInfoElement) pageInfoElement.textContent = 'Library Error';
        console.error('PageFlip or PDF.js libraries failed to load.');
        return;
    }

    pageFlip = new St.PageFlip(bookElement, {
        width: 600,
        height: 775,
        size: "fixed",
        showCover: false,          
        usePortrait: true,
        singlePageMode: true,      
        startPage: 0,
        drawShadow: false,
        flippingTime: 500,
        useMouseEvents: true,
        showPageCorners: false
    });

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

            if (prevBtn) prevBtn.onclick = () => pageFlip.turnToPrevPage();
            if (nextBtn) nextBtn.onclick = () => pageFlip.turnToNextPage();

            // Run scaling after rendering
            rescaleFlipbook();
            setTimeout(rescaleFlipbook, 100);
            setTimeout(rescaleFlipbook, 500);
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

window.addEventListener('resize', rescaleFlipbook);
window.addEventListener('orientationchange', () => setTimeout(rescaleFlipbook, 200));