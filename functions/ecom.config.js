/* eslint-disable comma-dangle, no-multi-spaces, key-spacing */

/**
 * Edit base E-Com Plus Application object here.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/applications/
 */

const app = {
  app_id: 115617,
  title: 'Boleto Banrisul',
  slug: 'banrisul',
  type: 'external',
  state: 'active',
  authentication: true,

  /**
   * Uncomment modules above to work with E-Com Plus Mods API on Storefront.
   * Ref.: https://developers.e-com.plus/modules-api/
   */
  modules: {
    /**
     * Triggered to calculate shipping options, must return values and deadlines.
     * Start editing `routes/ecom/modules/calculate-shipping.js`
     */
    // calculate_shipping:   { enabled: true },

    /**
     * Triggered to validate and apply discount value, must return discount and conditions.
     * Start editing `routes/ecom/modules/apply-discount.js`
     */
    // apply_discount:       { enabled: true },

    /**
     * Triggered when listing payments, must return available payment methods.
     * Start editing `routes/ecom/modules/list-payments.js`
     */
    list_payments:        { enabled: true },

    /**
     * Triggered when order is being closed, must create payment transaction and return info.
     * Start editing `routes/ecom/modules/create-transaction.js`
     */
    create_transaction:   { enabled: true },
  },

  /**
   * Uncomment only the resources/methods your app may need to consume through Store API.
   */
  auth_scope: {
    'stores/me': [
      'GET'            // Read store info
    ],
    procedures: [
      'POST'           // Create procedures to receive webhooks
    ],
    products: [
      // 'GET',           // Read products with public and private fields
      // 'POST',          // Create products
      // 'PATCH',         // Edit products
      // 'PUT',           // Overwrite products
      // 'DELETE',        // Delete products
    ],
    brands: [
      // 'GET',           // List/read brands with public and private fields
      // 'POST',          // Create brands
      // 'PATCH',         // Edit brands
      // 'PUT',           // Overwrite brands
      // 'DELETE',        // Delete brands
    ],
    categories: [
      // 'GET',           // List/read categories with public and private fields
      // 'POST',          // Create categories
      // 'PATCH',         // Edit categories
      // 'PUT',           // Overwrite categories
      // 'DELETE',        // Delete categories
    ],
    customers: [
      // 'GET',           // List/read customers
      // 'POST',          // Create customers
      // 'PATCH',         // Edit customers
      // 'PUT',           // Overwrite customers
      // 'DELETE',        // Delete customers
    ],
    orders: [
      'GET',           // List/read orders with public and private fields
      // 'POST',          // Create orders
      // 'PATCH',         // Edit orders
      // 'PUT',           // Overwrite orders
      // 'DELETE',        // Delete orders
    ],
    carts: [
      // 'GET',           // List all carts (no auth needed to read specific cart only)
      // 'POST',          // Create carts
      // 'PATCH',         // Edit carts
      // 'PUT',           // Overwrite carts
      // 'DELETE',        // Delete carts
    ],

    /**
     * Prefer using 'fulfillments' and 'payment_history' subresources to manipulate update order status.
     */
    'orders/fulfillments': [
      // 'GET',           // List/read order fulfillment and tracking events
      // 'POST',          // Create fulfillment event with new status
      // 'DELETE',        // Delete fulfillment event
    ],
    'orders/payments_history': [
      // 'GET',           // List/read order payments history events
      'POST',          // Create payments history entry with new status
      // 'DELETE',        // Delete payments history entry
    ],

    /**
     * Set above 'quantity' and 'price' subresources if you don't need access for full product document.
     * Stock and price management only.
     */
    'products/quantity': [
      // 'GET',           // Read product available quantity
      // 'PUT',           // Set product stock quantity
    ],
    'products/variations/quantity': [
      // 'GET',           // Read variaton available quantity
      // 'PUT',           // Set variation stock quantity
    ],
    'products/price': [
      // 'GET',           // Read product current sale price
      // 'PUT',           // Set product sale price
    ],
    'products/variations/price': [
      // 'GET',           // Read variation current sale price
      // 'PUT',           // Set variation sale price
    ],

    /**
     * You can also set any other valid resource/subresource combination.
     * Ref.: https://developers.e-com.plus/docs/api/#/store/
     */
  },

  admin_settings: {
    client_id: {
      schema: {
        type: 'string',
        maxLength: 255,
        title: 'Client Id',
        // description: ''
      },
      hide: true
    },
    client_secret: {
      schema: {
        type: 'string',
        maxLength: 255,
        title: 'Client Secret',
        // description: ''
      },
      hide: true
    },
    beneficiary_code: {
      schema: {
        type: 'string',
        maxLength: 13,
        title: 'Código beneficiário',
        description: 'Seu código de beneficiário no Banrisul (13 dígitos)'
      },
      hide: true
    },
    envoriment: {
      schema: {
        type: 'string',
        enum: [
          'teste',
          'homologação',
          'produção'
        ],
        default: 'produção',
        title: 'Ambiente',
        description: 'Definir o ambiente'
      },
      hide: false
    },
    days_to_expiry: {
      schema:{
        type: 'integer',
        minimum: 1,
        maximum: 999,
        default: 7,
        title: 'Dias corridos até o vencimento',
        description: 'Representa diferença de dias entre a data da requisição e a data de vencimento'
      },
      hide: false
    },
    fees: {
      schema: {
        type: 'object',
        required: [
          'value'
        ],
        title: 'Juros',
        description: 'Juros a ser aplicado nos boletos após vencimento',
        additionalProperties: false,
        properties: {
          type: {
            type: 'string',
            enum: [
              'percentual',
              'fixo',
              'isento'
            ],
            default: 'isento',
            title: 'Tipo de juros',
            description: 'Se fixo valor diário, se percentual taxa mensal'
          },
          value: {
            type: 'number',
            minimum: 0,
            maximum: 99999999,
            title: 'Valor do juros',
            description: 'Valor percentual ou fixo a ser acrescentado, dependendo to tipo configurado'
          }
        }
      },
      hide: false
    },
    tax: {
      schema: {
        type: 'object',
        required: [
          'value'
        ],
        title: 'Multa',
        description: 'Multa a ser aplicada nos boletos após vencimento',
        additionalProperties: false,
        properties: {
          disable: {
            type: 'boolean',
            default: true,
            title: 'Desabilitar multa'
          },
          type: {
            type: 'string',
            enum: [
              'percentual',
              'fixa'
            ],
            default: 'percentual',
            title: 'Tipo de multa',
            description: 'Multa com valor percentual ou fixo'
          },
          value: {
            type: 'number',
            minimum: 0,
            maximum: 99999999,
            title: 'Valor da multa',
            description: 'Valor percentual ou fixo a ser acrescentado, dependendo to tipo configurado'
          }
        }
      },
      hide: false
    },
    discount: {
      schema: {
        type: 'object',
        required: [
          'value'
        ],
        title: 'Desconto',
        additionalProperties: false,
        properties: {
          disable: {
            type: 'boolean',
            default: false,
            title: 'Desabilitar desconto'
          },
          apply_at: {
            type: 'string',
            enum: [
              'total',
              'subtotal',
              'freight'
            ],
            default: 'subtotal',
            title: 'Aplicar desconto em',
            description: 'Em qual valor o desconto deverá ser aplicado no checkout'
          },
          min_amount: {
            type: 'integer',
            minimum: 1,
            maximum: 999999999,
            title: 'Pedido mínimo',
            description: 'Montante mínimo para aplicar o desconto'
          },
          type: {
            type: 'string',
            enum: [
              'percentage',
              'fixed'
            ],
            default: 'percentage',
            title: 'Tipo de desconto',
            description: 'Desconto com valor percentual ou fixo'
          },
          value: {
            type: 'number',
            minimum: 0,
            maximum: 99999999,
            title: 'Valor do desconto',
            description: 'Valor percentual ou fixo a ser descontado, dependendo to tipo configurado'
          }
        }
      },
      hide: false
    }
  }
}

