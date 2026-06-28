import http from "../lib/http";
import { ChangePasswordBodyType } from "../schemaValidations/account.schema";
import { LoginBodyType, LoginResType } from "../schemaValidations/auth.schema";
import { MessageResType } from "../schemaValidations/common.schema";
import { GuestLoginBodyType, GuestLoginResType } from "../schemaValidations/guest.schema";


const authApiRequest = {
  SGuestLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body),
  GuestLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/api/guest/auth/login', body, {baseUrl: ''}),
  SLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  Login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {baseUrl: ''}),
  logoutFromNextServerToServer: ({accessToken, refreshToken} : {accessToken: string, refreshToken: string} ) => http.post<MessageResType>("/auth/logout", {refreshToken}, {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
  }),
  logout: (body: {refreshToken: string}, signal?: AbortSignal | undefined) => http.post<MessageResType>('/api/auth/logout', body, {baseUrl: '', signal}),
  changePassword: (body: ChangePasswordBodyType) => http.put<ChangePasswordBodyType>("/account/change-password", body)
}

export default authApiRequest


