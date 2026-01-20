<template>
  <div class="storage-page">
    <h1>Breast Milk Storage Tracker</h1>

    <!-- Form to Add a Bag -->
    <form @submit.prevent="addBag" class="form">
      <div>
        <label>Bag Name</label>
        <input type="text" v-model="bagName" placeholder="Enter bag name" required />
      </div>

      <div>
        <label>Date Pumped</label>
        <input type="date" v-model="datePumped" required />
      </div>

      <div>
        <label>Amount (oz)</label>
        <input type="number" v-model.number="amount" min="0.5" step="0.5" required />
      </div>

      <button type="submit">Add Bag</button>
    </form>

    <!-- Filters -->
    <!-- <div class="filters">
      <h3>Filter Bags</h3>
      <div>
        <label>From Date</label>
        <input type="date" v-model="filterStartDate" />
      </div>
      <div>
        <label>To Date</label>
        <input type="date" v-model="filterEndDate" />
      </div>
      <div>
        <label>Min Amount</label>
        <input type="number" v-model.number="filterMinAmount" min="0" step="0.5" />
      </div>
      <div>
        <label>Max Amount</label>
        <input type="number" v-model.number="filterMaxAmount" min="0" step="0.5" />
      </div>
    </div> -->

    <!-- Display Filtered Bags -->
    <!-- <h3 v-if="filteredBags.length">Stored Bags</h3>
    <p v-else>No bags found for current filters.</p> -->

    <table v-if="filteredBags.length">
      <thead>
        <tr>
          <th>Bag Name</th>
          <th>Date Pumped</th>
          <th>Amount (oz)</th>
          <th>Expires On</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bag, index) in filteredBags" :key="index">
          <td>{{ bag.bagName }}</td>
          <td>{{ bag.datePumped }}</td>
          <td>{{ bag.amount }}</td>
          <td>{{ bag.expiresOn }}</td>
          <td>
            <span :class="statusClass(bag)">
              {{ bagStatus(bag) }}
            </span>
          </td>
          <td>
            <button @click="removeBag(index)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No bags available</p>

    <!-- Display Filtered Bags as Cards -->
    <div v-if="filteredBags.length" class="bag-cards">
      <div v-for="(bag, index) in filteredBags" :key="index" class="bag-card">
        <div class="card-row"><strong>Bag Name:</strong> {{ bag.bagName }}</div>
        <div class="card-row"><strong>Date Pumped:</strong> {{ bag.datePumped }}</div>
        <div class="card-row"><strong>Amount:</strong> {{ bag.amount }} oz</div>
        <div class="card-row"><strong>Expires On:</strong> {{ bag.expiresOn }}</div>
        <div class="card-row">
          <strong>Status:</strong>
          <span :class="statusClass(bag)">
            {{ bagStatus(bag) }}
          </span>
        </div>
        <button @click="removeBag(index)">Remove</button>
      </div>
    </div>

    <p v-else>No bags found for current filters.</p>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Form Inputs
const bagName = ref('');
const datePumped = ref('');
const amount = ref(null);

// Filter Inputs
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterMinAmount = ref(null);
const filterMaxAmount = ref(null);

// Milk bags data
const bags = ref([]);

// Freezer expiration days
const FREEZER_DAYS = 180; // 6 months

function addBag() {
  const pumpedDate = new Date(datePumped.value);
  const expirationDate = new Date(pumpedDate);
  expirationDate.setDate(expirationDate.getDate() + FREEZER_DAYS);

  bags.value.push({
    bagName: bagName.value,
    datePumped: datePumped.value,
    amount: amount.value,
    expiresOn: expirationDate.toISOString().split('T')[0],
  });

  bagName.value = '';
  datePumped.value = '';
  amount.value = null;
}

function removeBag(index) {
  bags.value.splice(index, 1);
}

// Status logic
function bagStatus(bag) {
  const today = new Date();
  const expDate = new Date(bag.expiresOn);
  const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'Expired';
  if (diffDays <= 7) return 'Expiring Soon';
  return 'Good';
}

