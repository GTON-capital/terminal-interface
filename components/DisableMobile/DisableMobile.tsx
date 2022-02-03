import React, { PropsWithChildren } from 'react';
import { isMobile, isTablet } from 'react-device-detect';
import * as Styled from './DisableMobile.styled';

interface IDisableMobileProps {}

function DisableMobile({ children }: PropsWithChildren<IDisableMobileProps>) {
  const show = !isMobile && !isTablet;
  return (
    <>
      {!show && (
          <Styled.DisableWrap>
            <Styled.TextWrap>
              <Styled.Text>
                GTON Capital terminal is accessible from desktop only. Apologies for the inconvenience.
              </Styled.Text>
            </Styled.TextWrap>
          </Styled.DisableWrap>
      )}
      {show && children}
    </>
  );
}

export default DisableMobile;
