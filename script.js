/* Single-Page Flipbook Outer Container */
.flipbook-container {
   width: 100%;
   max-width: 650px;
   margin: 10px auto;
   display: flex;
   justify-content: center;
   align-items: center;
}

/* Flipbook Inner Box - Tight Fit */
#book {
   width: 100% !important;
   height: 840px !important;
   border: none !important;
   outline: none !important;
   border-radius: 0px !important;
   box-shadow: none !important;
   background-color: transparent !important;
   overflow: hidden;
   margin: 0 auto !important;
}

/* Page Rendering - Stretches Canvas to Edge */
.page {
   width: 100% !important;
   height: 100% !important;
   background-color: #ffffff;
   display: flex;
   justify-content: center;
   align-items: center;
   margin: 0 auto !important;
   padding: 0 !important;
}

.page canvas {
   width: 100% !important;
   height: 100% !important;
   object-fit: fill !important; /* Force page canvas to fill container width without side padding */
   display: block;
   margin: 0 auto;
}

@media screen and (max-width: 768px) {
   #book {
       height: 480px !important;
   }
}