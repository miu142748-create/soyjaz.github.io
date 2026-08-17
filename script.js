// PDF.js worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const pdfUrl = 'terrell-cv.pdf';
let pageFlip = null;

// Initialize StPageFlip in strict portrait/single-page mode
function initFlipbook() {
    pageFlip = new St.PageFlip(document.getElementById('book'), {
        width: 450,
        height: 600,
        size: "stretch",
        minWidth: 300,
        maxWidth: 500,
        minHeight: 400,
        maxHeight: 700,
        showCover: false,      // Disables offset 2-page spread
        usePortrait: true,     // Forces single-page view on all screen sizes
        startPage: 0,
        drawShadow: true,
        flippingTime: 800,
        useMouseEvents: true
    });

    // Render PDF Pages into the Flipbook
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        const totalPages = pdf.numPages;
        const pagePromises = [];

        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            pagePromises.push(
                pdf.getPage(pageNum).then(page => {
                    const viewport = page.getViewport({ scale: 2 }); // High DPI rendering
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
            // Mount pages to the flipbook
            pageFlip.loadFromHTML(pages);

            // Update Page Number Indicator
            document.getElementById('page-info').textContent = `Page 1 of ${totalPages}`;

            // Handle Page Change Events
            pageFlip.on('flip', (e) => {
                document.getElementById('page-info').textContent = `Page ${e.data + 1} of ${totalPages}`;
            });

            // Attach Controls
            document.getElementById('prev-btn').addEventListener('click', () => {
                pageFlip.turnToPrevPage();
            });

            document.getElementById('next-btn').addEventListener('click', () => {
                pageFlip.turnToNextPage();
            });
        });
    }).catch(error => {
        console.error('Error loading PDF:', error);
    });
}

document.addEventListener('DOMContentLoaded', initFlipbook);