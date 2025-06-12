export interface User {
  id: string; // Google's unique ID
  uniqueId: string; // Our custom 6-digit display ID
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  userUniqueId?: string; // Display the unique ID in messages
  userAvatar?: string;
  content: string;
  timestamp: Date;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}