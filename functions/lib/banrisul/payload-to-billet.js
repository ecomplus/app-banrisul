const parseAddress = to => ({
  city: to.city,
  state: to.province,
  stateCode: to.province_code,
  country: to.country_code ? to.country_code.toUpperCaseCase() : 'BR',
  zipCode: to.zip,
  number: `${String(to.number) || 's/n'}`,
  street: `${to.street}`,
  borough: `${to.borough}`,
  complement: to.complement || ''
})

const abbreviateAddress = (address) => {
  return address
    .replace('RUA', 'R.')
    .replace('AVENIDA', 'AV.')
    .replace('SANTO', 'STO.')
    .replace('SANTA', 'STA.')
    .replace('LOJA', 'LJ.')
    .substring(0, 35)
}

const createBodyToBillet = (appData, params) => {
  const { amount, buyer, to } = params
  const {
    fees, // Juros
    tax // Multa
  } = appData

  const isTest = appData.envoriment === 'homologação' || appData.envoriment === 'teste'
  const daysToExpiry = appData.days_to_expiry

  const createdAt = new Date()
  const dayExpiry = new Date(createdAt.getTime() + daysToExpiry * 24 * 60 * 60 * 1000)
  /*
    especie

    02 = Duplicata Mercantil
    04 = Duplicata de Serviço
    31 = Cartão de Crédito
    32 = Boleto de Proposta
    99 = Outros
  */

  const titulo = {
    data_emissao: createdAt.toISOString().split('T')[0],
    data_vencimento: dayExpiry.toISOString().split('T')[0],
    especie: '99',
    instrucoes: {},
    pag_parcial: {
      autoriza: 1,
      codigo: 3
    },
    valor_nominal: (amount.total).toFixed(2),
    // nosso_numero: ourNumber, // OBS.: in case it is necessary to calculate our number
    seu_numero: Date.now().toString()
  }

  /*
    Códigos Juros
      1 = Valor por dia
      2 = Taxa mensal
      3 = Isento
  */

  let codeFees = 3
  if (fees.type && fees.type !== 'isento') {
    codeFees = fees.type === 'percentual' ? 2 : 1
  }

  Object.assign(titulo.instrucoes, {
    juros: {
      codigo: codeFees
    }
  })

  switch (fees.type) {
    case 'percentual':
      titulo.instrucoes.juros.taxa = (fees.value || 0)
      break
    case 'fixo':
      titulo.instrucoes.juros.valor = (fees.value || 0)
      break
    default:
      break
  }

  /*
    Códigos Multa
      1 = Valor Fixo
      2 = Percentual
  */

  if (tax && !tax.disable && tax.value) {
    Object.assign(titulo.instrucoes, {
      multa: {
        codigo: tax.type === 'fixa' ? 1 : 2
      }
    })

    switch (tax.type) {
      case 'percentual':
        titulo.instrucoes.multa.taxa = (tax.value || 0)
        break
      case 'fixa':
        titulo.instrucoes.multa.valor = (tax.value || 0)
        break
      default:
        break
    }
  }

  const addressObj = to && to.street ? parseAddress(to) : parseAddress(params.billing_address)
  let address = `${addressObj.street}, ${addressObj.number}`
  if (addressObj.complement) {
    address += `Compl.: ${addressObj.complement}`
  }

  const endereco = abbreviateAddress(address.toUpperCase())

  const pagador = {
    aceite: 'A',
    cep: addressObj.zipCode,
    cidade: (addressObj.city).toUpperCase().substring(0, 15),
    cpf_cnpj: buyer.doc_number,
    endereco,
    nome: (buyer.fullname).toUpperCase().substring(0, 40),
    tipo_pessoa: buyer.registry_type.toUpperCase() === 'P' ? 'F' : 'J',
    uf: (addressObj.stateCode).toUpperCase()
  }

  Object.assign(titulo, { pagador })

  return { ambiente: isTest ? 'T' : 'P', titulo }
}

module.exports = {
  createBodyToBillet,
  abbreviateAddress
}
