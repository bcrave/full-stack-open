import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  test('renders title and author, but not url or number of likes', () => {
    const blog = {
      title: 'How to test with react-testing-library',
      author: 'Brendon Crave',
      url: 'https://www.craveweb.dev',
    };

    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector('[data-blog]');

    expect(div).toHaveTextContent('How to test with react-testing-library');

    const url = screen.queryByText('https://www.craveweb.dev');
    expect(url).toBeNull();
  });

  test('URL and number of likes display after button is clicked', async () => {
    const blog = {
      title: 'How to test with react-testing-library',
      likes: 0,
    };

    let url, numOfLikes;

    render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const detailsButton = screen.getByText('Show details');

    url = screen.queryByTestId('blog-url');
    numOfLikes = screen.queryByTestId('blog-likes');

    expect(url).toBeNull();
    expect(numOfLikes).toBeNull();

    await user.click(detailsButton);

    url = screen.getByTestId('blog-url');
    numOfLikes = screen.getByTestId('blog-likes');

    expect(numOfLikes).toBeDefined();
    expect(url).toBeDefined();
  });

  test('clicking the button calls event handler once', async () => {
    const blog = {
      title: 'How to test with react-testing-library',
      likes: 0,
    };

    const mockHandler = jest.fn();

    render(<Blog blog={blog} addLike={mockHandler} />);

    const user = userEvent.setup();
    const detailsButton = screen.getByText('Show details');

    await user.click(detailsButton);

    const likeButton = screen.getByTestId('like-button');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
