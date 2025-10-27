import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import borrowService from '../../../services/borrowService';
import { toast } from 'react-toastify';

export const useBorrowData = (filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      let response;

      if (user.role !== 'admin') {
        response = await borrowService.getBorrowedUser(user._id);
      } else {
        response = await borrowService.getTransactions(filters);
      }

      setData(response.data.data);
      setStats(response.data.stats);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [fetchData]);

  return { data, loading, pagination, stats, isMobile, fetchData };
};
