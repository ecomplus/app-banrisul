const Pdf = require('pdfkit')
const layoutPDF = require('./utils/layout-pdf')
const descriptionsPDF = require('./utils/descriptions-pdf')
const { join } = require('path')

/*
  REF.:
  https://github.com/Romulosanttos/gerar-boletos
*/

const generateBilletBanking = (billet, isSandbox) => new Promise((resolve, reject) => {
  try {
    const dirAssets = join(process.cwd(), '/assets')
    const dirFonts = join(dirAssets, '/fonts')

    const pdf = new Pdf({
      size: [595.44, 881.68]
    })

    const timesNewRoman = join(dirFonts, 'Times New Roman.ttf')
    const timesNewRomanBold = join(dirFonts, 'Times New Roman Bold.ttf')
    const code25I = join(dirFonts, 'Code25I.ttf')

    const chunks = []
    pdf.on('data', (buffer) => {
      chunks.push(buffer)
    })

    pdf.on('end', () => {
      resolve(Buffer.concat(chunks))
    })

    pdf.registerFont('normal', timesNewRoman)
    pdf.registerFont('bold', timesNewRomanBold)
    pdf.registerFont('barCode', code25I)

    /*
    const fs = require('fs')
    const dirFile = join(dirAssets, '/billet.pdf')
    pdf.pipe(fs.createWriteStream(dirFile))
    // */

    layoutPDF(pdf)
    descriptionsPDF(pdf, billet, isSandbox)

    pdf.end()
  } catch (err) {
    reject(err)
  }
})

module.exports = generateBilletBanking
