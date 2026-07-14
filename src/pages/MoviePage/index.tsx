import { useParams } from 'react-router';
import { data } from '../../data';
import MovieCard from '../../components/MovieCard';
import style from './MoviePage.module.css';
import { useNavigateInterception } from '../../context/useNavigateInterception';
import { useEffect, useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';

const TMDB_IMG = 'https://image.tmdb.org/t/p';

const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  18: 'Drama',
  14: 'Fantasy',
  27: 'Horror',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10751: 'Family',
  9648: 'Mystery',
  10402: 'Music'
};

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigateInterception();
  const movie = data.find((m) => m.id === Number(id));
  const isMobile = useIsMobile();

  const [loadedMovieId, setLoadedMovieId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!movie) {
      return () => {
        mounted = false;
      };
    }

    const poster = `${TMDB_IMG}/w342${movie.poster_path}`;
    const backdrop = `${TMDB_IMG}/original${movie.backdrop_path}`;

    Promise.allSettled([
      preloadImage(poster),
      preloadImage(backdrop),
      new Promise((resolve) => setTimeout(resolve, 350))
    ]).then(() => {
      if (mounted) {
        setLoadedMovieId(movie.id);
      }
    });

    return () => {
      mounted = false;
    };
  }, [movie]);

  const isLoading = Boolean(movie) && loadedMovieId !== movie?.id;

  if (!movie) {
    return (
      <div className={style.notFound}>
        <p>Movie not found.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  if (isLoading) return <SkeletonMoviePage />;

  const demoFields: Array<{ label: string; value: string }> = [
    { label: 'Movie ID', value: String(movie.id) },
    { label: 'Original Title', value: movie.original_title },
    { label: 'Runtime', value: `${95 + (movie.id % 55)} min` },
    { label: 'Budget', value: `$${Math.round(movie.popularity * 1200000).toLocaleString()}` },
    { label: 'Revenue', value: `$${Math.round(movie.popularity * 4500000).toLocaleString()}` },
    { label: 'Status', value: movie.release_date <= '2026-06-30' ? 'Released' : 'Post Production' },
    { label: 'Content Rating', value: movie.adult ? 'R / 18+' : 'PG-13' },
    { label: 'Has Video', value: movie.video ? 'Yes' : 'No' },
    { label: 'Softcore Flag', value: movie.softcore ? 'Yes' : 'No' },
    { label: 'Genre Count', value: String(movie.genre_ids.length) }
  ];

  // Related = share at least one genre, excluding current movie
  const related = data
    .filter((m) => m.id !== movie.id && m.genre_ids.some((g) => movie.genre_ids.includes(g)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 8);

  const handleRelatedClick = (relatedId: number) => {
    navigate(`/movie/${relatedId}`, {
      intercept: !isMobile
    });
  };

  const handleWatchClick = () => {
    navigate(`/watch?movieId=${movie.id}`);
  };
  const handleLogin = () => {
    navigate('/login', {
      intercept: !isMobile
    });
  };

  return (
    <div className={style.page}>
      {/* Hero backdrop */}
      <div
        className={style.backdrop}
        style={{
          backgroundImage: `url(${TMDB_IMG}/original${movie.backdrop_path})`
        }}>
        <div className={style.overlay} />
      </div>

      <div className={style.content}>
        {/* Hero details */}
        <div className={style.details}>
          <img
            className={style.poster}
            src={`${TMDB_IMG}/w342${movie.poster_path}`}
            alt={movie.title}
          />

          <div className={style.info}>
            <h1 className={style.title}>{movie.title}</h1>
            <div className={style.actionRow}>
              <p className={style.meta}>
                {movie.release_date} &nbsp;·&nbsp;
                <span className={style.rating}>★ {movie.vote_average.toFixed(1)}</span>
                &nbsp;({movie.vote_count.toLocaleString()} votes)
              </p>
            </div>
            <button className={style.watchBtn} onClick={handleLogin}>
              Login To Watch
            </button>
            <button className={style.watchBtn} onClick={handleWatchClick}>
              Watch Now
            </button>
            {/* Genre tags */}
            <div className={style.genres}>
              {movie.genre_ids.map((g) => (
                <span key={g} className={style.genreTag}>
                  {GENRE_MAP[g] ?? `Genre ${g}`}
                </span>
              ))}
            </div>

            <p className={style.overview}>{movie.overview}</p>

            {/* Stats row */}
            <div className={style.stats}>
              <div className={style.stat}>
                <span className={style.statLabel}>Popularity</span>
                <span className={style.statValue}>{movie.popularity.toFixed(0)}</span>
              </div>
              <div className={style.stat}>
                <span className={style.statLabel}>Language</span>
                <span className={style.statValue}>{movie.original_language.toUpperCase()}</span>
              </div>
              <div className={style.stat}>
                <span className={style.statLabel}>Votes</span>
                <span className={style.statValue}>{movie.vote_count.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.demoFields}>
          <h3 className={style.demoTitle}>Demo Data Fields</h3>
          <p className={style.demoHint}>Synthetic metadata for layout and interaction testing</p>
          <div className={style.demoGrid}>
            {demoFields.map((field) => (
              <div key={field.label} className={style.demoItem}>
                <span className={style.demoLabel}>{field.label}</span>
                <span className={style.demoValue}>{field.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Related movies */}
        {related.length > 0 && (
          <section className={style.related}>
            <h2 className={style.sectionTitle}>Related Movies</h2>
            <div className={style.relatedGrid}>
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} onClick={() => handleRelatedClick(m.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const SkeletonMoviePage = () => {
  return (
    <div className={style.page} aria-busy="true" aria-live="polite">
      <div className={style.backdropSkeleton}>
        <div className={style.overlay} />
      </div>
      <div className={style.content}>
        <div className={style.details}>
          <div className={`${style.skeleton} ${style.posterSkeleton}`} />
          <div className={style.info}>
            <div className={`${style.skeleton} ${style.titleSkeleton}`} />
            <div className={`${style.skeleton} ${style.metaSkeleton}`} />
            <div className={style.genreSkeletonRow}>
              <div className={`${style.skeleton} ${style.genreSkeleton}`} />
              <div className={`${style.skeleton} ${style.genreSkeleton}`} />
              <div className={`${style.skeleton} ${style.genreSkeleton}`} />
            </div>
            <div className={`${style.skeleton} ${style.overviewSkeleton}`} />
            <div className={`${style.skeleton} ${style.overviewSkeleton}`} />
            <div className={`${style.skeleton} ${style.overviewSkeletonShort}`} />
            <div className={style.stats}>
              <div className={style.stat}>
                <div className={`${style.skeleton} ${style.statLabelSkeleton}`} />
                <div className={`${style.skeleton} ${style.statValueSkeleton}`} />
              </div>
              <div className={style.stat}>
                <div className={`${style.skeleton} ${style.statLabelSkeleton}`} />
                <div className={`${style.skeleton} ${style.statValueSkeleton}`} />
              </div>
              <div className={style.stat}>
                <div className={`${style.skeleton} ${style.statLabelSkeleton}`} />
                <div className={`${style.skeleton} ${style.statValueSkeleton}`} />
              </div>
            </div>
          </div>
        </div>

        <section className={style.related}>
          <div className={`${style.skeleton} ${style.sectionTitleSkeleton}`} />
          <div className={style.relatedGrid}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className={style.relatedCardSkeleton}>
                <div className={`${style.skeleton} ${style.relatedPosterSkeleton}`} />
                <div className={`${style.skeleton} ${style.relatedTextSkeleton}`} />
                <div className={`${style.skeleton} ${style.relatedTextShortSkeleton}`} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoviePage;
