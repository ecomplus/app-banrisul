const {
  spaceCol,
  colStart,
  line
} = require('./dimensions')
const { abbreviateAddress } = require('../../banrisul/payload-to-billet')

const parseEspecie = {
  '02': 'DM',
  '04': 'DS',
  31: 'CC',
  32: 'BDP',
  99: 'DV'
}

const addText = (
  pdf,
  fontType,
  fontSize,
  text,
  posX,
  posY,
  width,
  align = 'left'
) => {
  pdf
    .font(fontType || 'normal')
    .fontSize(fontSize)
    .text(text, posX, posY,
      {
        lineBreak: false,
        width,
        align
      }
    )
}
const titles = {
  instrucoes: 'Instruções de responsabilidade do BENEFICIÁRIO',
  dataDocumento: 'Data Documento',
  nomeDoPagador: 'Nome do Cliente',
  agenciaECodigoDoBeneficiario: 'Agência / Código do Beneficiário',
  nossoNumero: 'Nosso Número',
  especie: 'Espécie',
  especieDoDocumento: 'Espécie Doc.',
  quantidade: 'Quantidade',
  numeroDoDocumento: 'Nº do Documento',
  dataDeProcessamento: 'Data Processamento',
  valorDoDocumento: '(=) Valor do Documento',
  valor: 'Valor',
  carteira: 'Carteira',
  moraMulta: '(+) Mora / Multa',
  localDoPagamento: 'Local do Pagamento'
}

const handleDate = (date) => {
  const newDate = date.split('-')
  return `${newDate[2]}/${newDate[1]}/${newDate[0]}`
}

const handleInstructions = (instructions, dayExpiry, pdf, posCol, lastLine, withCol) => {
  const {
    juros,
    desconto,
    multa,
    protesto
  } = instructions

  let hasInterest = false
  let text = ''

  if (juros && (juros.codigo !== 3)) {
    text = `APLICAR JUROS DE ${juros.codigo === 2 ? `${(juros.taxa).replace('.', ',')}% AO MÊS` : `R$${(juros.valor).replace('.', ',')} AO DIA`} `
    hasInterest = true
  }
  if (multa) {
    text += `${hasInterest ? 'E' : 'APLICAR'} MULTA DE ${multa.codigo === 2 ? `${(multa.taxa).replace('.', ',')}%` : `R$${(multa.valor).replace('.', ',')}`} AO DIA`
  }
  text = text.length ? `${text} após o vencimento` : ''
  addText(pdf, 'normal', 8, text?.toUpperCase(), posCol, line(lastLine + 6, -2, 'write'), withCol * 5)

  if (desconto) {
    let textDiscount = ''
    textDiscount = `APLICAR DESCONTO DE ${desconto.codigo === 2 ? `${(desconto.taxa).replace('.', ',')}%` : `R$${(desconto.valor).replace('.', ',')}`} até`
    textDiscount = dayExpiry === desconto.data ? `${textDiscount} o vencimento` : `${textDiscount} dia ${handleDate(dayExpiry)}`
    addText(pdf, 'normal', 8, textDiscount?.toUpperCase(), posCol, line(lastLine + 7, 10, 'write'), withCol * 5)
  }

  if (protesto && protesto.codigo !== 3) {
    const textProtest = `protestar em ${protesto.prazo} dias após o vencimento`
    addText(pdf, 'normal', 8, textProtest?.toUpperCase(), posCol, line(lastLine + 7, -2, 'write'), withCol * 5)
  }
}

const handleDigitableLine = (digitableLine) => {
  const arrayDigitableLine = digitableLine.split('')
  return arrayDigitableLine.reduce((accumulator, digit, index) => {
    let rule = ''
    if (index === 5 || index === 15 || index === 26) {
      rule = '.'
    } else if (index === 10 || index === 21 || index === 32 || index === 33) {
      rule = '  '
    }
    return accumulator + rule + digit
  }, '')
}

