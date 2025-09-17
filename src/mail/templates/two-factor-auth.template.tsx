import { Body, Heading, Html, Tailwind, Text } from '@react-email/components';
import * as React from 'react';

export const TwoFactorAuthentication = (token: string) => {
  return (
    <Tailwind>
      <Html>
        <Body className={'text-center'}>
          <Heading>Two-factor authentication</Heading>
          <Text>Your two-factor authentication code.</Text>
          <Text className={'font-bold'}>{token}</Text>
          <Text>Link is valid for an 5 minutes, if you did not request confirmation, ignore this message.</Text>
        </Body>
      </Html>
    </Tailwind>
  )
}