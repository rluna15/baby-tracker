<script setup>
import { ref } from 'vue'
// import { supabase } from '../supabase'

const feedTime = ref('')
const amount = ref('')
const unit = ref('oz')
const diaper = ref('pee')

async function saveLog() {
//   const { error } = await supabase.from('baby_logs').insert({
//     feed_time: feedTime.value,
//     feed_amount: amount.value,
//     feed_unit: unit.value,
//     diaper_type: diaper.value
//   })

//   if (error) alert(error.message)
//   else {
//     alert('Saved!')
//     amount.value = ''
//   }
}
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
    </select>

    <button @click="saveLog">Save</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 1rem;
}
input, select, button {
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
</style>
