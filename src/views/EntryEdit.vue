<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase';

const logs = ref([])

onMounted(async () => {
  const { data } = await supabase
    .from('baby_logs')
    .select('*')

  logs.value = data || []
})
</script>

<template>
  <div>
    <h2>Baby Logs</h2>
    <table v-if="logs.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Feed Time</th>
          <th>Feed Amount</th>
          <th>Feed Unit</th>
          <th>Diaper Type</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ log.id }}</td>
          <td>{{ new Date(log.feed_time).toLocaleString() }}</td>
          <td>{{ log.feed_amount }}</td>
          <td>{{ log.feed_unit }}</td>
          <td>{{ log.diaper_type }}</td>
          <td>{{ new Date(log.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
  .table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f2f2f2;
  }
</style>