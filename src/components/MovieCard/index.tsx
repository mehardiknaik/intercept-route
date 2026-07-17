import { useRef, useState } from 'react';
import style from './MovieCard.module.css';
import { usePageContext } from '../../context/pageContext';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count?: number;
  release_date: string;
  overview?: string;
  original_language?: string;
  adult?: boolean;
}

interface Props {
  movie: Movie;
  onClick: () => void;
}

const TMDB_IMG = 'https://image.tmdb.org/t/p/w342';
const HOVER_TIME = 1200;

const MovieCard = ({ movie, onClick }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [popupPositionX, setPopupPositionX] = useState<'center' | 'leftEdge' | 'rightEdge'>(
    'center'
  );
  const [popupPositionY, setPopupPositionY] = useState<'centerY' | 'topEdgeY' | 'bottomEdgeY'>(
    'centerY'
  );
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeRef = useRef<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { pageRef } = usePageContext();

  const handleMouseEnter = () => {
    if (leaveTimeRef.current) {
      clearTimeout(leaveTimeRef.current);
      leaveTimeRef.current = null;
    }

    timeRef.current = setTimeout(() => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const pageRect = pageRef?.current?.getBoundingClientRect();
        const pageLeft = pageRect?.left ?? 0;
        const pageRight = pageRect?.right ?? window.innerWidth;

        // Increase threshold to 45% of card width to account for page padding and wider popup
        if (rect.left - pageLeft < rect.width * 0.45) {
          setPopupPositionX('leftEdge');
        } else if (pageRight - rect.right < rect.width * 0.45) {
          setPopupPositionX('rightEdge');
        } else {
          setPopupPositionX('center');
        }

        const windowHeight = window.innerHeight;
        // Check if close to top or bottom of the screen to adjust Y position
        if (rect.top < rect.height * 0.5) {
          setPopupPositionY('topEdgeY');
        } else if (windowHeight - rect.bottom < rect.height * 0.5) {
          setPopupPositionY('bottomEdgeY');
        } else {
          setPopupPositionY('centerY');
        }
      }
      setIsRendered(true);
      // Use setTimeout to ensure DOM is updated before applying transition class
      setTimeout(() => setIsHovered(true), 10);
    }, HOVER_TIME);
  };

  const handleMouseLeave = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
    setIsHovered(false);

    // Wait for the exit animation (400ms) before unmounting
    leaveTimeRef.current = setTimeout(() => {
      setIsRendered(false);
    }, 400);
  };

  return (
    <div
      ref={cardRef}
      className={style.cardContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
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

      {isRendered && (
        <div
          className={`${style.hoverPopup} ${style[popupPositionX]} ${style[popupPositionY]} ${isHovered ? style.hoverPopupVisible : style.hoverPopupHidden}`}
          style={{
            transformOrigin: `${popupPositionX === 'center' ? 'center' : popupPositionX === 'leftEdge' ? 'left' : 'right'} ${popupPositionY === 'centerY' ? 'center' : popupPositionY === 'topEdgeY' ? 'top' : 'bottom'}`
          }}
          onClick={onClick}>
          <div className={style.popupPosterWrap}>
            <img
              className={style.popupPoster}
              src={`${TMDB_IMG}${movie.backdrop_path ?? movie.poster_path}`}
              alt={movie.title}
              loading="lazy"
            />
          </div>
          <div className={style.popupBody}>
            <h3 className={style.popupTitle}>{movie.title}</h3>
            <div className={style.popupMeta}>
              <span className={style.popupRating}>★ {movie.vote_average.toFixed(1)}</span>
              {movie.vote_count !== undefined && (
                <span className={style.voteCount}>({movie.vote_count})</span>
              )}
              <span>{movie.release_date.slice(0, 4)}</span>
              {movie.original_language && (
                <span className={style.langBadge}>{movie.original_language.toUpperCase()}</span>
              )}
              {movie.adult && <span className={style.adultBadge}>18+</span>}
            </div>
            {movie.overview && <p className={style.popupOverview}>{movie.overview}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
