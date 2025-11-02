import { supabase } from '../lib/supabaseClient'

/** RPC: vrati trenutni balans tokena za ulogovanog korisnika */
export async function getTokenBalance() {
  const { data, error } = await supabase.rpc('get_token_balance')
  if (error) throw error
  return data as number
}

/** Edge Function: pokreni AI generisanje (JWT je obavezan) */
export async function generateImage(genId: string) {
  const { data: sessionRes } = await supabase.auth.getSession()
  const accessToken = sessionRes.session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const { VITE_FUNCTIONS_URL } = import.meta.env
  if (!VITE_FUNCTIONS_URL) throw new Error('VITE_FUNCTIONS_URL is not defined')
  
  const res = await fetch(`${VITE_FUNCTIONS_URL}/generate-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ generation_id: genId }),
  })
  if (!res.ok) throw new Error('Generation failed')
  return res.json() as Promise<{ ok: boolean; generation_id: string; preview_url: string | null }>
}

/* (Opcionalno) tipične pomoćne stvari koje ćeš verovatno dodati ovde:
export async function startGeneration(args: {
  room_photo_id: string
  character_id: string
  action_id: string
  custom_prompt?: string | null
  realism_filter?: boolean
}) {
  const { data, error } = await supabase.rpc('start_generation', {
    _room_photo_id: args.room_photo_id,
    _character_id: args.character_id,
    _action_id: args.action_id,
    _custom_prompt: args.custom_prompt ?? null,
    _realism_filter: args.realism_filter ?? false,
  })
  if (error) throw error
  return data as string // generation_id
}
*/