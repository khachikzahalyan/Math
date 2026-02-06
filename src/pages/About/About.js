import './About.css';

const sections = [
  {
    text: `Այս կայքը ստեղծվել է այն գաղափարի շուրջ, որ մաթեմատիկան պետք է լինի հասկանալի, հասանելի և հետաքրքիր յուրաքանչյուր մարդու համար։
Մենք հավատում ենք, որ ճիշտ մոտեցման դեպքում նույնիսկ ամենաբարդ թեմաները կարող են դառնալ պարզ և ընկալելի։`,
    img: {
      src: '/about-reading.png',
      alt: 'Reading book',
    },
  },
  {
    text: `Մաթեմատիկան միայն թվերի և բանաձևերի համախումբ չէ։
Այն զարգացնում է տրամաբանական մտածողությունը, վերլուծական հմտությունները, խնդիրներ լուծելու կարողությունը և ինքնուրույն մտածելու ունակությունը։
Այս հմտությունները կարևոր են ոչ միայն ուսման ընթացքում, այլ նաև առօրյա կյանքում և մասնագիտական գործունեության մեջ։`,
    img: {
      src: '/about-education.png',
      alt: 'Education',
    },
  },
];

function About() {
  return (
    <div className="about">
      <div className="about__content">
        <h1 className="about__title animate-title">Մեր մասին</h1>

        <div className="about__sections">
          {sections.map((s, idx) => (
            <section
              key={idx}
              className={`about__section animate-section animate-delay-${idx + 1}`}
            >
              <p className="about__text">{s.text}</p>

              <div className="about__image">
                <img src={s.img.src} alt={s.img.alt} loading="lazy" />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
