// Single source of truth for the /predict input: field names, allowed values,
// limits and descriptions. Must stay in sync with app/schemas.py.

export const CONTRACTS = ['Month-to-month', 'One year', 'Two year'] as const

export const INTERNET_SERVICES = ['DSL', 'Fiber optic', 'No'] as const

export const PAYMENT_METHODS = [
  'Electronic check',
  'Mailed check',
  'Bank transfer (automatic)',
  'Credit card (automatic)',
] as const

interface NumberField {
  kind: 'number'
  label: string
  description: string
  min: number
  max?: number
  step: number
}

interface SelectField {
  kind: 'select'
  label: string
  description: string
  options: readonly string[]
}

export const CUSTOMER_FIELDS = {
  tenure: {
    kind: 'number',
    label: 'Tenure (months)',
    description: 'Number of months the customer has stayed with the company',
    min: 0,
    max: 100,
    step: 1,
  },
  monthly_charges: {
    kind: 'number',
    label: 'Monthly charges',
    description: 'The amount charged to the customer monthly',
    // The API requires > 0; with step 0.01 the smallest valid value is 0.01.
    min: 0.01,
    step: 0.01,
  },
  contract: {
    kind: 'select',
    label: 'Contract',
    description:
      'The contract term of the customer (Month-to-month, One year, Two year)',
    options: CONTRACTS,
  },
  internet_service: {
    kind: 'select',
    label: 'Internet service',
    description: "Customer's internet service provider (DSL, Fiber optic, No)",
    options: INTERNET_SERVICES,
  },
  payment_method: {
    kind: 'select',
    label: 'Payment method',
    description:
      "The customer's payment method (Electronic check, Mailed check, Bank transfer (automatic), Credit card (automatic))",
    options: PAYMENT_METHODS,
  },
} as const satisfies Record<string, NumberField | SelectField>

type Fields = typeof CUSTOMER_FIELDS

export type CustomerField = keyof Fields

/** Number fields map to `number`, select fields to the union of their options. */
export type CustomerInput = {
  -readonly [K in CustomerField]: Fields[K] extends {
    options: readonly (infer O)[]
  }
    ? O
    : number
}

export type Contract = CustomerInput['contract']
export type InternetService = CustomerInput['internet_service']
export type PaymentMethod = CustomerInput['payment_method']

export type FieldErrors = Partial<Record<keyof CustomerInput, string>>

export const FIELD_ORDER = Object.keys(CUSTOMER_FIELDS) as CustomerField[]

export const DEFAULT_CUSTOMER: CustomerInput = {
  tenure: 5,
  monthly_charges: 89.9,
  contract: 'Month-to-month',
  internet_service: 'Fiber optic',
  payment_method: 'Electronic check',
}
