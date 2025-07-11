import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

interface Post {
  id: number;
  title: string;
  content: string;
  authorName: string;
  authorId: number;
  isSecret: boolean;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PostsResponse {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const QnABoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '10'
      });
      
      if (keyword.trim()) {
        params.append('keyword', keyword.trim());
      }
      
      const response = await api.get(`/board/qna?${params}`);
      const data: PostsResponse = response.data;
      
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      setError('게시글을 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPosts();
  };

  const handlePostClick = (postId: number) => {
    navigate(`/qna/${postId}`);
  };

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/qna/write');
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (currentPage > 0) {
      pages.push(
        <button
          key="prev"
          className="btn btn-outline-primary"
          onClick={() => handlePageChange(currentPage - 1)}
        >
          이전
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => handlePageChange(i)}
        >
          {i + 1}
        </button>
      );
    }

    if (currentPage < totalPages - 1) {
      pages.push(
        <button
          key="next"
          className="btn btn-outline-primary"
          onClick={() => handlePageChange(currentPage + 1)}
        >
          다음
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Q&A 게시판</h2>
            <button
              className="btn btn-primary"
              onClick={handleWriteClick}
            >
              <i className="bi bi-pencil-square me-2"></i>
              질문하기
            </button>
          </div>

          {/* 검색 폼 */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  <div className="col-md-10">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="제목 또는 내용으로 검색..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button type="submit" className="btn btn-outline-primary w-100">
                      <i className="bi bi-search me-2"></i>
                      검색
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* 게시글 목록 */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">로딩 중...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '60px' }}>번호</th>
                        <th scope="col">제목</th>
                        <th scope="col" style={{ width: '120px' }}>작성자</th>
                        <th scope="col" style={{ width: '80px' }}>조회수</th>
                        <th scope="col" style={{ width: '80px' }}>댓글</th>
                        <th scope="col" style={{ width: '120px' }}>작성일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            등록된 게시글이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => (
                          <tr
                            key={post.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handlePostClick(post.id)}
                          >
                            <td>{post.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2">{post.title}</span>
                                {post.isSecret && (
                                  <i className="bi bi-lock text-warning" title="비밀글"></i>
                                )}
                              </div>
                            </td>
                            <td>{post.authorName}</td>
                            <td>{post.viewCount}</td>
                            <td>
                              <span className="badge bg-secondary">{post.commentCount}</span>
                            </td>
                            <td>{formatDate(post.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <div className="btn-group" role="group">
                      {renderPagination()}
                    </div>
                  </div>
                )}

                {/* 통계 정보 */}
                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <small className="text-muted">
                    총 {totalElements}개의 게시글이 있습니다.
                  </small>
                  <small className="text-muted">
                    {currentPage + 1} / {totalPages} 페이지
                  </small>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QnABoard;