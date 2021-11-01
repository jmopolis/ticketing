import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/use-request';

const AuthForm = ({ title, url }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doRequest, errors] = useRequest({
    url,
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async e => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>{title}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">{title}</button>
    </form>
  );
};

export default AuthForm;
