import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserType } from '../types';
import { boardApi } from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  isSecret: boolean;
  authorId: number;
}

const QnAWrite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (id) {
      setIsEdit(true);
      fetchPost();
    }
  }, [id, isAuthenticated, navigate]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const post = await boardApi.getQnAPost(parseInt(id!));
      
      if (user && (user.id !== post.authorId && user.userType !== UserType.ADMIN)) {
        alert('수정 권한이 없습니다.');
        navigate('/qna');
        return;
      }
      
      setTitle(post.title);
      setContent(post.content);
      setIsSecret(post.isSecret);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('수정 권한이 없습니다.');
      } else {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      }
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const postData = {
        title: title.trim(),
        content: content.trim(),
        isSecret
      };

      if (isEdit) {
        await boardApi.updateQnAPost(parseInt(id!), postData);
        alert('게시글이 수정되었습니다.');
        navigate(`/qna/${id}`);
      } else {
        const newPost = await boardApi.createQnAPost(postData);
        alert('게시글이 등록되었습니다.');
        navigate(`/qna/${newPost.id}`);
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(isEdit ? '게시글 수정 중 오류가 발생했습니다.' : '게시글 등록 중 오류가 발생했습니다.');
      }
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate(`/qna/${id}`);
    } else {
      navigate('/qna');
    }
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">
                {isEdit ? '질문 수정' : '새 질문 작성'}
              </h4>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    제목 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    maxLength={200}
                    required
                  />
                  <div className="form-text">
                    {title.length}/200자
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    내용 <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="질문 내용을 자세히 작성해주세요"
                    maxLength={10000}
                    required
                  />
                  <div className="form-text">
                    {content.length}/10,000자
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isSecret"
                      checked={isSecret}
                      onChange={(e) => setIsSecret(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="isSecret">
                      <i className="bi bi-lock me-2"></i>
                      비밀글로 설정 (작성자와 관리자만 볼 수 있습니다)
                    </label>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-between gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    취소
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        처리 중...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isEdit ? '수정' : '등록'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                질문 작성 팁
              </h6>
            </div>
            <div className="card-body">
              <ul className="mb-0">
                <li>구체적이고 명확한 제목을 작성해주세요.</li>
                <li>문제 상황을 자세히 설명해주세요.</li>
                <li>개인정보가 포함된 경우 비밀글로 설정해주세요.</li>
                <li>관련 스크린샷이나 파일이 있다면 내용에 설명을 포함해주세요.</li>
                <li>궁금한 점이 여러 개라면 번호를 매겨서 정리해주세요.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnAWrite;