/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '')
  }
}

loadEnvFile(path.join(process.cwd(), '.env.local'))
loadEnvFile(path.join(process.cwd(), '.env'))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  ?.replace(/;$/, '')
  ?.replace(/\/rest\/v1\/?$/, '')
  .replace(/\/+$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('FAIL: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey)
const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))

async function readStatus(approvalId, label) {
  const { data, error } = await supabase
    .from('application_approvals')
    .select('status')
    .eq('id', approvalId)
    .single()

  if (error) throw new Error(`${label} status lookup failed: ${error.message}`)
  console.log(`${label} application status: ${data.status}`)
  return data.status
}

function queryIdFromRpc(data) {
  const row = Array.isArray(data) ? data[0] : data
  return row && (row.id || row.query_id)
}

async function main() {
  const { data: approvals, error: approvalError } = await supabase
    .from('application_approvals')
    .select('id')
    .limit(1)

  if (approvalError) throw new Error(`Could not select an application approval: ${approvalError.message}`)
  const approval = approvals && approvals[0]
  if (!approval) throw new Error('Could not select an application approval: no rows returned')
  const approvalId = approval.id
  console.log(`Testing application approval UUID: ${approvalId}`)

  const events = []
  const channel = supabase
    .channel(`query-flow-test-${approvalId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'queries',
        filter: `application_approval_id=eq.${approvalId}`,
      },
      payload => {
        events.push(payload)
        console.log(`Realtime event: ${payload.eventType}`)
      }
    )

  const subscribed = new Promise((resolve, reject) => {
    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') resolve()
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') reject(new Error(`Realtime subscription ${status}`))
    })
  })
  await subscribed
  console.log('Realtime subscription: SUBSCRIBED')

  await wait(1000)
  const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const { data: raised, error: raiseError } = await supabase.rpc('raise_query', {
    p_approval_id: approvalId,
    p_category: 'Automated realtime flow test',
    p_message: `Realtime flow test ${new Date().toISOString()}`,
    p_required_document_key: null,
    p_deadline: deadline,
  })
  if (raiseError) throw new Error(`raise_query failed: ${raiseError.message}`)

  let createdQueryId = queryIdFromRpc(raised)
  if (!createdQueryId) {
    const { data: query, error: queryError } = await supabase
      .from('queries')
      .select('id')
      .eq('application_approval_id', approvalId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (queryError) throw new Error(`Could not identify the created query: ${queryError.message}`)
    if (!query) throw new Error('raise_query returned no query id')
    createdQueryId = query.id
  }
  await readStatus(approvalId, 'After raise_query')
  const insertPassed = await waitForEvent(events, 'INSERT')
  console.log(insertPassed ? 'INSERT realtime check: PASS' : 'INSERT realtime check: FAIL')

  const { error: respondError } = await supabase.rpc('respond_to_query', {
    p_query_id: createdQueryId,
    p_response: `Realtime response flow test ${new Date().toISOString()}`,
  })
  if (respondError) throw new Error(`respond_to_query failed: ${respondError.message}`)

  await readStatus(approvalId, 'After respond_to_query')
  const updatePassed = await waitForEvent(events, 'UPDATE')
  console.log(updatePassed ? 'UPDATE realtime check: PASS' : 'UPDATE realtime check: FAIL')

  await supabase.removeChannel(channel)
  if (!insertPassed || !updatePassed) process.exitCode = 1
}

async function waitForEvent(events, eventType) {
  const end = Date.now() + 3000
  while (Date.now() < end) {
    if (events.some(event => event.eventType === eventType)) return true
    await wait(50)
  }
  return events.some(event => event.eventType === eventType)
}

main().catch(error => {
  console.error(`FAIL: ${error.message}`)
  process.exitCode = 1
})
