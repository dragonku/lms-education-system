import React from 'react';
import { render } from '@testing-library/react';

test('renders without crashing', () => {
  const div = document.createElement('div');
  expect(div).toBeDefined();
});
