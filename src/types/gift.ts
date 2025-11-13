export enum GiftType {
  Transfer = 1,
  SendPackage,
}
export type Gift = {
  id: string
  invId: string
  giftType: GiftType
  method: string
  toPerson: string
  toTargetId: string
  thankYouNote: string
  createdAt: Date
}
