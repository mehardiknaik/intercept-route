import style from './MovieCard.module.css';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface Props {
  movie: Movie;
  onClick: () => void;
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';

const MovieCard = ({ movie, onClick }: Props) => {
  return (
    <div className={style.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={style.posterWrap}>
        <img
          className={style.poster}
          src={`${TMDB_IMG}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
        <span className={style.rating}>★ {movie.vote_average.toFixed(1)}</span>
      </div>
      <div className={style.body}>
        <p className={style.title}>{movie.title ?? 'Title'}</p>
        <p className={style.year}>{movie.release_date.slice(0, 4)}</p>
      </div>
    </div>
  );
};

export default MovieCard;
