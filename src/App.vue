<template>
  <!-- Wireframe Navbar -->
  <nav class="nav">
    <router-link to="/" class="nav-link">Baby Logs</router-link>
    <router-link to="/milktracker" class="nav-link">Milk Tracker</router-link>
  </nav>

  <!-- Main content -->
  <main class="main-content">
    <router-view />
  </main>
</template>

<script setup>
// No JS needed here; routing handles which page shows
</script>

<style scoped>
/* Navbar - wireframe style */
.nav {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border: 2px dashed #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.nav-link {
  padding: 6px 12px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}

.nav-link:hover {
  background-color: #eee;
  border-color: #555;
}

/* Main container spacing */
.main-content {
  max-width: 700px;
  margin: auto;
  padding: 16px;
}
</style>
