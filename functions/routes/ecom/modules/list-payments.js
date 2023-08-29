exports.post = ({ appSdk }, req, res) => {
  /**
   * Requests coming from Modules API have two object properties on body: `params` and `application`.
   * `application` is a copy of your app installed by the merchant,
   * including the properties `data` and `hidden_data` with admin settings configured values.
   * JSON Schema reference for the List Payments module objects:
   * `params`: https://apx-mods.e-com.plus/api/v1/list_payments/schema.json?store_id=100
   * `response`: https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100
   *
   * Examples in published apps:
   * https://github.com/ecomplus/app-pagarme/blob/master/functions/routes/ecom/modules/list-payments.js
   * https://github.com/ecomplus/app-custom-payment/blob/master/functions/routes/ecom/modules/list-payments.js
   */

  const { application, params } = req.body
  // const { storeId } = req
  // setup basic required response object
  const response = {
    payment_gateways: []
  }
  const appData = Object.assign({}, application.data, application.hidden_data)
  // const isProdution = appData.envoriment === 'produção'

  const amount = { ...params.amount } || {}

  if (!appData.client_id || !appData.client_secret) {
    return res.status(409).send({
      error: 'NO_BANRISUL_KEYS',
      message: 'Client ID e/ou Secret da API indefinido(s) (lojista deve configurar o aplicativo)'
    })
  }

  // add new payment method option
  const gateway = {
    intermediator: {
      code: 'banrisul',
      link: 'https://www.banrisul.com.br/',
      name: 'Banrisul'
    },
    type: 'payment',
    payment_method: {
      code: 'banking_billet',
      name: 'Boleto Bancário'
    },
    label: `Boleto Bancário${appData.envoriment && appData.envoriment !== 'produção' ? ` - ${appData.envoriment}` : ''}`,
    expiration_date: appData.expiration_date || 7
  }

  const discount = appData.discount

  if (discount) {
    gateway.discount = {
      apply_at: discount.apply_at,
      type: discount.type,
      value: discount.value
    }

    // check amount value to apply discount
    if (amount.total < (discount.min_amount || 0)) {
      delete gateway.discount
    } else {
      delete discount.min_amount

      // fix local amount object
      const applyDiscount = discount.apply_at

      const maxDiscount = amount[applyDiscount || 'subtotal']
      let discountValue
      if (discount.type === 'percentage') {
        discountValue = maxDiscount * discount.value / 100
      } else {
        discountValue = discount.value
        if (discountValue > maxDiscount) {
          discountValue = maxDiscount
        }
      }

      if (discountValue) {
        amount.discount = (amount.discount || 0) + discountValue
        amount.total -= discountValue
        if (amount.total < 0) {
          amount.total = 0
        }
      }
    }
    if (response.discount_option) {
      response.discount_option.min_amount = discount.min_amount
    }
  }

  response.payment_gateways.push(gateway)

  res.send(response)
}
