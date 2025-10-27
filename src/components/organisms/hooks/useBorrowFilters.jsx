import { useState, useRef, useCallback } from 'react';

export const useBorrowFilters = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'borrowedAt',
    sortOrder: 'desc',
    dateFrom: '',
    dateTo: '',
    status: 'all'
  });

  const timeoutRef = useRef(null);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: value,
        page: 1
      }));
    }, 500);
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  }, []);

  const handleDateFilter = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleSort = useCallback((field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1
    }));
  }, []);

  const clearFilters = useCallback(() => {
    // Clear any pending search timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setFilters({
      page: 1,
      limit: 10,
      status: 'all',
      search: '',
      sortBy: 'borrowedAt',
      sortOrder: 'desc',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  return {
    filters,
    handleSearch,
    handleStatusFilter,
    handleDateFilter,
    handlePageChange,
    handleSort,
    clearFilters
  };
};
