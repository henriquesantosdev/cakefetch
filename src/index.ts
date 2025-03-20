// import { sanitizeUrl } from "./utils/sanitizeUrl"
import { Interceptor } from "./types/interceptor"
import { RequestConfig } from "./types/request"

export default class Cakefetch {
  private baseUrl: string
  private authToken: string | undefined
  private requestInterceptor: Interceptor<RequestInit>[] = []
  private responseInterceptor: Interceptor<Response>[] = []

  constructor(config?: RequestConfig) {
    this.baseUrl = config?.baseUrl || ''
    this.authToken = config?.authToken || undefined
  }

  private async applyToken(token: string, config?: RequestInit) {
    const newConfig = {
      ...config
    }
    if (this.authToken) {
      newConfig.headers = {
        ...newConfig.headers,
        'Authorization': `${token}`
      }
    }
    return newConfig;
  }

  sanitizeUrl = (url: string, baseUrl: string) => {
    try {
      url = url.trim()
      const parsedUrl = new URL(`${baseUrl}${url}`)
      return parsedUrl.href
    } catch (error) {
      throw new Error(`Invalid url: ${error}`)      
    }
  }

  addRequestInterceptor(interceptor: Interceptor<RequestInit>) {
    this.requestInterceptor.push(interceptor)
  }

  addResponseInterceptor(interceptor: Interceptor<Response>) {
    this.responseInterceptor.push(interceptor)
  }

  private async applyInterceptors<T>(data: T, interceptors: Interceptor<T>[]) {
    for (const interceptor of interceptors) {
      data = await interceptor(data)
    }
    return data
  }

  async request<T>(url: string, options?: RequestInit): Promise<T> {
    let fullUrl = this.sanitizeUrl(url, this.baseUrl);
    let config: RequestInit = { ...options };

    if (this.authToken) {
      config = await this.applyToken(this.authToken, options)
    }

    config = await this.applyInterceptors(config, this.requestInterceptor);

    try {
      let response = await fetch(fullUrl, config);
      response = await this.applyInterceptors(response, this.responseInterceptor);

      if (!response.ok) {
        throw new Error(`Http error! status: ${response.status} | ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Fetch failed: ${error}`);
    }
  }

  get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'GET',
      headers: {
        ...options?.headers
      }
    })
  }

  post<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.mergeParams('POST', body, options))
  }

  put<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.mergeParams('PUT', body, options))
  }

  patch<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, this.mergeParams('PATCH', body, options))
  }

  delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'DELETE',
      headers: {
        ...options?.headers
      }
    })
  }

  private mergeParams<T>(method: string, body?: any, options: RequestInit = {}) {
    return {
      ...options,
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }
  }

}