export type CharacterChoice = { id: string; customPrompt?: string | null }
export type ActionChoice = { id: string }

let _dataUrl: string | null = null
let _character: CharacterChoice | null = null
let _action: ActionChoice | null = null

export const GenerationStore = {
  setDataUrl(d: string | null) { _dataUrl = d },
  getDataUrl() { return _dataUrl },

  setCharacter(c: CharacterChoice | null) { _character = c },
  getCharacter() { return _character },

  setAction(a: ActionChoice | null) { _action = a },
  getAction() { return _action },

  reset() { _dataUrl = null; _character = null; _action = null },
}
