import { Link } from 'react-router-dom';
import topics from '../../data/topics';
import Card from '../../components/Card/Card';
import './Lessons.css';

function Lessons() {
  if (topics.length === 0) {
    return <Card title="Շուտով կլինի" text="Ապագայում այստեղ կհայտնվի նյութը" />;
  }

  return (
    <div className="lessons">
      <h1 className="lessons__title">Դասեր</h1>
      <p className="lessons__subtitle">Ընտրեք թեմա ձախ մենյուից կամ բացեք ստորև գտնվող թեմաներից մեկը։</p>

      <div className="lessons__grid">
        {topics.map((t) => (
          <div className="lessons__card" key={t.id}>
            <h3 className="lessons__cardTitle">{t.title}</h3>
            <p className="lessons__cardText">{t.description}</p>
            <Link className="lessons__cardLink" to={t.id}>
              Բացել
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lessons;
