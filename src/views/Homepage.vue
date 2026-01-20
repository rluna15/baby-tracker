<script setup>
import { ref } from 'vue';

// Dummy data for preview
const recentLogs = ref([
	{ id: 1, feed_time: new Date().toISOString(), feed_amount: 3, feed_unit: 'oz', diaper_type: 'pee' },
	{ id: 2, feed_time: new Date().toISOString(), feed_amount: 4, feed_unit: 'oz', diaper_type: 'poop' },
]);
</script>

<template>
	<!-- Main content -->
	<main class="main-content">
		<h1>Baby Tracker Dashboard</h1>

		<!-- Quick Access Cards -->
		<div class="quick-cards">
			<router-link to="/babylogs" class="quick-card">
				<h3>Baby Logs</h3>
				<p>View and add feeding & diaper logs</p>
			</router-link>

			<router-link to="/milktracker" class="quick-card">
				<h3>Milk Tracker</h3>
				<p>Track pumped milk and expiration dates</p>
			</router-link>

			<div class="quick-card">
				<h3>Upcoming Alerts</h3>
				<p>Milk bags expiring soon or missed feeds</p>
			</div>
		</div>

		<!-- Recent Logs Preview (cards on mobile / table on desktop) -->
		<section class="recent-section">
			<h2>Recent Baby Logs</h2>

			<!-- Card view mobile -->
			<div class="log-cards mobile-only">
				<div class="log-card" v-for="log in recentLogs" :key="log.id">
					<div><strong>Feed Time:</strong> {{ new Date(log.feed_time).toLocaleString() }}</div>
					<div><strong>Amount:</strong> {{ log.feed_amount }} {{ log.feed_unit }}</div>
					<div><strong>Diaper:</strong> {{ log.diaper_type }}</div>
				</div>
			</div>

			<!-- Table view desktop -->
			<table class="log-table desktop-only">
				<thead>
					<tr>
						<th>Feed Time</th>
						<th>Amount</th>
						<th>Diaper</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="log in recentLogs" :key="log.id">
						<td>{{ new Date(log.feed_time).toLocaleString() }}</td>
						<td>{{ log.feed_amount }} {{ log.feed_unit }}</td>
						<td>{{ log.diaper_type }}</td>
					</tr>
				</tbody>
			</table>

			<p v-if="recentLogs.length === 0">No logs yet.</p>
		</section>
	</main>
</template>

<style>
/* Main content */
.main-content {
	max-width: 900px;
	margin: auto;
	padding: 16px;
}

/* Quick Access Cards */
.quick-cards {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-bottom: 24px;
}

.quick-card {
	flex: 1 1 200px;
	border: 2px dashed #aaa;
	border-radius: 8px;
	padding: 16px;
	background-color: #f9f9f9;
	text-align: center;
	text-decoration: none;
	color: #333;
	transition: background 0.2s, border-color 0.2s;
}

.quick-card:hover {
	background-color: #eee;
	border-color: #555;
}

.quick-card h3 {
	margin-bottom: 8px;
}

/* Recent Logs */
.recent-section {
	margin-top: 24px;
}

.log-cards {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.log-card {
	border: 2px dashed #aaa;
	border-radius: 8px;
	padding: 12px;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.log-card strong {
	font-weight: 600;
}

/* Table for desktop */
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

/* Responsive */
.desktop-only {
	display: none;
}

.mobile-only {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

@media (min-width: 768px) {
	.desktop-only {
		display: table;
	}

	.mobile-only {
		display: none;
	}
}
</style>