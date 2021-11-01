import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  // console.log('pageProps:', pageProps);
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async context => {
  const client = await buildClient(context.ctx);

  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx, client);
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
