<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../supabase'

const feedTime = ref('')
const amount = ref('')
const unit = ref('oz')
const diaper = ref('pee')

const logs = ref([])

async function saveLog() {
  const { error } = await supabase.from('baby_logs').insert({
    feed_time: feedTime.value,
    feed_amount: amount.value,
    feed_unit: unit.value,
    diaper_type: diaper.value
  })

  if (error) alert(error.message)
  else {
    // alert('Saved!')
    amount.value = ''
  }
}

onMounted(async () => {
  const { data } = await supabase
    .from('baby_logs')
    .select('*')

  logs.value = data || []
})
</script>

<template>
  <div class="container">
    <h2>New Entry</h2>

    <input type="datetime-local" v-model="feedTime" />

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

    <button @click="saveLog">Save</button>
  </div>
  <div class="container">
    <h2>Baby Logs</h2>
    <table class="table" v-if="logs.length">
      <thead>
        <tr>
          <!-- <th>ID</th> -->
          <th>Feed Time</th>
          <th>Feed Amount</th>
          <!-- <th>Feed Unit</th> -->
          <th>Diaper Type</th>
          <!-- <th>Created At</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id">
          <!-- <td>{{ log.id }}</td> -->
          <td>{{ new Date(log.feed_time).toLocaleString() }}</td>
          <td>{{ log.feed_amount + " " + log.feed_unit }}</td>
          <!-- <td>{{ log.feed_unit }}</td> -->
          <td>{{ log.diaper_type }}</td>
          <!-- <td>{{ new Date(log.created_at).toLocaleString() }}</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
}

input,
select,
button {
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.6rem;
  font-size: 1rem;
}

.row {
  display: flex;
  gap: 0.5rem;
}

button {
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
