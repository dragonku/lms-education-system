import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { boardApi } from '../services/api';
import { Post, PostDetailResponse, BoardType, Authority } from '../types';
import { useAuth } from '../contexts/AuthContext';

const NoticeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.authorities?.includes(Authority.ADMIN);
  const canEdit = isAdmin || (user && post && user.id === post.authorId);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      if (!id) return;
      
      const postData = await boardApi.getNoticePost(parseInt(id));
      setPost(postData);
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await boardApi.deleteNoticePost(post.id);
      alert('게시글이 삭제되었습니다.');
      navigate('/board/notice');
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || '게시글을 찾을 수 없습니다.'}
        </div>
        <Link to="/board/notice" className="btn btn-secondary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* 브레드크럼 */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">홈</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/board/notice">공지사항</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          {/* 게시글 헤더 */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h3 className="card-title mb-2">
                    {post.isNotice && (
                      <span className="badge bg-warning text-dark me-2">공지</span>
                    )}
                    {post.title}
                  </h3>
                  <div className="text-muted small">
                    <span className="me-3">
                      <i className="bi bi-person me-1"></i>
                      {post.authorName}
                    </span>
                    <span className="me-3">
                      <i className="bi bi-calendar me-1"></i>
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="me-3">
                      <i className="bi bi-eye me-1"></i>
                      조회 {post.viewCount}
                    </span>
                    {post.comments && post.comments.length > 0 && (
                      <span>
                        <i className="bi bi-chat me-1"></i>
                        댓글 {post.comments.length}
                      </span>
                    )}
                  </div>
                </div>
                
                {canEdit && (
                  <div className="btn-group">
                    <Link
                      to={`/board/notice/${post.id}/edit`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-pencil me-1"></i>
                      수정
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="bi bi-trash me-1"></i>
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 첨부파일 */}
          {post.attachments && post.attachments.length > 0 && (
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="card-title mb-0">
                  <i className="bi bi-paperclip me-2"></i>
                  첨부파일 ({post.attachments.length}개)
                </h6>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {post.attachments.map((file) => (
                    <div key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <i className="bi bi-file-earmark me-2"></i>
                        <span>{file.originalFileName}</span>
                        <small className="text-muted ms-2">
                          ({formatFileSize(file.fileSize)})
                        </small>
                      </div>
                      <a
                        href={file.downloadUrl}
                        className="btn btn-outline-primary btn-sm"
                        download
                      >
                        <i className="bi bi-download me-1"></i>
                        다운로드
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 게시글 내용 */}
          <div className="card mb-4">
            <div className="card-body">
              <div 
                className="post-content"
                style={{ 
                  minHeight: '200px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {post.content}
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Link to="/board/notice" className="btn btn-secondary">
              <i className="bi bi-list me-1"></i>
              목록으로
            </Link>
            
            {isAdmin && (
              <Link to="/board/notice/write" className="btn btn-primary">
                <i className="bi bi-pencil-square me-1"></i>
                새 글 쓰기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;