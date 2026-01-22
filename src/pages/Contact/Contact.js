import './Contact.css';
import { aboutInfo } from '../../shared/aboutInfo';

function Contact() {
  return (
    <div className="contact">
      <h1 className="contact__title">Կապ</h1>
      <p className="contact__text">Էլ․ փոստ՝ {aboutInfo.contacts.email}</p>
      <p className="contact__note">{aboutInfo.contacts.note}</p>
    </div>
  );
}

export default Contact;
