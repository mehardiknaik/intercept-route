import { PageProvider } from '../context/pageContext';

const withPageContext = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithPageContext = (props: P) => {
    return (
      <PageProvider>
        <WrappedComponent {...props} />
      </PageProvider>
    );
  };

  WithPageContext.displayName = `withPageContext(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithPageContext;
};

export default withPageContext;
