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

  describe('setNextPage', () => {
    it('should return currentPage, totalPages, pageSize and view more button when view more button is clicked', () => {
      const { getByText, queryByText } = getScreen(4, 2);

      fireEvent.click(getByText('view more'));

      expect(getByText('currentPage: 2')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
      expect(queryByText('view more')).toBeNull();
    });
    // TODO
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
    it('should still render the `view more` button when clicking on the `back` button from the last page.', () => {
      const { getByText } = getScreen(4, 2);

      fireEvent.click(getByText('view more'));
      fireEvent.click(getByText('back'));
      fireEvent.click(getByText('view more'));

      expect(getByText('currentPage: 2')).not.toBeNull();
      expect(getByText('totalPages: 2')).not.toBeNull();
      expect(getByText('pageSize: 2')).not.toBeNull();
    });
  });

  // TODO
  describe('setFirstPage', () => {});

  // TODO
  describe('setPagination validation', () => {
    // TODO
    it('Total < 0 ', () => {
      getScreen(-1, 2);

      expect(screen.getByText('currentPage: 1')).not.toBeNull();
      expect(screen.getByText('totalPages: 2')).not.toBeNull();
      expect(screen.getByText('pageSize: 2')).not.toBeNull();
      expect(screen.getByText('view more')).not.toBeNull();
    });
    // TODO
    it('when Total | perPage is an invalid number', () => {});
  });
});
