import constants from "../constants";
import { ripemd160 } from "ethers/lib/utils.js";
const snarkjs = require("snarkjs"); // snarkjs doesn't have types

/**
 * Generate a pre-image knowledge proof bound to the current key and value in the database.
 * The preimage of the key is `id_commitment` and `valueTx` is the currently stored value.
 * By binding to the value, we prevent replay attacks using this proof.
 * @param idCommitment preimage of FID, only known by the user
 * @param curValue currently stored value in HollowDB
 * @param nextValue new value to be stored in HollowDB
 * @returns a full proof that consists of public signals and the proof itself.
 */
export async function proveHollowAuthz(
  idCommitment: string,
  curValue: unknown,
  nextValue: unknown
): Promise<{ proof: object; publicSignals: string[] }> {
  return await snarkjs.groth16.fullProve(
    {
      preimage: idCommitment,
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
