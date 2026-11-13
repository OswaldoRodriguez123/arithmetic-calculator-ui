export const getUserDataStorage = () => {
  const raw = localStorage.getItem('user');
  if (raw === null) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    // Corrupted entry: drop it so the next boot starts clean instead of crashing.
    console.error('Discarding corrupted localStorage["user"] entry.');
    localStorage.removeItem('user');
    return null;
  }
}

// The stored entry is only a non-sensitive display profile
// ({ id, name, username }) kept for instant paint of the navbar/dashboard.
// The session itself lives in the httpOnly cookie, which JavaScript cannot read.
export const saveUserDataStorage = (data) => {
  localStorage.setItem('user', JSON.stringify(data))
}
