import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wutjkaonjygrjbanfxzn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGprYW9uanlncmpiYW5meHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MTU0MTcsImV4cCI6MjA5NjE5MTQxN30.dRK5MzAJ51DukC0E2lMMVkH9NNkNKffrWx4Mie5-C18'

const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

describe('E-14 FORENSIC ENGINE', () => {

  test('Detect fraudulent voting tables', async () => {

    const { data, error } = await supabase
      .from('e14_forms')
      .select(`
        *,
        polling_tables!inner (
          registered_voters
        )
      `)

    expect(error).toBeNull()

    const fraudulentTables = data.filter((table) => {

      const totalVotes =
        table.candidate_a_votes +
        table.candidate_b_votes +
        table.blank_votes +
        table.null_votes

      return (
        totalVotes >
        table.polling_tables.registered_voters
      )
    })

    console.log('\nFRAUD DETECTED:\n')

    console.table(
      fraudulentTables.map((table) => {
    
        const totalVotes =
          table.candidate_a_votes +
          table.candidate_b_votes +
          table.blank_votes +
          table.null_votes
    
        return {
          mesa: table.table_id,
          total_votos: totalVotes,
          limite_legal: table.polling_tables.registered_voters,
          fraude: totalVotes > table.polling_tables.registered_voters
        }
      })
    )

    expect(fraudulentTables.length).toBeGreaterThan(0)
  })
})