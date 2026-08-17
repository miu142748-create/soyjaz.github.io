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

   // Render all pages at HD resolution
   for (let pageNum = 1; pageNum <= numPages; pageNum++) {
       const page = await pdfDoc_.getPage(pageNum);
       
       // scale: 2.0 renders high-DPI canvas so text stays sharp when expanded
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

   // Initialize PageFlip with single-page portrait constraints
   pageFlip = new St.PageFlip(bookElement, {
       width: 550,          // Standard portrait ratio (Width)
       height: 733,         // Standard portrait ratio (Height)
       size: "stretch",     // Allows canvas to scale dynamically to fit container
       minWidth: 280,
       maxWidth: 600,       // Matches CSS max-width to lock single-page mode
       minHeight: 373,
       maxHeight: 800,
       showCover: false,
       usePortrait: true,   // Forces single-page view in portrait proportions
       mobileScrollSupport: true,
       maxShadowOpacity: 0.3
   });

   pageFlip.loadFromHTML(document.querySelectorAll('.page'));

   updatePageInfo();

   pageFlip.on('flip', () => {
       updatePageInfo();
   });

   function updatePageInfo() {
       const currentPage = pageFlip.getCurrentPageIndex() + 1;
       pageInfo.textContent = `Page ${currentPage} of ${numPages}`;
   }

}).catch(function(error) {
   console.error('Error loading PDF: ', error);
});