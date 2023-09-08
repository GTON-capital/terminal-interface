import { textLine, anchorWord } from '@gton-capital/crt-terminal';
import { isMobile, isTablet } from 'react-device-detect';
import connectMetamask from './WEB3/ConnectMetamask';
import { TerminalStateWithDispatch } from '../State/types';
import { ApplicationConfig } from '../config/types';

export async function connect(
  config: ApplicationConfig,
  [_, setState]: TerminalStateWithDispatch,
): Promise<string> {
  if (!isMobile && !isTablet) {
    try {
      const [address, chainId] = await connectMetamask();
      setState({
        address,
        chainId,
        chain: config.chains[chainId],
      });
      return address;
    } catch (e) {
      throw new Error(e.message);
    }
  } else {
    return ' ';
  }
}

export function printLink(print, text, link) {
  print([
    textLine({
      words: [
        anchorWord({
          className: 'link-padding',
          characters: text,
          onClick: () => {
            window.open(link, '_blank');
          },
        }),
      ],
    }),
  ]);
}
