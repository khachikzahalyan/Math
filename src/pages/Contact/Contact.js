import './Contact.css';
import { useState } from 'react';

function Contact() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setShowTooltip(true);
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    
    setTimeout(() => {
      setShowTooltip(false);
    }, 3000);
  };

  return (
    <div className="contact">
      <div className="contact__card animate-card">
        <h1 className="contact__title animate-title">Կապ մեզ հետ</h1>

        {showTooltip && (
          <div className="tooltip">
            Ձեր նամակը հաջողությամբ ուղղարկվեց․․․
          </div>
        )}
        
        <p className="contact__subtitle animate-text animate-delay-1">
          Եթե ունեք հարցեր, առաջարկներ կամ պարզապես ցանկանում եք կապ հաստատել,
          կարող եք գրել մեզ՝ ստորև նշված տվյալներով։
        </p>

        <form className="contact__form animate-text animate-delay-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Անուն</label>
          <input
            type="text"
            required
            placeholder="Ձեր անունը"
            onInvalid={(e) =>
              e.target.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը')
            }
            onInput={(e) => e.target.setCustomValidity('')}
          />
          </div>

          <div className="form-group">
            <label htmlFor="email">Էլ․ փոստ</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              onInvalid={(e) =>
              e.target.setCustomValidity('Խնդրում ենք լրացնել այս դաշտը')
            }
              placeholder="Ձեր էլ․ փոստը"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Հաղորդագրություն</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Ձեր հարցը կամ հաղորդագրությունը"
              rows="5"
            ></textarea>
          </div>

          <button type="submit" className="contact__button">
            Ուղարկել
          </button>
        </form>

        <p className="contact__footer animate-text animate-delay-5">
          Մենք կփորձենք պատասխանել հնարավորինս արագ։
        </p>
      </div>
    </div>
  );
}

export default Contact;
