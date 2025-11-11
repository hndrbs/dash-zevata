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

// Profile API functions
export type Profile = {
  id: string
  invId: string
  name: string
  gender: 'Male' | 'Female'
  shortName: string
  address?: string
  otherInfo?: string
  picture?: string
  facebook?: string
  instagram?: string
  twitter?: string
  tiktok?: string
}

export async function getProfiles(invId: string) {
  return get<Array<Profile>>({ path: `invprofile/${invId}` })
}

export async function createProfile(
  invId: string,
  profileData: Omit<Profile, 'id'>,
) {
  return post<Profile>(`invprofile/${invId}`, profileData)
}

export async function updateProfile(
  invId: string,
  profileId: string,
  profileData: Partial<Profile>,
) {
  return put<Profile>(`invprofile/${invId}/${profileId}`, profileData)
}

export async function deleteProfile(invId: string, profileId: string) {
  return del(`invprofile/${invId}/${profileId}`)
}

// Event API functions
export type Event = {
  id: string
  invId: string
  eventName: string
  eventDate: string
  startTime: string
  endTime: string
  venue: string
  address: string
  googleMapsUrl: string
  isMain: boolean
}

export async function getEvents(invId: string) {
  return get<Array<Event>>({ path: `event/${invId}` })
}

export async function createEvent(invId: string, eventData: Omit<Event, 'id'>) {
  return post<Event>(`event/${invId}`, eventData)
}

export async function updateEvent(
  invId: string,
  eventId: string,
  eventData: Partial<Event>,
) {
  return put<Event>(`event/${invId}/${eventId}`, eventData)
}

export async function deleteEvent(invId: string, eventId: string) {
  return del(`event/${invId}/${eventId}`)
}
