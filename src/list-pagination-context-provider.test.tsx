import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = () => {
    const { pagination, setNextPage, setPrevPage } = usePaginationContext();

    return (
      <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {pagination.nextEnabled && <button onClick={setNextPage}>view more</button>}
        {pagination.previousEnabled && <button onClick={setPrevPage}>back</button>}
      </div>
    );
  };

  it('should return currentPage, totalPages, pageSize and view more button', () => {
    render(
      <ListPaginationContextProvider
        value={{
          total: 4,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(screen.getByText('currentPage: 1')).not.toBeNull();
    expect(screen.getByText('totalPages: 2')).not.toBeNull();
    expect(screen.getByText('pageSize: 2')).not.toBeNull();
    expect(screen.getByText('view more')).not.toBeNull();
  });

  it('', () => {
    render(
      <ListPaginationContextProvider
        value={{
          total: -1,
          perPage: 2,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );

    expect(screen.getByText('currentPage: 1')).not.toBeNull();
    expect(screen.getByText('totalPages: 2')).not.toBeNull();
    expect(screen.getByText('pageSize: 2')).not.toBeNull();
    expect(screen.getByText('view more')).not.toBeNull();
  });

  describe('setNextPage', () => {
    const getScreen = () =>
      render(
        <ListPaginationContextProvider
          value={{
            total: 4,
            perPage: 2,
          }}
        >
          <NaiveList />
        </ListPaginationContextProvider>,
      );

    it('should return currentPage, totalPages, pageSize and view more button when view more button is clicked', () => {
      const { getByText, queryByText } = getScreen();

      fireEvent.click(getByText('view more'));

      expect(getByText('currentPage: 2')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
      expect(queryByText('view more')).toBeNull();
    });

    it('should render `back` button', () => {
      const { getByText } = getScreen();

      fireEvent.click(getByText('view more'));
      fireEvent.click(getByText('back'));

      expect(getByText('currentPage: 1')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
    });
  });
});
