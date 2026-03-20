import React, { useMemo } from 'react';
import './About.scss';
import techstack from '../../assets/data/techstack';
import Avatar from '../../assets/avatar.jpg';

interface TechItemProps {
  name: string;
  icon: string;
}

const TechItem: React.FC<TechItemProps> = ({ name, icon }) => (
  <div className="tech-item">
    <img src={icon} alt={name} />
    <p>{name}</p>
  </div>
);

const About: React.FC = () => {
  React.useEffect(() => {
    document.title = 'About | Niclas Schæffer Portfolio';
  }, []);

  const techItems = useMemo(
    () => techstack.map((tech, index) => <TechItem key={index} {...tech} />),
    []
  );

  return (
    <div className="About">
      <div className="heading">
        <h4>About Me</h4>
        <div className="underline"></div>
      </div>

      <section className="content">
        <div className="Avatar">
          <img src={Avatar} alt="Niclas Schæffer" />
        </div>
        <div className="designing">
          <div className="heading">
            Designing With Passion While Exploring the World
          </div>
          <div className="underline"></div>
          <div className="description">
            Hey I&apos;m Niclas Schæffer, I am a front-end / back-end web
            developer, was studying on DTU lyngby, Denmark for my Software
            Technology degree, and i didn&apos;t finish the education, because i had to
            go a different route. I create successful websites that are fast,
            easy to use and built with best practices.
          </div>
          <div className="description">
            I work to make a better web; one that is fast, easy to use,
            beautiful, and accessible to all, and frustration-free. Regardless
            of your specific business requirements, in solving these challenges,
            you have a great chance of finding success online.
          </div>
        </div>
        <div className="Products">
          <div className="heading">I create Products not just Arts.</div>
          <div className="underline"></div>
          <div className="description">
            My Main experience is in the front-end development but i also have
            passion for back-end and design. Given that producing a modern
            website requires the combination of design, server technology, and
            the layer that users interacts with, i believe having experience in
            both design and development allows for making the most optimal user
            experiences.
          </div>
          <div className="description">
            I can quickly and efficiently join your team using continuous -
            integration methods and tools such as Git and Agile.
          </div>
        </div>
      </section>

      <section className="developer">
        <div className="Frontend-backend">
          <div className="heading">Frontend and Backend Developer</div>
          <div className="underline"></div>
          <div className="content">
            I primarily developing web applications, but i do also have
            developed a few other applications, if you are interested, you will
            always be able to download my CV at the button below.
          </div>
          <div className="socials">
            <form
              method="get"
              target="_blank"
              action="https://cv.niclasjuul.dk"
            >
              <button className="download-cv" type="submit">
                Download CV
              </button>
            </form>
            <div className="icons">
              <ul className="icon-list-item">
                <li>
                  <a
                    href="https://www.linkedin.com/in/niclas-juul-schaeffer/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Niclasjuul96"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=1119953702"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tech-stack">
          <div className="heading">Tech Stack</div>
          <div className="underline"></div>
          <div className="tech-items">{techItems}</div>
        </div>
      </section>
    </div>
  );
};

About.displayName = 'About';

export default About;
