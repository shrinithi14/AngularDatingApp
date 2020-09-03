export interface Message {
  id: number;
  senderId: number;
  senderKnownAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientKnownAs: number;
  recipientPhotoUrl: string;
  content: string;
  isRead: boolean;
  dateRead: Date;
  dateSent: Date;
}
