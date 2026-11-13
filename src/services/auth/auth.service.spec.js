import { describe, expect, test, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores'
import AuthService from './auth.service'

describe('AuthService.logout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('asks the API to clear the session cookie, then clears local state', async () => {
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User 1' }))

    const service = new AuthService()
    const post = vi.spyOn(service.apiService, 'post').mockResolvedValue({ status: 204 })

    await service.logout()

    expect(post).toHaveBeenCalledWith('/auth/logout')
    expect(localStorage.getItem('user')).toBe('null')
    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(useAppStore().state.user).toBeNull()
  })

  test('still clears local state when the API is unreachable (best effort)', async () => {
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User 1' }))

    const service = new AuthService()
    vi.spyOn(service.apiService, 'post').mockRejectedValue(new Error('network down'))

    await expect(service.logout()).resolves.toBeUndefined()
    expect(localStorage.getItem('user')).toBe('null')
    expect(useAppStore().state.isAuthenticated).toBe(false)
  })
})

describe('AuthService.me', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  test('returns the API profile envelope on a valid session', async () => {
    const service = new AuthService()
    const profile = { id: '1', name: 'User 1', username: 'user1' }
    vi.spyOn(service.apiService, 'get').mockResolvedValue({ data: { status: 200, data: profile } })

    await expect(service.me()).resolves.toEqual(profile)
  })

  test('throws when the session is not valid', async () => {
    const service = new AuthService()
    vi.spyOn(service.apiService, 'get').mockRejectedValue({ response: { status: 401 } })

    await expect(service.me()).rejects.toEqual({ response: { status: 401 } })
  })
})
