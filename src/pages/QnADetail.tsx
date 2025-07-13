import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserType, Authority } from '../types';
import { boardApi } from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorId: number;
  isSecret: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  authorName: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

const QnADetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const postData = await boardApi.getQnAPost(parseInt(id!));
      
      // 비밀글 권한 체크
      if (postData.isSecret) {
        const isAdmin = user?.authorities?.includes(Authority.ADMIN);
        const isAuthor = user?.id === postData.authorId;
        
        if (!isAdmin && !isAuthor) {
          setError('비밀글은 작성자와 관리자만 볼 수 있습니다.');
          return;
        }
      }
      
      setPost(postData as any);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('비밀글은 작성자와 관리자만 볼 수 있습니다.');
      } else if (err.response?.status === 404) {
        setError('게시글을 찾을 수 없습니다.');
      } else {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      }
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!post) return;
    navigate(`/qna/edit/${post.id}`);
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await boardApi.deleteQnAPost(post.id);
        alert('게시글이 삭제되었습니다.');
        navigate('/qna');
      } catch (err) {
        alert('삭제 중 오류가 발생했습니다.');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await boardApi.createComment(parseInt(id!), 'qna', comment.trim());
      
      setComment('');
      await fetchPost();
    } catch (err) {
      alert('댓글 작성 중 오류가 발생했습니다.');
      console.error('Error creating comment:', err);
    }
  };

  const handleCommentEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleCommentUpdate = async (commentId: number) => {
    if (!editingCommentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await boardApi.updateComment(parseInt(id!), commentId, 'qna', editingCommentContent.trim());
      
      setEditingCommentId(null);
      setEditingCommentContent('');
      await fetchPost();
    } catch (err) {
      alert('댓글 수정 중 오류가 발생했습니다.');
      console.error('Error updating comment:', err);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await boardApi.deleteComment(parseInt(id!), commentId, 'qna');
        await fetchPost();
      } catch (err) {
        alert('댓글 삭제 중 오류가 발생했습니다.');
        console.error('Error deleting comment:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const canEditPost = () => {
    return user && post && (user.id === post.authorId || user.userType === UserType.ADMIN);
  };

  const canEditComment = (comment: Comment) => {
    return user && (user.id === comment.authorId || user.userType === UserType.ADMIN);
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/qna')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          게시글을 찾을 수 없습니다.
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/qna')}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="mb-2 mb-md-0">
                  <h4 className="mb-0">
                    {post.title}
                    {post.isSecret && (
                      <i className="bi bi-lock text-warning ms-2" title="비밀글"></i>
                    )}
                  </h4>
                  <small className="text-muted d-flex flex-wrap gap-2">
                    <span>작성자: {post.authorName}</span>
                    <span>조회수: {post.viewCount}</span>
                    <span>작성일: {formatDate(post.createdAt)}</span>
                    {post.updatedAt !== post.createdAt && (
                      <span>수정일: {formatDate(post.updatedAt)}</span>
                    )}
                  </small>
                </div>
                {canEditPost() && (
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={handleEdit}
                    >
                      <i className="bi bi-pencil"></i> 수정
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDelete}
                    >
                      <i className="bi bi-trash"></i> 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="content">
                {formatContent(post.content)}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                댓글 ({post.comments.length})
              </h5>
            </div>
            <div className="card-body">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-bottom pb-3 mb-3">
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        className="form-control mb-2"
                        rows={3}
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                      />
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCommentUpdate(comment.id)}
                        >
                          저장
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingCommentId(null)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="comment-content mb-2">
                            {formatContent(comment.content)}
                          </div>
                          <small className="text-muted">
                            {comment.authorName} | {formatDate(comment.createdAt)}
                            {comment.updatedAt !== comment.createdAt && (
                              <span> (수정됨)</span>
                            )}
                          </small>
                        </div>
                        {canEditComment(comment) && (
                          <div className="btn-group">
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleCommentEdit(comment.id, comment.content)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="댓글을 입력하세요..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-chat-left-text me-2"></i>
                    댓글 작성
                  </button>
                </form>
              ) : (
                <div className="text-center py-3">
                  <p className="text-muted">댓글을 작성하려면 로그인해주세요.</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                  >
                    로그인
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/qna')}
            >
              <i className="bi bi-list me-2"></i>
              목록
            </button>
            {isAuthenticated && (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/qna/write')}
              >
                <i className="bi bi-pencil-square me-2"></i>
                새 질문 작성
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnADetail;