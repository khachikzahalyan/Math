import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notFound">
      <h1 className="notFound__title">Էջը չի գտնվել</h1>
      <Link to="/">Գլխավոր էջ</Link>
    </div>
  );
}

export default NotFound;
