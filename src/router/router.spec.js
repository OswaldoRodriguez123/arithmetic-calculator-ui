import { describe, expect, test, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores'

const mocks = vi.hoisted(() => ({ me: vi.fn() }))
vi.mock('@/services/auth', () => ({
  default: class {
    constructor() {}
    login() { return Promise.reject(new Error('not implemented')); }
    me() { return mocks.me(); }
  },
}))

import router from './index'

const PROFILE = { id: '1', name: 'User 1', username: 'user1' }

describe('router auth guard (cookie session via /auth/me)', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    localStorage.clear()
    mocks.me.mockReset()
    await router.push('/sign-in')
  })

  test('redirects to sign-in when /auth/me rejects (no valid session)', async () => {
    mocks.me.mockRejectedValue({ response: { status: 401 } })

    await router.push('/user-records')

    expect(router.currentRoute.value.name).toBe('sign-in')
    expect(useAppStore().state.isAuthenticated).toBe(false)
  })

  test('redirects from the dashboard to sign-in when /auth/me rejects', async () => {
    mocks.me.mockRejectedValue({ response: { status: 401 } })

    await router.push('/')

    expect(router.currentRoute.value.name).toBe('sign-in')
  })

  test('allows protected routes and hydrates the store when the cookie is valid', async () => {
    mocks.me.mockResolvedValue(PROFILE)

    await router.push('/user-records')

    expect(router.currentRoute.value.name).toBe('user-records')
    expect(mocks.me).toHaveBeenCalledTimes(1)
    expect(useAppStore().state.isAuthenticated).toBe(true)
    expect(useAppStore().state.user).toEqual(PROFILE)
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(PROFILE)
  })

  test('does not call /auth/me again once the page already knows the session', async () => {
    mocks.me.mockResolvedValue(PROFILE)
    useAppStore().state = { user: PROFILE, isAuthenticated: true }

    await router.push('/user-records')

    expect(router.currentRoute.value.name).toBe('user-records')
    expect(mocks.me).not.toHaveBeenCalled()
  })

  test('the sign-in route stays reachable without a session', async () => {
    mocks.me.mockRejectedValue({ response: { status: 401 } })

    await router.push('/sign-in')

    expect(router.currentRoute.value.name).toBe('sign-in')
    expect(mocks.me).not.toHaveBeenCalled()
  })
})
