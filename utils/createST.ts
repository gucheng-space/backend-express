interface STvalues {
  setClause: string;
  values: string[];
  len?: number;
}

interface inputValue {
  obj: Record<string, any>;
  options: "UPDATE" | "INSERT";
}

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
