export { }

declare global {
  /* #region userStore */

  type UserInfo = {
    userName: string,
    userInfoID: number,
    token: string,
    expiryDate: Date | null
  }

  type UserState = {
    userInfo: UserInfo | null,
    isAuthenticated: boolean
  }

  /* #endregion */
  
}