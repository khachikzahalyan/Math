import './About.css';

function About() {
  return (
    <div className="about">
      <div className="about__content">
        <h1 className="about__title animate-title">Մեր մասին</h1>

        <p className="about__text animate-text animate-delay-1">
          Այս կայքը ստեղծվել է այն գաղափարի շուրջ, որ մաթեմատիկան պետք է լինի
          հասկանալի, հասանելի և հետաքրքիր յուրաքանչյուր մարդու համար։
          Մենք հավատում ենք, որ ճիշտ մոտեցման դեպքում նույնիսկ ամենաբարդ
          թեմաները կարող են դառնալ պարզ և ընկալելի։
        </p>

        <div className="about__image">
          <img src="/about-reading.png" alt="Reading book" loading="lazy" />
        </div>

        <p className="about__text animate-text animate-delay-2">
          Մաթեմատիկան միայն թվերի և բանաձևերի համախումբ չէ։
          Այն զարգացնում է տրամաբանական մտածողությունը, վերլուծական հմտությունները,
          խնդիրներ լուծելու կարողությունը և ինքնուրույն մտածելու ունակությունը։
          Այս հմտությունները կարևոր են ոչ միայն ուսման ընթացքում, այլ նաև
          առօրյա կյանքում և մասնագիտական գործունեության մեջ։
        </p>

        <div className="about__image">
          <img src="/about-education.png" alt="Education" loading="lazy" />
        </div>

        <p className="about__text animate-text animate-delay-3">
          Մեր հիմնական նպատակն է ստեղծել ուսումնական միջավայր, որտեղ սովորողը
          չի վախենա սխալվելուց։ Այստեղ սխալը դիտարկվում է որպես սովորելու
          բնական մաս, իսկ յուրաքանչյուր առաջադրանք՝ որպես նոր բան հասկանալու
          հնարավորություն։
        </p>

        <div className="about__image">
          <img src="/about-thinking.png" alt="Creative thinking" loading="lazy" />
        </div>

        <p className="about__text animate-text animate-delay-4">
          Կայքում ներկայացված նյութերը կառուցված են քայլ առ քայլ սկզբունքով։
          Սկզբում տրվում է տեսությունը պարզ լեզվով, ապա՝ օրինակներ,
          և վերջում փոքր առաջադրանքներ, որոնք օգնում են ամրապնդել ստացված
          գիտելիքները։
        </p>

        <div className="about__image">
          <img src="/about-math.png" alt="Learning math" loading="lazy" />
        </div>
      </div>
    </div>
  );
}

export default About;
