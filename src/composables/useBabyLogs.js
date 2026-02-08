import { ref } from "vue";
import { supabase } from "../supabase";

export function useBabyLogs() {
  const logs = ref([])
  const loading = ref(false)
  const error = ref(null)

  const table = 'baby_logs'

  // READ (all)
  const fetchLogs = async () => {
    loading.value = true
    error.value = null

    const { data, err } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })

    if (err) {
      error.value = err.message
    } else {
      logs.value = data || []
    }

    loading.value = false
  }

  // LATEST
  const getLatestLogs = async (limit) => {
    const { data, err } = await supabase
      .from(table)
      .select('*')
      .order('feed_time', { ascending: false })
      .limit(limit)

    if (err) throw err
    return data
  }

  // READ (single)
  const getLogById = async (id) => {
    const { data, err } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (err) throw err
    return data
  }

  // CREATE
  const createLog = async (payload) => {
    const { data, err } = await supabase
      .from(table)
      .insert(payload)

    if (err) throw err

    const latestLog = await getLatestLogs(1)

    logs.value.unshift(latestLog[0])
  }

  // UPDATE
  const updateLog = async (id, payload) => {
    const { data, err } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err

    const index = logs.value.findIndex(b => b.id === id)
    if (index !== -1) {
      logs.value[index] = data
    }
  }

  // DELETE
  const deleteLog = async (id) => {
    const { err } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (err) throw err
    logs.value = logs.value.filter(b => b.id !== id)
  }

  return {
    logs,
    loading,
    error,
    fetchLogs,
    getLogById,
    createLog,
    updateLog,
    deleteLog,
  }
}