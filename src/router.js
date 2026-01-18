import { createRouter, createWebHashHistory } from 'vue-router'
import LogEntry from './views/LogEntry.vue'
import Dashboard from './views/Dashboard.vue'
import EntryEdit from './views/EntryEdit.vue'

export default createRouter({
  history: createWebHashHistory(), // REQUIRED for GitHub Pages
  routes: [
    { path: '/', component: LogEntry },
    { path: '/dashboard', component: Dashboard },
    { path: '/entryedit', component: EntryEdit}
  ]
})
