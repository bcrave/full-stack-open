import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormBlog from './FormBlog';
import Blog from './Blog';
import userEvent from '@testing-library/user-event';

describe('<FormBlog />', () => {
  test('updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn();
    const user = userEvent.setup();

    render(<FormBlog createBlog={createBlog} />);

    const titleInput = screen.getByTestId('titleInput');
    const authorInput = screen.getByTestId('authorInput');
    const urlInput = screen.getByTestId('urlInput');

    const sendButton = screen.getByTestId('blogFormSubmit');

    await user.type(titleInput, 'test title');
    await user.type(authorInput, 'test author');
    await user.type(urlInput, 'test url');
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('test title');
    expect(createBlog.mock.calls[0][0].author).toBe('test author');
    expect(createBlog.mock.calls[0][0].url).toBe('test url');
  });

  test('renders content', () => {
    const blog = {
      title: 'test title',
      author: 'test author',
      url: 'test url',
    };

    render(<Blog blog={blog} />);

    const element = screen.getByText('test title', { exact: false });

    expect(element).toBeDefined();
  });
});
