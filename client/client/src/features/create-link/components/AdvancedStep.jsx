import { useEffect, useRef } from 'react'
import { validateAlias } from '../utils/createLinkValidation'
import CustomAliasSection from './CustomAliasSection'
import DateRangeSection from './DateRangeSection'
import PasswordProtectionSection from './PasswordProtectionSection'

export default function AdvancedStep({
  alias,
  setAlias,
  startDate,
  setStartDate,
  expiresAt,
  setExpiresAt,
  password,
  setPassword,
  isPasswordEnabled,
  setIsPasswordEnabled,
  onBack,
  onCreateLink,
}) {
  const inputRef = useRef(null)
  const trimmedAlias = alias.trim()
  const aliasResult = validateAlias(trimmedAlias)

  const dateError =
    startDate && expiresAt && expiresAt <= startDate
      ? 'Expiry date must be after start date.'
      : null

  const passwordError =
    isPasswordEnabled && !password.trim()
      ? 'Password is required when protection is enabled.'
      : null

  const canCreate = aliasResult.valid && !dateError && !passwordError

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <>
      {/* Custom Alias */}
      <CustomAliasSection
        alias={alias}
        setAlias={setAlias}
        canCreate={canCreate}
        onCreateLink={onCreateLink}
        inputRef={inputRef}
      />

      {/* Link Schedule */}
      <DateRangeSection
        startDate={startDate}
        setStartDate={setStartDate}
        expiresAt={expiresAt}
        setExpiresAt={setExpiresAt}
        dateError={dateError}
      />

      {/* Password Protection */}
      <PasswordProtectionSection
        password={password}
        setPassword={setPassword}
        isPasswordEnabled={isPasswordEnabled}
        setIsPasswordEnabled={setIsPasswordEnabled}
        passwordError={passwordError}
      />

      {/* Actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-[0.98]"
        >
          Back
        </button>
        <button
          id="create-link-submit-btn"
          type="button"
          onClick={onCreateLink}
          disabled={!canCreate}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Link
        </button>
      </div>
    </>
  )
}
