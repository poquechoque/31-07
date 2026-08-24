import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";


interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}


function LoginForm({ error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();


    const normalizedEmail = email.trim().toLowerCase();


    if (!normalizedEmail || !password) {
      return;
    }


    onSubmit({
      email: normalizedEmail,
      password,
    });
  };


  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>


      <div>
        <label htmlFor="email">Correo Gmail</label>


        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Ingrese su correo Gmail"
          autoComplete="email"
          pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$"
          title="Ingrese un correo de Gmail válido"
          required
        />
      </div>


      <div>
        <label htmlFor="password">Contraseña</label>


        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          required
        />
      </div>


      {error && (
        <p role="alert" aria-live="polite">
          {error}
        </p>
      )}


      <button type="submit">Ingresar</button>
    </form>
  );
}


export default LoginForm;
