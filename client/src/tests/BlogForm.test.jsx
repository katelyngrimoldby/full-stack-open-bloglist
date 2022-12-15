import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from '../components/BlogForm';

describe('BlogForm Component', () => {
  const mockCreate = jest.fn();

  beforeEach(() => {
    render(<BlogForm createBlog={mockCreate} />);
  });

  test('Mock handler called with correct params', async () => {
    const newBlog = {
      title: 'Sample Title',
      author: 'Sample Author',
      url: 'samplesite.com'
    };

    const user = userEvent.setup();
    const toggleButton = screen.getByText('Show');
    await user.click(toggleButton);

    const titleInput = document.querySelector('#title');
    const authorInput = document.querySelector('#author');
    const urlInput = document.querySelector('#url');
    const submitButton = screen.getByText('Add');

    await user.type(titleInput, newBlog.title);
    await user.type(authorInput, newBlog.author);
    await user.type(urlInput, newBlog.url);
    await user.click(submitButton);

    expect(mockCreate.mock.calls).toHaveLength(1);
    expect(mockCreate.mock.calls[0][0]).toEqual(newBlog);
  });
});