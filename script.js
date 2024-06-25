document.addEventListener('DOMContentLoaded', (event) => {
  // Fetch and display stored credentials
  fetch('https://localhost:5000/credentials')
    .then(response => response.json())
    .then(data => {
      // Sort data alphabetically by siteName
      data.sort((a, b) => a.siteName.localeCompare(b.siteName));
      data.forEach(card => {
        displayCard(card);
      });
    })
    .catch(error => console.error('Error fetching credentials:', error));

  // Function to open the modal for adding a new card
  window.openModal = function() {
    const modal = document.getElementById('myModal');

    // Reset form fields
    document.getElementById('siteName').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('internalIp').value = '';
    document.getElementById('externalIp').value = '';
    document.getElementById('notes').value = '';

    modal.style.display = 'flex';
  };

  // Function to close the modal
  window.closeModal = function() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  // Function to add a new card
  window.addCard = function() {
    const siteName = document.getElementById('siteName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const internalIp = document.getElementById('internalIp').value;
    const externalIp = document.getElementById('externalIp').value;
    const notes = document.getElementById('notes').value;

    fetch('https://localhost:5000/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteName, username, password, internalIp, externalIp, notes })
    })
    .then(response => response.json())
    .then(card => {
      displayCard(card);
      closeModal();
    })
    .catch(error => console.error('Error adding card:', error));
  };

  // Function to display a card
  function displayCard(card) {
    const cardContainer = document.getElementById('cardContainer');

    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const siteNameElement = document.createElement('h3');
    siteNameElement.textContent = card.siteName;
    cardElement.appendChild(siteNameElement);

    const usernameElement = document.createElement('p');
    usernameElement.textContent = `Username: ${card.username}`;
    cardElement.appendChild(usernameElement);

    const passwordElement = document.createElement('p');
    const passwordContainer = document.createElement('span');
    passwordContainer.className = 'password-container';
    const passwordText = document.createElement('span');
    passwordText.textContent = `Password: ${'•'.repeat(card.password.length)}`;
    
    passwordContainer.appendChild(passwordText);
    
    const togglePasswordButton = document.createElement('span');
    togglePasswordButton.className = 'toggle-password';
    togglePasswordButton.innerHTML = '🙈'; // eye icon
    
    togglePasswordButton.addEventListener('click', () => {
      if (passwordText.textContent === `Password: ${card.password}`) {
        passwordText.textContent = `Password: ${'•'.repeat(card.password.length)}`;
        togglePasswordButton.innerHTML = '🙈'; // show eye icon
      } else {
        passwordText.textContent = `Password: ${card.password}`;
        togglePasswordButton.innerHTML = '🙉'; // hide eye icon
      }
    });
    
    passwordContainer.appendChild(togglePasswordButton);
    passwordElement.appendChild(passwordContainer);

    cardElement.appendChild(passwordElement);

    const internalIpElement = document.createElement('p');
    internalIpElement.textContent = `Internal IP: ${card.internalIp}`;
    cardElement.appendChild(internalIpElement);

    const externalIpElement = document.createElement('p');
    externalIpElement.textContent = `External IP: ${card.externalIp}`;
    cardElement.appendChild(externalIpElement);

    const notesElement = document.createElement('p');
    notesElement.textContent = `Notes: ${card.notes}`;
    cardElement.appendChild(notesElement);

    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      openEditModal(card);
    });
    cardElement.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      deleteCard(card._id, cardElement);
    });
    cardElement.appendChild(deleteButton);

    cardContainer.appendChild(cardElement);
  }

  // Function to delete a card
  function deleteCard(id, cardElement) {
    fetch(`https://localhost:5000/credentials/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        cardElement.remove();
      } else {
        console.error('Error deleting card');
      }
    })
    .catch(error => console.error('Error deleting card:', error));
  }

  // Function to open the modal for editing a card
  function openEditModal(card) {
    const modal = document.getElementById('myModal');
    document.getElementById('siteName').value = card.siteName;
    document.getElementById('username').value = card.username;
    document.getElementById('password').value = card.password;
    document.getElementById('internalIp').value = card.internalIp;
    document.getElementById('externalIp').value = card.externalIp;
    document.getElementById('notes').value = card.notes;

    const saveButton = document.querySelector('.save-btn');
    saveButton.textContent = 'Update';
    saveButton.onclick = () => updateCard(card._id);

    modal.style.display = 'flex';
  }

  // Function to update a card
  function updateCard(id) {
    const siteName = document.getElementById('siteName').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const internalIp = document.getElementById('internalIp').value;
    const externalIp = document.getElementById('externalIp').value;
    const notes = document.getElementById('notes').value;

    fetch(`https://localhost:5000/credentials/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ siteName, username, password, internalIp, externalIp, notes })
    })
    .then(response => response.json())
    .then(updatedCard => {
      // Update the card in the DOM
      const cardElements = document.querySelectorAll('.card');
      cardElements.forEach(cardElement => {
        if (cardElement.querySelector('h3').textContent === updatedCard.siteName) {
          cardElement.querySelector('p:nth-child(2)').textContent = `Username: ${updatedCard.username}`;
          cardElement.querySelector('.password-container span').textContent = updatedCard.password;
          cardElement.querySelector('p:nth-child(4)').textContent = `Internal IP: ${updatedCard.internalIp}`;
          cardElement.querySelector('p:nth-child(5)').textContent = `External IP: ${updatedCard.externalIp}`;
          cardElement.querySelector('p:nth-child(6)').textContent = `Notes: ${updatedCard.notes}`;
        }
      });

      closeModal();
    })
    .catch(error => console.error('Error updating card:', error));
  }
});

document.getElementById('searchInput').addEventListener('input', function () {
  const searchValue = this.value.toLowerCase();
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const cardTitle = card.querySelector('h3').textContent.toLowerCase();
    const viewModeElements = card.querySelectorAll('.view-mode');

    let viewModeText = '';
    viewModeElements.forEach(element => {
      viewModeText += element.textContent.toLowerCase();
    });

    if (cardTitle.includes(searchValue) || viewModeText.includes(searchValue)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});


