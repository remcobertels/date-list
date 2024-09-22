const firebaseConfig = {
    apiKey: "AIzaSyDRS5hjGfiFeII9KZq9teUpXl9OaisiZCc",
    authDomain: "datelist-c60a6.firebaseapp.com",
    databaseURL: "https://datelist-c60a6-default-rtdb.firebaseio.com",
    projectId: "datelist-c60a6",
    storageBucket: "datelist-c60a6.appspot.com",
    messagingSenderId: "508998270035",
    appId: "1:508998270035:web:1969d8dc7cef3aac2adaa6"
  };

  // Add an event listener to the checkbox
  document.getElementById('menuButton').addEventListener('change', openMenu);

  
  // Handle information for input form
  let imageUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  let selectedTags = [];
  const tagButtons = document.querySelectorAll('.tagButton');


  // Function to be called when checkbox is checked/unchecked
  function openMenu() {
    const checkbox = document.getElementById('menuButton');
    const menu = document.getElementById('menu');
      
    if (checkbox.checked) {
      menu.style.transform = 'none';  // This removes any transform effects, effectively setting it to 0

    } else {
      menu.style.transform = 'translate(-100%, 0)'; 
    }
  }

function openPopup() {
  myPopup.classList.add("show");
  menu.classList.add("hide");
  document.body.classList.add('stop-scrolling');
}


function closePopup() {
  myPopup.classList.remove("show");
  menu.classList.remove("hide");
  document.body.classList.remove('stop-scrolling');

  // Reset the form
  document.getElementById('nameInput').value = '';
  document.getElementById('descriptionInput').value = '';
  imageUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  document.getElementById('newCardImage').style.backgroundImage = `url('${imageUrl}')`;

  // Reset the tags
  selectedTags = [];
  const tagButtons = document.querySelectorAll('.tagButton');
  tagButtons.forEach((button) => {
    button.classList.remove('tagSelected');
  });
}

page2.classList.add("hide");

function showPage1(){
  page1.classList.remove("hide");
  page2.classList.add("hide");
}

function showPage2(){
  page2.classList.remove("hide");
  page1.classList.add("hide");
}

window.addEventListener(
    "click",
    function (event) {
        if (event.target == myPopup) {
          closePopup();
        }
    }
);

function imageInput() {

  const target = document.getElementById("newCardImage");
  imageUrl = prompt("Enter image link:", "");
  if (imageUrl == null || imageUrl == "") {
    target.style.backgroundImage = `url("https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png")`;
  } else {
    target.style.backgroundImage = `url('${imageUrl}')`;
  }
}

  tagButtons.forEach((button) => {
    button.addEventListener('click', function() {
      const tag = button.getAttribute("filter-name");;

      // Toggle the selected class and manage the selectedTags array
      if (selectedTags.includes(tag)) {
        // Remove the tag if it's already selected
        const index = selectedTags.indexOf(tag);
        selectedTags.splice(index, 1);
        button.classList.remove('tagSelected');
      } else {
        // Add the tag to selectedTags
        selectedTags.push(tag);
        button.classList.add('tagSelected');
      }
    });
  });

  function submitDate() {
    
    const name = document.getElementById('nameInput').value;
    const description = document.getElementById('descriptionInput').value;

    // Ensure that fields are not empty
    if (name === '' || description === '' || selectedTags.length === 0) {
      alert('Vul alle velden in en selecteer minimaal 1 filter');
      return; // Stop the function if validation fails
    }
    
    var newContactForm = contactFormDB.push();
  
    newContactForm.set({
      name: name,
      description: description,
      url: imageUrl,
      tags: selectedTags,
    });

    // Close the popup
    closePopup();

    alert('Date is opgeslagen! (Nu nog uitvoeren...)');
  };


  //Filter logic
  // Function to shuffle an array (Fisher-Yates shuffle)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  function moveButton(button) {
    // Get the two divs
    var div1 = document.getElementById("selected");

    var originalDivId = button.getAttribute("category");
    var originalDiv = document.getElementById(originalDivId);

    // Check if the button is currently in div1
    if (button.parentNode.id === "selected") {
      originalDiv.appendChild(button); 

      // Remove the "X" when moving back to the original div
      button.innerHTML = button.innerHTML.replace(' <i class="fa-solid fa-x"></i>', '');
    } else {
      div1.appendChild(button); // Move back to div1
      button.innerHTML += ' <i class="fa-solid fa-x"></i>';
      
    }

    // Automatically call the filter function with selected tags in div1
    getSelectedTagsAndFilter();
  }

  function getSelectedTagsAndFilter() {
    // Get all buttons in div1
    const div1 = document.getElementById('selected');
    const buttons = div1.getElementsByTagName('button');

    // Extract the text of each button
    const selectedTags = Array.from(buttons).map(button => button.getAttribute('filter-name'));
    

    // Call the filterByTags function with the selected button names
    filterByTags(selectedTags);
  }
  
  // initialize firebase
  firebase.initializeApp(firebaseConfig);
  
  // reference your database
  var contactFormDB = firebase.database().ref("dates");