const handlePayer = (payer, pdf, posCol, lastLine, withCol) => {
  addText(pdf, 'bold', 5, 'PAGADOR', posCol, line(lastLine + 11, 8, 'write'), withCol / 2)
  let textLine1 = payer.nome
  const arrayDocNumber = payer.cpf_cnpj?.split('')
  if (payer.tipo_pessoa === 'J') {
    textLine1 += '   CNPJ: '
    textLine1 += arrayDocNumber.reduce((accumulator, digit, index) => {
      let rule = ''
      if (index === 2 || index === 5) {
        rule = '.'
      } else if (index === 8) {
        rule = '/'
      } else if (index === 12) {
        rule = '-'
      }
      return accumulator + rule + digit
    }, '')
  } else {
    textLine1 += '   CPF: '
    textLine1 += arrayDocNumber.reduce((accumulator, digit, index) => {
      let rule = ''
      if (index === 3 || index === 6) {
        rule = '.'
      } else if (index === 9) {
        rule = '-'
      }
      return accumulator + rule + digit
    }, '')
  }

  addText(pdf, 'normal', 9, textLine1, posCol + (withCol / 2), line(lastLine + 11, 8, 'write'), withCol * 4)
  addText(pdf, 'normal', 9, payer.endereco || '', posCol, line(lastLine + 11, -2, 'write'), withCol * 5)

  const textLine2 = `${payer.cidade || ''} - ${payer.uf || ''} CEP: ${payer.cep || ''}`
  addText(pdf, 'normal', 9, textLine2, posCol, line(lastLine + 11, -14, 'write'), withCol * 5)
}

const handleCodeBar = (text) => {
  // REF:
  // https://github.com/Romulosanttos/gerar-boletos/blob/master/lib/boleto/gerador-de-boleto.js#L624
  if (text.length % 2 !== 0) {
    throw new Error('Text must have an even number of characters')
  }
  const start = String.fromCharCode(201)
  const stop = String.fromCharCode(202)

  return text.match(/.{2}/g)
    .reduce((accumulator, part) => {
      const value = parseInt(part, 10)
      let ascii

      if (value >= 0 && value <= 93) {
        ascii = value + 33
      }

      if (value >= 94 && value <= 99) {
        ascii = value + 101
      }

      return accumulator + String.fromCharCode(ascii)
    }, start) + stop
}

const handleBenifeciario = (beneficiario) => {
  let complement = ''

  const arrayDocNumber = beneficiario.cpf_cnpj?.split('')
  if (beneficiario.tipo_pessoa === 'J') {
    complement += ' - '
    complement += arrayDocNumber.reduce((accumulator, digit, index) => {
      let rule = ''
      if (index === 2 || index === 5) {
        rule = '.'
      } else if (index === 8) {
        rule = '/'
      } else if (index === 12) {
        rule = '-'
      }
      return accumulator + rule + digit
    }, '')
  } else {
    complement += ' - '
    complement += arrayDocNumber.reduce((accumulator, digit, index) => {
      let rule = ''
      if (index === 3 || index === 6) {
        rule = '.'
      } else if (index === 9) {
        rule = '-'
      }
      return accumulator + rule + digit
    }, '')
  }

  if (beneficiario.address) {
    complement += ` ${abbreviateAddress(beneficiario.address?.toUpperCase())}`
  }

  if (beneficiario.zipCode) {
    const arrayZipCode = beneficiario.zipCode?.split('')
    let text = ' - CEP: '
    text += arrayZipCode.reduce((accumulator, digit, index) => {
      let rule = ''
      if (index === 4) {
        rule = '-'
      }
      return accumulator + rule + digit
    }, '')
    complement += text
  }

  const name = beneficiario?.nome_fantasia || beneficiario?.nome
  let fullBeneficiario

  if ((name + complement).length > 95) {
    const end = (name + complement).length - 95
    fullBeneficiario = name.substring(0, end) + complement
  } else {
    fullBeneficiario = name + complement
  }

  return fullBeneficiario
}

