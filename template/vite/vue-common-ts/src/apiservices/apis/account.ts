const { get, post } = http
const login = (data:LoginAttr) => post('/api/Account/Login', data)
const logout = () => get('/api/Account/Logout', null)

export default {
  login, logout
}