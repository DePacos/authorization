import { Button, Heading, Html, Link, Text, Body, Tailwind } from '@react-email/components';
import * as React from 'react';

export const PasswordRecoveryTemplate = (link: string) => {
  return (
    <Tailwind>
      <Html>
        <Body className={'text-center'}>
          <Heading>Password recovery</Heading>
          <Text>Hello, to recover your password please follow the link.</Text>
          <Button>
            <Link href={link}>Follow to link</Link>
          </Button>
          <Text>Link is valid for an hour, if you did not request confirmation, ignore this message.</Text>
        </Body>
      </Html>
    </Tailwind>
  )
}