/**
 * List of Procedures to be created on each store after app installation.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/procedures/
 */

const procedures = []

/**
 * Uncomment and edit code above to configure `triggers` and receive respective `webhooks`:

const { baseUri } = require('./__env')

procedures.push({
  title: app.title,

  triggers: [
    // Receive notifications when new order is created:
    {
      resource: 'orders',
      action: 'create',
    },

    // Receive notifications when order financial/fulfillment status are set or changed:
    // Obs.: you probably SHOULD NOT enable the orders triggers below and the one above (create) together.
    {
      resource: 'orders',
      field: 'financial_status',
    },
    {
      resource: 'orders',
      field: 'fulfillment_status',
    },

    // Receive notifications when products/variations stock quantity changes:
    {
      resource: 'products',
      field: 'quantity',
    },
    {
      resource: 'products',
      subresource: 'variations',
      field: 'quantity'
    },

    // Receive notifications when cart is edited:
    {
      resource: 'carts',
      action: 'change',
    },

    // Receive notifications when customer is deleted:
    {
      resource: 'customers',
      action: 'delete',
    },

    // Feel free to create custom combinations with any Store API resource, subresource, action and field.
  ],

  webhooks: [
    {
      api: {
        external_api: {
          uri: `${baseUri}/ecom/webhook`
        }
      },
      method: 'POST'
    }
  ]
})

 * You may also edit `routes/ecom/webhook.js` to treat notifications properly.
 */

exports.app = app

exports.procedures = procedures
