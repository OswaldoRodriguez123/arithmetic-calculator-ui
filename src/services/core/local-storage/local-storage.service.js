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

export const saveUserDataStorage = (data) => {
  localStorage.setItem('user', JSON.stringify(data))
}

export const getToken = () => {
  const user = getUserDataStorage();
  return user?.token
};

export default { getToken };
