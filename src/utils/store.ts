// State management lib: https://lostpebble.github.io/pullstate/docs/quick-example

import { Store } from "pullstate";
import { PublicKey } from "./types";

interface AppState {
  wallet: PublicKey | null;
  address: string;
}

export const UIStore = new Store<AppState>({
  wallet: null,
  address: ""
});