// Function to retrieve and display data based on chosen tags
const filterByTags = (chosenTags) => {
  // Reference the container where the data will be displayed
  const container = document.getElementById('dataContainer');
  
  // Clear any previous results in the container
  container.innerHTML = '';

  contactFormDB.once('value', (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Filter entries by tags
      let filteredData = Object.values(data).filter(entry => {
        return chosenTags.every(tag => entry.tags.includes(tag));
      });

      // Shuffle the filtered data
      filteredData = shuffleArray(filteredData);

      // Display filtered data in the container div
      if (filteredData.length > 0) {

        let isFirst = true;
        
        filteredData.forEach(entry => {
          // Create the outer div with class "item-1"
          const itemDiv = document.createElement('div');

          itemDiv.className = isFirst ? 'item-1' : 'item-2';
          isFirst = false;

          // Create the anchor tag with class "card"
          const cardLink = document.createElement('a');
          cardLink.className = 'card';
          cardLink.href = "#";  // Add the correct link if available

          // Create the thumb div with background image
          const thumbDiv = document.createElement('div');
          thumbDiv.className = 'thumb';
          
          thumbDiv.style.backgroundImage = `url('${entry.url}')`;

          // Create the article tag
          const article = document.createElement('article');

          // Create the h1 element for the name
          const nameElem = document.createElement('h1');
          nameElem.textContent = entry.name;

          // Create the h1 element for the name
          const descriptionElem = document.createElement('p');
          descriptionElem.textContent = entry.description;

          // Create a div for the tags/buttons
          const tagsContainer = document.createElement('div');
          tagsContainer.className = 'tags-container';

          let tagsArray;

          if (Array.isArray(entry.tags)) {
            tagsArray = entry.tags;  // Already an array
          } else if (typeof entry.tags === 'string') {
            tagsArray = [entry.tags];  // Convert string to array and trim spaces
          }

          // // Create a button for each tag
          tagsArray.forEach(tag => {
            const tagButton = document.createElement('span');
            tagButton.textContent = tag;
            tagButton.className = 'tag-item';
            tagsContainer.appendChild(tagButton);
          });

          // Append the name and span to the article
          article.appendChild(nameElem);
          article.appendChild(descriptionElem);
          article.appendChild(tagsContainer);

          // Append thumbDiv and article to the cardLink
          cardLink.appendChild(thumbDiv);
          cardLink.appendChild(article);

          // Append cardLink to itemDiv
          itemDiv.appendChild(cardLink);

          // Append the itemDiv to the container
          container.appendChild(itemDiv);
        });
      } else {
        // If no matches, display a message
        container.innerHTML = '<p id="error">Tsssk veeleisend ben jij zeg...</p>';
      }
    } else {
      container.innerHTML = '<p id="error">Bliep bloop, server error.</p>';
    }
  }).catch((error) => {
    console.error(error);
    container.innerHTML = '<p id="error">Bliep bloop, server error.</p>';
  });
};

// Display initial data
filterByTags([]);
  