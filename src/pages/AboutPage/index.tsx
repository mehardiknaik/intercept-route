import { useState } from 'react';
import style from './AboutPage.module.css';
import Scrolling from 'web-scrolling-text/react';
// import fade from 'web-scrolling-text/animation/rotate';

const footerText = ['Vesion', 'Build On'];

const AboutPage = () => {
  const [selected, setSelected] = useState(0);
  return (
    <section className={style.page}>
      <div className={style.card}>
        <h1 className={style.title}>About This Demo</h1>
        <p className={style.text}>This is a dummy About page for the route interception example.</p>
        <p className={style.text}>
          It exists to show a regular page route that is not intercepted as a modal.
        </p>
      </div>
      <div className={style.footer}>
        <div>{footerText?.[selected]} : </div>
        <Scrolling
          options={{
            onChange: setSelected
          }}>
          {[__VERSION__, __BUILD_DATE__]}
        </Scrolling>
      </div>
    </section>
  );
};

export default AboutPage;
