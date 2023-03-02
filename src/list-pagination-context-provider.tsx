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
  setPagination: (pg: Pagination) => void;
  setNextPage: () => void;
  setFirstPage: () => void;
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
    const nextEnabled = totalPages != INITIAL_PAGE;
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
        previousEnabled: updatedPreviousEnabled,
        currentPage: updatedPage,
      },
    });
  },
  setFirstPage: () => {
    set({ pagination: { ...get().pagination, currentPage: INITIAL_PAGE, nextEnabled: true, previousEnabled: false } });
  },
}));

export interface ListContextProps {
  total: number;
  perPage: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination, pagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      ...pagination,
      pageSize: value.perPage,
      totalItems: value.total,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
