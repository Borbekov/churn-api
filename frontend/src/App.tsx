import { useState } from 'react'
import { ChurnForm } from './components/ChurnForm'
import { ResultCard } from './components/ResultCard'
import type { CustomerInput, FieldErrors } from './customer'

/** The whole screen is driven by this one value. */
export type UiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; probability: number }
  | { status: 'error'; message?: string; fieldErrors?: FieldErrors }

export default function App() {
  const [ui, setUi] = useState<UiState>({ status: 'idle' })

  // ─── TODO: request handler ────────────────────────────────────────────────
  async function handleSubmit(values: CustomerInput) {
    /* TODO: POST /predict
     *
     * Drive the screen with setUi:
     *   setUi({ status: 'loading' })
     *   setUi({ status: 'success', probability: 0.721 })            // 0–1
     *   setUi({ status: 'error', message: 'Something went wrong' })
     *   setUi({ status: 'error', fieldErrors: { tenure: 'Must be ≤ 100' } })
     *   setUi({ status: 'idle' })
     */
    // Placeholders keep `noUnusedLocals`/`noUnusedParameters` happy; delete them
    // once the request code uses `values` and `setUi`.
    void values
    void setUi
  }
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <main className="page">
      <header className="page__header">
        <h1>Churn Predictor</h1>
        <p>Estimate how likely a customer is to leave.</p>
      </header>

      {ui.status === 'error' && ui.message && (
        <div className="alert" role="alert">
          {ui.message}
        </div>
      )}

      <ChurnForm
        onSubmit={handleSubmit}
        loading={ui.status === 'loading'}
        fieldErrors={ui.status === 'error' ? ui.fieldErrors : undefined}
      />

      {ui.status === 'success' && <ResultCard probability={ui.probability} />}
    </main>
  )
}
