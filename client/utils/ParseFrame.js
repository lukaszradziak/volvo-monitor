const evaluateEval = (definition, variable) => {
  definition = definition.replaceAll("x&0b", "x & 0x");
  return eval(`((x) => ${definition || "x"})(${variable})`);
};

const ParseFrame = (frame, parameter) => {
  if (!parameter) {
    return {};
  }

  const parse = {
    hex: "",
    value: "",
    calc: "",
    success: false,
  };

  if (parameter.size) {
    for (let i = 0; i < parseInt(parameter.size) / 8; i++) {
      if (frame[6 + i]) {
        parse.hex += frame[7 + i];
      }
    }
  }

  if (frame[4] === "E6") {
    parse.success = true;
  }

  parse.value = parseInt(parse.hex, 16);
  parse.calc = evaluateEval(parameter.definition, parse.value);

  return parse;
};

export default ParseFrame;
