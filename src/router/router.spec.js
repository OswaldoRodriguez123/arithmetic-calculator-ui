import { describe, expect, test, beforeEach } from 'vitest'
import router from './index'

describe('router auth guard', () => {
  beforeEach(async () => {
    localStorage.clear()
    await router.push('/sign-in')
  })

  test('redirects unauthenticated users from protected routes to sign-in', async () => {
    await router.push('/user-records')
    expect(router.currentRoute.value.name).toBe('sign-in')
  })

  test('redirects unauthenticated users from the dashboard to sign-in', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('sign-in')
  })

  test('allows authenticated users to reach protected routes', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', token: 'tok' }))
    await router.push('/user-records')
    expect(router.currentRoute.value.name).toBe('user-records')
  })

  test('the sign-in route stays reachable without a stored user', async () => {
    await router.push('/sign-in')
    expect(router.currentRoute.value.name).toBe('sign-in')
  })
})
