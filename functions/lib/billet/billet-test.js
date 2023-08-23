const billet = {
  retorno: '49',
  titulo: {
    beneficiario: {
      codigo: '5731168866247',
      cpf_cnpj: '76209196126',
      nome: 'uÍiÀI',
      nome_fantasia: 'ÀÃ%ÔGÀkÁzmyau`OPYoáT?v9_ÉÚÍ3;fÂUyÀ=h7~XSzÓyqF4Q.#vN',
      tipo_pessoa: 'J'
    },
    codigo_barras: '55283391686229690574349498672515103287485996',
    data_emissao: '5655-12-02',
    data_vencimento: '4348-09-31',
    especie: '02',
    instrucoes: {
      juros: {
        codigo: 2,
        data: '6324-10-31',
        taxa: '-271.8',
        valor: '-578496171676.03'
      },
      abatimento: {
        valor: '1111268606.51'
      },
      baixa: {
        codigo: 1,
        prazo: 36
      },
      desconto: {
        codigo: 5,
        data: '7772-11-07',
        taxa: '-7.08',
        valor: '-682677.95'
      },
      multa: {
        codigo: 2,
        data: '1689-03-06',
        taxa: '0753.4',
        valor: '679.05'
      },
      protesto: {
        codigo: 1,
        prazo: 2
      }
    },
    linha_digitavel: '77269815406457311243003537544386312277562531949',
    nosso_numero: '8513805687',
    pag_parcial: {
      autoriza: 1,
      codigo: 1,
      percentual_max: '-2.82',
      percentual_min: '-898.0',
      quantidade: 90,
      tipo: 1,
      valor_max: '819279703429.29',
      valor_min: '150673382.60'
    },
    pagador: {
      aceite: 'N',
      cep: '65514150',
      cidade: '`hzvú`NY',
      cpf_cnpj: '85417382064',
      endereco: 'ú_1vánÁ:_ôLÂgoÇu#+;d\\êUãÚÃcáocçwyd#',
      nome: '0vâç9À# G \\k81hXO#êàÍ2p',
      tipo_pessoa: 'F',
      uf: 'HU'
    },
    seu_numero: '.T5$s-ZyCj',
    valor_nominal: '-49231204.08',
    carteira: 5,
    hibrido: {
      autoriza: 'S',
      copia_cola: "pSx@k`{MccaQkm$i2`0*xNY[*1=K4|RfL'm_LBx4~IN,obW$2l0Q%SFY|IC2b*;n7R'}?SAH~ .Kx/[:%A#qOjTe7U!cdu,hsoBf077gxC=x2L5LW\\}XSEhu1k D?J8@)mq5'LP~4;@S1#EBW5/VGtE:BafwCESU#L~9tu",
      location: "_;D.zb$A_RX'P_i+a5F9Rx!Nd9jfme_X+{G5},3VDLUtG2U?1]0)Z(i'qSR",
      situacao: 'N',
      txid: '930072925297634867722746857370174'
    },
    id_titulo_empresa: 'Jm1QdffG4ATmT9vc6MdnFED',
    mensagens: [
      {
        linha: 1,
        texto: 'ÜlA?}?ÁLX=aõfVoaálBUÜK3Q_'
      }
    ],
    operacoes: {
      custas_cartorio: '-593529996407.27',
      data_baixa: '6031-06-01',
      data_credito: '5076-12-08',
      data_pagamento: '4015-02-26',
      data_reembolso: '7973-08-31',
      ressarcimento_cartorio: '-06858.22',
      tarifa_aponte_cartorio: '-5772142.19',
      tarifa_baixa_liquidacao: '-631558390.13',
      tarifa_interbancaria: '2786404686.91',
      tarifa_manutencao_mensal: '5784.51',
      tarifa_registro: '976691950.11',
      tarifa_sustacao: '-984300.69',
      tarifas_diversas: '-968.81',
      valor_abatimento_utilizado: '2.07',
      valor_cobrado: '9047821.85',
      valor_creditado_debitado: '7722975.40',
      valor_desconto_utilizado: '1660661.71',
      valor_iof: '-5800.18',
      valor_juros_pago: '65918831.20',
      valor_juros_recebido: '-06161021419.64',
      valor_multa_recebido: '2.49',
      valor_pagamento: '-8974290.59',
      valor_reembolso: '3980.25'
    },
    rateio: {
      beneficiarios: [
        {
          codigo: '0341947597124',
          cpf_cnpj: '96722574999',
          nome: "IÔ0b;W:JBÜÀç#POzú\\mrf5'Õ=SÚ+EJ=wÁiqLTSDrws|zOXU'Í+ÂêwbÊ$çX!h",
          nome_fantasia: 's7útÉ]é#17Â+Ua',
          parcela: 5,
          percentual: '190.037',
          tipo_pessoa: 'J',
          valor: '-3.67'
        }
      ],
      codigo: 2,
      tipo_valor: 2
    },
    situacao_banrisul: 'T',
    situacao_cip: 'A',
    situacao_pagamento: 4,
    valor_iof: '-38.70'
  }
}

/*
const testGerate = () => {
  console.log('>> Gerate')
  const gerate = require('./gerate-billet')
  gerate(billet.titulo)
}
testGerate()
// */

module.exports = billet
