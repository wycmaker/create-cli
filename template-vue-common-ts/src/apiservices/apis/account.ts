const { get, post } = http
const login = (data:LoginAttr) => post('/api/Acconut/Login', data)
const logout = () => get('/api/Account/Logout', null)

export default {
  login, logout
}