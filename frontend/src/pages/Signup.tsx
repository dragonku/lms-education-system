import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { SignupRequest, UserType } from '../types';

const SignupContainer = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 600px) {
    max-width: 90%;
    margin: 1rem auto;
    padding: 1.5rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #229954;
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const UserTypeInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #495057;
  }
`;

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupRequest>({
    email: '',
    password: '',
    name: '',
    phoneNumber: '',
    userType: UserType.EMPLOYEE,
    companyName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const message = await signup(formData);
      setSuccess(message);
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case UserType.EMPLOYEE:
        return '재직자';
      case UserType.JOB_SEEKER:
        return '구직자';
      case UserType.COMPANY:
        return '협약사';
      case UserType.ADMIN:
        return '관리자';
      default:
        return type;
    }
  };

  return (
    <SignupContainer>
      <Title>회원가입</Title>
      
      <UserTypeInfo>
        <h4>📋 사용자 유형별 안내</h4>
        <p><strong>재직자:</strong> 현재 직장에 근무 중인 분</p>
        <p><strong>구직자:</strong> 취업 준비 중인 분</p>
        <p><strong>협약사:</strong> 교육 협약을 맺은 기업</p>
      </UserTypeInfo>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="userType">사용자 유형</Label>
          <Select
            id="userType"
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            required
          >
            <option value={UserType.EMPLOYEE}>{getUserTypeLabel(UserType.EMPLOYEE)}</option>
            <option value={UserType.JOB_SEEKER}>{getUserTypeLabel(UserType.JOB_SEEKER)}</option>
            <option value={UserType.COMPANY}>{getUserTypeLabel(UserType.COMPANY)}</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">이메일</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">비밀번호 (최소 8자)</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="name">이름</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="phoneNumber">연락처</Label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="010-1234-5678"
            required
          />
        </FormGroup>
        
        {formData.userType === UserType.COMPANY && (
          <FormGroup>
            <Label htmlFor="companyName">회사명</Label>
            <Input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required={formData.userType === UserType.COMPANY}
            />
          </FormGroup>
        )}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </Button>
      </Form>
      
      <LinkContainer>
        <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </LinkContainer>
    </SignupContainer>
  );
};

export default Signup;