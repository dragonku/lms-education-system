export enum BoardType {
  NOTICE = 'notice',
  QNA = 'qna',
  FAQ = 'faq'
}

export enum PostStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export interface Board {
  id: string;
  title: string;
  boardType: BoardType;
  description?: string;
  allowFileUpload: boolean;
  allowComments: boolean;
  requireAuth: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  authorId: string;
  status: PostStatus;
  isPrivate: boolean;
  isPinned: boolean;
  viewCount: number;
  attachments: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  parentCommentId?: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileAttachment {
  id: string;
  postId: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
}