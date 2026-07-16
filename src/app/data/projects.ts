export interface Project {
  id: number;
  title: string;
  imgURL: string;
  detail: string;
  githuburl: string;
  livepreviewurl?: string;
  tech: string[];
  accounts?: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Chat-App',
    imgURL: 'assets/project-images/Chat-App.png',
    detail: 'This chat application is based on react and using firebase as the backend to track messages back and forth between users. It is available to use the existing accounts or creating a new account. It will be possible to find the users by thier firstName, upper and lowercase dosn\'t matter. for the real experience i would recommend to create an account and searching for users. cause many of the test users already have conversations between them.',
    githuburl: 'https://github.com/Niclasjuul96/Chat-App',
    livepreviewurl: 'http://chatapp.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json', 'firebase'],
    accounts: [
      'Account 1: jimmy@gmail.com, pass: password',
      'Account 2: jenna@gmail.com, pass: password',
      'Account 3: jennifer@gmail.com, pass: password',
      'Account 4: peter@gmail.com pass: password',
    ],
  },
  {
    id: 2,
    title: 'NoteEase',
    imgURL: 'assets/project-images/NoteEase.png',
    detail: 'NoteEase was one of my first projects, that i was doing while learning react. a simple note taking app that is saving your notes to remember for another time, i am using json and local storage to retrieve and save notes and able to delete aswell',
    githuburl: 'https://github.com/Niclasjuul96/NoteEase',
    livepreviewurl: 'http://noteease.niclasjuul.dk/',
    tech: ['react', 'javascript', 'node.js', 'json'],
  },
  {
    id: 3,
    title: 'Simon Says Game',
    imgURL: 'assets/project-images/SimonGame.png',
    detail: 'Simon game was a little funny project that i was testing if i would be able to do. it\'s just envolving the basic html, css and javascript.',
    githuburl: 'https://github.com/Niclasjuul96/SimonGame',
    livepreviewurl: 'http://simongame.niclasjuul.dk/',
    tech: ['Html', 'CSS', 'JavaScript'],
  },
  {
    id: 4,
    title: 'Password Generator',
    imgURL: 'assets/project-images/password.png',
    detail: 'Password generator is a small and simple tool to generate password that includes what ever you like. to solve solve one of the hardest stuff in life, finding a password to use. and ofc the copy to clipboard doesn\'t work on the website cause it\'s not possible. but iif you download the project from github, you will be able to use that feature aswell.',
    githuburl: 'https://github.com/Niclasjuul96/PasswordGenerator/tree/main',
    livepreviewurl: 'http://passwordgenerator.niclasjuul.dk/',
    tech: ['html', 'CSS', 'JavaScript'],
  },
  {
    id: 5,
    title: 'KanBan Board',
    imgURL: 'assets/project-images/KanBan.png',
    detail: 'This small kanban board project is based on console application, and coordination through tublespaces. Able to work around with the application at the same time without interfering with others. The live-preview will not work, so if you wanna look how it works, you will need to go to github and clone it.',
    githuburl: 'https://github.com/Niclasjuul96/KanBan',
    livepreviewurl: '',
    tech: ['Java', 'Tublespaces'],
  },
];

export default projects;
