import { createRouter, createWebHashHistory } from 'vue-router'
import LogEntry from './views/LogEntry.vue'
import Dashboard from './views/Dashboard.vue'
import MilkTracker from './views/MilkTracker.vue'
import Homepage from './views/Homepage.vue'

export default createRouter({
  history: createWebHashHistory(), // REQUIRED for GitHub Pages
  routes: [
    { path: '/', component: Homepage },
    { path: '/babylogs', component: LogEntry },
    {path: '/milktracker', component: MilkTracker}
  ]
})
