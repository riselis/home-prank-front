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
  character_slug: string
  action_slug: string
  custom_prompt?: string | null
  realism_filter?: boolean
}) {
  const { data, error } = await supabase.rpc('start_generation', {
    _room_photo_id: args.room_photo_id,
    _character_slug: args.character_slug,
    _action_slug: args.action_slug,
    _custom_prompt: args.custom_prompt ?? null,
    _realism_filter: args.realism_filter ?? false,
  })
  if (error) throw error
  return data as string // generation_id
}

/** 4) Edge funkcija /generate-image sa JWT */
export async function generateImage(genId: string) {
  const { data: sessionRes } = await supabase.auth.getSession()
  const accessToken = sessionRes.session?.access_token
  if (!accessToken) throw new Error('Not authenticated')

  const { VITE_FUNCTIONS_URL, VITE_PROJECT_ANON_KEY } = import.meta.env
  if (!VITE_FUNCTIONS_URL) throw new Error('VITE_FUNCTIONS_URL is not defined')

  const res = await fetch(`${VITE_FUNCTIONS_URL}/generate-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      // 👇 important when calling functions directly via fetch
      apikey: VITE_PROJECT_ANON_KEY,
    },
    body: JSON.stringify({ generation_id: genId }),
  })

  if (!res.ok) throw new Error(await res.text().catch(() => 'Generation failed'))
  return res.json() as Promise<{ ok: boolean; generation_id: string; preview_url: string | null }>
}