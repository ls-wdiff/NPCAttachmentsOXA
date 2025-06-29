/**
 * This file is part of the Stalker 2 Modding Tools project.
 * This is a base class for all structs.
 */
export abstract class Struct {
  reservedKeys = new Set([
    "reservedKeys",
    "isRoot",
    "refurl",
    "refkey",
    "TAB",
    "pad",
    "renderRef",
    "toString",
  ]);
  isRoot?: boolean = false;
  refurl?: string = undefined;
  refkey?: string | number = undefined;
  static TAB = "   ";
  static pad(text: string): string {
    return `${Struct.TAB}${text.replace(/\n+/g, `\n${Struct.TAB}`)}`;
  }

  static renderRef(ref: string): string {
    if (
      parseInt(ref).toString() === ref ||
      typeof ref === "number" ||
      ref === "*"
    ) {
      return `[${ref}]`;
    }
    return ref;
  }

  toString(): string {
    const allKeys = Object.keys(this).filter(
      (key) => !this.reservedKeys.has(key),
    );
    let text: string;
    text = this.isRoot ? `${this.constructor.name} : ` : "";
    text += "struct.begin";
    const refs = ["refurl", "refkey"]
      .map((k) => [k, this[k]])
      .filter(([_, v]) => v != null)
      .map(([k, v]) => `${k}=${Struct.renderRef(v)}`)
      .join(";");
    if (refs) {
      text += ` {${refs}}`;
    }
    text += "\n";
    // Add all keys
    text += allKeys
      .filter((k) => this[k])
      .map((key) =>
        Struct.pad(
          `${Struct.renderRef(key)} ${this[key] instanceof Struct ? ":" : "="} ${this[key]}`,
        ),
      )
      .join("\n");
    text += "\nstruct.end";
    return text;
  }
}
