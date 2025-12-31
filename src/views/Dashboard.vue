<script setup>
import { ref, onMounted } from 'vue'
// import { supabase } from '../supabase'
import { Bar, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const logs = ref([])

onMounted(async () => {
//   const { data } = await supabase
//     .from('baby_logs')
//     .select('*')
//     .order('feed_time')

//   logs.value = data || []
})

const diaperCounts = () => ({
  pee: logs.value.filter(l => l.diaper_type === 'pee').length,
  poop: logs.value.filter(l => l.diaper_type === 'poop').length,
  both: logs.value.filter(l => l.diaper_type === 'both').length
})
</script>

<template>
  <div class="container">
    <h2>Feed Amounts</h2>
    <Bar
      :data="{
        labels: logs.map(l => new Date(l.feed_time).toLocaleTimeString()),
        datasets: [{
          label: 'Feed',
          data: logs.map(l => l.feed_amount),
          backgroundColor: '#6366f1'
        }]
      }"
    />

    <h2>Diapers</h2>
    <Pie
      :data="{
        labels: ['Pee', 'Poop', 'Both'],
        datasets: [{
          data: Object.values(diaperCounts()),
          backgroundColor: ['#60a5fa', '#f97316', '#22c55e']
        }]
      }"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
}
</style>
