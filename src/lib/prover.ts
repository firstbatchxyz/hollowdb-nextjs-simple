import constants from "../constants";
import { poseidon1 } from "poseidon-lite";
import { ripemd160 } from "ethers/lib/utils.js";
const snarkjs = require("snarkjs"); // snarkjs doesn't have types

/**
 * Generate a pre-image knowledge proof bound to the current key and value in the database.
 * @param secret a secret
 * @param curValue currently stored value in HollowDB
 * @param nextValue new value to be stored in HollowDB
 * @returns a full proof that consists of public signals and the proof itself.
 */
export async function generateProof(
  secret: bigint,
  curValue: unknown,
  nextValue: unknown
): Promise<{ proof: object; publicSignals: string[] }> {
  return await snarkjs.groth16.fullProve(
    {
      preimage: secret,
      curValueHash: curValue ? valueToBigInt(curValue) : BigInt(0),
      nextValueHash: nextValue ? valueToBigInt(nextValue) : BigInt(0),
    },
    constants.CIRCUITS.HOLLOW_AUTHZ.WASM,
    constants.CIRCUITS.HOLLOW_AUTHZ.PROVER
  );
}

const valueToBigInt = (value: unknown): bigint => {
  return BigInt(ripemd160(Buffer.from(JSON.stringify(value))));
};

/**
 * Compute the key that only you can know the preimage of.
 * @param preimage your secret, the preimage of the key
 * @returns key, as the Poseidon hash of your secret
 */
export function computeKey(preimage: bigint): string {
  return poseidon1([preimage]).toString();
}
