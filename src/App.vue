<template>
  <nav class="nav">
    <router-link to="/">Log</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
    <router-link to="/entryedit">Entry Edit</router-link>
  </nav>
  <router-view />
</template>

<style>
.nav {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: #6366f1;
}
.nav a {
  color: white;
  font-weight: bold;
}
</style>
