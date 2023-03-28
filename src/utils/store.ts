// State management lib: https://lostpebble.github.io/pullstate/docs/quick-example

import { Store } from "pullstate";
import { AssetAccount } from "./types";

interface AppState {
  wallet: AssetAccount | null;
  address: string;
}

export const UIStore = new Store<AppState>({
  wallet: null,
  address: "",
});
