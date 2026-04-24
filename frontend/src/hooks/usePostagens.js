import { useState, useEffect } from 'react';
import { listarPostagens } from '../services/postagensService';

const usePostagens = () => {
  const [postagens, setPostagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        setLoading(true);
        const data = await listarPostagens();
        // Ordena por data de publicação decrescente (mais recentes primeiro)
        const sorted = Array.isArray(data) ? [...data].sort((a, b) => 
          new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
        ) : [];
        setPostagens(sorted);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar postagens:', err);
        setError(err.message);
        setPostagens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPostagens();
  }, []);

  return { postagens, loading, error };
};

export default usePostagens;
