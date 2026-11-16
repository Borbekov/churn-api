import { useState, type FormEvent } from 'react'
import {
  CUSTOMER_FIELDS,
  DEFAULT_CUSTOMER,
  FIELD_ORDER,
  type CustomerField,
  type CustomerInput,
  type FieldErrors,
} from '../customer'
import { InfoTooltip } from './InfoTooltip'

// Inputs hold strings so a number field can be temporarily empty while typing.
type Draft = Record<CustomerField, string>

function toDraft(values: CustomerInput): Draft {
  return {
    tenure: String(values.tenure),
    monthly_charges: String(values.monthly_charges),
    contract: values.contract,
    internet_service: values.internet_service,
    payment_method: values.payment_method,
  }
}

// Native constraint validation (required/min/max/step) has already passed here.
function fromDraft(draft: Draft): CustomerInput {
  return {
    tenure: Number(draft.tenure),
    monthly_charges: Number(draft.monthly_charges),
    contract: draft.contract as CustomerInput['contract'],
    internet_service: draft.internet_service as CustomerInput['internet_service'],
    payment_method: draft.payment_method as CustomerInput['payment_method'],
  }
}

interface ChurnFormProps {
  onSubmit: (values: CustomerInput) => void
  loading?: boolean
  fieldErrors?: FieldErrors
  initialValues?: CustomerInput
}

export function ChurnForm({
  onSubmit,
  loading = false,
  fieldErrors = {},
  initialValues = DEFAULT_CUSTOMER,
}: ChurnFormProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initialValues))

  function update(name: CustomerField, value: string) {
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(fromDraft(draft))
  }

  return (
    <form className="card form" onSubmit={submit}>
      <fieldset disabled={loading}>
        <legend className="visually-hidden">Customer</legend>
        {FIELD_ORDER.map((name) => {
          const field = CUSTOMER_FIELDS[name]
          const inputId = `field-${name}`
          const error = fieldErrors[name]
          const errorId = error ? `${inputId}-error` : undefined

          const common = {
            id: inputId,
            name,
            value: draft[name],
            required: true,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': errorId,
          }

          return (
            <div className="field" key={name}>
              <div className="field__label">
                <label htmlFor={inputId}>{field.label}</label>
                <InfoTooltip label={field.label} text={field.description} />
              </div>

              {field.kind === 'number' ? (
                <input
                  {...common}
                  type="number"
                  inputMode={field.step < 1 ? 'decimal' : 'numeric'}
                  min={field.min}
                  max={'max' in field ? field.max : undefined}
                  step={field.step}
                  onChange={(e) => update(name, e.target.value)}
                />
              ) : (
                <select {...common} onChange={(e) => update(name, e.target.value)}>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {error && (
                <p id={errorId} className="field__error">
                  {error}
                </p>
              )}
            </div>
          )
        })}
      </fieldset>

      <button type="submit" className="submit" disabled={loading}>
        {loading ? 'Predicting…' : 'Predict churn'}
      </button>
    </form>
  )
}
