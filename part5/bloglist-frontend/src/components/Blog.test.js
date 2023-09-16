import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  test('renders content', () => {
    const blog = {
      title: 'How to test with react-testing-library',
    };

    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector('[data-blog]');

    expect(div).toHaveTextContent('How to test with react-testing-library');
  });

  test('clicking the button calls event handler once', async () => {
    const blog = {
      title: 'How to test with react-testing-library',
      likes: 0,
    }

    const mockHandler = jest.fn();

    render(<Blog blog={blog} addLike={mockHandler} />);

    const user = userEvent.setup();
    const detailsButton = screen.getByText('Show details');

    await user.click(detailsButton);

    const likeButton = screen.getByTestId('like-button');
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
  });
})
