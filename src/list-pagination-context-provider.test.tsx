import * as React from 'react';
import expect from 'expect';
import { screen, render, fireEvent } from '@testing-library/react';
import ListPaginationContextProvider, { usePaginationContext } from './list-pagination-context-provider';

describe('ListPaginationContextProvider', () => {
  const NaiveList = () => {
    const { pagination, setNextPage, setPrevPage, setFirstPage } = usePaginationContext();

    return (
      <div>
        <span>{`currentPage: ${pagination.currentPage}`}</span>
        <span>{`totalPages: ${pagination.totalPages}`}</span>
        <span>{`pageSize: ${pagination.pageSize}`}</span>
        {
          <button disabled={!pagination.nextEnabled} onClick={setNextPage}>
            view more
          </button>
        }
        {
          <button disabled={!pagination.previousEnabled} onClick={setPrevPage}>
            back
          </button>
        }
        {
          <button disabled={!pagination.previousEnabled} onClick={setFirstPage}>
            To first page
          </button>
        }
      </div>
    );
  };
  const getScreen = (total: number, perPage: number) =>
    render(
      <ListPaginationContextProvider
        value={{
          total: total,
          perPage: perPage,
        }}
      >
        <NaiveList />
      </ListPaginationContextProvider>,
    );
  it('should return currentPage, totalPages, pageSize and view more button', () => {
    getScreen(4, 2);

    expect(screen.getByText('currentPage: 1')).not.toBeNull();
    expect(screen.getByText('totalPages: 2')).not.toBeNull();
    expect(screen.getByText('pageSize: 2')).not.toBeNull();
    expect(screen.getByText('view more')).not.toBeNull();
  });

  describe('the Pagination Component for first page and last page edge cases ', () => {
    it('should go back to first page when clicking "back" on first page', () => {
      const { getByText } = getScreen(8, 4);
      fireEvent.click(getByText('back'));
      expect(screen.getByText('currentPage: 1')).not.toBeNull();
    });
    it('should go to last page when clicking "view more" multiple times', () => {
      const { getByText } = getScreen(8, 4);
      fireEvent.click(getByText('view more'));
      fireEvent.click(getByText('view more'));
      expect(screen.getByText('currentPage: 2')).not.toBeNull();
    });
  });

  describe('setNextPage', () => {
    it('should return currentPage, totalPages, pageSize and view more button when view more button is clicked', () => {
      const { getByText, getByRole } = getScreen(4, 2);
      const nextBtn = getByRole('button', { name: /view more/i });
      fireEvent.click(getByText('view more'));

      expect(getByText('currentPage: 2')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
      expect(nextBtn.disabled).toBeTruthy();
    });

    it('Should render the `Back` button when clicking on the `view more` button', () => {
      const { getByText } = getScreen(4, 2);

      fireEvent.click(getByText('view more'));
      fireEvent.click(getByText('back'));

      expect(getByText('currentPage: 1')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
    });
  });
  describe('setPrevPage', () => {
    it('should render `back` button', () => {
      const { getByText } = getScreen(4, 2);

      fireEvent.click(getByText('view more'));
      fireEvent.click(getByText('back'));

      expect(getByText('currentPage: 1')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
    });
  });

  describe('setFirstPage', () => {
    it('Should render a view more button when totalPage is not equal to `INITIAL_PAGE`', () => {
      getScreen(4, 2);

      fireEvent.click(screen.getByText('view more'));
      fireEvent.click(screen.getByText('To first page'));

      expect(screen.getByText('currentPage: 1')).not.toBeNull();
      expect(screen.queryByText('totalPages: 2')).not.toBeNull();
    });
  });

  describe('setPagination validation', () => {
    it('Should return an error message when Total and perPage are negative', () => {
      expect(() => getScreen(-1, -2)).toThrow(
        'The total items and page size must be positive numbers. Please try again.',
      );
    });

    it('Should return an error message when total and perpage exceed the maximum value of an integer', () => {
      expect(() => getScreen(Number.MAX_SAFE_INTEGER + 1, Number.MAX_SAFE_INTEGER + 1)).toThrow(
        'The number of items exceeds the maximum safe integer value. Please reduce the number of items and try again',
      );
    });
  });
});
