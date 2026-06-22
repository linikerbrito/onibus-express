import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface RenderWithProvidersOptions extends RenderOptions {
  initialEntries?: MemoryRouterProps['initialEntries'];
  wrapper?: ({ children }: { children: ReactNode }) => JSX.Element;
}

export function renderWithProviders(
  ui: ReactNode,
  options: RenderWithProvidersOptions = {},
) {
  const { wrapper: Wrapper, initialEntries, ...renderOptions } = options;
  const queryClient = new QueryClient();

  const content = Wrapper ? (
    <Wrapper>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </Wrapper>
  ) : (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  );

  return render(content, renderOptions);
}
