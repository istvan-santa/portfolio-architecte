// ===============================
// Détection de l'état de connexion
// ===============================
const isLoggedIn = !!localStorage.getItem('authToken');

if (isLoggedIn) {
  // Mode administrateur : afficher outils d'édition
  document.querySelector('.admin-banner')?.classList.remove('hidden');
  document.getElementById('open-modal')?.classList.remove('hidden');
  document.getElementById('logout')?.classList.remove('hidden');
  document.getElementById('login')?.classList.add('hidden');
  document.querySelector('.filters')?.classList.add('hidden');
} else {
  // Mode visiteur : masquer outils d'édition et modales
  document.querySelector('.admin-banner')?.classList.add('hidden');
  document.getElementById('open-modal')?.classList.add('hidden');
  document.getElementById('logout')?.classList.add('hidden');
  document.getElementById('login')?.classList.remove('hidden');
  document.querySelector('.filters')?.classList.remove('hidden');

  // Supprimer les modales de l'admin pour les visiteurs
  document.getElementById('modal')?.remove();
  document.getElementById('modal-add-photo')?.remove();
}

// ===============================
// Chargement des projets depuis l'API
// ===============================
async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) throw new Error('Erreur lors de la récupération des travaux');
    return await response.json();
  } catch (error) {
    console.error('Erreur :', error);
  }
}

// ===============================
// Affichage des projets dans la galerie principale
// ===============================
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
  works.forEach(work => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const caption = document.createElement('figcaption');
    img.src = work.imageUrl;
    img.alt = work.title;
    caption.textContent = work.title;
    figure.append(img, caption);
    gallery.appendChild(figure);
  });
}

// Chargement initial des travaux
fetchWorks().then(works => works && displayWorks(works));

// ===============================
// Chargement et affichage des filtres de catégories
// ===============================
async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) throw new Error('Erreur lors de la récupération des catégories');
    return await response.json();
  } catch (error) {
    console.error('Erreur :', error);
  }
}

function displayFilters(categories) {
  const filtersContainer = document.querySelector('.filters');
  filtersContainer.innerHTML = '';
  const allButton = document.createElement('button');
  allButton.textContent = 'Tous';
  allButton.dataset.categoryId = '';
  filtersContainer.appendChild(allButton);
  categories.forEach(category => {
    const button = document.createElement('button');
    button.textContent = category.name;
    button.dataset.categoryId = category.id;
    filtersContainer.appendChild(button);
  });
}

// Chargement initial des filtres
fetchCategories().then(categories => categories && displayFilters(categories));

// ===============================
// Filtres interactifs des projets + scroll
// ===============================
document.querySelector('.filters').addEventListener('click', (event) => {
  const categoryId = event.target.dataset.categoryId;

  // Scroll vers la galerie
  document.querySelector('#portfolio').scrollIntoView({ behavior: 'instant' });

  // Gestion du style actif
  document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Affichage des projets filtrés
  fetchWorks().then((works) => {
    if (categoryId) {
      const filteredWorks = works.filter((work) => work.categoryId == categoryId);
      displayWorks(filteredWorks);
    } else {
      displayWorks(works);
    }
  });
});

// ===============================
// Gestion des modales (2 modales séparées)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const modalGallery = document.getElementById('modal');
  const modalAddPhoto = document.getElementById('modal-add-photo');
  const openModalBtn = document.getElementById('open-modal');
  const closeGalleryModalBtn = document.getElementById('close-modal');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const closeAddPhotoBtn = document.getElementById('close-modal-2');
  const backArrow = document.getElementById('back-arrow');

  openModalBtn?.addEventListener('click', () => {
    modalGallery.classList.remove('hidden');
    modalAddPhoto.classList.add('hidden');
    loadSmallGallery();
  });

  closeGalleryModalBtn?.addEventListener('click', () => {
    modalGallery.classList.add('hidden');
  });

  addPhotoBtn?.addEventListener('click', () => {
    modalGallery.classList.add('hidden');
    modalAddPhoto.classList.remove('hidden');
  });

  closeAddPhotoBtn?.addEventListener('click', () => {
    modalAddPhoto.classList.add('hidden');
  });

  backArrow?.addEventListener('click', () => {
    modalAddPhoto.classList.add('hidden');
    modalGallery.classList.remove('hidden');
  });
});

// ===============================
// Chargement des projets dans la modale galerie
// ===============================
function loadSmallGallery() {
  fetchWorks().then(works => {
    const galleryContent = document.getElementById('gallery-content');
    galleryContent.innerHTML = '';
    if (!works.length) {
      const msg = document.createElement('p');
      msg.textContent = 'Aucun projet trouvé.';
      galleryContent.appendChild(msg);
      return;
    }
    works.forEach(work => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-item');
      const img = document.createElement('img');
      img.src = work.imageUrl;
      img.alt = work.title;
      img.classList.add('small-image');
      const deleteIcon = document.createElement('button');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.innerHTML = '&#128465;';
      deleteIcon.dataset.id = work.id;
      deleteIcon.addEventListener('click', () => deleteProject(work.id));
      projectDiv.append(img, deleteIcon);
      galleryContent.appendChild(projectDiv);
    });
  });
}

// ===============================
// Suppression d'un projet via l'API
// ===============================
async function deleteProject(id) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      alert('Projet supprimé avec succès');
      loadSmallGallery();
    } else {
      alert('Erreur lors de la suppression du projet');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du projet :', error);
  }
}

// ===============================
// Gestion de l'ajout de photo
// ===============================
const photoFileInput = document.getElementById('photo-file');
const photoPreview = document.querySelector('.photo-preview');
const photoForm = document.getElementById('add-photo-form');
const validateBtn = document.getElementById('validate-btn');
const categorySelect = document.getElementById('photo-category');

photoFileInput?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      photoPreview.innerHTML = `<img src="${ev.target.result}" alt="Prévisualisation" style="width:100%;border-radius:10px;">`;
    };
    reader.readAsDataURL(file);
  }
});

categorySelect?.addEventListener('change', checkFormValidity);
function checkFormValidity() {
  const title = document.getElementById('photo-title').value;
  const category = categorySelect.value;
  const file = photoFileInput.files[0];
  if (title && category && file) {
    validateBtn.classList.add('active');
    validateBtn.disabled = false;
  } else {
    validateBtn.classList.remove('active');
    validateBtn.disabled = true;
  }
}

photoForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const title = document.getElementById('photo-title').value;
  const category = categorySelect.value;
  const file = photoFileInput.files[0];
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', file);
  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      body: formData
    });
    if (response.ok) {
      alert('Photo ajoutée avec succès !');
      photoForm.reset();
      photoPreview.innerHTML = `<label for="photo-file" class="upload-area">
        <img src="assets/icons/default-image-icon.png" alt="Image par défaut" class="default-icon">
        <p>+ Ajouter photo</p>
        <small>jpg, png : 4mo max</small>
      </label>`;
      validateBtn.disabled = true;
      validateBtn.classList.remove('active');
      loadSmallGallery();
    } else {
      alert("Erreur lors de l'ajout de la photo.");
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la photo :", error);
  }
});

// ===============================
// Gestion du bouton logout
// ===============================
document.getElementById("logout")?.addEventListener("click", function (e) {
  e.preventDefault();
  localStorage.removeItem("authToken");
  window.location.href = "login.html";
});

// ===============================
// Scroll fluide pour les liens internes
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'instant' });
    }
  });
});

// ===============================
// Chargement des catégories au démarrage
// ===============================
loadCategories();

async function loadCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    const categories = await response.json();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Erreur lors du chargement des catégories :', error);
  }
}
