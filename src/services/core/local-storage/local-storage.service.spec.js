import { describe, expect, test, beforeEach } from 'vitest'
import { getUserDataStorage, saveUserDataStorage } from './local-storage.service'

describe('getUserDataStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('returns null when nothing is stored', () => {
    expect(getUserDataStorage()).toBeNull()
  })

  test('returns the parsed profile when storage is valid', () => {
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User 1' }))
    expect(getUserDataStorage()).toEqual({ id: '1', name: 'User 1' })
  })

  test('returns null instead of throwing when storage is corrupted', () => {
    localStorage.setItem('user', '{not valid json')
    expect(() => getUserDataStorage()).not.toThrow()
    expect(getUserDataStorage()).toBeNull()
  })

  test('removes the corrupted entry so the app boots clean next time', () => {
    localStorage.setItem('user', '{not valid json')
    getUserDataStorage()
    expect(localStorage.getItem('user')).toBeNull()
  })

  test('saveUserDataStorage(null) then getUserDataStorage returns null', () => {
    saveUserDataStorage({ id: '1' })
    saveUserDataStorage(null)
    expect(getUserDataStorage()).toBeNull()
  })
})
