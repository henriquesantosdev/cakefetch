import { Interceptor } from "./interceptor"

export type RequestConfig = RequestInit & {
  baseUrl?: string,
  authToken?: string,
  interceptors?: {
    request?: Interceptor<RequestInit>,
    response?: Interceptor<Response>
  }
}