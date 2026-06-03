import { useState } from 'react'
import { createShortUrl } from '../../../services/url.api'

export default function useCreateLink() {
  const [step, setStep] = useState(0)
  const [url, setUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [startDate, setStartDate] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCreateLink = async () => {
    setStep(2)
    setError('')
    try {
      const payload = { originalUrl: url.trim() }
      const trimmedAlias = alias.trim()
      if (trimmedAlias) payload.customAlias = trimmedAlias
      if (startDate) {
        const [year, month, day] = startDate.split('-').map(Number)
        const start = new Date(year, month - 1, day)
        const today = new Date()
        if (start.toDateString() === today.toDateString()) {
          payload.startDate = today.toISOString()
        } else {
          payload.startDate = start.toISOString()
        }
      }
      if (expiresAt) {
        const [year, month, day] = expiresAt.split('-').map(Number)
        const exp = new Date(year, month - 1, day)
        exp.setHours(23, 59, 59, 999)
        payload.expiresAt = exp.toISOString()
      }
      if (isPasswordEnabled && password) {
        payload.password = password
      }
      const created = await createShortUrl(payload)
      setResult(created)
      setStep(3)
      return created
    } catch (err) {
      const errMsg = err?.response?.data?.message || 'Something went wrong. Please try again.'
      setError(errMsg)
      throw new Error(errMsg, { cause: err })
    }
  }

  return {
    step,
    setStep,
    url,
    setUrl,
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
    result,
    setResult,
    error,
    setError,
    handleCreateLink,
  }
}
