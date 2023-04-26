import type { HollowDBState } from "../contracts/hollowDB/types";

const initialState: HollowDBState = {
  owner: "0Kp_W9RbiQwJ0gIVtTp2yHPvBZ9kq_Wwf6E_kpB3C7E",
  verificationKey: null,
  isProofRequired: true,
  canEvolve: true,
  whitelist: {
    put: {},
    update: {},
  },
  isWhitelistRequired: {
    put: false,
    update: false,
  },
};

export default initialState;