const renderPdf = (pdf, lastLine, billet, isReceipt, isSandbox) => {
  const posX = colStart + 90
  const withCol = spaceCol - 20
  const posCol = colStart + 5
  const pagador = billet?.pagador

  const fullBeneficiario = handleBenifeciario(billet?.beneficiario)

  addText(pdf, 'bold', 18, '041-8', posX + 10, line(lastLine + 1, 7, 'write'), withCol, 'center')

  if (isReceipt) {
    addText(pdf, 'normal', 8, 'SAC BANRISUL: 0800-646-1515 OUVIDORIA BANRISUL: 0800-644-2200', posX + withCol * 1.5, line(lastLine + 1, 7, 'write'), withCol * 1.5)
    addText(pdf, 'bold', 10, 'RECIBO DO PAGADOR', posX + (3.4 * withCol), line(lastLine + 1, 7, 'write'), withCol * 2)
  } else {
    addText(pdf, 'bold', 12, handleDigitableLine(billet.linha_digitavel), posX + withCol, line(lastLine + 1, 2, 'write'), withCol * 3.5, 'right')
  }

  // row 1
  addText(pdf, 'bold', 5, titles.localDoPagamento.toLocaleUpperCase(), colStart + 5, line(lastLine + 2, 8, 'write'), withCol + 30)
  addText(pdf, null, 9, 'PAGÁVEL PREFERENCIALMENTE NA REDE INTEGRADA BANRISUL', colStart + 5, line(lastLine + 2, -2, 'write'), withCol * 3, 'center')
  addText(pdf, 'bold', 5, 'VENCIMENTO', posX + (withCol * 3.5), line(lastLine + 2, 8, 'write'), withCol)
  addText(pdf, 'normal', 9, billet.data_vencimento && handleDate(billet.data_vencimento), posX + (withCol * 3.5), line(lastLine + 2, -2, 'write'), withCol, 'right')

  // row 2
  addText(pdf, 'bold', 5, 'BENEFICIÁRIO', posCol, line(lastLine + 3, 8, 'write'), withCol * 3)
  // Beneficiário nome
  addText(pdf, null, 9, fullBeneficiario, colStart + 5, line(lastLine + 3, -2, 'write'), withCol * 5)
  addText(pdf, 'bold', 5, titles.agenciaECodigoDoBeneficiario?.toUpperCase(), posX + (withCol * 3.5), line(lastLine + 3, 8, 'write'), withCol)
  // Código
  addText(pdf, 'normal', 9, billet?.beneficiario?.codigo, posX + (withCol * 3.5), line(lastLine + 3, -2, 'write'), withCol, 'right')
  //

  // row 3
  addText(pdf, 'bold', 5, titles.dataDocumento?.toUpperCase(), posCol, line(lastLine + 4, 8, 'write'), withCol + 30)
  // data emissao
  addText(pdf, 'normal', 9, billet.data_emissao && handleDate(billet.data_emissao), posCol, line(lastLine + 4, -2, 'write'), withCol + 30)
  // seu numero
  addText(pdf, 'bold', 5, titles.numeroDoDocumento?.toUpperCase(), posCol + withCol, line(lastLine + 4, 8, 'write'), withCol)
  addText(pdf, 'normal', 9, billet.seu_numero, posCol + withCol, line(lastLine + 4, -2, 'write'), withCol)

  addText(pdf, 'bold', 5, titles.especieDoDocumento?.toUpperCase(), posCol + (2 * withCol), line(lastLine + 4, 8, 'write'), withCol)
  addText(pdf, 'normal', 9, parseEspecie[billet.especie || 99], posCol + (2 * withCol), line(lastLine + 4, -2, 'write'), withCol, 'center')
  //
  addText(pdf, 'bold', 5, 'ACEITE', posCol + (3 * withCol), line(lastLine + 4, 8, 'write'), withCol / 4, 'center')
  addText(pdf, 'normal', 9, pagador.aceite === 'A' ? 'S' : 'N', posCol + (3 * withCol), line(lastLine + 4, -2, 'write'), withCol / 4, 'center')
  //
  addText(pdf, 'bold', 5, titles.dataDeProcessamento?.toUpperCase(), posCol + (3 * withCol) + 40, line(lastLine + 4, 8, 'write'), withCol)
  //
  addText(pdf, 'bold', 5, titles.nossoNumero?.toUpperCase(), posX + (withCol * 3.5), line(lastLine + 4, 8, 'write'), withCol)
  addText(pdf, 'normal', 9, billet.nosso_numero, posX + (withCol * 3.5), line(lastLine + 4, -2, 'write'), withCol, 'right')
  //
  // row 4
  addText(pdf, 'bold', 5, 'USO DO BANCO', posCol, line(lastLine + 5, 8, 'write'), withCol)
  //
  addText(pdf, 'bold', 5, titles.especie?.toUpperCase(), posX + (withCol * 0.5), line(lastLine + 5, 8, 'write'), withCol)
  addText(pdf, 'normal', 9, 'R$', posX + (withCol * 0.5), line(lastLine + 5, -2, 'write'), withCol, 'center')
  //
  addText(pdf, 'bold', 5, titles.quantidade?.toUpperCase(), posX + (withCol * 1.55), line(lastLine + 5, 8, 'write'), withCol)
  //
  addText(pdf, 'bold', 5, titles.valor?.toUpperCase(), posX + (withCol * 2.75), line(lastLine + 5, 8, 'write'), withCol)
  //
  addText(pdf, 'bold', 5, titles.valorDoDocumento?.toUpperCase(), posX + (withCol * 3.5), line(lastLine + 5, 8, 'write'), withCol)
  addText(pdf, 'bold', 9, (billet.valor_nominal).replace('.', ','), posX + (withCol * 3.5), line(lastLine + 5, -2, 'write'), withCol, 'right')
  //

  // row 5
  addText(pdf, 'bold', 5, titles.instrucoes?.toUpperCase(), posCol, line(lastLine + 6, 8, 'write'), withCol * 5)
  handleInstructions(billet.instrucoes, billet.data_vencimento, pdf, posCol, lastLine, withCol)
  // 605 caracteres with 11 rows
  addText(pdf, 'normal', 10, '', posCol, line(lastLine + 6, 0, 'write'), withCol * 4)
  // row 6
  addText(pdf, 'bold', 5, '(-) DESCONTO/ABATIMENTO', posX + (withCol * 3.5), line(lastLine + 6, 8, 'write'), withCol * 5)

  // row 7
  addText(pdf, 'bold', 5, '(-) OUTRAS DEDUÇÕES', posX + (withCol * 3.5), line(lastLine + 7, 8, 'write'), withCol * 5)
  // row 8
  addText(pdf, 'bold', 5, titles.moraMulta?.toUpperCase(), posX + (withCol * 3.5), line(lastLine + 8, 8, 'write'), withCol * 5)
  // row 9
  addText(pdf, 'bold', 5, '(+) OUTROS ACRÉSCIMOS', posX + (withCol * 3.5), line(lastLine + 9, 8, 'write'), withCol * 5)
  // row 10
  addText(pdf, 'bold', 5, '(=) VALOR COBRADO', posX + (withCol * 3.5), line(lastLine + 10, 8, 'write'), withCol * 5)

  // row 11
  handlePayer(pagador, pdf, posCol, lastLine, withCol)

  // row 13
  addText(pdf, 'bold', 5, 'SACADOR/AVALISTA', posCol, line(lastLine + 13, 8, 'write'), withCol * 5)

  // row 14
  addText(pdf, 'bold', 5, `AUTENTICAÇÃO MECÂNICA ${isReceipt ? '' : '-FICHA DE COMPENSAÇÃO'}`, posCol + withCol * 3.5, line(lastLine + 15, 0, 'write'), withCol * 5)
  if (!isReceipt) {
    addText(pdf, 'barCode', 32, handleCodeBar(billet.codigo_barras), posCol - 10, line(lastLine + 14, -14, 'write'), withCol * 4)
  }

  //
  if (isSandbox) {
    addText(pdf, 'bold', 32, 'BOLETO DE TESTE', posCol, line(lastLine + 9, 8, 'write'), withCol * 5)
  }
}

module.exports = function (pdf, billet, isSandbox) {
  renderPdf(pdf, 0, billet, true, isSandbox)
  renderPdf(pdf, 17, billet, false, isSandbox)
}
