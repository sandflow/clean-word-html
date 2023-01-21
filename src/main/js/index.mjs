import * as hp2 from "htmlparser2";
import * as fs from "node:fs";
import * as cp1252 from 'windows-1252';

const excludedTags = new Set(["meta", "style", "span"]);

const outputStream = fs.createWriteStream(process.argv[3]);

const tagStack = [];

const parser = new hp2.Parser({
  onopentag(tagname, attributes) {
    tagname = tagname.toLowerCase();

    if (excludedTags.has(tagname))
      return;
    if (tagname === "p" && tagStack.length && tagStack[0] === "td")
      return;

    outputStream.write(`<${tagname}>`);

    tagStack.unshift(tagname);
  },
  ontext(text) {
    outputStream.write(text);
  },
  onclosetag(tagname) {
    tagname = tagname.toLowerCase();

    if (excludedTags.has(tagname))
      return;
    if (tagname === "p" && tagStack.length && tagStack[0] === "td")
      return;

    outputStream.write(`</${tagname}>`);

    tagStack.shift();
  },
  oncomment(data) {

  }
});

parser.write(cp1252.decode(fs.readFileSync(process.argv[2])));

parser.end();