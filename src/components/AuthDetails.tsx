import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthDetailsContainer = styled.div`
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
`;

const UserInfo = styled.div`
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const AuthLinks = styled.div`
  a {
    margin: 0 0.5rem;
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AuthDetails: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <AuthDetailsContainer>
      {currentUser ? (
        <UserInfo>
          <p>Logged in as: {currentUser.email}</p>
          <Button onClick={logout}>Logout</Button>
        </UserInfo>
      ) : (
        <AuthLinks>
          <p>You are not logged in.</p>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </AuthLinks>
      )}
    </AuthDetailsContainer>
  );
};

export default AuthDetails;
