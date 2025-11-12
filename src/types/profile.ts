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
