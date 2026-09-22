import { data } from '../../data';
import MovieCard from '../../components/MovieCard';
import { useNavigateInterception } from '../../components/Interception';
import style from './HomePage.module.css';
import useIsMobile from '../../hooks/useIsMobile';

const HomePage = () => {
  const navigate = useNavigateInterception();
  const isMobile = useIsMobile();

  const handleCardClick = (id: number) => {
    // Navigate with intercept=true to show modal overlay
    navigate(`/movie/${id}`, {
      intercept: !isMobile
    });
  };

  return (
    <div className={style.page}>
      <h1 className={style.heading}>Now Trending</h1>
      <div className={style.grid}>
        {data.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => handleCardClick(movie.id)} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
