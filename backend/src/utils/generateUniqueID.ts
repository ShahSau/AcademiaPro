const generateUniqueId = (
  name: string,
  email: string,
  mobileNumber: string
): Promise<string> => {
  name = name.trim().toLowerCase();
  email = email.trim().toLowerCase();
  mobileNumber = mobileNumber.trim();

  const combinedString = name + email + mobileNumber;

  const encoder = new TextEncoder();
  const data = encoder.encode(combinedString);

  // Using the Web Crypto API to generate a SHA-256 hash
  return crypto.subtle
    .digest("SHA-256", data)
    .then((hashBuffer: ArrayBuffer) => {
      const hashArray = new Uint8Array(hashBuffer);
      const hashHex = Array.from(hashArray)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      const shortUniqueId = hashHex.slice(0, 16);

      return shortUniqueId;
    });
};

export default generateUniqueId;

//   generateUniqueId(name, email, mobileNumber).then((uniqueId: string) => {
//     console.log("Generated ID:", uniqueId);
//   });
