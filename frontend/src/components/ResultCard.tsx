interface ResultCardProps {
  /** Churn probability in the 0–1 range. */
  probability: number
}

export function ResultCard({ probability }: ResultCardProps) {
  const clamped = Math.min(1, Math.max(0, probability))
  const percent = `${(clamped * 100).toFixed(1)}%`

  return (
    <section className="card result" aria-live="polite">
      <p className="result__value">
        <strong>{percent}</strong> churn risk
      </p>
      <div
        className="result__bar"
        role="meter"
        aria-label="Churn risk"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number((clamped * 100).toFixed(1))}
        aria-valuetext={percent}
      >
        <div className="result__fill" style={{ width: percent }} />
      </div>
    </section>
  )
}
