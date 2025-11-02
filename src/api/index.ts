// src/api/index.ts
import { supabase } from '../lib/supabaseClient'

export async function getTokenBalance() {
  const { data, error } = await supabase.rpc('get_token_balance')
  if (error) throw error
  return data as number
}

function dataUrlToFile(dataUrl: string, fileName = 'room.png') {
  const [head, b64] = dataUrl.split(',')
  const mime = head.match(/:(.*?);/)?.[1] || 'image/png'
  const bin = atob(b64)
  const u8 = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i)
  return new File([u8], fileName, { type: mime })
}

/** 1) Upload u Storage bucket 'room_photos' */
export async function uploadRoomPhotoFromDataUrl(dataUrl: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  const file = dataUrlToFile(dataUrl)
  const path = `${user.id}/${crypto.randomUUID()}.png`
  const { error } = await supabase.storage.from('room_photos').upload(path, file, {
    contentType: file.type || 'image/png',
    upsert: true,
  })
  if (error) throw error
  return path
}

/** 2) Insert u public.room_photos i vrati id */
export async function insertRoomPhotoRow(src_storage_path: string, room_id: string | null = null) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  const { data, error } = await supabase
    .from('room_photos')
    .insert({
      user_id: user.id,
      src_storage_path,
      room_id,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

/** 3) start_generation RPC — pravi red u public.generations i troši token */
export async function startGeneration(args: {
  room_photo_id: string
  character_slug?: string | null
  action_slug?: string | null
  custom_prompt?: string | null
  realism_filter?: boolean
}) {
  // Ako tvoj RPC očekuje UUID-ove za character/action — prilagodi! Ovde pretpostavljamo slug lookups u samom RPC-u.
  const { data, error } = await supabase.rpc('start_generation', {
    _room_photo_id: args.room_photo_id,
    _character_slug: args.character_slug ?? null,
    _action_slug: args.action_slug ?? null,
    _custom_prompt: args.custom_prompt ?? null,
    _realism_filter: args.realism_filter ?? false,
  })
  if (error) throw error
  return data as string // generation_id
}

/** 4) Edge funkcija /generate-image sa JWT */
export async function callGenerateImage(generation_id: string) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Not authenticated')

  const base = import.meta.env.VITE_FUNCTIONS_URL
  if (!base) throw new Error('VITE_FUNCTIONS_URL not set')

  const res = await fetch(`${base}/generate-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ generation_id }),
  })

  const text = await res.text()
  if (!res.ok) throw new Error(text || 'Generation failed')
  try { return JSON.parse(text) } catch { return { ok: true, raw: text } }
}
