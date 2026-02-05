import { ComponentState } from '../types';
export type GroupState = ComponentState & {
    dataAttributes?: Record<string, any>;
    childrenProps?: Array<Record<string, any>>;
};
export type GroupContextType = Record<string, Array<GroupState>>;
export declare const GroupContext: import("react").Context<GroupContextType>;
export declare const useGroupContext: () => GroupContextType;
