document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#lastModified').textContent = document.lastModified;

const navButton = document.querySelector('#nav-button');
const navBar = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
  const isOpen = navBar.classList.toggle('open');
  navButton.classList.toggle('open');
  navButton.setAttribute('aria-expanded', isOpen);
});

const cards = document.querySelector('#cards');
const gridButton = document.querySelector('#grid');
const listButton = document.querySelector('#list');

const levels = { 1: 'Member', 2: 'Silver', 3: 'Gold' };

async function getMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) {
      throw new Error(`Could not load members.json (${response.status})`);
    }
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error(error);
    cards.textContent = 'Sorry, the member list could not be loaded.';
  }
}

function displayMembers(members) {
  members.forEach((member) => {
    const card = document.createElement('section');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-top">
        <h2>${member.name}</h2>
        <p>${member.description}</p>
      </div>
      <div class="card-body">
        <img src="images/${member.image}" alt="${member.name} logo" width="100" height="75" loading="lazy">
        <div>
          <p><strong>ADDRESS:</strong> ${member.address}</p>
          <p><strong>PHONE:</strong> ${member.phone}</p>
          <p><strong>URL:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace('https://', '')}</a></p>
          <p><strong>LEVEL:</strong> ${levels[member.membership]}</p>
        </div>
      </div>
    `;

    cards.appendChild(card);
  });
}

function setView(view) {
  cards.classList.remove('grid', 'list');
  cards.classList.add(view);
  gridButton.classList.toggle('active', view === 'grid');
  listButton.classList.toggle('active', view === 'list');
}

gridButton.addEventListener('click', () => setView('grid'));
listButton.addEventListener('click', () => setView('list'));

setView('grid');
getMembers();