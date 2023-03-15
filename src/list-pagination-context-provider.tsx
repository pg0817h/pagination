import React from 'react';
import { create } from 'zustand';

type PaginationState = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
};

type PaginationMeta = {
  totalPages: number;
  previousEnabled: boolean;
  nextEnabled: boolean;
};

type Pagination = PaginationState & PaginationMeta;
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize'>;
const INITIAL_PAGE = 1;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: PaginationArgs) => void;
  setNextPage: () => void;
  setFirstPage: () => void;
  setPrevPage: () => void;
}>((set, get) => ({
  pagination: {
    totalPages: 0,
    pageSize: 0,
    currentPage: INITIAL_PAGE,
    nextEnabled: false,
    previousEnabled: false,
    totalItems: 0,
  },
  setPagination: (args: PaginationArgs) => {
    const totalPages = Math.ceil(args.totalItems / args.pageSize);
    const nextEnabled = totalPages !== INITIAL_PAGE;
    set({
      pagination: {
        ...args,
        totalPages: totalPages,
        nextEnabled: nextEnabled,
        currentPage: INITIAL_PAGE,
        previousEnabled: false,
      },
    });
  },
  setNextPage: () => {
    const { nextEnabled, currentPage, totalPages, ...props } = get().pagination;
    const updatedPage = nextEnabled ? currentPage + 1 : currentPage;
    const updatedNextEnabled = updatedPage !== totalPages;

    set({
      pagination: {
        ...props,
        totalPages: totalPages,
        previousEnabled: true,
        nextEnabled: updatedNextEnabled,
        currentPage: updatedPage,
      },
    });
  },
  setPrevPage: () => {
    const { previousEnabled, currentPage, ...props } = get().pagination;
    const updatedPage = previousEnabled ? currentPage - 1 : currentPage;
    const updatedPreviousEnabled = updatedPage !== INITIAL_PAGE;
    set({
      pagination: {
        ...props,
        nextEnabled: true,
        previousEnabled: updatedPreviousEnabled,
        currentPage: updatedPage,
      },
    });
  },
  setFirstPage: () => {
    const totalPages = get().pagination.totalPages;
    set({
      pagination: {
        ...get().pagination,
        currentPage: INITIAL_PAGE,
        nextEnabled: totalPages !== INITIAL_PAGE,
        previousEnabled: false,
      },
    });
  },
}));

export interface ListContextProps {
  total: number;
  perPage: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination } = usePaginationContext();
  React.useEffect(() => {
    if (value.total <= 0 || value.perPage <= 0) {
      throw new Error('The total items and page size must be positive numbers. Please try again.');
    } else if (value.total >= Number.MAX_SAFE_INTEGER || value.perPage >= Number.MAX_SAFE_INTEGER) {
      throw new Error('The number of items exceeds the maximum safe integer value. Please reduce the number of items and try again.');
    } else {
      setPagination({
        pageSize: value.perPage,
        totalItems: value.total,
      });
    }
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
