export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: string;
}

export interface EmailStatus {
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  deleted: boolean;
  draft: boolean;
  recent: boolean;
  important: boolean;
}

export interface EmailAddress {
  value?: string;
  address?: string;
  name?: string;
  text?: string;
}

export interface Email {
  uid: number;
  subject: string;
  from: EmailAddress[] | null;
  to: EmailAddress[] | null;
  date: Date | string;
  text: string;
  html: string;
  status: EmailStatus;
  attachments: EmailAttachment[];
}
