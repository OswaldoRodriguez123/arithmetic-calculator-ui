import { describe, expect, test, beforeEach } from 'vitest'
import axios from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores'
import { handleApiError } from './api.service'

describe('handleApiError', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
  })

  test('401 clears the stored user, the store and the axios default bearer, and rejects', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', token: 'tok123' }))
    axios.defaults.headers.common['Authorization'] = 'Bearer tok123'
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const error = { response: { status: 401 } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(localStorage.getItem('user')).toBe('null')
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(useAppStore().state.user).toBeNull()
  })

  test('non-401 errors reject with the original error and keep state', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', token: 'tok123' }))
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    const error = { response: { status: 500 } }
    await expect(handleApiError(error)).rejects.toBe(error)

    expect(useAppStore().state.isAuthenticated).toBe(true)
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: '1', token: 'tok123' }))
  })

  test('network errors without a response reject with the original error', async () => {
    const error = new Error('socket hang up')
    await expect(handleApiError(error)).rejects.toBe(error)
  })
})
