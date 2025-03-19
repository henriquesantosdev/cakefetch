type Interceptor<T> = (data: T) => T | Promise<T>

type RequestConfig = RequestInit & {
  baseUrl?: string,
  interceptors?: {
    request?: Interceptor<RequestInit>,
    response?: Interceptor<Response>
  }
}

export default class Cakefetch {
  private baseUrl: string
  private requestInterceptor: Interceptor<RequestInit>[] = []
  private responseInterceptor: Interceptor<Response>[] = []

  constructor(config?: RequestConfig) {
    this.baseUrl = config?.baseUrl || ''
  }

  sanitizeUrl(url: string) {
    if (url[0] === '/') {
      url = url.slice(1, url.length)
    }
    console.log()
    return url
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
    let fullUrl = this.baseUrl + url;
    let config: RequestInit = { ...options };

    config = await this.applyInterceptors(config, this.requestInterceptor);

    try {
      let response = await fetch(fullUrl, config);

      response = await this.applyInterceptors(response, this.responseInterceptor);

      if (!response.ok) {
        throw new Error(`Http error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      throw new Error(`Fetch failed: ${error}`);
    }
  }

  get<T>(url: string, options: RequestInit = {}): Promise<T> {
    url = this.sanitizeUrl(url)
    return this.request<T>(url, {
      ...options,
      method: 'GET',
      headers: {
        ...options?.headers
      }
    })
  }

  post<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    url = this.sanitizeUrl(url)
    return this.request<T>(url, this.mergeParams('POST', body, options))
  }

  put<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    url = this.sanitizeUrl(url)
    return this.request<T>(url, this.mergeParams('PUT', body, options))
  }

  patch<T>(url: string, body?: any, options: RequestInit = {}): Promise<T> {
    url = this.sanitizeUrl(url)
    return this.request<T>(url, this.mergeParams('PATCH', body, options))
  }

  delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    url = this.sanitizeUrl(url)
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