import { atom } from "jotai";

export const totalAtom = atom(1);

export const activeSessionAtom = atom(undefined);

export const deleteModeAtom = atom(false);

export const sessionsSelectedsAtom = atom({});
