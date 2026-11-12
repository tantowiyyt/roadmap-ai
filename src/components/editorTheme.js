// Tema editor kode (gelap, dipakai di mode terang maupun gelap agar kode selalu kontras).
// Warna token dipilih agar mudah dibedakan dan tetap terbaca (kontras ≥ 4.5:1 terhadap latar).
import { EditorView } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

export const warnaEditor = {
  bg: '#141722',
  gutter: '#5c6380',
  teks: '#e4e7f2',
  aktif: '#1b1f2d',
  seleksi: '#2d3554',
  kursor: '#a5b4fc',
}

const dasar = EditorView.theme(
  {
    '&': { color: warnaEditor.teks, backgroundColor: warnaEditor.bg },
    '.cm-content': { caretColor: warnaEditor.kursor, padding: '12px 0' },
    '.cm-line': { padding: '0 16px 0 10px' },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: warnaEditor.kursor, borderLeftWidth: '2px' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: warnaEditor.seleksi },
    '.cm-activeLine': { backgroundColor: warnaEditor.aktif },
    '.cm-gutters': { backgroundColor: warnaEditor.bg, color: warnaEditor.gutter, border: 'none', paddingLeft: '6px' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#a6accd' },
    '.cm-lineNumbers .cm-gutterElement': { minWidth: '28px', padding: '0 8px 0 0' },
    '&.cm-focused .cm-matchingBracket': { backgroundColor: '#3a4266', outline: '1px solid #6b74a8' },
    '.cm-searchMatch': { backgroundColor: '#5b4a1f' },
    '.cm-tooltip': { backgroundColor: '#1d2130', border: '1px solid #2c3247', color: warnaEditor.teks },
    '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: '#2d3554', color: '#fff' },
    '.cm-panels': { backgroundColor: '#10131c', color: warnaEditor.teks },
  },
  { dark: true },
)

const sorotan = HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword, t.operatorKeyword], color: '#c4a1ff' },
  { tag: [t.string, t.special(t.string)], color: '#a9dc76' },
  { tag: [t.number, t.bool, t.null], color: '#ffab70' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#7a83a6', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#78c6ff' },
  { tag: [t.definition(t.variableName), t.definition(t.function(t.variableName))], color: '#7fdbca' },
  { tag: [t.className, t.definition(t.className)], color: '#ffd479' },
  { tag: [t.self, t.special(t.variableName)], color: '#ff8fa3', fontStyle: 'italic' },
  { tag: t.propertyName, color: '#d7dcf0' },
  { tag: [t.operator, t.compareOperator, t.arithmeticOperator, t.logicOperator, t.updateOperator], color: '#89ddff' },
  { tag: [t.punctuation, t.paren, t.squareBracket, t.brace, t.separator], color: '#a6accd' },
  { tag: t.escape, color: '#ffab70' },
  { tag: t.invalid, color: '#ff6b81' },
])

export const temaEditor = [dasar, syntaxHighlighting(sorotan)]
