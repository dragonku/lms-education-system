import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { boardApi } from '../services/api';
import { Post, PostListResponse, BoardType, Authority } from '../types';
import { useAuth } from '../contexts/AuthContext';

const NoticeBoard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [notices, setNotices] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.authorities?.includes(Authority.ADMIN);

  useEffect(() => {
    fetchPosts();
    fetchNotices();
  }, [currentPage, searchKeyword]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PostListResponse = await boardApi.getNoticePosts({
        page: currentPage,
        size: 10,
        keyword: searchKeyword || undefined
      });
      
      setPosts(response.posts || []);
      setTotalPages(response.totalPages || 0);
    } catch (err: any) {
      console.error('Error fetching notice posts:', err);
      // 404 에러나 빈 결과는 에러로 처리하지 않음
      if (err.response?.status === 404 || err.response?.status === 204) {
        setPosts([]);
        setTotalPages(0);
      } else {
        setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotices = async () => {
    try {
      const noticeList = await boardApi.getNotices(BoardType.NOTICE);
      setNotices(noticeList);
    } catch (err) {
      console.error('공지사항을 불러오는데 실패했습니다:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-megaphone-fill text-primary me-2"></i>
              공지사항
            </h2>
            {isAdmin && (
              <Link to="/board/notice/write" className="btn btn-primary">
                <i className="bi bi-pencil-square me-1"></i>
                글쓰기
              </Link>
            )}
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* 검색 폼 */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSearch} className="row g-3">
                <div className="col-md-10 col-12 mb-2 mb-md-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="제목이나 내용으로 검색..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className="col-md-2 col-12">
                  <button type="submit" className="btn btn-outline-primary w-100">
                    <i className="bi bi-search me-1"></i>
                    검색
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* 중요 공지사항 */}
          {notices.length > 0 && (
            <div className="card mb-4 border-warning">
              <div className="card-header bg-warning bg-opacity-10">
                <h5 className="card-title mb-0">
                  <i className="bi bi-pin-fill text-warning me-2"></i>
                  중요 공지
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {notices.map((notice) => (
                    <Link
                      key={notice.id}
                      to={`/board/notice/${notice.id}`}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{notice.title}</strong>
                        <small className="text-muted ms-2">
                          by {notice.authorName}
                        </small>
                      </div>
                      <small className="text-muted">
                        {formatDate(notice.createdAt)}
                      </small>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 게시글 목록 */}
          <div className="card">
            <div className="card-body p-0">
              {posts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <p className="text-muted mt-3">등록된 공지사항이 없습니다.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '60px' }}>번호</th>
                        <th>제목</th>
                        <th style={{ width: '120px' }}>작성자</th>
                        <th style={{ width: '100px' }}>조회수</th>
                        <th style={{ width: '120px' }}>작성일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post, index) => (
                        <tr key={post.id}>
                          <td className="text-center">
                            {totalPages * 10 - (currentPage * 10) - index}
                          </td>
                          <td>
                            <Link
                              to={`/board/notice/${post.id}`}
                              className="text-decoration-none"
                            >
                              {post.title}
                              {post.commentCount > 0 && (
                                <span className="badge bg-secondary ms-2">
                                  {post.commentCount}
                                </span>
                              )}
                              {post.attachments && post.attachments.length > 0 && (
                                <i className="bi bi-paperclip ms-1 text-muted"></i>
                              )}
                            </Link>
                          </td>
                          <td>{post.authorName}</td>
                          <td className="text-center">{post.viewCount}</td>
                          <td className="text-center">
                            {formatDate(post.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    이전
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                  >
                    다음
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;