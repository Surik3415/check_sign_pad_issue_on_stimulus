import { Controller } from "@hotwired/stimulus"
import SignaturePad from 'signature_pad'

export default class extends Controller {
  static targets = ["canvas", "input"]
  connect() {
    this.signaturePad = new SignaturePad(this.canvasTarget)
    this.signaturePad.addEventListener("endStroke", this.endStroke)
    this.resizeCanvas()
    if (this.inputTarget.value) {
      this.signaturePad.fromDataURL(this.inputTarget.value)
    }
  }

  disconnect() {
    this.signaturePad.off()
  }

  clear() {
    this.signaturePad.clear()
    this.inputTarget.value = ""
  }

  endStroke = (_) => {
    this.inputTarget.value = this.signaturePad.toDataURL("image/svg+xml")
  }

  // Return svg string without converting to base64
  toSVG() {
    const svgData = this.signaturePad.toDataURL("image/svg+xml")
    console.log(svgData)
    this.svgUrlTarget.textContent = svgData
  }


  resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio = Math.max(window.devicePixelRatio || 1, 1)
    this.canvasTarget.width = this.canvasTarget.offsetWidth * ratio
    this.canvasTarget.height = this.canvasTarget.offsetHeight * ratio
    this.canvasTarget.getContext("2d").scale(ratio, ratio)
  }
}