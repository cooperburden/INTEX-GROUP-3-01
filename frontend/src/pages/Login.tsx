import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Footer from '../components/Footer';
import * as Yup from 'yup';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues: LoginFormValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  });

  const loginUser = async (email: string, password: string) => {
    const response = await fetch('https://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    return response.ok;
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const success = await loginUser(values.email, values.password);
      if (success) {
        login();
        navigate('/movieList');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('An error occurred during login');
    }
  };

  return (
    <>
    <div
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back to Home
      </button>

      <div
        style={{
          padding: '4rem 2rem',
          maxWidth: '600px',
          width: '100%',
          margin: '0 auto',
          color: 'white',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2
          style={{
            marginBottom: '2rem',
            textAlign: 'center',
            color: 'white',
            fontSize: '2rem',
          }}
        >
          Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <Field
                name="email"
                type="email"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <ErrorMessage name="email">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <Field
                name="password"
                type="password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <ErrorMessage name="password">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#e50914',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </Form>
        </Formik>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Login;
