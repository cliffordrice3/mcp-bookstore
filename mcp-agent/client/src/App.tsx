import { Outlet, Link } from 'react-router-dom';
import './style.css';

export default function App() {
  return (
    <div className="container">
      <header>
        <h1>MCP Bookstore Assistant</h1>
        <nav>
          <Link to="/chat">Chat</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
