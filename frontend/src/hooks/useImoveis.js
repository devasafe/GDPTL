import { useEffect, useState } from 'react';
import { listarImoveis } from '../services/imoveisService';

const mockImoveis = [
  {
    _id: '1',
    slug: 'cobertura-vista-mar',
    titulo: 'Cobertura Vista Mar',
    tipo: 'Cobertura',
    cidade: 'Fortaleza',
    bairro: 'Meireles',
    preco: 1850000,
    area: 210,
    quartos: 3,
    vagas: 3,
    banheiros: 4,
    descricao: 'Cobertura frente mar com piscina privativa e lazer completo.',
    destaque: true,
    status: 'ativo',
    capa: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  },
  {
    _id: '2',
    slug: 'casa-condominio-fechado',
    titulo: 'Casa em condomínio fechado',
    tipo: 'Casa',
    cidade: 'Fortaleza',
    bairro: 'Sapiranga',
    preco: 950000,
    area: 180,
    quartos: 4,
    vagas: 2,
    banheiros: 4,
    descricao: 'Casa com jardim, espaço gourmet e segurança 24h.',
    destaque: false,
    status: 'ativo',
    capa: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
  },
];

const useImoveis = () => {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await listarImoveis();
        setImoveis(data || mockImoveis);
      } catch (err) {
        setError(true);
        setImoveis(mockImoveis);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { imoveis, loading, error };
};

export default useImoveis;
