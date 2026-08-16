// Set the worker path for PDF.js so it can process the PDF file safely
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

const url = 'terrell-cv.pdf'; // Path to your PDF file in the repository
const bookElement = document.getElementById('book');

// Load the PDF document asynchronously
pdfjsLib.getDocument(url).promise.then(async function(pdfDoc_) {
    const numPages = pdfDoc_.numPages;

    // Loop through every page of your PDF
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc_.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale for crisp text quality

        // Create a wrapper div for each page required by StPageFlip
        const pageDiv = document.createElement('div');
        pageDiv.className = 'page';

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the PDF page onto the HTML canvas element
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        pageDiv.appendChild(canvas);
        bookElement.appendChild(pageDiv);
    }

    // Initialize the StPageFlip engine once all pages are fully loaded
    const pageFlip = new St.PageFlip(bookElement, {
        width: 400,  // Single page width (adjust if needed to fit your layout)
        height: 560, // Single page height (adjust if needed)
        size: "stretch",
        minWidth: 250,
        maxWidth: 600,
        minHeight: 350,
        maxHeight: 800,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false
    });

    // Feed the generated HTML pages into the flipbook container
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

}).catch(function(error) {
    console.error('Error loading PDF: ', error);
});