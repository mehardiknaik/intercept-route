import { useEffect, useRef } from 'react';
import { useNavigateInterception } from '../../context/useNavigateInterception';
import style from './Model.module.css';
import closeImg from '../../assets/close.svg';
import fillImg from '../../assets/full.svg';
import { useLocation } from 'react-router';

const Model = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigateInterception();
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const handleClose = () => {
    navigate(-1);
  };

  const handleFullScreen = () => {
    navigate(location, {
      intercept: false,
      replace: true
    });
  };

  useEffect(() => {
    const body = document.body;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    ref.current?.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={style.container} onClick={handleClose}>
      <div ref={ref} className={style.content}>
        <div className={style.contentInside} onClick={(e) => e.stopPropagation()}>
          <div className={style.buttonContainer}>
            <button title="Full Screen" className={style.button} onClick={handleFullScreen}>
              <img src={fillImg} alt="Full" />
            </button>
            <button title="Close" className={style.button} onClick={handleClose}>
              <img src={closeImg} alt="Close" height={'100%'} width={'100%'} />
            </button>
          </div>
          <div className={style.wrapper}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Model;
