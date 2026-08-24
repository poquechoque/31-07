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


 codex/mostrar-estructura-de-archivos
    const normalizedEmail = email.trim().toLowerCase();

     const normalizedEmail = email.trim().toLowerCase();
 main


    if (!normalizedEmail || !password) {
      return;
    }


    onSubmit({
 codex/mostrar-estructura-de-archivos
      email: normalizedEmail,

     email: normalizedEmail,
 main
      password,
    });
  };


  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>
      <div>
 codex/mostrar-estructura-de-archivos
        <label htmlFor="email">Correo Gmail</label>

       <label htmlFor="email">Correo Gmail</label>
main


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
