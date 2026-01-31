<script setup>
import { ref, computed, onMounted } from 'vue';

import { useBreastMilkBags } from '../composables/useBreastMilkBags';
const { bags, loading, error, fetchBags, createBag, deleteBag } = useBreastMilkBags()

// Form Inputs
const bagName = ref('');
const dateStart = ref('');
const dateEnd = ref('');
const amount = ref(null);

// Filter Inputs
const filterStartDate = ref('');
const filterEndDate = ref('');
const filterMinAmount = ref(null);
const filterMaxAmount = ref(null);

// Freezer expiration days
const FREEZER_DAYS = 180; // 6 months

function addBag() {
  const start = new Date(dateStart.value);
  const end = new Date(dateEnd.value);
  const expirationDate = new Date(start);
  expirationDate.setDate(expirationDate.getDate() + FREEZER_DAYS);

  createBag({
    name: bagName.value,
    date_start: start,
    date_end: end,
    amount: amount.value,
    expires_on: expirationDate
  })
}

function removeBag(index) {
  deleteBag(index)
}

// Status logic
function bagStatus(bag) {
  const today = new Date();
  const expDate = new Date(bag.expiresOn);
  const diffDays = (expDate - today) / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'Expired';
  if (diffDays <= 14) return 'Expiring Soon';
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

function formatDate(timestamp) {
  const date = new Date(timestamp)
  const options = { year: 'numeric', month: 'short', day: 'numeric'}
  return date.toLocaleDateString('en-US', options)
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

const totalSupply = computed(() => {
  let totalAmount = 0;
  bags.value.forEach(bag => {
    totalAmount += bag.amount
  })

  return totalAmount
})

onMounted(() => {
  fetchBags()
})
</script>

<template>
  <div class="container">
    <h2>Milk Tracker</h2>

    <!-- Add Bag Form -->
    <div class="form-card">
      <input type="text" v-model="bagName" placeholder="Bag Name" />
      <input type="date" v-model="dateStart" />
      <input type="date" v-model="dateEnd" />
      <input type="number" v-model.number="amount" placeholder="Amount (oz)" />
      <button @click="addBag">Add Bag</button>
    </div>

    <!-- Filters -->
    <!-- <div class="filter-card">
      <input type="date" v-model="filterStartDate" placeholder="From Date" />
      <input type="date" v-model="filterEndDate" placeholder="To Date" />
      <input type="number" v-model.number="filterMinAmount" placeholder="Min Amount" />
      <input type="number" v-model.number="filterMaxAmount" placeholder="Max Amount" />
    </div> -->

    <div>
      <h3>Total Supply: {{ totalSupply }} oz</h3>
    </div>

    <!-- Cards (mobile) -->
    <div class="bag-cards mobile-only" v-if="filteredBags.length">
      <div v-for="(bag, index) in filteredBags" :key="index" class="bag-card">
        <div><strong>Bag Name:</strong> {{ bag.name }}</div>
        <div><strong>Date Pumped:</strong> {{ formatDate(bag.date_start) }} - {{ formatDate(bag.date_end) }}</div>
        <div><strong>Amount:</strong> {{ bag.amount }} oz</div>
        <div><strong>Expires On:</strong> {{ formatDate(bag.expires_on) }}</div>
        <div>
          <strong>Status:</strong>
          <span :class="statusClass(bag)">{{ bagStatus(bag) }}</span>
        </div>
        <button @click="removeBag(bag.id)">Remove</button>
      </div>
    </div>

    <!-- Table (desktop) -->
    <table class="bag-table desktop-only" v-if="filteredBags.length">
      <thead>
        <tr>
          <th>Bag Name</th>
          <th>Date Pumped</th>
          <th>Amount (oz)</th>
          <th>Expires On</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bag, index) in filteredBags" :key="index">
          <td>{{ bag.name }}</td>
          <td>{{ formatDate(bag.date_start) }} - {{ formatDate(bag.date_end) }}</td>
          <td>{{ bag.amount }}</td>
          <td>{{ formatDate(bag.expires_on) }}</td>
          <td><span :class="statusClass(bag)">{{ bagStatus(bag) }}</span></td>
          <td><button @click="removeBag(bag.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else>No milk bags found.</p>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form & Filter Cards */
.form-card,
.filter-card {
  border: 2px dashed #aaa;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  background-color: #f9f9f9;
}

input {
  padding: 6px;
  border: 2px dashed #aaa;
  border-radius: 4px;
  flex: 1 1 120px;
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
  border-color: #555;
  background: #eee;
}

/* Bag cards */
.bag-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bag-card {
  border: 2px dashed #aaa;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bag-card strong {
  font-weight: 600;
}

/* Status colors */
.expired {
  color: #d9534f;
  border-color: #d9534f;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.expiring {
  color: #f0ad4e;
  border-color: #f0ad4e;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.good {
  color: #5cb85c;
  border-color: #5cb85c;
  border: 1px dashed;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* Tables */
.bag-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.bag-table th,
.bag-table td {
  border: 2px dashed #aaa;
  padding: 8px;
  text-align: left;
}

.bag-table th {
  background-color: #f0f0f0;
  font-weight: 600;
}

/* Hide on mobile by default */
.desktop-only {
  display: none;
}

/* Show only on mobile */
.mobile-only {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Responsive breakpoint: desktop */
@media (min-width: 768px) {
  .desktop-only {
    display: table;
  }

  .mobile-only {
    display: none;
  }
}
</style>
