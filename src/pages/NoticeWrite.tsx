import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { boardApi } from '../services/api';
import { Post, PostRequest, BoardType, Authority } from '../types';
import { useAuth } from '../contexts/AuthContext';

const NoticeWrite: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<PostRequest>({
    title: '',
    content: '',
    boardType: BoardType.NOTICE,
    isNotice: false,
    isSecret: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.authorities?.includes(Authority.ADMIN);

  // 관리자가 아니면 접근 불가
  useEffect(() => {
    if (!isAdmin) {
      alert('접근 권한이 없습니다.');
      navigate('/board/notice');
      return;
    }
  }, [isAdmin, navigate]);

  // 수정 모드인 경우 기존 데이터 로드
  useEffect(() => {
    if (isEdit && id && isAdmin) {
      fetchPost();
    }
  }, [isEdit, id, isAdmin]);

  const fetchPost = async () => {
    try {
      setInitialLoading(true);
      if (!id) return;
      
      const post = await boardApi.getPost(BoardType.NOTICE, parseInt(id));
      setFormData({
        title: post.title,
        content: post.content,
        boardType: post.boardType,
        isNotice: post.isNotice,
        isSecret: post.isSecret
      });
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEdit && id) {
        await boardApi.updatePost(BoardType.NOTICE, parseInt(id), formData);
        alert('게시글이 수정되었습니다.');
        navigate(`/board/notice/${id}`);
      } else {
        const newPost = await boardApi.createPost(BoardType.NOTICE, formData);
        alert('게시글이 등록되었습니다.');
        navigate(`/board/notice/${newPost.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // 접근 권한 체크에서 리다이렉트됨
  }

  if (initialLoading) {
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
                {isEdit ? '글 수정' : '글 쓰기'}
              </li>
            </ol>
          </nav>

          {/* 페이지 헤더 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-pencil-square text-primary me-2"></i>
              {isEdit ? '공지사항 수정' : '공지사항 작성'}
            </h2>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* 작성 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="card">
              <div className="card-body">
                {/* 제목 */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    제목 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>

                {/* 옵션 */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isNotice"
                      name="isNotice"
                      checked={formData.isNotice}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isNotice">
                      <i className="bi bi-pin text-warning me-1"></i>
                      중요 공지사항으로 설정
                    </label>
                    <small className="form-text text-muted d-block">
                      체크하면 게시판 상단에 고정됩니다.
                    </small>
                  </div>
                </div>

                {/* 내용 */}
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    내용 <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="내용을 입력하세요"
                    required
                    style={{ resize: 'vertical' }}
                  />
                  <small className="form-text text-muted">
                    HTML 태그는 지원되지 않습니다. 텍스트로만 작성해주세요.
                  </small>
                </div>

                {/* 파일 첨부 (향후 구현) */}
                <div className="mb-3">
                  <label htmlFor="files" className="form-label">
                    파일 첨부
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="files"
                    multiple
                    disabled
                  />
                  <small className="form-text text-muted">
                    파일 첨부 기능은 곧 제공될 예정입니다.
                  </small>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="d-flex justify-content-between mt-4 mb-5">
              <Link to="/board/notice" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-1"></i>
                취소
              </Link>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    저장 중...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2 me-1"></i>
                    {isEdit ? '수정 완료' : '등록'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoticeWrite;