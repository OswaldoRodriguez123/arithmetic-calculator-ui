import { describe, expect, test, beforeEach } from 'vitest'
import axios from 'axios'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores'
import AuthService from './auth.service'

describe('AuthService.logout', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    delete axios.defaults.headers.common['Authorization']
  })

  test('clears the stored user, the store and the axios default bearer', async () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', token: 'tok123' }))
    axios.defaults.headers.common['Authorization'] = 'Bearer tok123'
    useAppStore().state = { user: { id: '1' }, isAuthenticated: true }

    await new AuthService().logout()

    expect(localStorage.getItem('user')).toBe('null')
    expect(axios.defaults.headers.common['Authorization']).toBeUndefined()
    expect(useAppStore().state.isAuthenticated).toBe(false)
    expect(useAppStore().state.user).toBeNull()
  })
})
