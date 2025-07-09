import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserType } from '../types';
import { adminApi } from '../services/api';

const AdminUsers: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock 사용자 데이터
  const mockUsers: User[] = [
    {
      id: 1,
      email: 'admin@lms.com',
      name: '관리자',
      phoneNumber: '010-1234-5678',
      userType: UserType.ADMIN,
      status: 'ACTIVE',
      authorities: ['ADMIN', 'USER'],
      createdAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      email: 'employee@test.com',
      name: '김재직',
      phoneNumber: '010-2345-6789',
      userType: UserType.EMPLOYEE,
      status: 'ACTIVE',
      authorities: ['USER'],
      createdAt: '2025-01-05T00:00:00Z'
    },
    {
      id: 3,
      email: 'jobseeker@test.com',
      name: '이구직',
      phoneNumber: '010-3456-7890',
      userType: UserType.JOB_SEEKER,
      status: 'PENDING',
      authorities: ['USER'],
      createdAt: '2025-01-10T00:00:00Z'
    },
    {
      id: 4,
      email: 'company@test.com',
      name: '박협약',
      phoneNumber: '010-4567-8901',
      userType: UserType.COMPANY,
      status: 'PENDING',
      authorities: ['COMPANY', 'USER'],
      companyName: '테스트협약사',
      createdAt: '2025-01-15T00:00:00Z'
    },
    {
      id: 5,
      email: 'newuser@test.com',
      name: '신규회원',
      phoneNumber: '010-5678-9012',
      userType: UserType.EMPLOYEE,
      status: 'PENDING',
      authorities: ['USER'],
      createdAt: '2025-01-20T00:00:00Z'
    }
  ];

  useEffect(() => {
    if (user?.userType === 'ADMIN') {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await adminApi.getAllUsers();
      setUsers(result);
    } catch (error) {
      console.error('Failed to load users:', error);
      // Fallback to mock data if API fails
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      await adminApi.approveUser(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'ACTIVE' } : u
      ));
      alert('사용자가 승인되었습니다.');
    } catch (error) {
      alert('승인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (userId: number) => {
    if (!window.confirm('정말로 이 사용자를 거절하시겠습니까?')) {
      return;
    }
    
    try {
      await adminApi.rejectUser(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'REJECTED' } : u
      ));
      alert('사용자가 거절되었습니다.');
    } catch (error) {
      alert('거절 처리 중 오류가 발생했습니다.');
    }
  };

  const handleSuspend = async (userId: number) => {
    if (!window.confirm('정말로 이 사용자를 정지하시겠습니까?')) {
      return;
    }
    
    try {
      await adminApi.suspendUser(userId);
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'SUSPENDED' } : u
      ));
      alert('사용자가 정지되었습니다.');
    } catch (error) {
      alert('정지 처리 중 오류가 발생했습니다.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>활성</span>;
      case 'PENDING':
        return <span className="badge bg-warning"><i className="bi bi-hourglass-split me-1"></i>대기</span>;
      case 'REJECTED':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>거절</span>;
      case 'SUSPENDED':
        return <span className="badge bg-secondary"><i className="bi bi-pause-circle me-1"></i>정지</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getUserTypeLabel = (userType: UserType) => {
    switch (userType) {
      case UserType.ADMIN:
        return <span className="badge bg-primary">관리자</span>;
      case UserType.EMPLOYEE:
        return <span className="badge bg-info">재직자</span>;
      case UserType.JOB_SEEKER:
        return <span className="badge bg-success">구직자</span>;
      case UserType.COMPANY:
        return <span className="badge bg-warning">협약사</span>;
      default:
        return <span className="badge bg-secondary">{userType}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (user?.userType !== 'ADMIN') {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-shield-exclamation me-2"></i>
          관리자 권한이 필요합니다.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
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
            <h1>
              <i className="bi bi-person-gear me-2"></i>
              회원 관리
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/admin">관리자</a></li>
                <li className="breadcrumb-item active">회원 관리</li>
              </ol>
            </nav>
          </div>

          {/* 필터 및 검색 */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-funnel"></i></span>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">전체 상태</option>
                  <option value="ACTIVE">활성</option>
                  <option value="PENDING">승인 대기</option>
                  <option value="REJECTED">거절</option>
                  <option value="SUSPENDED">정지</option>
                </select>
              </div>
            </div>
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-primary">{users.length}</h4>
                  <p className="text-muted mb-0">전체 회원</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-success">{users.filter(u => u.status === 'ACTIVE').length}</h4>
                  <p className="text-muted mb-0">활성 회원</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-warning">{users.filter(u => u.status === 'PENDING').length}</h4>
                  <p className="text-muted mb-0">승인 대기</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h4 className="text-info">{users.filter(u => u.userType === UserType.COMPANY).length}</h4>
                  <p className="text-muted mb-0">협약사</p>
                </div>
              </div>
            </div>
          </div>

          {/* 회원 목록 */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>이메일</th>
                      <th>전화번호</th>
                      <th>유형</th>
                      <th>상태</th>
                      <th>가입일</th>
                      <th>협약사</th>
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2"></i>
                            {user.name}
                          </div>
                        </td>
                        <td>
                          <i className="bi bi-envelope me-2"></i>
                          {user.email}
                        </td>
                        <td>
                          <i className="bi bi-telephone me-2"></i>
                          {user.phoneNumber}
                        </td>
                        <td>{getUserTypeLabel(user.userType)}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td>{formatDate(user.createdAt || '')}</td>
                        <td>
                          {user.companyName ? (
                            <span className="badge bg-info">
                              <i className="bi bi-building me-1"></i>
                              {user.companyName}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {user.status === 'PENDING' && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleApprove(user.id)}
                                  title="승인"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleReject(user.id)}
                                  title="거절"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              </>
                            )}
                            {user.status === 'ACTIVE' && user.userType !== UserType.ADMIN && (
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleSuspend(user.id)}
                                title="정지"
                              >
                                <i className="bi bi-pause-circle"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-search fs-1 text-muted"></i>
                  <p className="text-muted mt-2">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;