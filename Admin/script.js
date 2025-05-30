import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  set,
  update,
  remove,
  get
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAnk8ApGJZd85R8eT2ryg72jUd90VEyuAQ",
  authDomain: "test-pro-e6152.firebaseapp.com",
  databaseURL: "https://test-pro-e6152-default-rtdb.firebaseio.com",
  projectId: "test-pro-e6152",
  storageBucket: "test-pro-e6152.appspot.com",
  messagingSenderId: "766763484355",
  appId: "1:766763484355:web:db970872019c63a507ce76"
};

// App initialization
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM Elements
const form = document.getElementById('shayariForm');
const input = document.getElementById('shayariInput');
const list = document.getElementById('shayariList');
const logoutBtn = document.getElementById('logoutBtn');
const status = document.getElementById('status');

let editingKey = null;

// Logout functionality
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    status.textContent = "You have been logged out.";
  } catch (error) {
    status.textContent = `Logout error: ${error.message}`;
  }
});

// Submit form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  if (editingKey) {
    await update(ref(db, 'shayaris/' + editingKey), { text });
    editingKey = null;
    window.localStorage.setItem("e01", 'null');
  } else {
    const newRef = push(ref(db, 'shayaris'));
    await set(newRef, { text });
  }

  input.value = '';
  loadShayaris();
});

// Load Shayaris
// function loadShayaris() {
//   get(ref(db, 'shayaris')).then((snapshot) => {
//     const data = snapshot.val();
//     list.innerHTML = '';

//     if (!data) return;

//     for (let key in data) {
//       const item = data[key];
//       const card = document.createElement('div');
//       card.className = 'shayari-card';

//       card.innerHTML = `
//         <div class="shayari-text">${item.text}</div>
//         <div class="card-actions">
//           <i class="e fa fa-pen edit-btn" data-key="${key}" data-text="${item.text.replace(/"/g, '&quot;')}"></i>
//           <i class="e fa fa-trash delete-btn" data-key="${key}"></i>
//         </div>
//       `;

//       list.appendChild(card);
//     }

//     // Attach listeners after DOM render
//     document.querySelectorAll('.edit-btn').forEach(btn => {
//       btn.addEventListener('click', () => {
//         const key = btn.getAttribute('data-key');
//         const text = btn.getAttribute('data-text');
//         editShayari(key, text);
//       });
//     });

//     document.querySelectorAll('.delete-btn').forEach(btn => {
//       btn.addEventListener('click', () => {
//         const key = btn.getAttribute('data-key');
//         deleteShayari(key);
//       });
//     });
//   });
// }

function loadShayaris() {
  const loader = document.getElementById('pageLoader');
  get(ref(db, 'shayaris')).then((snapshot) => {
    const data = snapshot.val();
    list.innerHTML = '';

    if (!data) {
      loader.classList.add('hidden');
      return;
    }

    for (let key in data) {
      const item = data[key];
      const card = document.createElement('div');
      card.className = 'shayari-card';

      card.innerHTML = `
        <div class="shayari-text">${item.text}</div>
        <div class="card-actions">
          <i class="e fa fa-pen edit-btn" data-key="${key}" data-text="${item.text.replace(/"/g, '&quot;')}"></i>
          <i class="e fa fa-trash delete-btn" data-key="${key}"></i>
        </div>
      `;

      list.appendChild(card);
    }

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        const text = btn.getAttribute('data-text');
        editShayari(key, text);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-key');
        deleteShayari(key);
      });
    });

    // Hide loader after all DOM updates
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 300);
  });
}


// Edit Shayari
function editShayari(key, text) {
  input.value = text;
  editingKey = key;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete Shayari
function deleteShayari(key) {
  if (confirm("Are you sure you want to delete this Shayari?")) {
    remove(ref(db, 'shayaris/' + key)).then(loadShayaris);
  }
}

// Initial load
window.addEventListener('load', loadShayaris);

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}