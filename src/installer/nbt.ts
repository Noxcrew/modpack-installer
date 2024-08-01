import { Buffer } from "buffer";

import type { Profile } from "../profile";

export const createServersNBT = (profile: Profile): Buffer => {
  const size = computeServersNBTSize(profile);
  const buffer = new Buffer(size);

  buffer.writeUInt8(0x0a, 0); // TAG_Compound
  buffer.writeUInt16BE(0, 1); // Name size
  buffer.writeUInt8(0x09, 3); // TAG_List
  buffer.writeUInt16BE(7, 4); // Name size
  buffer.write("servers", 6, 7, "utf-8");
  buffer.writeUInt8(0x0a, 13); // TAG_Compound
  buffer.writeInt32BE(profile.servers.length, 14); // TAG_Compound

  let offset = 18;
  for (const server of profile.servers) {
    buffer.writeUInt8(0x08, offset++); // TAG_String
    buffer.writeUInt16BE(2, offset); // Name size
    offset += 2;
    offset += buffer.write("ip", offset, 2, "utf-8");

    const ipSize = computeUTF8Size(server.host);
    buffer.writeUInt16BE(ipSize, offset);
    offset += 2;
    offset += buffer.write(server.host, offset, ipSize, "utf-8");

    buffer.writeUInt8(0x08, offset++); // TAG_String
    buffer.writeUInt16BE(4, offset); // Name size
    offset += 2;
    offset += buffer.write("name", offset, 4, "utf-8");

    const nameSize = computeUTF8Size(server.name);
    buffer.writeUInt16BE(nameSize, offset);
    offset += 2;
    offset += buffer.write(server.name, offset, nameSize, "utf-8");

    offset++; // TAG_End
  }

  return buffer;
};

const computeServersNBTSize = (profile: Profile): number => {
  let size = 19; // TAG_Compound (3) + TAG_List (15) + ... + TAG_End (1)
  for (const server of profile.servers) {
    size += 7; // TAG_String (3) + "ip" (2) + payload size (2)
    size += computeUTF8Size(server.host);
    size += 9; // TAG_String (3) + "name" (2) + payload size (2)
    size += computeUTF8Size(server.name);
    size += 1; // TAG_End
  }
  return size;
};

const computeUTF8Size = (str: string): number => {
  let size = str.length;
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) {
      size++;
    } else if (code > 0x7ff && code <= 0xffff) {
      size += 2;
    }
    if (code >= 0xdc00 && code <= 0xdfff) {
      // Trail surrogate
      i--;
    }
  }
  return size;
};
