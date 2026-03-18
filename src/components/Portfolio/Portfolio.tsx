import React, { useState, useMemo } from 'react';
import './Portfolio.scss';
import type { Project } from '../../types/data';
import projects from '../../assets/data/projects';

interface ModalState {
  isOpen: boolean;
  project: Project | null;
}

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => (
  <div className="project-box" onClick={() => onClick(project)}>
    <img src={project.imgURL} alt={project.title} className="project-image" />
  </div>
);

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleLiveClick = (): void => {
    if (project.livepreviewurl) {
      window.open(project.livepreviewurl, '_blank');
    }
  };

  const handleGithubClick = (): void => {
    window.open(project.githuburl, '_blank');
  };

  return (
    <div
      className="modal-wrapper"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="content">
          <span
            className="close"
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label="Close modal"
          >
            &times;
          </span>
          <img className="image" src={project.imgURL} alt={project.title} />
          <h2 className="title" id="project-title">
            {project.title}
          </h2>
          <p className="detail">{project.detail}</p>
          {project.accounts && project.accounts.length > 0 && (
            <div className="accounts">
              <p>
                <strong>Demo Accounts:</strong>
              </p>
              <ul>
                {project.accounts.map((account, index) => (
                  <li key={index}>{account}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="techstack">
            <strong>TechStack used:</strong> {project.tech.join(', ')}
          </p>
          <div className="btns">
            <button
              className={`livepreview ${
                !project.livepreviewurl ? 'disabled' : ''
              }`}
              onClick={handleLiveClick}
              disabled={!project.livepreviewurl}
            >
              Live Preview
            </button>
            <button className="Github" onClick={handleGithubClick}>
              Github Repository
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio: React.FC = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    project: null,
  });

  React.useEffect(() => {
    document.title = 'Portfolio | Niclas Schæffer Portfolio';
  }, []);

  const handleProjectClick = (project: Project): void => {
    setModal({
      isOpen: true,
      project,
    });
  };

  const handleCloseModal = (): void => {
    setModal({
      isOpen: false,
      project: null,
    });
  };

  const projectsContent = useMemo(
    () =>
      projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={handleProjectClick}
        />
      )),
    []
  );

  return (
    <div className="Portfolio">
      <section className="heading">
        <div className="title">
          <h4>Portfolio</h4>
          <div className="underline"></div>
        </div>
      </section>

      <section className="subheading">
        <div className="subtitle">What Services You Will Get From Me</div>
        <div className="description">
          Here is a list over my last projects, so you can have a sneak peek and
          see. You can click on the projects and it will direct you to the
          project. Feel free to contact me for more information about the
          projects.
        </div>
        <div className="underline"></div>
      </section>

      <section className="projects-grid">{projectsContent}</section>

      {modal.project && (
        <ProjectModal
          project={modal.project}
          isOpen={modal.isOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

Portfolio.displayName = 'Portfolio';

export default Portfolio;
