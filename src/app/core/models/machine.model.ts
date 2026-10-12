export type MachineState = 'running' | 'alarm' | 'warning';

export const STATE_ICONS: Record<MachineState, string> = {
  running: 'update',
  alarm: 'error',
  warning: 'warning',
};

export const TYPE_ICONS: Record<string, string> = {
  scale: 'system_update_alt',
  attacher: 'chrome_reader_mode',
  packer: 'call_to_action',
  closer: 'grid_on',
};
export const DEFAULT_TYPE_ICON = 'precision_manufacturing'; // for a type we do not know

export const DEFAULT_STATE_ICON = 'help'; // for a state we do not know

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting';
export type LoadStatus = 'loading' | 'ready' | 'error';

export interface MachineDto {
  id: string;
  type: string; // translated
  name: string; // name from BE (not translated)
  state: MachineState;
  secondsInState: number;
}

export interface Machine {
  id: string;
  type: string;
  name: string;
  state: MachineState;
  since: number; // timestamp (ms) when the state started
}

export interface MachineUpdate {
  id: string;
  state: MachineState;
  timestamp: number;
}

export interface StateChange {
  id: string;
  type: string;
  name: string;
  from: MachineState;
  to: MachineState;
  timestamp: number;
}
