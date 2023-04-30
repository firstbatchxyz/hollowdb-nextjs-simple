const constants = {
  /**
   * A small contract, just a few keys.
   * @see https://sonar.warp.cc/#/app/contract/_eVfQYDOLpd-0QX0yt7RV2CXE5D9U0otCz9BNBiJMYY
   */
  HOLLOWDB_TEST_TXID: "_eVfQYDOLpd-0QX0yt7RV2CXE5D9U0otCz9BNBiJMYY",
  /**
   * Source txId of the TEST contract. You can use this to re-deploy the same smart contract.
   * @see https://sonar.warp.cc/#/app/source/cfsV8-jfbZhe8aYZEMVkKAE_UFP_sE1O1F_ksmsxx6k
   */
  HOLLOWDB_TEST_SRCTXID: "cfsV8-jfbZhe8aYZEMVkKAE_UFP_sE1O1F_ksmsxx6k",
  /**
   * Production contract, many many keys.
   * @see https://sonar.warp.cc/#/app/contract/i5p9_c7LAmGk1YxAws0FU2haKjJanR6TSjSRFXP-JNE
   */
  // HOLLOWDB_PROD_TXID: "i5p9_c7LAmGk1YxAws0FU2haKjJanR6TSjSRFXP-JNE",
  /**
   * Arithemtic circuits for Zero-knowledge Proof generation
   */
  CIRCUITS: {
    HOLLOW_AUTHZ: {
      PROVER: "/circuits/hollow-authz-prover.zkey",
      WASM: "/circuits/hollow-authz.wasm",
    },
  },
};

export default constants as Readonly<typeof constants>;
