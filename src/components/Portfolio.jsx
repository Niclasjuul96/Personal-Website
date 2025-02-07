import React, { useState } from 'react';
import './Portfolio.scss';
import projects from "../assets/projects";

function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  document.title = 'Portfolio';

  const onProjectclick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleClicklive = () => {
    if (selectedProject?.livepreviewurl) {
      window.open(selectedProject.livepreviewurl);
    }
  };

  const handleClickGit = () => {
    window.open(selectedProject.githuburl);
  };

  const projectsContent = projects.map((project, index) => (
    <div key={project.id} className='project-box' onClick={() => onProjectclick(project)}>
      <img src={project.imgURL} alt={project.title} className='project-image' />
    </div>
  ));

  return (
    <div className="Portfolio">
      <section className='heading'>
        <div className='title'>
          <h4>Portfolio</h4>
          <div className='underline'></div>
        </div>
      </section>

      <section className='subheading'>
        <div className='subtitle'>What Services You Will Get From Me</div>
        <div className='description'>
          Here is a list over my last projects, so you can have a sneak peek and see. You can click on the projects
          and it will direct you to the project. Feel free to contact me for more information about the projects.
        </div>
        <div className='underline'></div>
      </section>

      <section className='projects-grid'>{projectsContent}</section>

      {selectedProject && (
        <div className="modal-wrapper" onClick={closeModal}>
          <div className="modal">
            <div className="content">
              <span className="close" onClick={closeModal}>&times;</span>
              <img className='image' src={selectedProject.imgURL} alt='project'></img>
              <h2 className='title'>{selectedProject.title}</h2>
              <p className='detail'>{selectedProject.detail}</p>
              {selectedProject.accounts && (
                <p>
                  {selectedProject.accounts.map((account, index) => (
                    <React.Fragment key={index}>
                      {account}
                      {index < selectedProject.accounts.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              )}
              <p className='techstack'><b>TechStack used:</b> {selectedProject.tech.join(", ")}</p>
              <div className="btns">
                <button
                  className={`livepreview ${!selectedProject.livepreviewurl ? "disabled" : ""}`}
                  onClick={handleClicklive}
                  disabled={!selectedProject.livepreviewurl}
                >
                  Live Preview
                </button>
                <button className='Github' onClick={handleClickGit}>Github Repository</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
