import { ref } from 'vue'
import { supabase } from '../supabase'

export function useBreastMilkBags() {
  const bags = ref([])
  const loading = ref(false)
  const error = ref(null)

  const table = 'breast_milk_bags'

  // READ (all)
  const fetchBags = async () => {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .order('date_start', { ascending: true })

    if (err) {
      error.value = err.message
    } else {
      bags.value = data || []
    }

    loading.value = false
  }

  // READ (single)
  const getBagById = async (id) => {
    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (err) throw err
    return data
  }

  // CREATE
  const createBag = async (payload) => {
    const { data, error: err } = await supabase
      .from(table)
      .insert(payload)
      .select()
      .single()

    if (err) throw err

    bags.value.unshift(data)
    return data
  }

  // UPDATE
  const updateBag = async (id, payload) => {
    const { data, error: err } = await supabase
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err

    const index = bags.value.findIndex(b => b.id === id)
    if (index !== -1) {
      bags.value[index] = data
    }

    return data
  }

  // DELETE
  const deleteBag = async (id) => {
    const { error: err } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (err) throw err

    bags.value = bags.value.filter(b => b.id !== id)
  }

  return {
    bags,
    loading,
    error,
    fetchBags,
    getBagById,
    createBag,
    updateBag,
    deleteBag,
  }
}
