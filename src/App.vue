<template>
  <!-- Navbar -->
  <nav class="nav">
    <router-link to="/" class="nav-link">Home</router-link>
    <router-link to="/babylogs" class="nav-link">Baby Logs</router-link>
    <router-link to="/milktracker" class="nav-link">Milk Tracker</router-link>
  </nav>

  <router-view/>
</template>

<script setup>

</script>

<style scoped>
/* Navbar */
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
}

.nav-link:hover {
  background-color: #eee;
  border-color: #555;
}
</style>
