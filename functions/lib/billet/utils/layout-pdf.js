const { join } = require('path')
const {
  spaceCol,
  colStart,
  colEnd,
  line
} = require('./dimensions')

const dirAssets = join(process.cwd(), '/assets')

const addStroke = (
  pdf,
  lineStartX,
  lineStartY,
  lineEndX,
  lineEndY,
  type = false
) => {
  const startY = -100
  const startX = 0
  const colorStroke = 'black'

  if (type === 'logo') {
    return pdf
      .image(dirAssets + '/images/banrisul.png',
        startX + lineStartX,
        startY + lineStartY,
        {
          fit: [100, 30]
        }
      )
  } if (type === 'dash') {
    return pdf
      .moveTo(startX + lineStartX, startY + lineStartY)
      .lineTo(startX + lineEndX, startY + lineEndY)
      .dash(3, { space: 5 })
      .stroke(colorStroke)
  } else {
    return pdf
      .moveTo(startX + lineStartX, startY + lineStartY)
      .lineTo(startX + lineEndX, startY + lineEndY).stroke(colorStroke)
  }
}

const renderPdf = (pdf, lastLine, isReceipt) => {
  // Main Lines
  addStroke(pdf, colStart, line(lastLine + 1), colEnd, line(lastLine + 1))
  addStroke(pdf, colStart, line(lastLine + 2), colEnd, line(lastLine + 2))
  addStroke(pdf, colStart, line(lastLine + 3), colEnd, line(lastLine + 3))
  addStroke(pdf, colStart, line(lastLine + 4), colEnd, line(lastLine + 4))
  addStroke(pdf, colStart, line(lastLine + 5), colEnd, line(lastLine + 5))
  //
  addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 6), colEnd, line(lastLine + 6))
  addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 7), colEnd, line(lastLine + 7))
  addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 8), colEnd, line(lastLine + 8))
  addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 9), colEnd, line(lastLine + 9))
  // addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 10), colEnd, line(lastLine + 10))
  //
  addStroke(pdf, colStart, line(lastLine + 10), colEnd, line(lastLine + 10))
  addStroke(pdf, colStart, line(lastLine + 14), colEnd, line(lastLine + 14))
  // colluns top
  addStroke(pdf, colStart + spaceCol, line(lastLine + 1, 20), colStart + spaceCol, line(lastLine + 1))
  addStroke(pdf, colStart + spaceCol, line(lastLine + 1, 20), colStart + spaceCol, line(lastLine + 1))
  addStroke(pdf, colStart + 1.5 * spaceCol, line(lastLine + 1, 20), colStart + 1.5 * spaceCol, line(lastLine + 1))
  addStroke(pdf, colStart + 1.5 * spaceCol, line(lastLine + 1, 20), colStart + 1.5 * spaceCol, line(lastLine + 1))
  // main colluns
  addStroke(pdf, colStart, line(lastLine + 1), colStart, line(lastLine + 14))
  addStroke(pdf, colEnd, line(lastLine + 1), colEnd, line(lastLine + 14))
  addStroke(pdf, colEnd - spaceCol + 10, line(lastLine + 1), colEnd - spaceCol + 10, line(lastLine + 10))
  // colluns line 3
  addStroke(pdf, colStart + spaceCol - 20, line(lastLine + 3), colStart + spaceCol - 20, line(lastLine + 4))
  addStroke(pdf, colStart + spaceCol + 80, line(lastLine + 3), colStart + spaceCol + 80, line(lastLine + 4))
  addStroke(pdf, colStart + (2.5 * spaceCol), line(lastLine + 3), colStart + (2.5 * spaceCol), line(lastLine + 4))
  addStroke(pdf, colStart + (2.5 * spaceCol) + 40, line(lastLine + 3), colStart + (2.5 * spaceCol) + 40, line(lastLine + 4))
  // colluns line 4
  addStroke(pdf, colStart + spaceCol + 10, line(lastLine + 4), colStart + spaceCol + 10, line(lastLine + 5))
  addStroke(pdf, colStart + spaceCol * 2, line(lastLine + 4), colStart + spaceCol * 2, line(lastLine + 5))
  addStroke(pdf, colStart + (2.95 * spaceCol), line(lastLine + 4), colStart + (2.95 * spaceCol), line(lastLine + 5))
  //
  if (isReceipt) {
    // footer
    addStroke(pdf, colEnd / 2, line(lastLine + 14, -5), colEnd, line(lastLine + 14, -5))
    addStroke(pdf, colEnd / 2, line(lastLine + 14, -5), colEnd / 2, line(lastLine + 14, -33))
    addStroke(pdf, colEnd, line(lastLine + 14, -5), colEnd, line(lastLine + 14, -33))
  }
}

module.exports = function (pdf) {
  renderPdf(pdf, 1, true)
  renderPdf(pdf, 18)
  addStroke(pdf, colStart + 3, line(1), 0, 0, 'logo')
  addStroke(pdf, colStart + 3, line(18), 0, 0, 'logo')
  addStroke(pdf, colStart, line(17, 3), colEnd, line(17, 3), 'dash')
}
