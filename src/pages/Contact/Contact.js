import './Contact.css';
import { aboutInfo } from '../../shared/aboutInfo';

function Contact() {
  return (
    <div className="contact">
      <div className="contact__card animate-card">
        <h1 className="contact__title animate-title">Կապ մեզ հետ</h1>

        <p className="contact__subtitle animate-text animate-delay-1">
          Եթե ունեք հարցեր, առաջարկներ կամ պարզապես ցանկանում եք կապ հաստատել,
          կարող եք գրել մեզ՝ ստորև նշված տվյալներով։
        </p>

        <div className="contact__info">
          <div className="contact__row animate-text animate-delay-2">
            <span className="contact__label">📧 Էլ․ փոստ</span>
            <span className="contact__value">{aboutInfo.contacts.email}</span>
          </div>

          <div className="contact__row animate-text animate-delay-3">
            <span className="contact__label">ℹ️ Նշում</span>
            <span className="contact__value">{aboutInfo.contacts.note}</span>
          </div>
        </div>

        <p className="contact__footer animate-text animate-delay-4">
          Մենք կփորձենք պատասխանել հնարավորինս արագ։
        </p>
      </div>
    </div>
  );
}

export default Contact;
