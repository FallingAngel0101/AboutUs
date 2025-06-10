import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <header>
      {/* другие элементы */}
      <button onClick={handleLogout}>Выйти</button>
    </header>
  );
};
