import React, { useMemo } from 'react';
import type { Service, Experience } from '../../types/data';
import './Home.scss';
import Homeabout from '../../assets/section-1-bg1.jpg';
import Avatar from '../../assets/ProfilePictureJuul.png';
import services from '../../assets/data/services';
import workExperiences from '../../assets/data/WorkExperience';
import otherExperiences from '../../assets/data/OtherWorkExperience';
import education from '../../assets/data/Education';
import { sliceArray } from '../../utils/helpers';

interface CardServiceProps {
  service: Service;
}

const CardService: React.FC<CardServiceProps> = ({ service }) => (
  <div className="card-service" key={service.id}>
    <img src={service.img} alt={service.name} />
    <div className="card-title">{service.name}</div>
    <div className="card-description">{service.description}</div>
  </div>
);

interface CardExperienceProps {
  title: string;
  duration: string;
  description: string;
}

const CardExperience: React.FC<CardExperienceProps> = ({
  title,
  duration,
  description,
}) => (
  <div className="card-experience">
    <div className="card-title">{title}</div>
    <div className="card-duration">{duration}</div>
    <div className="card-description">{description}</div>
  </div>
);

interface CardEducationProps {
  title: string;
  duration: string;
  details?: string;
}

const CardEducation: React.FC<CardEducationProps> = ({
  title,
  duration,
  details,
}) => (
  <div className="card-experience">
    <div className="card-title">{title}</div>
    <div className="card-duration">{duration}</div>
    {details && (
      <ul className="subjects-list">
        {details.split(',').map((subject, index) => (
          <li key={index}>{subject.trim()}</li>
        ))}
      </ul>
    )}
  </div>
);

const Home: React.FC = () => {
  React.useEffect(() => {
    document.title = 'Home | Niclas Schæffer Portfolio';
  }, []);

  const servicesContent = useMemo(
    () => services.map((service) => <CardService key={service.id} service={service} />),
    []
  );

  const workExperience1 = useMemo(
    () =>
      sliceArray(workExperiences, 0, 2).map((exp) => (
        <CardExperience
          key={exp.id}
          title={exp.title}
          duration={exp.duration}
          description={exp.description}
        />
      )),
    []
  );

  const workExperience2 = useMemo(
    () =>
      sliceArray(workExperiences, 2).map((exp) => (
        <CardExperience
          key={exp.id}
          title={exp.title}
          duration={exp.duration}
          description={exp.description}
        />
      )),
    []
  );

  const education1 = useMemo(
    () =>
      sliceArray(education, 0, 2).map((edu) => (
        <CardEducation
          key={edu.id}
          title={edu.school}
          duration={edu.duration}
          details={edu.details}
        />
      )),
    []
  );

  const education2 = useMemo(
    () =>
      sliceArray(education, 2).map((edu) => (
        <CardEducation
          key={edu.id}
          title={edu.school}
          duration={edu.duration}
          details={edu.details}
        />
      )),
    []
  );

  const otherworkExperience1 = useMemo(
    () =>
      sliceArray(otherExperiences, 0, 2).map((exp) => (
        <CardExperience
          key={exp.id}
          title={exp.title}
          duration={exp.duration}
          description={exp.description}
        />
      )),
    []
  );

  const otherworkExperience2 = useMemo(
    () =>
      sliceArray(otherExperiences, 2).map((exp) => (
        <CardExperience
          key={exp.id}
          title={exp.title}
          duration={exp.duration}
          description={exp.description}
        />
      )),
    []
  );

  return (
    <div className="Home">
      <section className="introduction">
        <div className="Home-who">
          <div className="Home-title">
            I&apos;m Web Developer Niclas Schæffer
          </div>
          <div className="Home-subtext">
            A passionate Fullstack Web Developer based in Roskilde. Fast learner and ready for some challenges.
          </div>
          <div className="Links">
            <ul className="link-list-item">
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
        <div className="Home-picture"></div>
      </section>

      <section className="services">
        <div className="Services-heading">
          <h2>Services</h2>
          <div className="underline"></div>
        </div>
        <div className="services-content">{servicesContent}</div>
      </section>

      <section className="work-experience">
        <div className="work-experience-heading">
          <h2>Work Experience</h2>
          <div className="underline"></div>
        </div>
        <div className="work-experience-row">
          <div className="work-experience-col">{workExperience1}</div>
          <div className="work-experience-col">{workExperience2}</div>
        </div>
      </section>

      <section className="education">
        <div className="education-heading">
          <h2>Education</h2>
          <div className="underline"></div>
        </div>
        <div className="education-row">
          <div className="education-col">{education1}</div>
          <div className="education-col">{education2}</div>
        </div>
      </section>

      <section className="other-work-experience">
        <div className="other-work-heading">
          <h2>Other Work Experience</h2>
          <div className="underline"></div>
        </div>
        <div className="other-work-row">
          <div className="other-work-col">{otherworkExperience1}</div>
          <div className="other-work-col">{otherworkExperience2}</div>
        </div>
      </section>
    </div>
  );
};

Home.displayName = 'Home';

export default Home;
