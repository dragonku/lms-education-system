import { Board, BoardType, Post, PostStatus, Comment, FileAttachment } from '../entities/Board';

export interface BoardRepository {
  findById(id: string): Promise<Board | null>;
  findByType(boardType: BoardType): Promise<Board[]>;
  create(board: Omit<Board, 'id' | 'createdAt' | 'updatedAt'>): Promise<Board>;
  update(id: string, board: Partial<Board>): Promise<Board>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Board[]>;
}

export interface PostRepository {
  findById(id: string): Promise<Post | null>;
  findByBoardId(boardId: string, page?: number, limit?: number): Promise<{ posts: Post[]; total: number }>;
  findByAuthorId(authorId: string): Promise<Post[]>;
  findByStatus(status: PostStatus): Promise<Post[]>;
  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post>;
  update(id: string, post: Partial<Post>): Promise<Post>;
  delete(id: string): Promise<void>;
  searchByTitle(title: string): Promise<Post[]>;
  searchByContent(content: string): Promise<Post[]>;
  findPinnedPosts(boardId: string): Promise<Post[]>;
  incrementViewCount(id: string): Promise<void>;
}

export interface CommentRepository {
  findById(id: string): Promise<Comment | null>;
  findByPostId(postId: string): Promise<Comment[]>;
  findByAuthorId(authorId: string): Promise<Comment[]>;
  create(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment>;
  update(id: string, comment: Partial<Comment>): Promise<Comment>;
  delete(id: string): Promise<void>;
  findReplies(parentCommentId: string): Promise<Comment[]>;
}

export interface FileAttachmentRepository {
  findById(id: string): Promise<FileAttachment | null>;
  findByPostId(postId: string): Promise<FileAttachment[]>;
  create(attachment: Omit<FileAttachment, 'id'>): Promise<FileAttachment>;
  delete(id: string): Promise<void>;
  findByFileName(fileName: string): Promise<FileAttachment | null>;
}