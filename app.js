// Get DOM elements
const dataListElem = document.querySelector("#history");
const formElem = document.querySelector("#qr-options");
const qrContainer = document.querySelector("#qrcode");
const { jsPDF } = window.jspdf;
const pdfContainer = document.querySelector("#pdfButtonCont");

/**
 * Construct QR code URL for the QRCode Server API, see doc:
 * https://goqr.me/api/
 * @param {string} data - Content to encode in QR code
 * @param {number} margin - Margin size
 * @param {string} ecc - Error correction level (L, M, Q, H)
 * @param {string} colorPr - Foreground color (without #)
 * @param {string} colorBg - Background color (without #)
 * @returns {string} QR code image URL
 */
function constructQRCodeURL(data, margin, ecc, colorPr, colorBg) {
  const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
  const params = new URLSearchParams({
    size: "200x200",
    data: data,
    ecc: ecc,
    color: colorPr,
    bgcolor: colorBg,
    margin: margin,
  });
  // concat everything together
  const qrCodeUrl = `${baseUrl}?${params.toString()}`;
  return qrCodeUrl;
}

/**
 * Create PDF with multiple QR codes
 * @param {HTMLElement} image image node with src
 * @param {int} size size of QR codes in mm
 * @return {obj} jsPDF object
 */
function createQRCodePDF(image, size) {
  // init object
  const doc = new jsPDF();

  // set repetitions per row and column and the step
  const repetitionsX = 205 - size;
  const repetitionsY = 292 - size;
  const step = size + 10;
  // loop and populate QR codes at designated points
  for (let i = 5; i <= repetitionsY; i += step) {
    for (let l = 5; l <= repetitionsX; l += step) {
      doc.addImage(image, "PNG", l, i, size, size);
    }
  }

  return doc;
}

/**
 * Create PDF download button
 * @param {jsPDF} doc
 */
function createPDFButton(doc) {
  pdfContainer.innerHTML = "";
  // Create new button
  const pdfButton = document.createElement("button");
  pdfButton.innerText = "Générer PDF";
  pdfButton.classList.add("btn");
  pdfContainer.appendChild(pdfButton);

  // Add click event to download PDF
  pdfButton.addEventListener("click", () => {
    doc.save("qrcode.pdf");
  });
}

/**
 * Saves a String to localStorage under the history Key
 * which is an array on strings
 * @param {*} inputString the input to be saved
 * @return {string}
 */
function saveInputToLS(inputString) {
  const historyArray = JSON.parse(localStorage.getItem("history"));
  for (let i = 0; i < historyArray.length; i++) {
    if (historyArray[i] === inputString) {
      return "alreadyExists";
    }
  }
  historyArray.push(inputString);
  localStorage.setItem("history", JSON.stringify(historyArray));

  return "saved";
}

function populateDatalist() {
  dataListElem.innerHTML = "";
  const historyArray = JSON.parse(localStorage.getItem("history"));
  historyArray.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    dataListElem.appendChild(option);
  });
}

// Handle form submission
formElem.addEventListener("submit", (event) => {
  event.preventDefault();

  // Clear existing QR code
  qrContainer.innerHTML = "";

  // Get form data
  let formData = new FormData(formElem);

  // Show loading indicator
  // WARN: broken animation
  const loadingText = document.createElement("div");
  loadingText.innerHTML =
    '<div class="loader-container"><svg class="loader" viewBox="0 0 50 50"><circle class="loader-circle" cx="25" cy="25" r="20"></circle></svg></div>';
  qrContainer.appendChild(loadingText);

  saveInputToLS(formData.get("input-text"));
  populateDatalist();

  // Construct QR code URL from inputs as params
  const qrCodeURL = constructQRCodeURL(
    formData.get("input-text"),
    formData.get("margin"),
    formData.get("correction"),
    formData.get("color-pr").replace("#", ""),
    formData.get("color-bg").replace("#", "")
  );

  // Create and add QR code image
  const img = document.createElement("img");
  img.src = qrCodeURL;
  img.alt = "QR Code for: " + formData.get("input-text");
  img.style.maxWidth = "100%";

  // Wait for image to load before creating PDF
  img.onload = () => {
    // Remove loading indicator
    qrContainer.innerHTML = "";
    qrContainer.appendChild(img);
    const size = parseInt(formData.get("size"));
    const doc = createQRCodePDF(img, size);
    createPDFButton(doc);
  };
});

if (!localStorage.getItem('history')) {
  const historyArray = [];
  localStorage.setItem("history", JSON.stringify(historyArray));
}

populateDatalist();
