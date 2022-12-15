import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../components/Blog';

describe('Blog component', () => {
  const blog = {
    title: 'Sample Title',
    author: 'Sample Author',
    url: 'samplesite.com',
    likes: 0,
    id: 'fakeId',
    user: {
      id: 'fakeUserId',
      name: 'Sample User',
      username: 'sampleuser'
    }
  };
  const user = {
    name: 'Sample User',
    username: 'sampleuser'
  };

  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  beforeEach(() => {
    render(<Blog blog={blog} user={user} updateBlog={mockUpdate} deleteBlog={mockDelete} />);
  });

  test('Renders only title and author', () => {
    const div = document.querySelector('.toggleable');

    expect(div).not.toBeInTheDocument();
  });

  test('Renders extra details on button click', async () => {
    const user = userEvent.setup();
    const button = document.querySelector('.toggleButton');

    await user.click(button);

    const div = document.querySelector('.toggleable');
    expect(div).toBeInTheDocument();
  });

  test('Calls update handler twice for two clicks to button', async () => {
    const user = userEvent.setup();
    const toggleButton = document.querySelector('.toggleButton');

    await user.click(toggleButton);

    const updateButton = screen.getByText('Like');

    await user.click(updateButton);
    await user.click(updateButton);

    expect(mockUpdate.mock.calls).toHaveLength(2);
  });
});



