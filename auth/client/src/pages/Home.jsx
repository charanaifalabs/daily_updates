export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <p>This demo uses Redux Toolkit for auth state and SCSS for styling.</p>
      <ul>
        <li>Register a new account</li>
        <li>Login to get a JWT</li>
        <li>Access a protected /dashboard route</li>
      </ul>
    </div>
  );
}
