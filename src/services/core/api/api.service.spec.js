import { describe, expect, test, beforeEach, vi } from 'vitest'
import axios from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores'
import ApiService, { handleApiError } from './api.service'

describe('ApiService', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('sends cookies cross-origin (httpOnly session) and never an Authorization default', () => {
    new ApiService()
    expect(axios.defaults.withCredentials).toBe(true)
    expect(axios.defaults.headers?.common?.Authorization).toBeUndefined()
  })
})

describe('handleApiError', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('401 clears the stored profile and the store, and rejects', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User 1' }))
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const error = { response: { status: 401 } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(localStorage.getItem('user')).toBe('null')
    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(useAppStore().state.user).toBeNull()
  })

  test('401 on a session-flow endpoint (/auth/*) clears state but does NOT reload (view/guard handles it)', async () => {
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const reload = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
    const error = { response: { status: 401 }, config: { url: 'https://arithmetic-calculator-api.onrender.com/api/v1/auth/login' } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(reload).not.toHaveBeenCalled()
    reload.mockRestore()
  })

  test('401 on a session-flow endpoint (/auth/me) clears state but does NOT reload', async () => {
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const reload = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
    const error = { response: { status: 401 }, config: { url: '/auth/me' } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(reload).not.toHaveBeenCalled()
    reload.mockRestore()
  })

  test('401 on a regular API call clears state and reloads', async () => {
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const reload = vi.spyOn(window.location, 'reload').mockImplementation(() => {})
    const error = { response: { status: 401 }, config: { url: '/user-records' } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(reload).toHaveBeenCalledTimes(1)
    reload.mockRestore()
  })

  test('non-401 errors reject with the original error and keep state', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User 1' }))
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const error = { response: { status: 500 } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(useAppStore().state.isAuthenticated).toBe(true)
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: '1', name: 'User 1' }))
  })

  test('network errors without a response reject with the original error', async () => {
    const error = new Error('socket hang up')
    await expect(handleApiError(error)).rejects.toBe(error)
  })
})
