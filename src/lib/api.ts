const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const getToken = () => localStorage.getItem('auth_token')

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
})

type BaseResponse<T> = {
  status: string
  message: string
  data?: T
}

type GetParams = {
  path: string
  pagination?: {
    page: number
    pageSize: number
  }
}

export async function get<T>({ path, pagination }: GetParams) {
  const url = new URL(`${API_BASE_URL}/api/${path}`)
  if (pagination) {
    const { page, pageSize } = pagination
    url.searchParams.append('page', page.toString())
    url.searchParams.append('pageSize', pageSize.toString())
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const res = (await response.json()) as BaseResponse<T>
  return res.data || []
}

export async function post<T>(path: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}/api/${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const res = (await response.json()) as BaseResponse<T>
  return res.data
}

export async function put<T>(path: string, data: unknown) {
  const response = await fetch(`${API_BASE_URL}/api/${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const res = (await response.json()) as BaseResponse<T>
  return res.data
}

export async function del(path: string) {
  const response = await fetch(`${API_BASE_URL}/api/${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  const res = (await response.json()) as BaseResponse<unknown>
  return res.data
}
