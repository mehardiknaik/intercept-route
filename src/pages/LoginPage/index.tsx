import { FormEvent } from 'react';
import style from './LoginPage.module.css';

const LoginPage = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className={style.page}>
      <div className={style.card}>
        <p className={style.kicker}>Welcome Back</p>
        <h1 className={style.title}>Sign in to continue</h1>
        <p className={style.subtitle}>
          Use any values below. This is a UI-only login screen for the routing demo.
        </p>

        <form className={style.form} onSubmit={handleSubmit}>
          <label className={style.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className={style.input}
            required
          />

          <label className={style.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            className={style.input}
            required
          />

          <button className={style.submit} type="submit">
            Sign In
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
