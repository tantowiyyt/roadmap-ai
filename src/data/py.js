// Tag untuk menulis kode Python apa adanya (backslash seperti \n tidak diubah).
// Pakai: py`print("halo\n")`
export const py = (strings, ...values) =>
  String.raw(strings, ...values).replace(/^\n/, '').trimEnd()
