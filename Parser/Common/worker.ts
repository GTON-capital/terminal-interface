import { EventQueueReturnType, textLine, textWord } from '@gton-capital/crt-terminal';
import { ErrorCodes, errorStrings } from './constants';
import { TerminalStateWithDispatch } from '../../State/types';
import { ApplicationConfig, ChainConfig } from '../../config/types';

type WorkerDescriptorInit = {
  description: string;
  getOptions?(config: ApplicationConfig, chain?: ChainConfig): Record<string, Array<string>>;
};

export type WorkerDecriptor = {
  description: string;
  getOptions?(config: ApplicationConfig, chain: ChainConfig): Record<string, Array<string>>;
};

type AvailableHandlers = Pick<EventQueueReturnType['handlers'], 'lock' | 'loading' | 'print'>;

type WorkerHandler = (
  handlers: AvailableHandlers,
  arg: string,
  state: TerminalStateWithDispatch,
  config: ApplicationConfig,
) => Promise<void>;

export interface IWorker {
  execute(
    { lock, loading, print }: AvailableHandlers,
    args: string,
    state: TerminalStateWithDispatch,
    config: ApplicationConfig,
  ): Promise<void> | void;

  helpText?(config: ApplicationConfig, chain?: ChainConfig): string | null;
}

export class Worker implements IWorker {
  description: string | null = null;

  constructor(private handler: WorkerHandler, private readonly errMessage: string | null = null) {}

  getOptions:
    | null
    | ((config: ApplicationConfig, chain?: ChainConfig) => Record<string, Array<string>>);

  async execute(
    { lock, loading, print }: AvailableHandlers,
    args: string,
    state: TerminalStateWithDispatch,
    config: ApplicationConfig,
  ): Promise<void> {
    try {
      lock(true);
      loading(true);
      await this.handler({ lock, loading, print }, args, state, config);
      loading(false);
      lock(false);
    } catch (err) {
      let message;
      if (err.code in ErrorCodes) {
        message = errorStrings[err.code];
      } else {
        message = err.message || this.errMessage;
      }
      print([textLine({ words: [textWord({ characters: message })] })]);
      const helpText = this.helpText(config, state[0]?.chain);
      print([textLine({ words: [textWord({ characters: message })] })]);
      loading(false);
      lock(false);
    }
  }

  setDescription(payload: WorkerDescriptorInit): Worker {
    this.description = payload.description;
    this.getOptions = payload.getOptions?.bind(this);
    return this;
  }

  helpText(config: ApplicationConfig, chain?: ChainConfig): string | null {
    if (!this.description) {
      return null;
    }

    if (this.getOptions) {
      const options = this.getOptions(config, chain);

      let formatedDescription = this.description;

      Object.entries(options).forEach(([name, opts]) => {
        formatedDescription = formatedDescription.replace(
          `<${name.toLowerCase()}>`,
          `<${opts.join(' | ')}>`,
        );
      });

      return formatedDescription;
    }

    return this.description;
  }
}
