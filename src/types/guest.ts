export type Guest = {
  id: string
  invId: string
  name: string
  phone?: string
  createdAt: string
}

export type GuestStatus = 'Pending' | 'Invited'
