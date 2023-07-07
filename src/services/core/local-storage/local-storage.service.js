export const getUserDataStorage = () => {
  return JSON.parse(localStorage.getItem('user'))
}

export const saveUserDataStorage = (data) => {
  localStorage.setItem('user', JSON.stringify(data))
}

export const getToken = () => {
  const user = getUserDataStorage();
  return user?.token
};

export default { getToken };
