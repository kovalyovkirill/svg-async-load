import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { Icon } from '@src/atoms/Icon';

const WAIT_TIMEOUT = 3000;

const options = { timeout: WAIT_TIMEOUT };

describe('Icon test', () => {
  it('should render data id', async () => {
    const { container } = render(<Icon name="close" id="newId" />);

    await waitFor(() => {
      const element = container.querySelector('[data-id="newId"]');
      expect(element).toBeInTheDocument();
    }, options);
  });
});
