export type RsvpStatus =
  | 'NotConfirmedYet'
  | 'Attending'
  | 'Maybe'
  | 'NotAttending'

export type Rsvp = {
  id: string
  invId: string
  guestId: string
  status: RsvpStatus
  countGuests: number
  wish: string
  createdAt: string
}

export type RsvpWithGuest = Rsvp & {
  guestName: string
}
