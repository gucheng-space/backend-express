interface STvalues {
  setClause: string;
  values: string[];
  len?: number;
}

interface inputValue {
  obj: Record<string, any>;
  options: "UPDATE" | "INSERT";
}

/**
 * Creates SQL SET clause and values for INSERT/UPDATE queries.
 * @returns {STvalues} Returns an object with:
 *   - `setClause`: The SQL SET clause (e.g., `"name = $1, age = $2"`)
 *   - `values`: The values array (e.g., `["John", 30]`)
 *   - `len?`: Optional length of values (for UPDATE queries)
 */
export const createST = (inputValue: inputValue): STvalues => {
  const fields = Object.entries(inputValue.obj);
  const values = fields.map(([_, value]) => value);

  let setClause: string;
  let len: number | undefined;

  if (inputValue.options === "UPDATE") {
    setClause = fields.map(([key], i) => `${key} = $${i + 1}`).join(", ");
    len = fields.length;
  } else {
    setClause = fields.map(([key]) => key).join(", ");
  }

  return { setClause, values, len };
};
