// const sourceInput = document.querySelector('input-text')
// const { jsPDF } = window.jspdf;
// const doc = new jsPDF();

const qrContainer = document.querySelector("#qrcode");
let qrcode = new QRCode(qrContainer, {
  text: "http://jindo.dev.naver.com/collie",
  // width: 128,
  // height: 128,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});
const base64QRToImg = (data) => {
  let base64string = data.src.replace("data:image/png;base64,", "");
  base64string = window.atob(base64string)
  const buffer = new ArrayBuffer(base64string.length);
  const view = new Uint8Array(buffer);
  for (let n = 0; n < base64string.length; n++) {
    view[n] = base64string.charCodeAt(n);
  }
  const type = 'image/png';
  const blob = new Blob([buffer], { type });    // file = new File(blob, 'qrcodeimage.png')
  return new File([blob], 'imageQr', { lastModified: new Date().getTime(), type });
};
setTimeout(() => {
    const qrImage = document.querySelector("#qrcode > img");
    const file = base64QRToImg(qrImage)
    console.log(file)
  }, 1);
// doc.text("Hello world!", 10, 10);
// doc.addImage(image, 10, 20, 200, 200)
// doc.save('a4.pdf')

// qrcode.makeCode("https://www.google.com")