function statusClass(bag) {
  const status = bagStatus(bag);
  return {
    expired: status === 'Expired',
    expiring: status === 'Expiring Soon',
    good: status === 'Good',
  };
}

// Filtered bags
const filteredBags = computed(() => {
  return bags.value.filter(bag => {
    const bagDate = new Date(bag.datePumped);
    const startDate = filterStartDate.value ? new Date(filterStartDate.value) : null;
    const endDate = filterEndDate.value ? new Date(filterEndDate.value) : null;
    const minAmt = filterMinAmount.value != null ? filterMinAmount.value : null;
    const maxAmt = filterMaxAmount.value != null ? filterMaxAmount.value : null;

    if (startDate && bagDate < startDate) return false;
    if (endDate && bagDate > endDate) return false;
    if (minAmt != null && bag.amount < minAmt) return false;
    if (maxAmt != null && bag.amount > maxAmt) return false;

    return true;
  });
});
</script>

<style scoped>
/* .storage-page {
  max-width: 700px;
  margin: auto;
  font-family: sans-serif;
}

.form,
.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.form div,
.filters div {
  display: flex;
  flex-direction: column;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

button {
  cursor: pointer;
}

.expired {
  color: red;
  font-weight: bold;
}

.expiring {
  color: orange;
  font-weight: bold;
}

.good {
  color: green;
  font-weight: bold;
} */
.storage-page {
  max-width: 700px;
  margin: 40px auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* Form and Filters as wireframe cards */
.form,
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 16px;
  border: 2px dashed #aaa;
  /* wireframe border */
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

/* Individual input boxes */
.form div,
.filters div {
  display: flex;
  flex-direction: column;
  flex: 1 1 150px;
}

/* Labels as simple wireframe text */
label {
  font-weight: 600;
  margin-bottom: 4px;
}

/* Inputs styled as wireframe boxes */
input[type="text"],
input[type="date"],
input[type="number"] {
  padding: 6px 8px;
  border: 2px solid #aaa;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  outline: none;
}

input[type="text"]:focus,
input[type="date"]:focus,
input[type="number"]:focus {
  border-color: #555;
}

/* Buttons as simple outlined wireframe */
button {
  padding: 8px 12px;
  border: 2px solid #aaa;
  border-radius: 4px;
  background: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

button:hover {
  border-color: #333;
  background-color: #eee;
}

/* Table as wireframe */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  border: 2px dashed #aaa;
}

th,
td {
  border: 1px dashed #aaa;
  padding: 10px;
  text-align: center;
  font-size: 14px;
}

/* Table header */
th {
  background-color: #f0f0f0;
  font-weight: 700;
}

/* Status indicators as outlined labels */
.expired,
.expiring,
.good {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #aaa;
  font-size: 12px;
}

/* Colors are minimal for wireframe feel */
.expired {
  color: #d9534f;
  border-color: #d9534f;
}

.expiring {
  color: #f0ad4e;
  border-color: #f0ad4e;
}

.good {
  color: #5cb85c;
  border-color: #5cb85c;
}

/*--------------------- */

/* Container for cards */
.bag-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

/* Individual bag card */
.bag-card {
  border: 2px dashed #aaa;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Each row inside the card */
.card-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

/* Button inside card */
.bag-card button {
  align-self: flex-start;
  margin-top: 8px;
  padding: 6px 10px;
  border: 2px solid #aaa;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-weight: 600;
}

.bag-card button:hover {
  border-color: #333;
  background-color: #eee;
}

/* Status indicators */
.expired,
.expiring,
.good {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  border: 1px solid #aaa;
  font-size: 12px;
}

/* Minimal colors for wireframe feel */
.expired {
  color: #d9534f;
  border-color: #d9534f;
}

.expiring {
  color: #f0ad4e;
  border-color: #f0ad4e;
}

.good {
  color: #5cb85c;
  border-color: #5cb85c;
}
</style>
