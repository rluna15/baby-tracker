<script setup>
import { onMounted, ref } from 'vue'

import AsciiLocader from '../components/AsciiLocader.vue'

import { useBabyLogs } from '../composables/useBabyLogs'
const { logs, loading, error, fetchLogs, createLog} = useBabyLogs()

const feedTime = ref('')
const amount = ref('')
const unit = ref('oz')
const diaper = ref('pee')

function saveLog() {
  createLog({
    feed_time: feedTime.value,
    feed_amount: amount.value,
    feed_unit: unit.value,
    diaper_type: diaper.value
  })

  amount.value = ''
  unit.value = 'oz'
  diaper.value = 'pee'
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="container">
    <h2>New Entry</h2>

    <input type="datetime-local" v-model="feedTime" placeholder="Feed Time" />
    <div class="row">
      <input type="number" placeholder="Amount" v-model="amount" />
      <select v-model="unit">
        <option value="oz">oz</option>
        <option value="ml">ml</option>
      </select>
    </div>
    <select v-model="diaper">
      <option value="pee">Pee</option>
      <option value="poop">Poop</option>
      <option value="both">Both</option>
      <option value="none">None</option>
    </select>
    <AsciiLocader v-if="loading"></AsciiLocader>
    <button v-else @click="saveLog">Save</button>
  </div>

  <div class="container">
    <h2>Baby Logs</h2>
    Entry Count: {{ logs.length }}
    <!-- Cards mobile -->
    <div class="log-cards mobile-only" v-if="logs.length">
      <div v-for="log in logs" :key="log.id" class="log-card">
        <div><strong>Feed Time:</strong> {{ new Date(log.feed_time).toLocaleString() }}</div>
        <div><strong>Feed Amount:</strong> {{ log.feed_amount + ' ' + log.feed_unit }}</div>
        <div><strong>Diaper Type:</strong> {{ log.diaper_type }}</div>
      </div>
    </div>

    <!-- Table desktop -->
    <table class="log-table desktop-only" v-if="logs.length">
      <thead>
        <tr>
          <th>Feed Time</th>
          <th>Feed Amount</th>
          <th>Diaper Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <td>{{ new Date(log.feed_time).toLocaleString() }}</td>
          <td>{{ log.feed_amount + ' ' + log.feed_unit }}</td>
          <td>{{ log.diaper_type }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No logs yet.</p>
  </div>
</template>

<style scoped>
.container {
  /* max-width: 400px; */
  margin: 20px auto;
  padding: 16px;
  border: 2px dashed #aaa;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

input,
select {
  width: 100%;
  padding: 6px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
select:focus {
  border-color: #555;
}

.row {
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background-color: #eee;
  border-color: #555;
}

.log-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.log-card {
  border: 2px dashed #aaa;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-card strong {
  font-weight: 600;
}

/* Tables */
.log-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.log-table th,
.log-table td {
  border: 2px dashed #aaa;
  padding: 8px;
  text-align: left;
}

.log-table th {
  background-color: #f0f0f0;
  font-weight: 600;
}

/* Hide table on mobile, show cards */
.desktop-only {
  display: none;
}

.mobile-only {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Responsive breakpoint */
@media (min-width: 768px) {
  .desktop-only {
    display: table;
  }

  .mobile-only {
    display: none;
  }
}
</style>
