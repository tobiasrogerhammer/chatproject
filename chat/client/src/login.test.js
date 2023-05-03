import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Login from './pages/login';

// Mock axios post request
jest.mock('axios');
axios.post.mockResolvedValue({ data: { exists: false }, status: 200 });

// Mock bcrypt functions
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('fakeSalt'),
  hash: jest.fn().mockResolvedValue('fakeHash'),
}));

describe('Login', () => {
  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByLabelText('Username:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Join Chat Rooms:')).toBeInTheDocument();
    expect(screen.getByText('Chat 1')).toBeInTheDocument();
    expect(screen.getByText('Chat 2')).toBeInTheDocument();
    expect(screen.getByText('Chat 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByLabelText('Chat 1'));
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5000/user/create',
      {
        username: 'testuser',
        mailadress: 'testuser@example.com',
        password: 'fakeHash',
        selectedChats: ['chat1'],
      },
      { withCredentials: true }
    );
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 'fakeSalt');
    expect(window.location.href).toEqual('/chat');
  });

  it('shows an error message for existing username or email', async () => {
    axios.post.mockResolvedValueOnce({ data: { exists: true } });
    render(<Login />);
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'existinguser' } });
    fireEvent.change(screen.getByLabelText('Email:'), { target: { value: 'existinguser@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    await waitFor(() => expect(axios.post).toHaveBeenCalled());
    expect(screen.getByText('Username or email already taken')).toBeInTheDocument();
    expect(window.location.href).not.toEqual('/chat');
  });
});
