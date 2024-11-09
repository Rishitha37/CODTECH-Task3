// Store posts in localStorage
let posts = JSON.parse(localStorage.getItem('blog-posts')) || [];
let editingPostId = null;

// DOM Elements
const newPostBtn = document.getElementById('newPostBtn');
const postForm = document.getElementById('postForm');
const blogForm = document.getElementById('blogForm');
const postsContainer = document.getElementById('posts');
const themeToggle = document.getElementById('themeToggle');
const postTitleInput = document.getElementById('postTitle');
const postContentInput = document.getElementById('postContent');
const cancelBtn = document.getElementById('cancelBtn');

// Theme Management
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeToggle.textContent = isDark ? '🌞' : '🌙';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '🌞';

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
newPostBtn.addEventListener('click', () => {
  editingPostId = null;
  postForm.querySelector('h2').textContent = 'Create New Post';
  blogForm.reset();
  togglePostForm();
});
blogForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', () => {
  blogForm.reset();
  postForm.classList.add('hidden');
  editingPostId = null;
});

// Initialize
renderPosts();

function togglePostForm() {
  postForm.classList.toggle('hidden');
}

function handleSubmit(e) {
  e.preventDefault();
  
  const title = postTitleInput.value.trim();
  const content = postContentInput.value.trim();
  
  if (!title || !content) return;
  
  if (editingPostId) {
    // Update existing post
    const index = posts.findIndex(post => post.id === editingPostId);
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        title,
        content,
        edited: true,
        editDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };
    }
    editingPostId = null;
  } else {
    // Create new post
    const newPost = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    posts.unshift(newPost);
  }
  
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  blogForm.reset();
  postForm.classList.add('hidden');
  renderPosts();
}

function editPost(id) {
  const post = posts.find(post => post.id === id);
  if (post) {
    editingPostId = id;
    postTitleInput.value = post.title;
    postContentInput.value = post.content;
    postForm.querySelector('h2').textContent = 'Edit Post';
    postForm.classList.remove('hidden');
  }
}

function deletePost(id) {
  if (confirm('Are you sure you want to delete this post?')) {
    posts = posts.filter(post => post.id !== id);
    localStorage.setItem('blog-posts', JSON.stringify(posts));
    renderPosts();
  }
}

function renderPosts() {
  postsContainer.innerHTML = posts.map(post => `
    <article class="post">
      <div class="post-header">
        <div class="post-info">
          <h2 class="post-title">${post.title}</h2>
          <div class="post-date">
            Posted on ${post.date}
            ${post.edited ? `<br>Edited on ${post.editDate}` : ''}
          </div>
        </div>
        <div class="post-actions">
          <button onclick="editPost(${post.id})" class="btn btn-edit">Edit</button>
          <button onclick="deletePost(${post.id})" class="btn btn-delete">Delete</button>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
    </article>
  `).join('');
}

// Make functions available globally for onclick handlers
window.editPost = editPost;
window.deletePost = deletePost;

// Initialize with sample content if no posts exist
if (posts.length === 0) {
  const samplePost = {
    id: Date.now(),
    title: "Welcome to My Blog",
    content: "This is a simple blog platform built with HTML, CSS, and JavaScript. Click the 'New Post' button to create your first blog post!",
    date: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  };
  posts.push(samplePost);
  localStorage.setItem('blog-posts', JSON.stringify(posts));
  renderPosts();
}
